/**
 * Farm-Flow: Canvas UI & Interactive Graph Renderer
 * Provides smooth drag-and-drop node placement, bezier wire routing,
 * zooming, panning, port snapping, and live execution animations.
 */

import { NODE_DEFINITIONS, NODE_CATEGORIES } from './node-definitions.js';
import { CLEVELAND_COUNTY_SOILS } from './soil-data.js';

export class CanvasUI {
  constructor(canvasContainerId, engine) {
    this.container = document.getElementById(canvasContainerId);
    this.engine = engine;

    // Viewport transform (pan & zoom)
    this.panX = 40;
    this.panY = 40;
    this.scale = 1.0;
    this.isPanning = false;
    this.startPanX = 0;
    this.startPanY = 0;

    // Interaction states
    this.selectedNodeId = null;
    this.isDraggingNode = false;
    this.draggedNodeId = null;
    this.dragOffset = { x: 0, y: 0 };

    // Wire connection drawing
    this.isConnecting = false;
    this.connectingSource = null; // { nodeId, portId, x, y, type }
    this.currentMousePos = { x: 0, y: 0 };

    this.initDOM();
    this.bindEvents();

    // Subscribe to engine events
    this.engine.subscribe((evt, data) => this.handleEngineEvent(evt, data));
  }

  initDOM() {
    this.container.innerHTML = `
      <div class="canvas-viewport" id="canvas-viewport">
        <svg class="canvas-svg-layer" id="canvas-svg-layer">
          <defs>
            <linearGradient id="wire-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#06b6d4" />
              <stop offset="50%" stop-color="#10b981" />
              <stop offset="100%" stop-color="#3b82f6" />
            </linearGradient>
            <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g id="wires-group"></g>
          <path id="temp-wire-path" class="temp-wire" d="" style="display: none;"></path>
        </svg>
        <div class="canvas-nodes-layer" id="canvas-nodes-layer"></div>
      </div>
      <div class="canvas-watermark">
        <span class="watermark-badge">🌾 FARM-FLOW ENGINE</span>
        <span>Cleveland County Hydrology &amp; Automation</span>
      </div>
    `;

    this.viewport = document.getElementById('canvas-viewport');
    this.svgLayer = document.getElementById('canvas-svg-layer');
    this.wiresGroup = document.getElementById('wires-group');
    this.tempWirePath = document.getElementById('temp-wire-path');
    this.nodesLayer = document.getElementById('canvas-nodes-layer');

    this.updateTransform();
  }

  bindEvents() {
    // Pan canvas with background drag
    this.container.addEventListener('mousedown', (e) => {
      if (e.target === this.container || e.target === this.viewport || e.target.classList.contains('canvas-svg-layer')) {
        this.isPanning = true;
        this.startPanX = e.clientX - this.panX;
        this.startPanY = e.clientY - this.panY;
        this.container.style.cursor = 'grabbing';
      }
    });

    window.addEventListener('mousemove', (e) => {
      const rect = this.container.getBoundingClientRect();
      this.currentMousePos = {
        x: (e.clientX - rect.left - this.panX) / this.scale,
        y: (e.clientY - rect.top - this.panY) / this.scale
      };

      if (this.isPanning) {
        this.panX = e.clientX - this.startPanX;
        this.panY = e.clientY - this.startPanY;
        this.updateTransform();
      } else if (this.isDraggingNode && this.draggedNodeId) {
        const node = this.engine.nodes.get(this.draggedNodeId);
        if (node) {
          node.x = Math.round(this.currentMousePos.x - this.dragOffset.x);
          node.y = Math.round(this.currentMousePos.y - this.dragOffset.y);
          this.updateNodePositionInDOM(node);
          this.renderWires();
        }
      } else if (this.isConnecting && this.connectingSource) {
        this.updateTempWire(this.connectingSource, this.currentMousePos);
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (this.isPanning) {
        this.isPanning = false;
        this.container.style.cursor = 'default';
      }
      if (this.isDraggingNode) {
        this.isDraggingNode = false;
        this.draggedNodeId = null;
      }
      if (this.isConnecting) {
        this.cancelConnecting();
      }
    });

    // Zoom with scroll wheel
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = 1.08;
      const oldScale = this.scale;
      let newScale = e.deltaY < 0 ? oldScale * zoomFactor : oldScale / zoomFactor;
      newScale = Math.min(Math.max(0.4, newScale), 2.2);

      const rect = this.container.getBoundingClientRect();
      const mouseCanvasX = e.clientX - rect.left;
      const mouseCanvasY = e.clientY - rect.top;

      this.panX = mouseCanvasX - (mouseCanvasX - this.panX) * (newScale / oldScale);
      this.panY = mouseCanvasY - (mouseCanvasY - this.panY) * (newScale / oldScale);
      this.scale = newScale;

      this.updateTransform();
      const zoomBadge = document.getElementById('zoom-percentage');
      if (zoomBadge) zoomBadge.textContent = `${Math.round(this.scale * 100)}%`;
    }, { passive: false });

