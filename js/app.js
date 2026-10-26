/**
 * Farm-Flow: Main Application Orchestrator
 * Connects canvas UI, workflow engine, hardware simulator, inspector, and sidebar.
 */

import { NODE_CATEGORIES, NODE_DEFINITIONS } from './node-definitions.js';
import { CLEVELAND_COUNTY_SOILS, KONAWA_SERIES_PROFILE, HydrologyCalculations } from './soil-data.js';
import { hardwareSimulator } from './hardware-simulator.js';
import { workflowEngine } from './workflow-engine.js';
import { WORKFLOW_TEMPLATES } from './templates.js';
import { CanvasUI } from './canvas-ui.js';

class FarmFlowApp {
  constructor() {
    this.canvasUI = null;
    this.selectedNodeId = null;
    this.continuousTimer = null;
  }

  init() {
    // 1. Initialize Canvas UI
    this.canvasUI = new CanvasUI('flow-canvas-container', workflowEngine);

    // 2. Build Sidebar Node Library
    this.renderSidebarLibrary();

    // 3. Setup Template Selectors
    this.initTemplateSelector();

    // 4. Bind Hardware Simulator UI
    this.bindHardwareUI();

    // 5. Bind Node Inspector
    this.bindNodeInspector();

    // 6. Bind Console & Modals
    this.bindConsoleAndModals();

    // 7. Load default template (Hackathon Salinity Flush prompt!)
    this.loadTemplateById('hackathon-salinity-flush');

    // 8. Bind global buttons (Run, Zoom, Simulation)
    this.bindToolbarButtons();

    console.log('🌾 Farm-Flow initialized successfully with Cleveland County AgTech datasets.');
  }

