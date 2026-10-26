/**
 * Farm-Flow: Graph Execution Engine & Webhook Dispatcher
 * Evaluates directed workflow graphs, computes water balance formulas,
 * triggers actuators in the virtual hardware rack, and coordinates visual flow pulses.
 */

import { NODE_DEFINITIONS } from './node-definitions.js';
import { CLEVELAND_COUNTY_SOILS, HydrologyCalculations } from './soil-data.js';
import { hardwareSimulator } from './hardware-simulator.js';

export class WorkflowEngine {
  constructor() {
    this.nodes = new Map(); // id -> node instance
    this.connections = []; // array of { id, fromNode, fromPort, toNode, toPort }
    this.listeners = new Set();
    this.executionLog = [];
    this.isSimulatingContinuous = false;
    this.simulationInterval = null;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data));
  }

  loadGraph(graphData) {
    this.nodes.clear();
    this.connections = [];

    (graphData.nodes || []).forEach(n => {
      this.nodes.set(n.id, {
        ...n,
        runtimeOutputs: {},
        executionState: 'IDLE' // 'IDLE' | 'EVALUATING' | 'SUCCESS' | 'ERROR'
      });
    });

    this.connections = (graphData.connections || []).map(c => ({ ...c }));
    this.notify('GRAPH_LOADED', { nodes: Array.from(this.nodes.values()), connections: this.connections });
  }

  addNode(type, x, y, customConfig = {}) {
    const def = NODE_DEFINITIONS[type];
    if (!def) return null;

    const id = `node-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`;
    const newNode = {
      id,
      type,
      x: Math.round(x),
      y: Math.round(y),
      config: { ...def.defaultConfig, ...customConfig },
      runtimeOutputs: {},
      executionState: 'IDLE'
    };

    this.nodes.set(id, newNode);
    this.notify('NODE_ADDED', newNode);
    return newNode;
  }

  removeNode(nodeId) {
    if (!this.nodes.has(nodeId)) return;
    this.nodes.delete(nodeId);
    this.connections = this.connections.filter(c => c.fromNode !== nodeId && c.toNode !== nodeId);
    this.notify('NODE_REMOVED', { nodeId });
  }

  addConnection(fromNode, fromPort, toNode, toPort) {
    // Avoid duplicates or self-connections
    if (fromNode === toNode) return null;
    const exists = this.connections.some(c =>
      c.fromNode === fromNode && c.fromPort === fromPort &&
      c.toNode === toNode && c.toPort === toPort
    );
    if (exists) return null;

    const conn = {
      id: `wire-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
      fromNode,
      fromPort,
      toNode,
      toPort,
      active: false
    };

    this.connections.push(conn);
    this.notify('CONNECTION_ADDED', conn);
    return conn;
  }

  removeConnection(connectionId) {
    const idx = this.connections.findIndex(c => c.id === connectionId);
    if (idx !== -1) {
      const removed = this.connections.splice(idx, 1)[0];
      this.notify('CONNECTION_REMOVED', removed);
    }
  }

  updateNodeConfig(nodeId, newConfig) {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.config = { ...node.config, ...newConfig };
      this.notify('NODE_UPDATED', node);
    }
  }

  /**
   * Execute the full workflow graph
   */
  async executeWorkflow(triggerSource = 'USER_MANUAL') {
    const timestamp = new Date().toLocaleTimeString();
    this.log(`🚀 [ENGINE] Starting Workflow Execution (Trigger: ${triggerSource})`);

    // Reset runtime states
    this.nodes.forEach(n => {
      n.executionState = 'EVALUATING';
      n.runtimeOutputs = {};
    });
    this.connections.forEach(c => { c.active = false; });
    this.notify('EXECUTION_STARTED');

    // Build dependency map
    const incoming = new Map();
    this.nodes.forEach(n => incoming.set(n.id, []));
    this.connections.forEach(c => {
      if (incoming.has(c.toNode)) {
        incoming.get(c.toNode).push(c);
      }
    });

    // Find root nodes (no incoming connections or source sensors)
    const queue = [];
    incoming.forEach((conns, nodeId) => {
      if (conns.length === 0) queue.push(nodeId);
    });

    const evaluated = new Set();

    while (queue.length > 0) {
      const currentId = queue.shift();
      const node = this.nodes.get(currentId);
      if (!node) continue;

      // Animate node active
      node.executionState = 'EVALUATING';
      this.notify('NODE_STATUS_CHANGE', { nodeId: currentId, state: 'EVALUATING' });
      await this.sleep(120);

      try {
        // Collect inputs from incoming connections
        const nodeInputs = {};
        const incomingConns = incoming.get(currentId) || [];
        incomingConns.forEach(conn => {
          const sourceNode = this.nodes.get(conn.fromNode);
          if (sourceNode && sourceNode.runtimeOutputs) {
            nodeInputs[conn.toPort] = sourceNode.runtimeOutputs[conn.fromPort];
          }
        });

        // Evaluate node logic
        const outputs = this.evaluateSingleNode(node, nodeInputs);
        node.runtimeOutputs = outputs;
        node.executionState = 'SUCCESS';

        // Animate outgoing connections
        const outgoingConns = this.connections.filter(c => c.fromNode === currentId);
        outgoingConns.forEach(c => {
          c.active = true;
          if (!queue.includes(c.toNode) && !evaluated.has(c.toNode)) {
            // Check if all dependencies ready
            const canRun = incoming.get(c.toNode).every(dep => evaluated.has(dep.fromNode) || dep.fromNode === currentId);
            if (canRun) queue.push(c.toNode);
          }
        });

        this.notify('NODE_STATUS_CHANGE', { nodeId: currentId, state: 'SUCCESS', outputs });
        await this.sleep(150);

      } catch (err) {
        console.error(`Error evaluating node ${currentId}:`, err);
        node.executionState = 'ERROR';
        this.notify('NODE_STATUS_CHANGE', { nodeId: currentId, state: 'ERROR', error: err.message });
      }

      evaluated.add(currentId);
    }

    this.log(`✅ [ENGINE] Workflow Completed. All actuators and telemetry synchronized.`);
    this.notify('EXECUTION_COMPLETED');
  }

  /**
   * Core logic handler for each node type
   */
  evaluateSingleNode(node, inputs) {
    const hw = hardwareSimulator.state;
    const cfg = node.config;

    switch (node.type) {
      // 1. KETOS Salinity Sensor
      case 'sensor-ketos-salinity': {
        const sal = hw.ketosProbe.salinityMsCm ?? cfg.currentSalinity;
        const isSpike = sal > (cfg.thresholdMsCm || 2.0);
        this.log(`📊 [KETOS] Salinity: ${sal} mS/cm | Spike Trigger: ${isSpike}`);
        return {
          salinity: sal,
          salinitySpike: isSpike
        };
      }

      // 2. Soil Moisture Sensor (AquaSpy)
      case 'sensor-soil-moisture': {
        const vwc = hw.soilMoisture.vwcPercent ?? cfg.currentVwc;
        const deficit = vwc < (cfg.refillThreshold || 22.0);
        this.log(`🌱 [AquaSpy] VWC: ${vwc}% | Refill Deficit Trigger: ${deficit}`);
        return {
          vwc,
          deficitDetected: deficit,
          soilProfileData: { vwc, depth: cfg.depthInches, temp: hw.soilMoisture.temperatureF }
        };
      }

      // 3. Weather & ET0 Station
      case 'sensor-weather-et0': {
        const et0 = hw.weather.et0Inches ?? cfg.dailyEt0;
        const rain = hw.weather.rainfallInches ?? cfg.rainfall24h;
        const netDeficit = Math.max(0, Number((et0 - rain).toFixed(2)));
        const rainLockout = rain >= (cfg.rainLockoutThreshold || 0.25);
        this.log(`☀️ [Weather] ET₀: ${et0}" | Rain: ${rain}" | Net Deficit: ${netDeficit}"`);
        return {
          et0,
          rainfall: rain,
          netDeficit,
          rainLockout
        };
      }

      // 4. Well Flow Meter (McCrometer)
      case 'sensor-well-meter': {
        const gpm = hw.pump.status === 'RUNNING' ? (hw.pump.currentGpm || cfg.nominalGpm) : 0;
        const ytdGallons = hw.pump.totalGallonsYtd;
        const acFt = HydrologyCalculations.gallonsToAcreFeet(ytdGallons);
        this.log(`🌊 [Meter] Rate: ${gpm} GPM | Totalizer: ${ytdGallons.toLocaleString()} gal (${acFt} Ac-Ft)`);
        return {
          flowRateGpm: gpm,
          gallonsPumpedToday: 3200,
          acreFeetExtracted: acFt,
          wellOperating: hw.pump.status === 'RUNNING'
        };
      }

      // 5. Cleveland County Soil Survey
      case 'soil-cleveland-unit': {
        const unit = CLEVELAND_COUNTY_SOILS[cfg.selectedUnit] || CLEVELAND_COUNTY_SOILS['stephenville-harrah-newalla'];
        this.log(`🗺️ [Cleveland Co. NRCS] Selected: ${unit.name} | Max Infil: ${unit.infiltrationRateInHr}"/hr | Risk: ${unit.runoffRisk}`);
        return {
          infiltrationRate: unit.infiltrationRateInHr,
          availableWaterCapacity: unit.availableWaterCapacity,
          runoffRiskLevel: unit.runoffRisk,
          soilMetadata: unit
        };
      }

      // 6. Logic: Comparator (IF/THEN)
      case 'logic-comparator': {
        const inVal = inputs.inputValue ?? 0;
        const thresh = Number(cfg.threshold ?? 2.0);
        let conditionMet = false;

        switch (cfg.operator) {
          case '>': conditionMet = inVal > thresh; break;
          case '>=': conditionMet = inVal >= thresh; break;
          case '<': conditionMet = inVal < thresh; break;
          case '<=': conditionMet = inVal <= thresh; break;
          case '==': conditionMet = inVal === thresh; break;
          default: conditionMet = inVal > thresh;
        }

        this.log(`⚖️ [Comparator] Evaluating: ${inVal} ${cfg.operator} ${thresh} -> ${conditionMet ? 'TRUE (Trigger THEN)' : 'FALSE'}`);
        return {
          result: conditionMet,
          thenPulse: conditionMet,
          elsePulse: !conditionMet
        };
      }

      // 7. Logic: Water Deficit & Volume Calculation
      case 'logic-water-deficit-calc': {
        const netDeficit = inputs.deficitInches ?? 0.23;
        const acres = Number(cfg.fieldAcres || 12.5);
        const gpm = inputs.systemFlowGpm || cfg.fallbackGpm || 120;
        const kc = Number(cfg.cropCoefficientKc || 1.05);

        const adjustedDeficit = netDeficit * kc;
        const res = HydrologyCalculations.calcRequiredRunMinutes(adjustedDeficit, acres, gpm, cfg.distributionUniformity || 0.88);

        this.log(`💧 [Hydrology Calc] Deficit: ${adjustedDeficit.toFixed(2)}" on ${acres}ac @ ${gpm} GPM -> Requires ${res.totalGallons.toLocaleString()} gal (~${res.runMinutes} min)`);
        return {
          gallonsRequired: res.totalGallons,
          runTimeMinutes: res.runMinutes,
          acreInches: Number((adjustedDeficit * acres).toFixed(2))
        };
      }

      // 8. Logic: Soil Infiltration Limiter (Cycle & Soak)
      case 'logic-infiltration-limiter': {
        const targetMinutes = inputs.targetRunMinutes || 25;
        const infilRate = inputs.soilInfiltrationInHr || 1.1;

        let cycleMin = 20;
        let soakMin = 20;
        if (infilRate < 0.3) {
          cycleMin = 10;
          soakMin = 35;
        } else if (infilRate < 0.8) {
          cycleMin = 18;
          soakMin = 25;
        } else {
          cycleMin = targetMinutes;
          soakMin = 0;
        }

        const totalCycles = soakMin > 0 ? Math.ceil(targetMinutes / cycleMin) : 1;
        this.log(`🛡️ [Soil Safeguard] Infil: ${infilRate}"/hr -> Enforcing Pulse: ${cycleMin}m ON / ${soakMin}m SOAK (${totalCycles} cycles)`);
        return {
          cycleRunMinutes: cycleMin,
          soakMinutes: soakMin,
          totalCycles,
          safeApplicationTrigger: true
        };
      }

      // 9. Logic: OWRB Groundwater Quota Guard
      case 'logic-owrb-quota-guard': {
        const totalGallons = inputs.cumulativeGallons || hw.pump.totalGallonsYtd;
        const usedAcFt = HydrologyCalculations.gallonsToAcreFeet(totalGallons);
        const permitCap = Number(cfg.annualAllocationAcFt || 25.0);
        const pct = Math.round((usedAcFt / permitCap) * 100);
        const overQuota = usedAcFt >= permitCap;

        this.log(`🏛️ [OWRB Quota Guard] Cumulative: ${usedAcFt} / ${permitCap} Ac-Ft (${pct}%)`);
        return {
          quotaRemainingAcFt: Math.max(0, Number((permitCap - usedAcFt).toFixed(2))),
          percentQuotaUsed: pct,
          permitApproved: !overQuota,
          emergencyCutoffTrigger: overQuota
        };
      }

      // 10. Logic: Power Peak Tariff Gate (OG&E)
      case 'gate-peak-power': {
        const currentHour = new Date().getHours();
        const isPeak = currentHour >= (cfg.peakStartHour || 14) && currentHour < (cfg.peakEndHour || 19);
        const allow = !isPeak || cfg.overrideForCropStress;

        this.log(`⚡ [Electric Gate] Hour: ${currentHour}:00 | Peak Window: ${cfg.peakStartHour}-${cfg.peakEndHour} -> ${allow ? 'PERMITTED' : 'CURTAILED'}`);
        return {
          allowOperation: allow,
          curtailedRequest: !allow
        };
      }

      // 11. Actuator: WiseConn DropControl Valve
      case 'action-wiseconn-valve': {
        const shouldTrigger = inputs.trigger !== false;
        const duration = inputs.durationMinutes || cfg.nominalDurationMinutes || 20;

        if (shouldTrigger) {
          const webhookCall = hardwareSimulator.openWiseConnValve(cfg.valveId || 'VALVE-04', duration);
          this.log(`🚜 [WiseConn Actuator] Valve ${cfg.valveId} OPENED for ${duration} min via DropControl API`);
          return {
            valveStatus: 'OPEN',
            waterDischargedGallons: duration * (cfg.flowRateGpm || 120),
            completedPulse: true
          };
        }
        return { valveStatus: 'CLOSED', waterDischargedGallons: 0, completedPulse: false };
      }

      // 12. Actuator: VFD Well Pump
      case 'action-vfd-pump': {
        if (inputs.commandStop) {
          hardwareSimulator.stopPump();
          this.log(`🛑 [VFD Pump] Emergency Interlock triggered. Pump STOPPED.`);
          return { isRunning: false, activeGpm: 0, powerKw: 0 };
        }
        if (inputs.commandStart !== false) {
          const target = inputs.targetGpm || cfg.targetGpm || 450;
          hardwareSimulator.startPump(target);
          this.log(`🚀 [VFD Pump] Pump STARTED at ${target} GPM`);
          return { isRunning: true, activeGpm: target, powerKw: 42.5 };
        }
        return { isRunning: hw.pump.status === 'RUNNING', activeGpm: hw.pump.currentGpm, powerKw: 0 };
      }

      // 13. Compliance: Google Sheets Sync
      case 'log-google-sheets': {
        const row = hardwareSimulator.appendGoogleSheetRow({
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          valveId: 'VALVE-04',
          durationMin: 20,
          gallons: 2400,
          salinity: `${hw.ketosProbe.salinityMsCm} mS/cm`,
          notes: 'Auto-appended by Farm-Flow Google Sheet Integration'
        });
        this.log(`📋 [Google Sheets] Row #${row.rowId} logged for regulatory compliance.`);
        return { status: true };
      }

      // 14. Compliance: OWRB Regulatory Ledger
      case 'log-owrb-ledger': {
        const gallons = inputs.gallonsPumped || 2400;
        const source = inputs.valveOrPumpSource || 'VALVE-04';
        const record = hardwareSimulator.logOwrbExtraction(gallons, source);
        this.log(`🏛️ [OWRB Ledger] Audit entry logged: +${gallons.toLocaleString()} gal (+${record.acreFeet} Ac-Ft). Balance: ${record.balanceRemainingAcFt} Ac-Ft`);
        return {
          auditRecorded: true,
          totalYearToDateAcreFt: hw.owrbPermit.usedAcFt
        };
      }

      // 15. Compliance: Twilio SMS Alert
      case 'alert-sms-twilio': {
        const msg = inputs.alertMessage || cfg.defaultTemplate || 'Farm-Flow Alert';
        this.log(`📱 [Twilio SMS] Dispatched to ${cfg.recipientPhone}: "${msg}"`);
        return { messageSent: true };
      }

      // 16. Actuator: Custom Webhook
      case 'action-custom-webhook': {
        this.log(`🌐 [Custom Webhook] POST dispatched to ${cfg.endpointUrl}`);
        hardwareSimulator.logWebhook(cfg.endpointUrl, { event: 'FARM_FLOW_TRIGGER', timestamp: new Date().toISOString() });
        return { responseStatus: 200, isSuccess: true };
      }

      default:
        return {};
    }
  }

  log(message) {
    const entry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      text: message
    };
    this.executionLog.unshift(entry);
    if (this.executionLog.length > 100) this.executionLog.pop();
    this.notify('LOG_APPENDED', entry);
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export const workflowEngine = new WorkflowEngine();