    // Drag-and-drop from sidebar
    this.container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    });

    this.container.addEventListener('drop', (e) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('application/farm-flow-node');
      if (nodeType) {
        const rect = this.container.getBoundingClientRect();
        const dropX = (e.clientX - rect.left - this.panX) / this.scale - 110;
        const dropY = (e.clientY - rect.top - this.panY) / this.scale - 40;
        const node = this.engine.addNode(nodeType, dropX, dropY);
        if (node) {
          this.selectNode(node.id);
        }
      }
    });
  }

  updateTransform() {
    const transformStr = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    this.viewport.style.transform = transformStr;
  }

  zoomIn() {
    this.scale = Math.min(2.2, this.scale * 1.15);
    this.updateTransform();
    const badge = document.getElementById('zoom-percentage');
    if (badge) badge.textContent = `${Math.round(this.scale * 100)}%`;
  }

  zoomOut() {
    this.scale = Math.max(0.4, this.scale / 1.15);
    this.updateTransform();
    const badge = document.getElementById('zoom-percentage');
    if (badge) badge.textContent = `${Math.round(this.scale * 100)}%`;
  }

  resetView() {
    this.scale = 1.0;
    this.panX = 60;
    this.panY = 60;
    this.updateTransform();
    const badge = document.getElementById('zoom-percentage');
    if (badge) badge.textContent = '100%';
  }

  handleEngineEvent(event, data) {
    switch (event) {
      case 'GRAPH_LOADED':
        this.renderAllNodes();
        this.renderWires();
        break;
      case 'NODE_ADDED':
        this.renderSingleNode(data);
        break;
      case 'NODE_REMOVED':
        const el = document.getElementById(`node-el-${data.nodeId}`);
        if (el) el.remove();
        this.renderWires();
        if (this.selectedNodeId === data.nodeId) {
          this.selectNode(null);
        }
        break;
      case 'NODE_UPDATED':
        this.refreshNodeSummary(data);
        break;
      case 'CONNECTION_ADDED':
      case 'CONNECTION_REMOVED':
        this.renderWires();
        break;
      case 'NODE_STATUS_CHANGE':
        this.updateNodeStatusVisual(data.nodeId, data.state, data.outputs);
        break;
      case 'EXECUTION_STARTED':
      case 'EXECUTION_COMPLETED':
        this.renderWires();
        break;
    }
  }

  renderAllNodes() {
    this.nodesLayer.innerHTML = '';
    this.engine.nodes.forEach(node => this.renderSingleNode(node));
  }

  renderSingleNode(node) {
    const def = NODE_DEFINITIONS[node.type];
    if (!def) return;

    const nodeEl = document.createElement('div');
    nodeEl.className = 'flow-node';
    nodeEl.id = `node-el-${node.id}`;
    nodeEl.style.left = `${node.x}px`;
    nodeEl.style.top = `${node.y}px`;
    nodeEl.style.borderColor = def.accentColor;

    // Header with category accent
    const inputsHtml = (def.inputs || []).map(input => `
      <div class="node-port input-port" data-node="${node.id}" data-port="${input.id}" data-dir="in" title="${input.label} (${input.type})">
        <span class="port-socket port-type-${input.type}"></span>
        <span class="port-name">${input.label}</span>
      </div>
    `).join('');

    const outputsHtml = (def.outputs || []).map(output => `
      <div class="node-port output-port" data-node="${node.id}" data-port="${output.id}" data-dir="out" title="${output.label} (${output.type})">
        <span class="port-name">${output.label}</span>
        <span class="port-socket port-type-${output.type}"></span>
      </div>
    `).join('');

    const summaryText = def.renderSummary ? def.renderSummary(node.config) : '';

    nodeEl.innerHTML = `
      <div class="node-header" style="background: linear-gradient(135deg, ${def.accentColor}25, transparent);">
        <div class="node-title-box">
          <span class="node-icon">${this.getIconSvg(def.icon)}</span>
          <div>
            <div class="node-title">${def.title}</div>
            <div class="node-subtitle">${def.subtitle}</div>
          </div>
        </div>
        <div class="node-header-actions">
          <span class="node-status-pill status-idle" id="status-pill-${node.id}">IDLE</span>
          <button class="node-close-btn" title="Remove Node" data-delete-node="${node.id}">✕</button>
        </div>
      </div>
      <div class="node-body">
        <div class="node-summary-preview" id="summary-${node.id}">
          ${summaryText}
        </div>
        <div class="node-ports-container">
          <div class="ports-column inputs-column">${inputsHtml}</div>
          <div class="ports-column outputs-column">${outputsHtml}</div>
        </div>
      </div>
    `;

    // Bind Node Events
    nodeEl.addEventListener('mousedown', (e) => {
      // Don't drag if clicking port or delete button
      if (e.target.closest('.port-socket') || e.target.closest('.node-close-btn') || e.target.closest('select') || e.target.closest('input')) {
        return;
      }
      this.selectNode(node.id);
      this.isDraggingNode = true;
      this.draggedNodeId = node.id;
      this.dragOffset = {
        x: this.currentMousePos.x - node.x,
        y: this.currentMousePos.y - node.y
      };
      e.stopPropagation();
    });

    // Delete button
    const delBtn = nodeEl.querySelector('[data-delete-node]');
    if (delBtn) {
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.engine.removeNode(node.id);
      });
    }

    // Bind Port Out mousedown (initiates connection)
    nodeEl.querySelectorAll('.output-port .port-socket').forEach(socket => {
      socket.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        const portEl = socket.closest('.output-port');
        const portId = portEl.getAttribute('data-port');
        const socketPos = this.getPortCenterCoords(portEl);

        this.isConnecting = true;
        this.connectingSource = {
          nodeId: node.id,
          portId,
          x: socketPos.x,
          y: socketPos.y
        };
        this.tempWirePath.style.display = 'block';
        this.updateTempWire(this.connectingSource, this.currentMousePos);
      });
    });

    // Bind Port In mouseup (completes connection)
    nodeEl.querySelectorAll('.input-port .port-socket').forEach(socket => {
      socket.addEventListener('mouseup', (e) => {
        e.stopPropagation();
        if (this.isConnecting && this.connectingSource) {
          const portEl = socket.closest('.input-port');
          const toPort = portEl.getAttribute('data-port');
          this.engine.addConnection(
            this.connectingSource.nodeId,
            this.connectingSource.portId,
            node.id,
            toPort
          );
          this.cancelConnecting();
        }
      });
    });

    this.nodesLayer.appendChild(nodeEl);
  }

  updateNodePositionInDOM(node) {
    const el = document.getElementById(`node-el-${node.id}`);
    if (el) {
      el.style.left = `${node.x}px`;
      el.style.top = `${node.y}px`;
    }
  }

  refreshNodeSummary(node) {
    const def = NODE_DEFINITIONS[node.type];
    const sumEl = document.getElementById(`summary-${node.id}`);
    if (def && sumEl && def.renderSummary) {
      sumEl.innerHTML = def.renderSummary(node.config);
    }
  }

  updateNodeStatusVisual(nodeId, state, outputs) {
    const pill = document.getElementById(`status-pill-${nodeId}`);
    const nodeEl = document.getElementById(`node-el-${nodeId}`);
    if (!pill || !nodeEl) return;

    pill.className = `node-status-pill status-${state.toLowerCase()}`;
    pill.textContent = state;

    if (state === 'EVALUATING') {
      nodeEl.classList.add('node-evaluating');
      nodeEl.classList.remove('node-success', 'node-error');
    } else if (state === 'SUCCESS') {
      nodeEl.classList.remove('node-evaluating');
      nodeEl.classList.add('node-success');
      setTimeout(() => nodeEl.classList.remove('node-success'), 1200);
    } else if (state === 'ERROR') {
      nodeEl.classList.remove('node-evaluating');
      nodeEl.classList.add('node-error');
    }
  }

  selectNode(nodeId) {
    if (this.selectedNodeId) {
      const prev = document.getElementById(`node-el-${this.selectedNodeId}`);
      if (prev) prev.classList.remove('selected-node');
    }

    this.selectedNodeId = nodeId;
    if (nodeId) {
      const current = document.getElementById(`node-el-${nodeId}`);
      if (current) current.classList.add('selected-node');
    }

    // Trigger Node Inspector Update
    window.dispatchEvent(new CustomEvent('node-selected', { detail: { nodeId } }));
  }

  // ==================== WIRE ROUTING & RENDERING ====================

  renderWires() {
    this.wiresGroup.innerHTML = '';

    this.engine.connections.forEach(conn => {
      const fromEl = this.container.querySelector(`.output-port[data-node="${conn.fromNode}"][data-port="${conn.fromPort}"]`);
      const toEl = this.container.querySelector(`.input-port[data-node="${conn.toNode}"][data-port="${conn.toPort}"]`);

      if (!fromEl || !toEl) return;

      const p1 = this.getPortCenterCoords(fromEl);
      const p2 = this.getPortCenterCoords(toEl);

      const pathData = this.calculateBezierPath(p1.x, p1.y, p2.x, p2.y);

      // SVG path element
      const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathEl.setAttribute('d', pathData);
      pathEl.setAttribute('class', `flow-wire ${conn.active ? 'wire-active' : ''}`);
      pathEl.setAttribute('data-wire-id', conn.id);

      // Click wire to remove
      pathEl.addEventListener('click', (e) => {
        e.stopPropagation();
        if (confirm('Delete this connection wire?')) {
          this.engine.removeConnection(conn.id);
        }
      });

      this.wiresGroup.appendChild(pathEl);
    });
  }

  updateTempWire(source, target) {
    const d = this.calculateBezierPath(source.x, source.y, target.x, target.y);
    this.tempWirePath.setAttribute('d', d);
  }

  cancelConnecting() {
    this.isConnecting = false;
    this.connectingSource = null;
    this.tempWirePath.style.display = 'none';
  }

  calculateBezierPath(x1, y1, x2, y2) {
    const dx = Math.abs(x2 - x1) * 0.55;
    return `M ${x1} ${y1} C ${x1 + Math.max(40, dx)} ${y1}, ${x2 - Math.max(40, dx)} ${y2}, ${x2} ${y2}`;
  }

  getPortCenterCoords(portEl) {
    const socket = portEl.querySelector('.port-socket');
    const target = socket || portEl;
    const rect = target.getBoundingClientRect();
    const containerRect = this.container.getBoundingClientRect();

    const cx = (rect.left + rect.width / 2 - containerRect.left - this.panX) / this.scale;
    const cy = (rect.top + rect.height / 2 - containerRect.top - this.panY) / this.scale;

    return { x: cx, y: cy };
  }

  getIconSvg(name) {
    const icons = {
      'droplets': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
      'droplet': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
      'cloud-sun': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
      'activity': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
      'gauge': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
      'map-pin': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
      'layers': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
      'calculator': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/></svg>`,
      'shield-check': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
      'scale': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
      'git-branch': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
      'clock': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
      'toggle-right': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>`,
      'zap': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
      'compass': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
      'file-check': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>`,
      'table': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`,
      'bell': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
      'send': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" x2="11" y1="2" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
      'cpu': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>`,
      'file-text': `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/><line x1="10" x2="8" y1="9" y2="9"/></svg>`
    };
    return icons[name] || icons['activity'];
  }
}
