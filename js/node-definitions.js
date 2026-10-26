/**
 * Farm-Flow: Ag-Tech Node Definitions & Metadata Catalog
 * Focus: Water Quantity, Soil Infiltration, Equipment Control, and OWRB Compliance
 */

export const NODE_CATEGORIES = {
  SENSORS: { id: 'sensors', name: 'Sensors & Field Telemetry', color: '#06b6d4', icon: 'droplet' },
  SOIL: { id: 'soil', name: 'Cleveland Co. Soil Profiles', color: '#10b981', icon: 'layers' },
  LOGIC: { id: 'logic', name: 'Hydrology & Logic Gates', color: '#8b5cf6', icon: 'cpu' },
  EQUIPMENT: { id: 'equipment', name: 'Equipment & Actuators', color: '#f59e0b', icon: 'zap' },
  COMPLIANCE: { id: 'compliance', name: 'Compliance & Alerts', color: '#ec4899', icon: 'file-text' }
};

export const NODE_DEFINITIONS = {
  // ==================== SENSORS & TELEMETRY ====================
  'sensor-soil-moisture': {
    type: 'sensor-soil-moisture',
    category: 'sensors',
    title: 'Soil Moisture Probe (AquaSpy)',
    subtitle: 'Root Zone Moisture Telemetry',
    icon: 'droplets',
    accentColor: '#06b6d4',
    inputs: [],
    outputs: [
      { id: 'vwc', label: 'Moisture (VWC %)', type: 'number' },
      { id: 'deficitDetected', label: 'Below Refill Point', type: 'boolean' },
      { id: 'soilProfileData', label: 'Probe Data Object', type: 'object' }
    ],
    defaultConfig: {
      sensorId: 'PROBE-NORM-01',
      fieldZone: 'Zone 4 - North Orchard',
      depthInches: 24,
      currentVwc: 17.5,
      refillThreshold: 22.0,
      fieldCapacity: 35.0
    },
    renderSummary(cfg) {
      return `Current: <b>${cfg.currentVwc}%</b> (Refill: &lt;${cfg.refillThreshold}%)`;
    }
  },

  'sensor-weather-et0': {
    type: 'sensor-weather-et0',
    category: 'sensors',
    title: 'Weather & ET₀ Station',
    subtitle: 'Evapotranspiration & Rain',
    icon: 'cloud-sun',
    accentColor: '#0ea5e9',
    inputs: [],
    outputs: [
      { id: 'et0', label: 'ET₀ (in/day)', type: 'number' },
      { id: 'rainfall', label: 'Rainfall 24h (in)', type: 'number' },
      { id: 'netDeficit', label: 'Net Water Deficit (in)', type: 'number' },
      { id: 'rainLockout', label: 'Rain Lockout Active', type: 'boolean' }
    ],
    defaultConfig: {
      stationId: 'DAVIS-OK-NORM',
      dailyEt0: 0.28,
      rainfall24h: 0.05,
      tempF: 88,
      rainLockoutThreshold: 0.25
    },
    renderSummary(cfg) {
      const net = (cfg.dailyEt0 - cfg.rainfall24h).toFixed(2);
      return `ET₀: <b>${cfg.dailyEt0}"</b> | Rain: <b>${cfg.rainfall24h}"</b> | Deficit: <b>${net}"</b>`;
    }
  },

  'sensor-ketos-salinity': {
    type: 'sensor-ketos-salinity',
    category: 'sensors',
    title: 'KETOS Water Quality Probe',
    subtitle: 'Salinity & EC In-Line Sensor',
    icon: 'activity',
    accentColor: '#14b8a6',
    inputs: [],
    outputs: [
      { id: 'salinity', label: 'Salinity (mS/cm)', type: 'number' },
      { id: 'salinitySpike', label: 'Flush Trigger (&gt;2.0)', type: 'boolean' }
    ],
    defaultConfig: {
      sensorModel: 'KETOS SHIELD-2',
      currentSalinity: 2.25,
      thresholdMsCm: 2.00,
      samplingRateMin: 15
    },
    renderSummary(cfg) {
      const status = cfg.currentSalinity > cfg.thresholdMsCm ? '⚠️ HIGH' : '✅ NORMAL';
      return `EC: <b>${cfg.currentSalinity} mS/cm</b> [${status}]`;
    }
  },

  'sensor-well-meter': {
    type: 'sensor-well-meter',
    category: 'sensors',
    title: 'McCrometer Well Flow Meter',
    subtitle: 'Water Extraction Totalizer',
    icon: 'gauge',
    accentColor: '#3b82f6',
    inputs: [],
    outputs: [
      { id: 'flowRateGpm', label: 'Flow Rate (GPM)', type: 'number' },
      { id: 'gallonsPumpedToday', label: 'Gallons Today', type: 'number' },
      { id: 'acreFeetExtracted', label: 'Acre-Feet Extracted', type: 'number' },
      { id: 'wellOperating', label: 'Pump Running', type: 'boolean' }
    ],
    defaultConfig: {
      meterId: 'FLOW-MCR-801',
      nominalGpm: 450,
      currentGpm: 450,
      totalGallonsYtd: 4850000,
      linePressurePsi: 58
    },
    renderSummary(cfg) {
      const acFt = (cfg.totalGallonsYtd / 325851).toFixed(2);
      return `Rate: <b>${cfg.currentGpm} GPM</b> | YTD: <b>${acFt} Ac-Ft</b>`;
    }
  },

  // ==================== CLEVELAND COUNTY SOIL PROFILES ====================
  'soil-cleveland-unit': {
    type: 'soil-cleveland-unit',
    category: 'soil',
    title: 'Cleveland County Soil Survey',
    subtitle: 'Norman, OK NRCS Map Unit',
    icon: 'map-pin',
    accentColor: '#10b981',
    inputs: [],
    outputs: [
      { id: 'infiltrationRate', label: 'Max Infil. Rate (in/hr)', type: 'number' },
      { id: 'availableWaterCapacity', label: 'AWC (in/in)', type: 'number' },
      { id: 'runoffRiskLevel', label: 'Runoff Risk', type: 'string' },
      { id: 'soilMetadata', label: 'Soil Physics Profile', type: 'object' }
    ],
    defaultConfig: {
      selectedUnit: 'stephenville-harrah-newalla',
      rootZoneDepthInches: 24,
      irrigationEfficiency: 0.88
    },
    renderSummary(cfg) {
      const names = {
        'stephenville-harrah-newalla': 'Stephenville-Harrah (~40%)',
        'renfrow-grainola-grant': 'Renfrow-Grainola (~15% Clay)',
        'norge-teller-vanoss': 'Norge-Teller (~14% Loam)',
        'doolin-bethany-urban': 'Doolin-Bethany (~8%)',
        'stephenville-littleaxe-darsil': 'Darsil Sandstone (~7% Rapid)',
        'port-weswood': 'Port-Weswood Bottomland'
      };
      return `Unit: <b>${names[cfg.selectedUnit] || cfg.selectedUnit}</b>`;
    }
  },

  // ==================== HYDROLOGY & LOGIC GATES ====================
  'logic-water-deficit-calc': {
    type: 'logic-water-deficit-calc',
    category: 'logic',
    title: 'Water Deficit & Volume Calc',
    subtitle: 'ET₀ × Crop Factor to Gallons',
    icon: 'calculator',
    accentColor: '#8b5cf6',
    inputs: [
      { id: 'deficitInches', label: 'Net Deficit (in)', type: 'number' },
      { id: 'systemFlowGpm', label: 'System GPM', type: 'number' }
    ],
    outputs: [
      { id: 'gallonsRequired', label: 'Total Gallons Req.', type: 'number' },
      { id: 'runTimeMinutes', label: 'Valve Run (min)', type: 'number' },
      { id: 'acreInches', label: 'Acre-Inches', type: 'number' }
    ],
    defaultConfig: {
      fieldAcres: 12.5,
      cropCoefficientKc: 1.05,
      distributionUniformity: 0.85,
      fallbackGpm: 350
    },
    renderSummary(cfg) {
      return `Field: <b>${cfg.fieldAcres} ac</b> | Kc: <b>${cfg.cropCoefficientKc}</b>`;
    }
  },

  'logic-infiltration-limiter': {
    type: 'logic-infiltration-limiter',
    category: 'logic',
    title: 'Soil Runoff Safeguard',
    subtitle: 'Cycle & Soak Pulse Splitter',
    icon: 'shield-check',
    accentColor: '#a855f7',
    inputs: [
      { id: 'targetRunMinutes', label: 'Target Run (min)', type: 'number' },
      { id: 'soilInfiltrationInHr', label: 'Soil Infil (in/hr)', type: 'number' }
    ],
    outputs: [
      { id: 'cycleRunMinutes', label: 'Pulse ON (min)', type: 'number' },
      { id: 'soakMinutes', label: 'Soak OFF (min)', type: 'number' },
      { id: 'totalCycles', label: 'Cycle Count', type: 'number' },
      { id: 'safeApplicationTrigger', label: 'Safe Execution Pulse', type: 'trigger' }
    ],
    defaultConfig: {
      maxSinglePulseMinutes: 20,
      minSoakMinutes: 25,
      strictSoilProtection: true
    },
    renderSummary(cfg) {
      return `Enforce Cycle & Soak based on Norman Soil Infiltration`;
    }
  },

  'logic-owrb-quota-guard': {
    type: 'logic-owrb-quota-guard',
    category: 'logic',
    title: 'OWRB Water Rights Quota',
    subtitle: 'Oklahoma Permit Cap Interlock',
    icon: 'scale',
    accentColor: '#6366f1',
    inputs: [
      { id: 'cumulativeGallons', label: 'Total Gallons Pumped', type: 'number' }
    ],
    outputs: [
      { id: 'quotaRemainingAcFt', label: 'Remaining (Ac-Ft)', type: 'number' },
      { id: 'percentQuotaUsed', label: 'Quota Used %', type: 'number' },
      { id: 'permitApproved', label: 'Under Permit Quota', type: 'boolean' },
      { id: 'emergencyCutoffTrigger', label: 'Over-Quota Cutoff', type: 'trigger' }
    ],
    defaultConfig: {
      permitNumber: 'OWRB-GW-2026-0814',
      annualAllocationAcFt: 25.0,
      warningThresholdPercent: 85.0
    },
    renderSummary(cfg) {
      return `Permit: <b>${cfg.permitNumber}</b> (Cap: ${cfg.annualAllocationAcFt} Ac-Ft)`;
    }
  },

  'logic-comparator': {
    type: 'logic-comparator',
    category: 'logic',
    title: 'Threshold Condition (IF / THEN)',
    subtitle: 'Comparator & Decision Branch',
    icon: 'git-branch',
    accentColor: '#ec4899',
    inputs: [
      { id: 'inputValue', label: 'Input Value', type: 'number' }
    ],
    outputs: [
      { id: 'result', label: 'Condition Met', type: 'boolean' },
      { id: 'thenPulse', label: 'THEN Trigger', type: 'trigger' },
      { id: 'elsePulse', label: 'ELSE Trigger', type: 'trigger' }
    ],
    defaultConfig: {
      operator: '>',
      threshold: 2.0,
      metricLabel: 'Salinity (mS/cm)'
    },
    renderSummary(cfg) {
      return `IF value <b>${cfg.operator} ${cfg.threshold}</b>`;
    }
  },

  'gate-peak-power': {
    type: 'gate-peak-power',
    category: 'logic',
    title: 'Electric Tariff Gate (OG&E)',
    subtitle: 'Peak Rate Lockout (2PM - 7PM)',
    icon: 'clock',
    accentColor: '#eab308',
    inputs: [
      { id: 'pumpRequest', label: 'Water Request', type: 'trigger' }
    ],
    outputs: [
      { id: 'allowOperation', label: 'Off-Peak Permitted', type: 'boolean' },
      { id: 'curtailedRequest', label: 'Delayed to Night Window', type: 'trigger' }
    ],
    defaultConfig: {
      utilityProvider: 'OG&E Smart Hours Ag',
      peakStartHour: 14,
      peakEndHour: 19,
      overrideForCropStress: false
    },
    renderSummary(cfg) {
      return `Lockout: <b>${cfg.peakStartHour}:00 - ${cfg.peakEndHour}:00</b>`;
    }
  },

  // ==================== EQUIPMENT & ACTUATORS ====================
  'action-wiseconn-valve': {
    type: 'action-wiseconn-valve',
    category: 'equipment',
    title: 'WiseConn DropControl Valve',
    subtitle: 'Field Solenoid Actuator',
    icon: 'toggle-right',
    accentColor: '#f59e0b',
    inputs: [
      { id: 'trigger', label: 'Open Command', type: 'trigger' },
      { id: 'durationMinutes', label: 'Run Duration (min)', type: 'number' }
    ],
    outputs: [
      { id: 'valveStatus', label: 'Valve State (OPEN/CLOSED)', type: 'string' },
      { id: 'waterDischargedGallons', label: 'Discharged Gallons', type: 'number' },
      { id: 'completedPulse', label: 'Cycle Finished', type: 'trigger' }
    ],
    defaultConfig: {
      valveId: 'VALVE-04',
      zoneName: 'Block C - Pecan Orchard',
      nominalDurationMinutes: 20,
      flowRateGpm: 120,
      currentStatus: 'CLOSED'
    },
    renderSummary(cfg) {
      const state = cfg.currentStatus === 'OPEN' ? '🟢 OPEN' : '⚪ CLOSED';
      return `Valve: <b>${cfg.valveId}</b> | State: <b>${state}</b> (${cfg.nominalDurationMinutes}m)`;
    }
  },

  'action-vfd-pump': {
    type: 'action-vfd-pump',
    category: 'equipment',
    title: 'VFD Well Pump Controller',
    subtitle: 'Variable Frequency Motor Drive',
    icon: 'zap',
    accentColor: '#d97706',
    inputs: [
      { id: 'commandStart', label: 'Start Pump', type: 'trigger' },
      { id: 'commandStop', label: 'Stop / Interlock', type: 'trigger' },
      { id: 'targetGpm', label: 'Target GPM', type: 'number' }
    ],
    outputs: [
      { id: 'isRunning', label: 'Motor Running', type: 'boolean' },
      { id: 'activeGpm', label: 'Discharge Flow (GPM)', type: 'number' },
      { id: 'powerKw', label: 'Power (kW)', type: 'number' }
    ],
    defaultConfig: {
      pumpId: 'WELL-PUMP-01',
      horsepower: 60,
      maxGpm: 500,
      operatingStatus: 'STOPPED',
      targetGpm: 400
    },
    renderSummary(cfg) {
      const state = cfg.operatingStatus === 'RUNNING' ? '🟢 RUNNING' : '🛑 STOPPED';
      return `Status: <b>${state}</b> | Target: <b>${cfg.targetGpm} GPM</b>`;
    }
  },

  'action-center-pivot': {
    type: 'action-center-pivot',
    category: 'equipment',
    title: 'Valley / Lindsay Center Pivot',
    subtitle: 'Precision Overhead Pivot',
    icon: 'compass',
    accentColor: '#f97316',
    inputs: [
      { id: 'startPivot', label: 'Start Revolution', type: 'trigger' },
      { id: 'depthInches', label: 'Apply Depth (in)', type: 'number' }
    ],
    outputs: [
      { id: 'pivotState', label: 'Pivot State', type: 'string' },
      { id: 'speedPercent', label: 'Timer Speed %', type: 'number' }
    ],
    defaultConfig: {
      pivotId: 'PIVOT-SOUTH-02',
      spansCount: 7,
      fieldAcres: 125,
      waterDepthInches: 0.75,
      currentStatus: 'IDLE'
    },
    renderSummary(cfg) {
      return `Pivot: <b>${cfg.pivotId}</b> | Depth: <b>${cfg.waterDepthInches}"</b>`;
    }
  },

  // ==================== COMPLIANCE & LOGGING ====================
  'log-owrb-ledger': {
    type: 'log-owrb-ledger',
    category: 'compliance',
    title: 'OWRB Regulatory Water Ledger',
    subtitle: 'Groundwater Rights Audit Log',
    icon: 'file-check',
    accentColor: '#10b981',
    inputs: [
      { id: 'logTrigger', label: 'Audit Record Event', type: 'trigger' },
      { id: 'gallonsPumped', label: 'Gallons Volume', type: 'number' },
      { id: 'valveOrPumpSource', label: 'Asset Identifier', type: 'string' }
    ],
    outputs: [
      { id: 'auditRecorded', label: 'Log Confirmed', type: 'boolean' },
      { id: 'totalYearToDateAcreFt', label: 'Cumulative Ac-Ft', type: 'number' }
    ],
    defaultConfig: {
      basinName: 'Garber-Wellington Aquifer',
      permitOwner: 'Norman Agritech Holdings LLC',
      permitId: 'OWRB-GW-2026-0814',
      autoSyncOklahomaPortal: true
    },
    renderSummary(cfg) {
      return `Aquifer: <b>Garber-Wellington</b> | Permit: <b>${cfg.permitId}</b>`;
    }
  },

  'log-google-sheets': {
    type: 'log-google-sheets',
    category: 'compliance',
    title: 'Google Sheets Compliance Sync',
    subtitle: 'Automated Cloud Water Bookkeeping',
    icon: 'table',
    accentColor: '#22c55e',
    inputs: [
      { id: 'trigger', label: 'Append Row', type: 'trigger' },
      { id: 'dataPayload', label: 'Data Row Object', type: 'object' }
    ],
    outputs: [
      { id: 'status', label: 'Row Written', type: 'boolean' }
    ],
    defaultConfig: {
      sheetName: '2026_Irrigation_Water_Volume_Norman',
      columns: 'Timestamp, ValveID, DurationMinutes, Gallons, SoilPermeability, SalinityEC',
      cloudSync: true
    },
    renderSummary(cfg) {
      return `Sheet: <b>${cfg.sheetName}</b>`;
    }
  },

  'alert-sms-twilio': {
    type: 'alert-sms-twilio',
    category: 'compliance',
    title: 'Twilio Farm SMS Alert',
    subtitle: 'Real-time Operator Dispatch',
    icon: 'bell',
    accentColor: '#ef4444',
    inputs: [
      { id: 'alertTrigger', label: 'Send Alert', type: 'trigger' },
      { id: 'alertMessage', label: 'Custom Alert Text', type: 'string' }
    ],
    outputs: [
      { id: 'messageSent', label: 'SMS Dispatched', type: 'boolean' }
    ],
    defaultConfig: {
      recipientPhone: '+1 (405) 555-FARM',
      alertPrefix: '🚨 [FARM-FLOW ALERT]',
      defaultTemplate: 'High salinity (2.25 mS/cm) detected. WiseConn Valve 4 flush initiated for 20 mins.'
    },
    renderSummary(cfg) {
      return `To: <b>${cfg.recipientPhone}</b>`;
    }
  },

  'action-custom-webhook': {
    type: 'action-custom-webhook',
    category: 'compliance',
    title: 'Remote Webhook Dispatcher',
    subtitle: 'HTTP POST to Ag Equipment API',
    icon: 'send',
    accentColor: '#6366f1',
    inputs: [
      { id: 'executeWebhook', label: 'POST Trigger', type: 'trigger' },
      { id: 'payloadData', label: 'JSON Payload', type: 'object' }
    ],
    outputs: [
      { id: 'responseStatus', label: 'HTTP Status Code', type: 'number' },
      { id: 'isSuccess', label: 'Success (200 OK)', type: 'boolean' }
    ],
    defaultConfig: {
      endpointUrl: 'https://api.wiseconn.cloud/v2/valves/VALVE-04/actuate',
      httpMethod: 'POST',
      headers: 'Authorization: Bearer mock_ag_token_2026',
      timeoutMs: 3000
    },
    renderSummary(cfg) {
      return `POST: <b>${cfg.endpointUrl.split('/').slice(2, 5).join('/')}...</b>`;
    }
  }
};