  renderSidebarLibrary() {
    const listContainer = document.getElementById('sidebar-component-list');
    if (!listContainer) return;

    let html = '';
    Object.values(NODE_CATEGORIES).forEach(cat => {
      const catNodes = Object.values(NODE_DEFINITIONS).filter(n => n.category === cat.id);
      if (catNodes.length === 0) return;

      html += `
        <div class="sidebar-category-group">
          <div class="category-header">
            <span class="cat-dot" style="background: ${cat.color}"></span>
            <span class="cat-title">${cat.name}</span>
            <span class="cat-count">${catNodes.length}</span>
          </div>
          <div class="category-items">
            ${catNodes.map(node => `
              <div class="draggable-node-card" draggable="true" data-node-type="${node.type}" style="border-left: 3px solid ${node.accentColor}">
                <div class="card-icon" style="color: ${node.accentColor}">
                  ${this.canvasUI.getIconSvg(node.icon)}
                </div>
                <div class="card-content">
                  <div class="card-title">${node.title}</div>
                  <div class="card-desc">${node.subtitle}</div>
                </div>
                <span class="card-drag-hint">drag</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    });

    listContainer.innerHTML = html;

    // Dragstart handlers
    listContainer.querySelectorAll('.draggable-node-card').forEach(card => {
      card.addEventListener('dragstart', (e) => {
        const type = card.getAttribute('data-node-type');
        e.dataTransfer.setData('application/farm-flow-node', type);
        card.classList.add('dragging');
      });
      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
      });
    });
  }

  initTemplateSelector() {
    const selectEl = document.getElementById('template-select');
    if (!selectEl) return;

    selectEl.innerHTML = WORKFLOW_TEMPLATES.map(t => `
      <option value="${t.id}">${t.name}</option>
    `).join('');

    selectEl.addEventListener('change', (e) => {
      this.loadTemplateById(e.target.value);
    });
  }

  loadTemplateById(templateId) {
    const tmpl = WORKFLOW_TEMPLATES.find(t => t.id === templateId) || WORKFLOW_TEMPLATES[0];
    workflowEngine.loadGraph(tmpl);
    this.canvasUI.resetView();

    // Update banner
    const banner = document.getElementById('active-template-banner');
    if (banner) {
      banner.innerHTML = `
        <span class="template-pill">${tmpl.badge}</span>
        <strong>${tmpl.name}:</strong> ${tmpl.description}
      `;
    }

    workflowEngine.log(`📂 Loaded Workflow Template: "${tmpl.name}"`);
  }

  bindToolbarButtons() {
    // Run Step Button
    const runBtn = document.getElementById('btn-run-workflow');
    if (runBtn) {
      runBtn.addEventListener('click', () => {
        workflowEngine.executeWorkflow('MANUAL_RUN_BUTTON');
      });
    }

    // Continuous Simulation Toggle
    const simToggle = document.getElementById('btn-toggle-continuous');
    if (simToggle) {
      simToggle.addEventListener('click', () => {
        if (this.continuousTimer) {
          clearInterval(this.continuousTimer);
          this.continuousTimer = null;
          simToggle.classList.remove('active-sim-pulse');
          simToggle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg> Live Loop: OFF`;
          workflowEngine.log('⏸️ Continuous Simulation Loop paused.');
        } else {
          this.continuousTimer = setInterval(() => {
            // slight random drift to simulate live sensor environment
            const delta = (Math.random() - 0.48) * 0.05;
            const newSal = Math.max(1.4, Math.min(2.8, hardwareSimulator.state.ketosProbe.salinityMsCm + delta));
            hardwareSimulator.setSalinity(newSal);

            workflowEngine.executeWorkflow('CONTINUOUS_TICK');
          }, 3500);
          simToggle.classList.add('active-sim-pulse');
          simToggle.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg> Live Loop: RUNNING`;
          workflowEngine.log('▶️ Continuous Simulation Loop started (evaluates every 3.5s).');
        }
      });
    }

    // Zoom Controls
    document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.canvasUI.zoomIn());
    document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.canvasUI.zoomOut());
    document.getElementById('btn-zoom-fit')?.addEventListener('click', () => this.canvasUI.resetView());

    // Clear Canvas
    document.getElementById('btn-clear-canvas')?.addEventListener('click', () => {
      if (confirm('Clear the entire canvas?')) {
        workflowEngine.loadGraph({ nodes: [], connections: [] });
      }
    });

    // Export Workflow JSON
    document.getElementById('btn-export-json')?.addEventListener('click', () => {
      const data = {
        name: 'Farm-Flow Export',
        exportedAt: new Date().toISOString(),
        nodes: Array.from(workflowEngine.nodes.values()),
        connections: workflowEngine.connections
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `farm-flow-workflow-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Export OWRB CSV
    document.getElementById('btn-export-owrb-csv')?.addEventListener('click', () => {
      const records = hardwareSimulator.state.owrbPermit.ledgerRecords;
      let csv = 'Timestamp,Source,Gallons,AcreFeet,BalanceRemainingAcFt,Status\n';
      records.forEach(r => {
        csv += `"${r.timestamp}","${r.source}",${r.gallons},${r.acreFeet},${r.balanceRemainingAcFt},"${r.status}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OWRB-Cleveland-County-Water-Log-${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // Preset Scenario Quick Buttons
    document.getElementById('btn-scenario-salinity')?.addEventListener('click', () => {
      hardwareSimulator.setSalinity(2.45);
      workflowEngine.log('⚡ [SCENARIO] Injected KETOS Salinity Spike (2.45 mS/cm > 2.0 threshold)!');
      workflowEngine.executeWorkflow('SCENARIO_SALINITY_SPIKE');
    });

    document.getElementById('btn-scenario-drought')?.addEventListener('click', () => {
      hardwareSimulator.setSoilMoisture(14.8);
      hardwareSimulator.setEt0(0.35);
      hardwareSimulator.setRainfall(0.00);
      workflowEngine.log('⚡ [SCENARIO] Injected Summer Heatwave: Moisture 14.8%, ET₀ 0.35"/day.');
      workflowEngine.executeWorkflow('SCENARIO_DROUGHT');
    });

    document.getElementById('btn-scenario-storm')?.addEventListener('click', () => {
      hardwareSimulator.setRainfall(1.50);
      hardwareSimulator.setSoilMoisture(32.0);
      workflowEngine.log('⚡ [SCENARIO] Injected Oklahoma Thunderstorm: Rain 1.50", Moisture 32%.');
      workflowEngine.executeWorkflow('SCENARIO_STORM');
    });
  }

  bindHardwareUI() {
    // Sliders
    const salSlider = document.getElementById('slider-salinity');
    const salVal = document.getElementById('val-salinity');
    if (salSlider && salVal) {
      salSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        salVal.textContent = `${val.toFixed(2)} mS/cm`;
        hardwareSimulator.setSalinity(val);
      });
    }

    const moistSlider = document.getElementById('slider-moisture');
    const moistVal = document.getElementById('val-moisture');
    if (moistSlider && moistVal) {
      moistSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        moistVal.textContent = `${val.toFixed(1)}%`;
        hardwareSimulator.setSoilMoisture(val);
      });
    }

    const et0Slider = document.getElementById('slider-et0');
    const et0Val = document.getElementById('val-et0');
    if (et0Slider && et0Val) {
      et0Slider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        et0Val.textContent = `${val.toFixed(2)}"/day`;
        hardwareSimulator.setEt0(val);
      });
    }

    // Subscribe to Hardware changes to update simulator rack UI
    hardwareSimulator.subscribe((hw) => {
      this.updateHardwareRackDOM(hw);
    });

    // Initial render of Hardware Rack
    this.updateHardwareRackDOM(hardwareSimulator.state);
  }

  updateHardwareRackDOM(hw) {
    // 1. WiseConn Valve 4
    const v4 = hw.valves['VALVE-04'];
    const v4El = document.getElementById('rack-valve-4-state');
    const v4Rem = document.getElementById('rack-valve-4-timer');
    const v4Tot = document.getElementById('rack-valve-4-volume');
    if (v4El) {
      if (v4.status === 'OPEN') {
        v4El.className = 'status-tag status-open';
        v4El.textContent = 'OPEN (ACTUATED)';
      } else {
        v4El.className = 'status-tag status-closed';
        v4El.textContent = 'CLOSED';
      }
    }
    if (v4Rem) {
      v4Rem.textContent = v4.remainingMinutes > 0 ? `${Math.ceil(v4.remainingMinutes)} min left` : 'Standby';
    }
    if (v4Tot) {
      v4Tot.textContent = `${Math.round(v4.totalGallonsDelivered).toLocaleString()} gal`;
    }

    // 2. VFD Well Pump
    const pumpEl = document.getElementById('rack-pump-state');
    const pumpGpm = document.getElementById('rack-pump-gpm');
    const pumpYtd = document.getElementById('rack-pump-ytd');
    if (pumpEl) {
      if (hw.pump.interlockedByQuota) {
        pumpEl.className = 'status-tag status-interlocked';
        pumpEl.textContent = 'INTERLOCKED (OWRB)';
      } else if (hw.pump.status === 'RUNNING') {
        pumpEl.className = 'status-tag status-running';
        pumpEl.textContent = 'RUNNING (55 Hz)';
      } else {
        pumpEl.className = 'status-tag status-stopped';
        pumpEl.textContent = 'STANDBY';
      }
    }
    if (pumpGpm) pumpGpm.textContent = `${hw.pump.currentGpm} GPM`;
    if (pumpYtd) {
      const acFt = (hw.pump.totalGallonsYtd / 325851).toFixed(2);
      pumpYtd.textContent = `${acFt} Ac-Ft`;
    }

    // 3. OWRB Permit Meter
    const permitBar = document.getElementById('rack-owrb-bar');
    const permitText = document.getElementById('rack-owrb-text');
    if (permitBar && permitText) {
      const pct = Math.min(100, Math.round((hw.owrbPermit.usedAcFt / hw.owrbPermit.annualQuotaAcFt) * 100));
      permitBar.style.width = `${pct}%`;
      permitBar.className = `permit-progress-bar ${pct > 90 ? 'bar-danger' : pct > 75 ? 'bar-warning' : 'bar-normal'}`;
      permitText.textContent = `${hw.owrbPermit.usedAcFt} / ${hw.owrbPermit.annualQuotaAcFt} Ac-Ft (${pct}%)`;
    }

    // 4. Update Webhook Badge Counter
    const whCount = document.getElementById('webhook-count-badge');
    if (whCount) whCount.textContent = hw.webhookLog.length;

    // 5. Update Google Sheets Counter
    const gsCount = document.getElementById('sheets-count-badge');
    if (gsCount) gsCount.textContent = hw.googleSheetsLog.length;

    // Update Slider indicators if needed
    const salVal = document.getElementById('val-salinity');
    if (salVal) salVal.textContent = `${hw.ketosProbe.salinityMsCm.toFixed(2)} mS/cm`;
    const salSlider = document.getElementById('slider-salinity');
    if (salSlider && document.activeElement !== salSlider) {
      salSlider.value = hw.ketosProbe.salinityMsCm;
    }

    const moistVal = document.getElementById('val-moisture');
    if (moistVal) moistVal.textContent = `${hw.soilMoisture.vwcPercent.toFixed(1)}%`;
    const moistSlider = document.getElementById('slider-moisture');
    if (moistSlider && document.activeElement !== moistSlider) {
      moistSlider.value = hw.soilMoisture.vwcPercent;
    }
  }

  bindNodeInspector() {
    const inspectorContainer = document.getElementById('inspector-content');

    window.addEventListener('node-selected', (e) => {
      const nodeId = e.detail.nodeId;
      this.selectedNodeId = nodeId;

      if (!nodeId) {
        inspectorContainer.innerHTML = `
          <div class="inspector-empty">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="12" cy="12" r="3"/></svg>
            <p>Select any node on the canvas to configure parameters, thresholds, and agricultural targets.</p>
          </div>
        `;
        return;
      }

      const node = workflowEngine.nodes.get(nodeId);
      if (!node) return;
      const def = NODE_DEFINITIONS[node.type];
      if (!def) return;

      let fieldsHtml = '';

      // Render custom controls based on node type
      if (node.type === 'soil-cleveland-unit') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>Cleveland County Map Unit (1987 NRCS Survey)</label>
            <select class="inspector-select" id="cfg-soil-unit">
              ${Object.keys(CLEVELAND_COUNTY_SOILS).map(k => `
                <option value="${k}" ${node.config.selectedUnit === k ? 'selected' : ''}>
                  ${CLEVELAND_COUNTY_SOILS[k].name} (${CLEVELAND_COUNTY_SOILS[k].shareOfCounty}% share)
                </option>
              `).join('')}
            </select>
          </div>
          <div class="inspector-soil-card" id="inspector-soil-detail">
            ${this.renderSoilCardDetail(node.config.selectedUnit)}
          </div>
        `;
      } else if (node.type === 'sensor-ketos-salinity') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>Salinity Spike Threshold (mS/cm)</label>
            <input type="number" step="0.1" class="inspector-input" id="cfg-salinity-thresh" value="${node.config.thresholdMsCm || 2.0}">
            <span class="field-hint">Standard Hackathon threshold: 2.0 mS/cm</span>
          </div>
          <div class="inspector-field">
            <label>Current Probe Reading (mS/cm)</label>
            <input type="number" step="0.05" class="inspector-input" id="cfg-current-salinity" value="${node.config.currentSalinity || 2.25}">
          </div>
        `;
      } else if (node.type === 'action-wiseconn-valve') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>Valve Identifier</label>
            <input type="text" class="inspector-input" id="cfg-valve-id" value="${node.config.valveId || 'VALVE-04'}">
          </div>
          <div class="inspector-field">
            <label>Zone Name</label>
            <input type="text" class="inspector-input" id="cfg-zone-name" value="${node.config.zoneName || 'Block C - Pecan Orchard'}">
          </div>
          <div class="inspector-field">
            <label>Run Duration (Minutes)</label>
            <input type="number" class="inspector-input" id="cfg-duration" value="${node.config.nominalDurationMinutes || 20}">
            <span class="field-hint">Hackathon prompt: 20 minutes flush</span>
          </div>
          <div class="inspector-field">
            <label>Flow Rate (GPM)</label>
            <input type="number" class="inspector-input" id="cfg-valve-gpm" value="${node.config.flowRateGpm || 120}">
          </div>
        `;
      } else if (node.type === 'logic-comparator') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>Comparison Operator</label>
            <select class="inspector-select" id="cfg-comp-op">
              <option value=">" ${node.config.operator === '>' ? 'selected' : ''}>&gt; (Greater than)</option>
              <option value=">=" ${node.config.operator === '>=' ? 'selected' : ''}>&gt;= (Greater or equal)</option>
              <option value="<" ${node.config.operator === '<' ? 'selected' : ''}>&lt; (Less than)</option>
              <option value="<=" ${node.config.operator === '<=' ? 'selected' : ''}>&lt;= (Less or equal)</option>
              <option value="==" ${node.config.operator === '==' ? 'selected' : ''}>== (Equal)</option>
            </select>
          </div>
          <div class="inspector-field">
            <label>Threshold Value</label>
            <input type="number" step="0.1" class="inspector-input" id="cfg-comp-thresh" value="${node.config.threshold ?? 2.0}">
          </div>
        `;
      } else if (node.type === 'logic-water-deficit-calc') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>Field Size (Acres)</label>
            <input type="number" step="0.5" class="inspector-input" id="cfg-field-acres" value="${node.config.fieldAcres || 12.5}">
          </div>
          <div class="inspector-field">
            <label>Crop Coefficient (Kc)</label>
            <input type="number" step="0.05" class="inspector-input" id="cfg-crop-kc" value="${node.config.cropCoefficientKc || 1.05}">
          </div>
          <div class="inspector-field">
            <label>Irrigation Distribution Uniformity (DU)</label>
            <input type="number" step="0.05" class="inspector-input" id="cfg-du" value="${node.config.distributionUniformity || 0.88}">
          </div>
        `;
      } else if (node.type === 'logic-owrb-quota-guard') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>OWRB Groundwater Permit Number</label>
            <input type="text" class="inspector-input" id="cfg-permit-num" value="${node.config.permitNumber || 'OWRB-GW-2026-0814'}">
          </div>
          <div class="inspector-field">
            <label>Annual Quota (Acre-Feet)</label>
            <input type="number" step="1" class="inspector-input" id="cfg-annual-quota" value="${node.config.annualAllocationAcFt || 25.0}">
          </div>
        `;
      } else if (node.type === 'log-google-sheets') {
        fieldsHtml = `
          <div class="inspector-field">
            <label>Google Sheet Title</label>
            <input type="text" class="inspector-input" id="cfg-sheet-name" value="${node.config.sheetName || '2026_Irrigation_Water_Volume_Norman'}">
          </div>
          <div class="inspector-field">
            <label>Logged Columns</label>
            <textarea class="inspector-input" rows="2" id="cfg-sheet-cols">${node.config.columns || 'Timestamp, ValveID, DurationMinutes, Gallons, SalinityEC'}</textarea>
          </div>
        `;
      } else {
        // Generic config key-value editors
        fieldsHtml = Object.entries(node.config).map(([key, val]) => `
          <div class="inspector-field">
            <label>${key}</label>
            <input type="${typeof val === 'number' ? 'number' : 'text'}" class="inspector-input cfg-generic" data-cfg-key="${key}" value="${val}">
          </div>
        `).join('');
      }

      inspectorContainer.innerHTML = `
        <div class="inspector-header" style="border-left: 4px solid ${def.accentColor}">
          <div class="inspector-title">${def.title}</div>
          <div class="inspector-subtitle">${def.subtitle} [ID: ${node.id}]</div>
        </div>
        <div class="inspector-form">
          ${fieldsHtml}
          <div class="inspector-actions">
            <button class="btn btn-primary btn-sm" id="btn-save-inspector">Update Node</button>
            <button class="btn btn-secondary btn-sm" id="btn-delete-node-inspector">Delete Node</button>
          </div>
        </div>
      `;

      // Bind Save
      document.getElementById('btn-save-inspector')?.addEventListener('click', () => {
        this.saveNodeInspectorValues(node);
      });

      // Bind Delete
      document.getElementById('btn-delete-node-inspector')?.addEventListener('click', () => {
        workflowEngine.removeNode(node.id);
      });

      // Soil unit dynamic change
      const soilSel = document.getElementById('cfg-soil-unit');
      if (soilSel) {
        soilSel.addEventListener('change', (e) => {
          node.config.selectedUnit = e.target.value;
          const detailEl = document.getElementById('inspector-soil-detail');
          if (detailEl) detailEl.innerHTML = this.renderSoilCardDetail(e.target.value);
          workflowEngine.updateNodeConfig(node.id, { selectedUnit: e.target.value });
        });
      }
    });
  }

  renderSoilCardDetail(unitKey) {
    const s = CLEVELAND_COUNTY_SOILS[unitKey] || CLEVELAND_COUNTY_SOILS['stephenville-harrah-newalla'];
    return `
      <div class="soil-detail-card">
        <div class="soil-metric-row">
          <span>Permeability:</span> <strong class="badge-permeability">${s.overallPermeability}</strong>
        </div>
        <div class="soil-metric-row">
          <span>Max Infiltration:</span> <strong>${s.infiltrationRateInHr}" / hour</strong>
        </div>
        <div class="soil-metric-row">
          <span>Avail. Water Cap:</span> <strong>${s.availableWaterCapacity} in/in</strong>
        </div>
        <div class="soil-metric-row">
          <span>Runoff Risk:</span> <strong style="color: ${s.infiltrationRateInHr < 0.3 ? '#ef4444' : '#10b981'}">${s.runoffRisk}</strong>
        </div>
        <div class="soil-desc-text">${s.description}</div>
      </div>
    `;
  }

  saveNodeInspectorValues(node) {
    const newConfig = { ...node.config };

    if (node.type === 'sensor-ketos-salinity') {
      const th = document.getElementById('cfg-salinity-thresh');
      const cur = document.getElementById('cfg-current-salinity');
      if (th) newConfig.thresholdMsCm = parseFloat(th.value);
      if (cur) {
        newConfig.currentSalinity = parseFloat(cur.value);
        hardwareSimulator.setSalinity(newConfig.currentSalinity);
      }
    } else if (node.type === 'action-wiseconn-valve') {
      const vid = document.getElementById('cfg-valve-id');
      const dur = document.getElementById('cfg-duration');
      const gpm = document.getElementById('cfg-valve-gpm');
      if (vid) newConfig.valveId = vid.value;
      if (dur) newConfig.nominalDurationMinutes = parseInt(dur.value);
      if (gpm) newConfig.flowRateGpm = parseInt(gpm.value);
    } else if (node.type === 'logic-comparator') {
      const op = document.getElementById('cfg-comp-op');
      const th = document.getElementById('cfg-comp-thresh');
      if (op) newConfig.operator = op.value;
      if (th) newConfig.threshold = parseFloat(th.value);
    } else if (node.type === 'logic-water-deficit-calc') {
      const ac = document.getElementById('cfg-field-acres');
      const kc = document.getElementById('cfg-crop-kc');
      if (ac) newConfig.fieldAcres = parseFloat(ac.value);
      if (kc) newConfig.cropCoefficientKc = parseFloat(kc.value);
    } else if (node.type === 'log-google-sheets') {
      const sh = document.getElementById('cfg-sheet-name');
      if (sh) newConfig.sheetName = sh.value;
    }

    workflowEngine.updateNodeConfig(node.id, newConfig);
    workflowEngine.log(`⚙️ Saved configuration for node: ${node.id}`);
  }

  bindConsoleAndModals() {
    // Console log updates
    const consoleBody = document.getElementById('console-log-body');
    workflowEngine.subscribe((evt, data) => {
      if (evt === 'LOG_APPENDED' && consoleBody) {
        const item = document.createElement('div');
        item.className = 'log-entry';
        item.innerHTML = `<span class="log-time">[${data.timestamp}]</span> ${data.text}`;
        consoleBody.prepend(item);
      }
    });

    document.getElementById('btn-clear-console')?.addEventListener('click', () => {
      if (consoleBody) consoleBody.innerHTML = '';
      workflowEngine.executionLog = [];
    });

    // Google Sheets Modal
    const sheetModal = document.getElementById('modal-google-sheets');
    document.getElementById('btn-open-sheets-modal')?.addEventListener('click', () => {
      this.populateGoogleSheetsModal();
      if (sheetModal) sheetModal.style.display = 'flex';
    });

    // OWRB Ledger Modal
    const owrbModal = document.getElementById('modal-owrb');
    document.getElementById('btn-open-owrb-modal')?.addEventListener('click', () => {
      this.populateOwrbModal();
      if (owrbModal) owrbModal.style.display = 'flex';
    });

    // Webhook Log Modal
    const whModal = document.getElementById('modal-webhooks');
    document.getElementById('btn-open-webhooks-modal')?.addEventListener('click', () => {
      this.populateWebhookModal();
      if (whModal) whModal.style.display = 'flex';
    });

    // Cleveland County Soil Survey Pedon Modal
    const soilModal = document.getElementById('modal-soil-survey');
    document.getElementById('btn-open-soil-modal')?.addEventListener('click', () => {
      this.populateSoilModal();
      if (soilModal) soilModal.style.display = 'flex';
    });

    // Close Modals
    document.querySelectorAll('.modal-close, .modal-backdrop').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop') || e.target.classList.contains('modal-close')) {
          e.target.closest('.modal-container').style.display = 'none';
        }
      });
    });
  }

  populateGoogleSheetsModal() {
    const tableBody = document.getElementById('sheets-table-body');
    if (!tableBody) return;
    const rows = hardwareSimulator.state.googleSheetsLog;

    tableBody.innerHTML = rows.map(r => `
      <tr>
        <td>#${r.rowId}</td>
        <td><strong>${r.timestamp}</strong></td>
        <td><span class="badge-valve">${r.valveId}</span></td>
        <td>${r.durationMin} min</td>
        <td><strong>${r.gallons.toLocaleString()} gal</strong></td>
        <td>${r.salinity}</td>
        <td class="notes-cell">${r.notes}</td>
      </tr>
    `).join('');
  }

  populateOwrbModal() {
    const tableBody = document.getElementById('owrb-table-body');
    const quotaHeader = document.getElementById('owrb-modal-quota-stat');
    if (quotaHeader) {
      const p = hardwareSimulator.state.owrbPermit;
      quotaHeader.innerHTML = `
        <strong>Permit:</strong> ${p.permitId} | 
        <strong>Basin:</strong> ${p.basin} | 
        <strong>Used:</strong> ${p.usedAcFt} / ${p.annualQuotaAcFt} Acre-Feet 
        <span class="status-tag ${p.status === 'IN_COMPLIANCE' ? 'status-open' : 'status-interlocked'}">${p.status}</span>
      `;
    }

    if (!tableBody) return;
    const records = hardwareSimulator.state.owrbPermit.ledgerRecords;

    tableBody.innerHTML = records.map(r => `
      <tr>
        <td>${r.timestamp}</td>
        <td><strong>${r.source}</strong></td>
        <td>${r.gallons.toLocaleString()} gal</td>
        <td><strong>${r.acreFeet} Ac-Ft</strong></td>
        <td>${r.balanceRemainingAcFt} Ac-Ft</td>
        <td><span class="status-tag status-open">${r.status}</span></td>
      </tr>
    `).join('');
  }

  populateWebhookModal() {
    const container = document.getElementById('webhook-cards-container');
    if (!container) return;
    const list = hardwareSimulator.state.webhookLog;

    if (list.length === 0) {
      container.innerHTML = `<div class="empty-hint">No webhook dispatches recorded yet. Run a workflow to trigger API calls.</div>`;
      return;
    }

    container.innerHTML = list.map(wh => `
      <div class="webhook-card">
        <div class="webhook-card-header">
          <span class="http-badge ${wh.method === 'POST' ? 'post' : 'evt'}">${wh.method}</span>
          <span class="webhook-url">${wh.endpoint}</span>
          <span class="webhook-time">${wh.timestamp}</span>
        </div>
        <div class="webhook-payload">
          <strong>Payload Dispatched:</strong>
          <pre>${JSON.stringify(wh.payload, null, 2)}</pre>
        </div>
        <div class="webhook-response">
          <span class="status-200">HTTP ${wh.response.status} OK</span> - ${wh.response.message}
        </div>
      </div>
    `).join('');
  }

  populateSoilModal() {
    const container = document.getElementById('soil-survey-modal-body');
    if (!container) return;

    const k = KONAWA_SERIES_PROFILE;
    container.innerHTML = `
      <div class="soil-modal-grid">
        <div class="soil-modal-intro">
          <h3>Cleveland County, Oklahoma (Norman) NRCS Soil Data</h3>
          <p>Norman sits primarily within the <strong>Stephenville-Harrah-Newalla</strong> association (~40% of Cleveland County), with alluvial loams along the South Canadian River and expansive clayey subsoils (Renfrow/Doolin) across upland divides.</p>
        </div>

        <div class="soil-units-overview-table">
          <h4>1987 NRCS Cleveland County Map Units Summary</h4>
          <table class="data-table">
            <thead>
              <tr>
                <th>Map Unit</th>
                <th>County Share</th>
                <th>Parent Material</th>
                <th>Permeability</th>
                <th>Runoff Risk</th>
                <th>Infiltration Rate</th>
              </tr>
            </thead>
            <tbody>
              ${Object.values(CLEVELAND_COUNTY_SOILS).map(u => `
                <tr>
                  <td><strong>${u.name}</strong></td>
                  <td>${u.shareOfCounty}%</td>
                  <td>${u.parentMaterial}</td>
                  <td><span class="badge-permeability">${u.overallPermeability}</span></td>
                  <td>${u.runoffRisk}</td>
                  <td><strong>${u.infiltrationRateInHr}" / hr</strong></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="pedon-horizon-section">
          <h4>Detailed Konawa Pedon Profile (Fine-Loamy Ultic Haplustalf)</h4>
          <p>Classification: <em>${k.classification}</em> | Bedrock: <em>${k.bedrockDepthInches}</em></p>
          <table class="data-table">
            <thead>
              <tr>
                <th>Horizon</th>
                <th>Depth (cm)</th>
                <th>Depth (in)</th>
                <th>Color (Moist)</th>
                <th>Texture</th>
                <th>Structure</th>
                <th>Clay %</th>
                <th>Reaction (pH)</th>
              </tr>
            </thead>
            <tbody>
              ${k.horizons.map(h => `
                <tr>
                  <td><strong>${h.horizon}</strong></td>
                  <td>${h.depthCm}</td>
                  <td>${h.depthInches}</td>
                  <td>${h.color}</td>
                  <td>${h.texture}</td>
                  <td>${h.structure}</td>
                  <td><strong>${h.clayPercent}%</strong></td>
                  <td>${h.reaction}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="soil-health-baselines">
          <h4>Oklahoma Soil Test Medians (OSU Extension 2018–2022)</h4>
          <div class="stat-pills-row">
            <div class="stat-pill"><strong>Soil pH:</strong> 6.2 (Slightly Acid)</div>
            <div class="stat-pill"><strong>Nitrate-N:</strong> 8 lb/acre</div>
            <div class="stat-pill"><strong>Phosphorus (STP):</strong> 32</div>
            <div class="stat-pill"><strong>Potassium (STK):</strong> 233</div>
            <div class="stat-pill"><strong>Organic Matter:</strong> ~1.0%</div>
          </div>
        </div>
      </div>
    `;
  }
}

// Instantiate and boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const app = new FarmFlowApp();
  app.init();
  window.farmFlowApp = app;
});
