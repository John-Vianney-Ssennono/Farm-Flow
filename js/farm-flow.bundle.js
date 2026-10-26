/**
 * Farm-Flow: Standalone High-Performance AgTech Engine Bundle
 * Complete zero-dependency bundle supporting direct file:// protocol execution,
 * local dev servers, and production deployments.
 */

(function () {
  'use strict';

  // ==================== CLEVELAND COUNTY SOIL MATRIX ====================
  const CLEVELAND_COUNTY_SOILS = {
    'stephenville-harrah-newalla': {
      id: 'stephenville-harrah-newalla',
      name: 'Stephenville-Harrah-Newalla Unit',
      shareOfCounty: 40,
      parentMaterial: 'Sandstone, colluvium, shale',
      primaryLocation: 'Norman & Central/Eastern Cleveland County Uplands',
      dominantSeries: [
        { name: 'Stephenville', share: 33, permeability: 'Moderate', maxInfiltrationRateInHr: 1.2, awcInIn: 0.14 },
        { name: 'Harrah', share: 33, permeability: 'Moderate', maxInfiltrationRateInHr: 1.1, awcInIn: 0.15 },
        { name: 'Newalla', share: 12, permeability: 'Moderate', maxInfiltrationRateInHr: 0.9, awcInIn: 0.16 }
      ],
      overallPermeability: 'Moderate',
      infiltrationRateInHr: 1.1,
      availableWaterCapacity: 0.15,
      soilTexture: 'Fine sandy loam to sandy clay loam',
      runoffRisk: 'Low to Moderate',
      recommendedIrrigationMethod: 'Drip or Moderate Overhead Pivot (Cycle & Soak 30m on / 20m off)',
      recommendedMaxApplicationRateInHr: 0.8,
      description: 'Covers ~40% of Cleveland County including most agricultural parcels around Norman. Well-drained upland soils over sandstone. High suitability for specialty crops, wheat, and pasture when irrigated at moderate rates.'
    },
    'renfrow-grainola-grant': {
      id: 'renfrow-grainola-grant',
      name: 'Renfrow-Grainola-Grant Unit',
      shareOfCounty: 15,
      parentMaterial: 'Shale, siltstone, sandstone',
      primaryLocation: 'Rolling prairie slopes and upland divides',
      dominantSeries: [
        { name: 'Renfrow', share: 34, permeability: 'Very Slow', maxInfiltrationRateInHr: 0.15, awcInIn: 0.18 },
        { name: 'Grainola', share: 14, permeability: 'Slow', maxInfiltrationRateInHr: 0.35, awcInIn: 0.16 },
        { name: 'Grant', share: 7, permeability: 'Moderate', maxInfiltrationRateInHr: 0.8, awcInIn: 0.19 }
      ],
      overallPermeability: 'Very Slow (Clayey Subsoils)',
      infiltrationRateInHr: 0.20,
      availableWaterCapacity: 0.18,
      soilTexture: 'Silty clay loam to dense clay',
      runoffRisk: 'VERY HIGH (Immediate ponding if rate > 0.25 in/hr)',
      recommendedIrrigationMethod: 'Micro-Pulse Drip Only (Cycle & Soak 10m on / 45m off)',
      recommendedMaxApplicationRateInHr: 0.18,
      description: 'Heavy clayey subsoils prone to severe runoff and crusting. Requires strict pulse irrigation automation to prevent water standing and nutrient leaching.'
    },
    'norge-teller-vanoss': {
      id: 'norge-teller-vanoss',
      name: 'Norge-Teller-Vanoss Unit',
      shareOfCounty: 14,
      parentMaterial: 'Old loamy alluvium terraces',
      primaryLocation: 'Old river terraces north and east of Norman',
      dominantSeries: [
        { name: 'Norge', share: 28, permeability: 'Moderately Slow', maxInfiltrationRateInHr: 0.55, awcInIn: 0.20 },
        { name: 'Teller', share: 26, permeability: 'Moderate', maxInfiltrationRateInHr: 1.0, awcInIn: 0.18 },
        { name: 'Vanoss', share: 15, permeability: 'Moderate', maxInfiltrationRateInHr: 0.95, awcInIn: 0.19 }
      ],
      overallPermeability: 'Moderately Slow to Moderate',
      infiltrationRateInHr: 0.75,
      availableWaterCapacity: 0.19,
      soilTexture: 'Deep loams and silt loams (Prime Farmland)',
      runoffRisk: 'Moderate',
      recommendedIrrigationMethod: 'Center Pivot or Drip Irrigation',
      recommendedMaxApplicationRateInHr: 0.65,
      description: 'The highest quality agricultural soils in Cleveland County. Deep loams with superior available water capacity. Exceptional yield potential under precision water scheduling.'
    },
    'doolin-bethany-urban': {
      id: 'doolin-bethany-urban',
      name: 'Doolin-Bethany-Urban Land Unit',
      shareOfCounty: 8,
      parentMaterial: 'Old clayey and loamy alluvium',
      primaryLocation: 'Flat uplands and urban fringe of Norman',
      dominantSeries: [
        { name: 'Doolin', share: 49, permeability: 'Very Slow', maxInfiltrationRateInHr: 0.12, awcInIn: 0.17 },
        { name: 'Bethany', share: 18, permeability: 'Slow', maxInfiltrationRateInHr: 0.30, awcInIn: 0.18 },
        { name: 'Urban land', share: 10, permeability: 'Impervious / Variable', maxInfiltrationRateInHr: 0.05, awcInIn: 0.08 }
      ],
      overallPermeability: 'Very Slow',
      infiltrationRateInHr: 0.15,
      availableWaterCapacity: 0.16,
      soilTexture: 'Dense clay subsoil',
      runoffRisk: 'High',
      recommendedIrrigationMethod: 'Low-Volume Micro-Sprinkler or Drip',
      recommendedMaxApplicationRateInHr: 0.15,
      description: 'Dense subsoils that impede vertical water drainage. High perched water table risk during wet Oklahoma spring months.'
    },
    'stephenville-littleaxe-darsil': {
      id: 'stephenville-littleaxe-darsil',
      name: 'Stephenville-Littleaxe-Darsil Unit',
      shareOfCounty: 7,
      parentMaterial: 'Sandstone ridges and hills',
      primaryLocation: 'Eastern Cleveland County near Little Axe & Lake Thunderbird',
      dominantSeries: [
        { name: 'Stephenville', share: 49, permeability: 'Moderate', maxInfiltrationRateInHr: 1.2, awcInIn: 0.14 },
        { name: 'Littleaxe', share: 20, permeability: 'Moderate to Rapid', maxInfiltrationRateInHr: 1.8, awcInIn: 0.11 },
        { name: 'Darsil', share: 9, permeability: 'Rapid (Excessively Drained)', maxInfiltrationRateInHr: 3.5, awcInIn: 0.08 }
      ],
      overallPermeability: 'Moderate to Rapid',
      infiltrationRateInHr: 1.8,
      availableWaterCapacity: 0.11,
      soilTexture: 'Coarse sandy loam over fractured sandstone',
      runoffRisk: 'Low (Deep percolation leaching risk instead)',
      recommendedIrrigationMethod: 'Frequent Low-Dose Micro-Irrigation',
      recommendedMaxApplicationRateInHr: 1.4,
      description: 'Shallow and excessively drained. High risk of water and fertilizer percolating past crop roots if single irrigation duration is too long.'
    },
    'port-weswood': {
      id: 'port-weswood',
      name: 'Port-Weswood Floodplain Unit',
      shareOfCounty: 5,
      parentMaterial: 'Recent loamy alluvium',
      primaryLocation: 'Canadian River bottomland and Major Creek corridors',
      dominantSeries: [
        { name: 'Port', share: 62, permeability: 'Moderate', maxInfiltrationRateInHr: 0.9, awcInIn: 0.20 },
        { name: 'Weswood', share: 31, permeability: 'Moderate', maxInfiltrationRateInHr: 0.85, awcInIn: 0.19 }
      ],
      overallPermeability: 'Moderate (Flood prone)',
      infiltrationRateInHr: 0.88,
      availableWaterCapacity: 0.20,
      soilTexture: 'Deep fertile silt loam & loamy alluvium',
      runoffRisk: 'Moderate / Flooding Hazard during River Crests',
      recommendedIrrigationMethod: 'Subsurface Drip or Surface Irrigation',
      recommendedMaxApplicationRateInHr: 0.75,
      description: 'Rich bottomland along the South Canadian River. Deep productive soils, but subject to occasional inundation.'
    }
  };

  const KONAWA_SERIES_PROFILE = {
    seriesName: 'Konawa Fine-Loamy Ultic Haplustalf',
    classification: 'Fine-loamy, mixed, active, thermic Ultic Haplustalf',
    drainage: 'Well drained, moderately permeable',
    bedrockDepthInches: '> 80',
    horizons: [
      { horizon: 'Ap', depthCm: '0–23', depthInches: '0–9', color: 'Dark brown (7.5YR 3/2)', texture: 'Fine sandy loam', structure: 'Weak fine granular', reaction: 'Slightly acid (pH 6.1)', clayPercent: 12, cec: 8.5 },
      { horizon: 'E', depthCm: '23–43', depthInches: '9–17', color: 'Reddish brown (5YR 4/4)', texture: 'Fine sandy loam', structure: 'Weak fine granular', reaction: 'Slightly acid (pH 6.0)', clayPercent: 14, cec: 7.2 },
      { horizon: 'Bt', depthCm: '43–135', depthInches: '17–53', color: 'Dark red (2.5YR 3/6)', texture: 'Sandy clay loam', structure: 'Moderate medium subangular blocky', reaction: 'Moderately acid (pH 5.8)', clayPercent: 24, cec: 19.5 },
      { horizon: 'BC', depthCm: '135–183', depthInches: '53–72', color: 'Red (2.5YR 4/6)', texture: 'Fine sandy loam', structure: 'Weak coarse subangular blocky', reaction: 'Neutral (pH 6.8)', clayPercent: 15, cec: 12.0 }
    ],
    oklahomaMedianBaseline: {
      soilPh: 6.2,
      nitrateN_lbAcre: 8,
      phosphorusSTP: 32,
      potassiumSTK: 233,
      organicMatterPercent: 1.05
    }
  };

  const HydrologyCalculations = {
    calcMaxApplicationDepthInches(infil, durationMin) {
      return Number((infil * (durationMin / 60) * 0.85).toFixed(2));
    },
    gallonsToAcreFeet(gallons) {
      return Number((gallons / 325851).toFixed(4));
    },
    gallonsToAcreInches(gallons) {
      return Number((gallons / 27154).toFixed(3));
    },
    calcRequiredRunMinutes(netDeficitInches, fieldAcres, systemFlowRateGpm, efficiency = 0.85) {
      if (netDeficitInches <= 0 || systemFlowRateGpm <= 0) return { runMinutes: 0, totalGallons: 0, acreFeet: 0 };
      const reqGallons = (netDeficitInches * 27154 * fieldAcres) / efficiency;
      const runMinutes = Math.round(reqGallons / systemFlowRateGpm);
      return {
        runMinutes,
        totalGallons: Math.round(reqGallons),
        acreFeet: Number((reqGallons / 325851).toFixed(3))
      };
    }
  };

  // ==================== NODE DEFINITIONS CATALOG ====================
  const NODE_CATEGORIES = {
    SENSORS: { id: 'sensors', name: 'Sensors & Field Telemetry', color: '#06b6d4', icon: 'droplet' },
    SOIL: { id: 'soil', name: 'Cleveland Co. Soil Profiles', color: '#10b981', icon: 'layers' },
    LOGIC: { id: 'logic', name: 'Hydrology & Logic Gates', color: '#8b5cf6', icon: 'cpu' },
    EQUIPMENT: { id: 'equipment', name: 'Equipment & Actuators', color: '#f59e0b', icon: 'zap' },
    COMPLIANCE: { id: 'compliance', name: 'Compliance & Alerts', color: '#ec4899', icon: 'file-text' }
  };

  const NODE_DEFINITIONS = {
    'sensor-ketos-salinity': {
      type: 'sensor-ketos-salinity',
      category: 'sensors',
      title: 'KETOS Salinity Probe',
      subtitle: 'EC In-Line Sensor',
      icon: 'activity',
      accentColor: '#14b8a6',
      inputs: [],
      outputs: [
        { id: 'salinity', label: 'Salinity (mS/cm)', type: 'number' },
        { id: 'salinitySpike', label: 'Flush Trigger (>2.0)', type: 'boolean' }
      ],
      defaultConfig: { sensorModel: 'KETOS SHIELD-2', currentSalinity: 2.25, thresholdMsCm: 2.00 },
      renderSummary(cfg) {
        const status = cfg.currentSalinity > cfg.thresholdMsCm ? '⚠️ HIGH' : '✅ NORMAL';
        return `EC: <b>${cfg.currentSalinity} mS/cm</b> [${status}]`;
      }
    },
    'sensor-soil-moisture': {
      type: 'sensor-soil-moisture',
      category: 'sensors',
      title: 'Soil Moisture (AquaSpy)',
      subtitle: 'Root Zone Moisture VWC%',
      icon: 'droplets',
      accentColor: '#06b6d4',
      inputs: [],
      outputs: [
        { id: 'vwc', label: 'Moisture (VWC %)', type: 'number' },
        { id: 'deficitDetected', label: 'Below Refill Point', type: 'boolean' }
      ],
      defaultConfig: { depthInches: 24, currentVwc: 17.5, refillThreshold: 22.0 },
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
        { id: 'netDeficit', label: 'Net Water Deficit (in)', type: 'number' }
      ],
      defaultConfig: { dailyEt0: 0.28, rainfall24h: 0.05 },
      renderSummary(cfg) {
        const net = (cfg.dailyEt0 - cfg.rainfall24h).toFixed(2);
        return `ET₀: <b>${cfg.dailyEt0}"</b> | Rain: <b>${cfg.rainfall24h}"</b> | Deficit: <b>${net}"</b>`;
      }
    },
    'sensor-well-meter': {
      type: 'sensor-well-meter',
      category: 'sensors',
      title: 'McCrometer Flow Meter',
      subtitle: 'Extraction Totalizer',
      icon: 'gauge',
      accentColor: '#3b82f6',
      inputs: [],
      outputs: [
        { id: 'flowRateGpm', label: 'Flow Rate (GPM)', type: 'number' },
        { id: 'totalGallonsYtd', label: 'Cumulative Gallons', type: 'number' }
      ],
      defaultConfig: { currentGpm: 450, totalGallonsYtd: 4850000 },
      renderSummary(cfg) {
        const acFt = (cfg.totalGallonsYtd / 325851).toFixed(2);
        return `Rate: <b>${cfg.currentGpm} GPM</b> | YTD: <b>${acFt} Ac-Ft</b>`;
      }
    },
    'soil-cleveland-unit': {
      type: 'soil-cleveland-unit',
      category: 'soil',
      title: 'Cleveland County Soil Unit',
      subtitle: 'Norman NRCS 1987 Survey',
      icon: 'map-pin',
      accentColor: '#10b981',
      inputs: [],
      outputs: [
        { id: 'infiltrationRate', label: 'Max Infil. (in/hr)', type: 'number' },
        { id: 'availableWaterCapacity', label: 'AWC (in/in)', type: 'number' }
      ],
      defaultConfig: { selectedUnit: 'stephenville-harrah-newalla' },
      renderSummary(cfg) {
        const u = CLEVELAND_COUNTY_SOILS[cfg.selectedUnit] || CLEVELAND_COUNTY_SOILS['stephenville-harrah-newalla'];
        return `Unit: <b>${u.name.split(' ')[0]}</b> (${u.overallPermeability})`;
      }
    },
    'logic-comparator': {
      type: 'logic-comparator',
      category: 'logic',
      title: 'Threshold Check (IF / THEN)',
      subtitle: 'Conditional Branching',
      icon: 'git-branch',
      accentColor: '#ec4899',
      inputs: [{ id: 'inputValue', label: 'Input Value', type: 'number' }],
      outputs: [
        { id: 'result', label: 'Condition Met', type: 'boolean' },
        { id: 'thenPulse', label: 'THEN Trigger', type: 'trigger' },
        { id: 'elsePulse', label: 'ELSE Trigger', type: 'trigger' }
      ],
      defaultConfig: { operator: '>', threshold: 2.0 },
      renderSummary(cfg) {
        return `IF value <b>${cfg.operator} ${cfg.threshold}</b>`;
      }
    },
    'logic-water-deficit-calc': {
      type: 'logic-water-deficit-calc',
      category: 'logic',
      title: 'Water Volume Calculator',
      subtitle: 'ET₀ Deficit to Gallons',
      icon: 'calculator',
      accentColor: '#8b5cf6',
      inputs: [
        { id: 'deficitInches', label: 'Net Deficit (in)', type: 'number' },
        { id: 'systemFlowGpm', label: 'System GPM', type: 'number' }
      ],
      outputs: [
        { id: 'gallonsRequired', label: 'Gallons Req.', type: 'number' },
        { id: 'runTimeMinutes', label: 'Run Time (min)', type: 'number' }
      ],
      defaultConfig: { fieldAcres: 12.5, cropCoefficientKc: 1.05, fallbackGpm: 120 },
      renderSummary(cfg) {
        return `Field: <b>${cfg.fieldAcres} ac</b> | Kc: <b>${cfg.cropCoefficientKc}</b>`;
      }
    },
    'logic-infiltration-limiter': {
      type: 'logic-infiltration-limiter',
      category: 'logic',
      title: 'Soil Runoff Limiter',
      subtitle: 'Cycle & Soak Pulse Splitter',
      icon: 'shield-check',
      accentColor: '#a855f7',
      inputs: [
        { id: 'soilInfiltrationInHr', label: 'Soil Infil (in/hr)', type: 'number' },
        { id: 'targetRunMinutes', label: 'Target Run (min)', type: 'number' }
      ],
      outputs: [
        { id: 'cycleRunMinutes', label: 'Pulse ON (min)', type: 'number' },
        { id: 'soakMinutes', label: 'Soak OFF (min)', type: 'number' },
        { id: 'safeApplicationTrigger', label: 'Safe Trigger', type: 'trigger' }
      ],
      defaultConfig: { maxSinglePulseMinutes: 20 },
      renderSummary(cfg) {
        return `Pulse irrigation enforcement for Cleveland Co. soils`;
      }
    },
    'logic-owrb-quota-guard': {
      type: 'logic-owrb-quota-guard',
      category: 'logic',
      title: 'OWRB Water Quota Guard',
      subtitle: 'Permit Cap Interlock',
      icon: 'scale',
      accentColor: '#6366f1',
      inputs: [{ id: 'cumulativeGallons', label: 'Total Gallons Pumped', type: 'number' }],
      outputs: [
        { id: 'percentQuotaUsed', label: 'Quota Used %', type: 'number' },
        { id: 'emergencyCutoffTrigger', label: 'Over-Quota Cutoff', type: 'trigger' }
      ],
      defaultConfig: { permitNumber: 'OWRB-GW-2026-0814', annualAllocationAcFt: 25.0 },
      renderSummary(cfg) {
        return `Cap: <b>${cfg.annualAllocationAcFt} Ac-Ft</b> (${cfg.permitNumber})`;
      }
    },
    'gate-peak-power': {
      type: 'gate-peak-power',
      category: 'logic',
      title: 'Electric Tariff Gate (OG&E)',
      subtitle: 'Peak Rate Lockout (2-7 PM)',
      icon: 'clock',
      accentColor: '#eab308',
      inputs: [{ id: 'pumpRequest', label: 'Water Request', type: 'trigger' }],
      outputs: [{ id: 'allowOperation', label: 'Off-Peak Permitted', type: 'boolean' }],
      defaultConfig: { peakStartHour: 14, peakEndHour: 19 },
      renderSummary(cfg) {
        return `Lockout: <b>${cfg.peakStartHour}:00 - ${cfg.peakEndHour}:00</b>`;
      }
    },
    'action-wiseconn-valve': {
      type: 'action-wiseconn-valve',
      category: 'equipment',
      title: 'WiseConn DropControl Valve',
      subtitle: 'Zone Solenoid Actuator',
      icon: 'toggle-right',
      accentColor: '#f59e0b',
      inputs: [
        { id: 'trigger', label: 'Open Command', type: 'trigger' },
        { id: 'durationMinutes', label: 'Run Duration (min)', type: 'number' }
      ],
      outputs: [
        { id: 'valveStatus', label: 'Valve State', type: 'string' },
        { id: 'waterDischargedGallons', label: 'Discharged Gal', type: 'number' },
        { id: 'completedPulse', label: 'Cycle Finished', type: 'trigger' }
      ],
      defaultConfig: { valveId: 'VALVE-04', zoneName: 'Block C - Pecan Orchard', nominalDurationMinutes: 20, flowRateGpm: 120, currentStatus: 'CLOSED' },
      renderSummary(cfg) {
        const state = cfg.currentStatus === 'OPEN' ? '🟢 OPEN' : '⚪ CLOSED';
        return `Valve: <b>${cfg.valveId}</b> | <b>${state}</b> (${cfg.nominalDurationMinutes}m)`;
      }
    },
    'action-vfd-pump': {
      type: 'action-vfd-pump',
      category: 'equipment',
      title: 'VFD Well Pump',
      subtitle: 'Variable Frequency Motor',
      icon: 'zap',
      accentColor: '#d97706',
      inputs: [
        { id: 'commandStart', label: 'Start Pump', type: 'trigger' },
        { id: 'commandStop', label: 'Stop Interlock', type: 'trigger' }
      ],
      outputs: [{ id: 'isRunning', label: 'Motor Running', type: 'boolean' }],
      defaultConfig: { pumpId: 'WELL-PUMP-01', targetGpm: 450, operatingStatus: 'STOPPED' },
      renderSummary(cfg) {
        return `Pump: <b>${cfg.pumpId}</b> (${cfg.targetGpm} GPM)`;
      }
    },
    'action-center-pivot': {
      type: 'action-center-pivot',
      category: 'equipment',
      title: 'Center Pivot (Valley)',
      subtitle: 'Overhead Sprinkler',
      icon: 'compass',
      accentColor: '#f97316',
      inputs: [{ id: 'startPivot', label: 'Start Revolution', type: 'trigger' }],
      outputs: [{ id: 'pivotState', label: 'Pivot State', type: 'string' }],
      defaultConfig: { pivotId: 'PIVOT-SOUTH-02', waterDepthInches: 0.75 },
      renderSummary(cfg) {
        return `Depth: <b>${cfg.waterDepthInches}"</b>`;
      }
    },
    'log-google-sheets': {
      type: 'log-google-sheets',
      category: 'compliance',
      title: 'Google Sheets Compliance',
      subtitle: 'Water Ledger Bookkeeping',
      icon: 'table',
      accentColor: '#22c55e',
      inputs: [{ id: 'trigger', label: 'Append Row', type: 'trigger' }],
      outputs: [{ id: 'status', label: 'Row Written', type: 'boolean' }],
      defaultConfig: { sheetName: '2026_Irrigation_Water_Volume_Norman' },
      renderSummary(cfg) {
        return `Sheet: <b>${cfg.sheetName}</b>`;
      }
    },
    'log-owrb-ledger': {
      type: 'log-owrb-ledger',
      category: 'compliance',
      title: 'OWRB Water Rights Ledger',
      subtitle: 'State Regulatory Audit',
      icon: 'file-check',
      accentColor: '#10b981',
      inputs: [
        { id: 'logTrigger', label: 'Record Event', type: 'trigger' },
        { id: 'gallonsPumped', label: 'Volume Gallons', type: 'number' }
      ],
      outputs: [{ id: 'auditRecorded', label: 'Logged', type: 'boolean' }],
      defaultConfig: { permitId: 'OWRB-GW-2026-0814' },
      renderSummary(cfg) {
        return `Permit: <b>${cfg.permitId}</b>`;
      }
    },
    'alert-sms-twilio': {
      type: 'alert-sms-twilio',
      category: 'compliance',
      title: 'Twilio Farm SMS Alert',
      subtitle: 'Operator Notification',
      icon: 'bell',
      accentColor: '#ef4444',
      inputs: [{ id: 'alertTrigger', label: 'Send Alert', type: 'trigger' }],
      outputs: [{ id: 'messageSent', label: 'Sent', type: 'boolean' }],
      defaultConfig: { recipientPhone: '+1 (405) 555-FARM' },
      renderSummary(cfg) {
        return `To: <b>${cfg.recipientPhone}</b>`;
      }
    }
  };

  // ==================== VIRTUAL HARDWARE SIMULATOR ====================
  class FarmHardwareSimulator {
    constructor() {
      this.state = {
        valves: {
          'VALVE-04': { id: 'VALVE-04', name: 'Block C - Pecan Orchard', status: 'CLOSED', flowRateGpm: 120, remainingMinutes: 0, totalGallonsDelivered: 14200 },
          'VALVE-02': { id: 'VALVE-02', name: 'Block A - Wheat', status: 'CLOSED', flowRateGpm: 180, remainingMinutes: 0, totalGallonsDelivered: 28500 }
        },
        pump: { id: 'WELL-PUMP-01', name: 'Norman Well #1', status: 'STOPPED', currentGpm: 0, interlockedByQuota: false, totalGallonsYtd: 4850000 },
        ketosProbe: { salinityMsCm: 2.25, nitratePpm: 14.2 },
        soilMoisture: { vwcPercent: 17.5, refillThreshold: 22.0 },
        weather: { et0Inches: 0.28, rainfallInches: 0.00 },
        owrbPermit: {
          permitId: 'OWRB-GW-2026-0814',
          basin: 'Garber-Wellington Aquifer (Cleveland Co.)',
          annualQuotaAcFt: 25.0,
          usedAcFt: 14.88,
          status: 'IN_COMPLIANCE',
          ledgerRecords: [
            { timestamp: new Date(Date.now() - 3600000 * 48).toISOString().replace('T', ' ').substring(0, 19), source: 'WELL-PUMP-01', gallons: 384000, acreFeet: 1.18, balanceRemainingAcFt: 11.30, status: 'VERIFIED' },
            { timestamp: new Date(Date.now() - 3600000 * 24).toISOString().replace('T', ' ').substring(0, 19), source: 'WELL-PUMP-01', gallons: 240000, acreFeet: 0.74, balanceRemainingAcFt: 10.56, status: 'VERIFIED' }
          ]
        },
        googleSheetsLog: [
          { rowId: 101, timestamp: new Date(Date.now() - 86400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), valveId: 'VALVE-04', durationMin: 20, gallons: 2400, salinity: '2.18 mS/cm', notes: 'Salinity flush cycle executed' }
        ],
        webhookLog: []
      };
      this.listeners = new Set();
      this.startTick();
    }

    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    notify() {
      this.listeners.forEach(fn => fn(this.state));
    }

    startTick() {
      setInterval(() => {
        let changed = false;
        for (const vId in this.state.valves) {
          const v = this.state.valves[vId];
          if (v.status === 'OPEN') {
            v.totalGallonsDelivered += (v.flowRateGpm / 30);
            if (v.remainingMinutes > 0) {
              v.remainingMinutes = Math.max(0, v.remainingMinutes - 0.2);
              if (v.remainingMinutes <= 0) {
                v.status = 'CLOSED';
              }
            }
            changed = true;
          }
        }
        if (changed) this.notify();
      }, 1000);
    }

    openWiseConnValve(valveId = 'VALVE-04', durationMinutes = 20) {
      const v = this.state.valves[valveId] || this.state.valves['VALVE-04'];
      v.status = 'OPEN';
      v.remainingMinutes = durationMinutes;
      const gal = durationMinutes * v.flowRateGpm;

      const wh = {
        id: 'WH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
        timestamp: new Date().toLocaleTimeString(),
        endpoint: `https://api.wiseconn.cloud/v2/valves/${v.id}/actuate`,
        method: 'POST',
        payload: { command: 'OPEN_VALVE', valveId: v.id, durationMinutes, flowRateGpm: v.flowRateGpm, volumeGallons: gal },
        response: { status: 200, message: `WiseConn DropControl ACK: Valve ${v.id} opened for ${durationMinutes} min.` }
      };
      this.state.webhookLog.unshift(wh);

      this.appendGoogleSheetRow({
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        valveId: v.id,
        durationMin: durationMinutes,
        gallons: gal,
        salinity: `${this.state.ketosProbe.salinityMsCm} mS/cm`,
        notes: `Triggered by Farm-Flow Automation`
      });

      this.notify();
      return wh;
    }

    startPump(targetGpm = 450) {
      if (this.state.pump.interlockedByQuota) return false;
      this.state.pump.status = 'RUNNING';
      this.state.pump.currentGpm = targetGpm;
      this.notify();
      return true;
    }

    stopPump() {
      this.state.pump.status = 'STOPPED';
      this.state.pump.currentGpm = 0;
      this.notify();
    }

    logOwrbExtraction(gallons, source = 'WELL-PUMP-01') {
      const acFt = Number((gallons / 325851).toFixed(3));
      this.state.pump.totalGallonsYtd += gallons;
      this.state.owrbPermit.usedAcFt = Number((this.state.pump.totalGallonsYtd / 325851).toFixed(3));
      const remaining = Number((this.state.owrbPermit.annualQuotaAcFt - this.state.owrbPermit.usedAcFt).toFixed(3));
      const rec = {
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        source,
        gallons: Math.round(gallons),
        acreFeet: acFt,
        balanceRemainingAcFt: remaining,
        status: 'VERIFIED'
      };
      this.state.owrbPermit.ledgerRecords.unshift(rec);
      this.notify();
      return rec;
    }

    appendGoogleSheetRow(data) {
      const row = { rowId: this.state.googleSheetsLog.length + 101, ...data };
      this.state.googleSheetsLog.unshift(row);
      this.notify();
      return row;
    }

    setSalinity(val) {
      this.state.ketosProbe.salinityMsCm = Number(Number(val).toFixed(2));
      this.notify();
    }

    setSoilMoisture(val) {
      this.state.soilMoisture.vwcPercent = Number(Number(val).toFixed(1));
      this.notify();
    }

    setEt0(val) {
      this.state.weather.et0Inches = Number(Number(val).toFixed(2));
      this.notify();
    }

    setRainfall(val) {
      this.state.weather.rainfallInches = Number(Number(val).toFixed(2));
      this.notify();
    }
  }

  const hardwareSimulator = new FarmHardwareSimulator();

  // ==================== WORKFLOW TEMPLATES ====================
  const WORKFLOW_TEMPLATES = [
    {
      id: 'hackathon-salinity-flush',
      name: '1. KETOS Salinity Flush & Regulatory Log',
      badge: 'Hackathon Prompt',
      description: 'IF KETOS detects salinity > 2.0 mS/cm, THEN trigger WiseConn Valve 4 for 20 mins, AND log water volume to Google Sheets & OWRB ledger for regulatory compliance.',
      nodes: [
        { id: 'node-ketos-1', type: 'sensor-ketos-salinity', x: 60, y: 180, config: { sensorModel: 'KETOS SHIELD-2', currentSalinity: 2.25, thresholdMsCm: 2.00 } },
        { id: 'node-comp-1', type: 'logic-comparator', x: 360, y: 180, config: { operator: '>', threshold: 2.0 } },
        { id: 'node-valve-4', type: 'action-wiseconn-valve', x: 660, y: 120, config: { valveId: 'VALVE-04', zoneName: 'Block C - Pecan Orchard', nominalDurationMinutes: 20, flowRateGpm: 120, currentStatus: 'CLOSED' } },
        { id: 'node-sheet-1', type: 'log-google-sheets', x: 980, y: 80, config: { sheetName: '2026_Irrigation_Water_Volume_Norman' } },
        { id: 'node-owrb-1', type: 'log-owrb-ledger', x: 980, y: 300, config: { permitId: 'OWRB-GW-2026-0814' } },
        { id: 'node-sms-1', type: 'alert-sms-twilio', x: 660, y: 360, config: { recipientPhone: '+1 (405) 555-FARM' } }
      ],
      connections: [
        { id: 'c1', fromNode: 'node-ketos-1', fromPort: 'salinity', toNode: 'node-comp-1', toPort: 'inputValue' },
        { id: 'c2', fromNode: 'node-comp-1', fromPort: 'thenPulse', toNode: 'node-valve-4', toPort: 'trigger' },
        { id: 'c3', fromNode: 'node-comp-1', fromPort: 'thenPulse', toNode: 'node-sms-1', toPort: 'alertTrigger' },
        { id: 'c4', fromNode: 'node-valve-4', fromPort: 'completedPulse', toNode: 'node-sheet-1', toPort: 'trigger' },
        { id: 'c5', fromNode: 'node-valve-4', fromPort: 'waterDischargedGallons', toNode: 'node-owrb-1', toPort: 'gallonsPumped' },
        { id: 'c6', fromNode: 'node-valve-4', fromPort: 'completedPulse', toNode: 'node-owrb-1', toPort: 'logTrigger' }
      ]
    },
    {
      id: 'norman-soil-adaptive',
      name: '2. Cleveland Co. Soil-Adaptive Runoff Guard',
      badge: 'Norman Soil NRCS',
      description: 'Uses Cleveland County (Stephenville-Harrah) soil infiltration rates (1.2 in/hr) to calculate Cycle & Soak pulses, preventing surface runoff.',
      nodes: [
        { id: 'node-soil-1', type: 'soil-cleveland-unit', x: 60, y: 140, config: { selectedUnit: 'stephenville-harrah-newalla' } },
        { id: 'node-limiter-1', type: 'logic-infiltration-limiter', x: 420, y: 140, config: { maxSinglePulseMinutes: 20 } },
        { id: 'node-valve-soak', type: 'action-wiseconn-valve', x: 740, y: 140, config: { valveId: 'VALVE-04', nominalDurationMinutes: 20, flowRateGpm: 120 } },
        { id: 'node-sheet-2', type: 'log-google-sheets', x: 1040, y: 140, config: { sheetName: 'Soil_Infiltration_Water_Logs_Norman' } }
      ],
      connections: [
        { id: 'c201', fromNode: 'node-soil-1', fromPort: 'infiltrationRate', toNode: 'node-limiter-1', toPort: 'soilInfiltrationInHr' },
        { id: 'c202', fromNode: 'node-limiter-1', fromPort: 'safeApplicationTrigger', toNode: 'node-valve-soak', toPort: 'trigger' },
        { id: 'c203', fromNode: 'node-limiter-1', fromPort: 'cycleRunMinutes', toNode: 'node-valve-soak', toPort: 'durationMinutes' },
        { id: 'c204', fromNode: 'node-valve-soak', fromPort: 'completedPulse', toNode: 'node-sheet-2', toPort: 'trigger' }
      ]
    },
    {
      id: 'et0-deficit-replenishment',
      name: '3. Daily ET₀ Water Deficit Volume Replenishment',
      badge: 'Weather & Volume',
      description: 'Calculates net water lost from evapotranspiration minus rain, determines exact required gallons for 12.5 acres, and operates WiseConn valve.',
      nodes: [
        { id: 'node-weather-1', type: 'sensor-weather-et0', x: 60, y: 160, config: { dailyEt0: 0.28, rainfall24h: 0.05 } },
        { id: 'node-deficit-1', type: 'logic-water-deficit-calc', x: 400, y: 160, config: { fieldAcres: 12.5, cropCoefficientKc: 1.05, fallbackGpm: 120 } },
        { id: 'node-gate-power', type: 'gate-peak-power', x: 720, y: 160, config: { peakStartHour: 14, peakEndHour: 19 } },
        { id: 'node-valve-et', type: 'action-wiseconn-valve', x: 1020, y: 160, config: { valveId: 'VALVE-04', nominalDurationMinutes: 45, flowRateGpm: 120 } }
      ],
      connections: [
        { id: 'c301', fromNode: 'node-weather-1', fromPort: 'netDeficit', toNode: 'node-deficit-1', toPort: 'deficitInches' },
        { id: 'c302', fromNode: 'node-deficit-1', fromPort: 'runTimeMinutes', toNode: 'node-valve-et', toPort: 'durationMinutes' },
        { id: 'c303', fromNode: 'node-deficit-1', fromPort: 'runTimeMinutes', toNode: 'node-gate-power', toPort: 'pumpRequest' },
        { id: 'c304', fromNode: 'node-gate-power', fromPort: 'allowOperation', toNode: 'node-valve-et', toPort: 'trigger' }
      ]
    },
    {
      id: 'owrb-groundwater-quota-lockout',
      name: '4. OWRB Groundwater Quota Enforcement',
      badge: 'Legal & Conservation',
      description: 'Guards the farm’s 25.0 Acre-Foot annual groundwater permit. Halts VFD Well Pump #1 when extraction reaches 100% and alerts the farm manager.',
      nodes: [
        { id: 'node-meter-1', type: 'sensor-well-meter', x: 80, y: 200, config: { currentGpm: 450, totalGallonsYtd: 8150000 } },
        { id: 'node-quota-1', type: 'logic-owrb-quota-guard', x: 420, y: 200, config: { permitNumber: 'OWRB-GW-2026-0814', annualAllocationAcFt: 25.0 } },
        { id: 'node-pump-1', type: 'action-vfd-pump', x: 760, y: 140, config: { pumpId: 'WELL-PUMP-01', targetGpm: 450, operatingStatus: 'RUNNING' } },
        { id: 'node-sms-quota', type: 'alert-sms-twilio', x: 760, y: 340, config: { recipientPhone: '+1 (405) 555-FARM' } }
      ],
      connections: [
        { id: 'c401', fromNode: 'node-meter-1', fromPort: 'totalGallonsYtd', toNode: 'node-quota-1', toPort: 'cumulativeGallons' },
        { id: 'c402', fromNode: 'node-quota-1', fromPort: 'emergencyCutoffTrigger', toNode: 'node-pump-1', toPort: 'commandStop' },
        { id: 'c403', fromNode: 'node-quota-1', fromPort: 'emergencyCutoffTrigger', toNode: 'node-sms-quota', toPort: 'alertTrigger' }
      ]
    }
  ];

  // ==================== WORKFLOW EXECUTION ENGINE ====================
  class WorkflowEngine {
    constructor() {
      this.nodes = new Map();
      this.connections = [];
      this.listeners = new Set();
      this.executionLog = [];
    }

    subscribe(fn) {
      this.listeners.add(fn);
      return () => this.listeners.delete(fn);
    }

    notify(event, data) {
      this.listeners.forEach(fn => fn(event, data));
    }

    loadGraph(graphData) {
      this.nodes.clear();
      this.connections = [];
      (graphData.nodes || []).forEach(n => {
        this.nodes.set(n.id, { ...n, runtimeOutputs: {}, executionState: 'IDLE' });
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
      if (fromNode === toNode) return null;
      const exists = this.connections.some(c =>
        c.fromNode === fromNode && c.fromPort === fromPort && c.toNode === toNode && c.toPort === toPort
      );
      if (exists) return null;
      const conn = {
        id: `wire-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 5)}`,
        fromNode, fromPort, toNode, toPort, active: false
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

    async executeWorkflow(triggerSource = 'USER_MANUAL') {
      this.log(`🚀 [ENGINE] Starting Workflow Execution (Trigger: ${triggerSource})`);
      this.nodes.forEach(n => { n.executionState = 'EVALUATING'; n.runtimeOutputs = {}; });
      this.connections.forEach(c => { c.active = false; });
      this.notify('EXECUTION_STARTED');

      const incoming = new Map();
      this.nodes.forEach(n => incoming.set(n.id, []));
      this.connections.forEach(c => {
        if (incoming.has(c.toNode)) incoming.get(c.toNode).push(c);
      });

      const queue = [];
      incoming.forEach((conns, nodeId) => {
        if (conns.length === 0) queue.push(nodeId);
      });

      const evaluated = new Set();
      while (queue.length > 0) {
        const currentId = queue.shift();
        const node = this.nodes.get(currentId);
        if (!node) continue;

        node.executionState = 'EVALUATING';
        this.notify('NODE_STATUS_CHANGE', { nodeId: currentId, state: 'EVALUATING' });
        await new Promise(r => setTimeout(r, 120));

        try {
          const nodeInputs = {};
          (incoming.get(currentId) || []).forEach(conn => {
            const src = this.nodes.get(conn.fromNode);
            if (src && src.runtimeOutputs) nodeInputs[conn.toPort] = src.runtimeOutputs[conn.fromPort];
          });

          const outputs = this.evaluateSingleNode(node, nodeInputs);
          node.runtimeOutputs = outputs;
          node.executionState = 'SUCCESS';

          const outgoing = this.connections.filter(c => c.fromNode === currentId);
          outgoing.forEach(c => {
            c.active = true;
            if (!queue.includes(c.toNode) && !evaluated.has(c.toNode)) {
              const ready = incoming.get(c.toNode).every(dep => evaluated.has(dep.fromNode) || dep.fromNode === currentId);
              if (ready) queue.push(c.toNode);
            }
          });

          this.notify('NODE_STATUS_CHANGE', { nodeId: currentId, state: 'SUCCESS', outputs });
          await new Promise(r => setTimeout(r, 150));
        } catch (err) {
          node.executionState = 'ERROR';
          this.notify('NODE_STATUS_CHANGE', { nodeId: currentId, state: 'ERROR', error: err.message });
        }
        evaluated.add(currentId);
      }

      this.log(`✅ [ENGINE] Workflow Evaluation Finished.`);
      this.notify('EXECUTION_COMPLETED');
    }

    evaluateSingleNode(node, inputs) {
      const hw = hardwareSimulator.state;
      const cfg = node.config;

      switch (node.type) {
        case 'sensor-ketos-salinity': {
          const sal = hw.ketosProbe.salinityMsCm ?? cfg.currentSalinity;
          const isSpike = sal > (cfg.thresholdMsCm || 2.0);
          this.log(`📊 [KETOS] Salinity: ${sal} mS/cm | Spike (>2.0): ${isSpike}`);
          return { salinity: sal, salinitySpike: isSpike };
        }
        case 'sensor-soil-moisture': {
          const vwc = hw.soilMoisture.vwcPercent ?? cfg.currentVwc;
          const deficit = vwc < (cfg.refillThreshold || 22.0);
          this.log(`🌱 [AquaSpy] Moisture: ${vwc}% | Deficit: ${deficit}`);
          return { vwc, deficitDetected: deficit };
        }
        case 'sensor-weather-et0': {
          const et0 = hw.weather.et0Inches ?? cfg.dailyEt0;
          const rain = hw.weather.rainfallInches ?? cfg.rainfall24h;
          const net = Math.max(0, Number((et0 - rain).toFixed(2)));
          this.log(`☀️ [Weather] ET₀: ${et0}" | Rain: ${rain}" | Net: ${net}"`);
          return { et0, rainfall: rain, netDeficit: net };
        }
        case 'sensor-well-meter': {
          const gpm = hw.pump.status === 'RUNNING' ? (hw.pump.currentGpm || 450) : 0;
          const ytd = hw.pump.totalGallonsYtd;
          return { flowRateGpm: gpm, totalGallonsYtd: ytd };
        }
        case 'soil-cleveland-unit': {
          const u = CLEVELAND_COUNTY_SOILS[cfg.selectedUnit] || CLEVELAND_COUNTY_SOILS['stephenville-harrah-newalla'];
          this.log(`🗺️ [Cleveland Soil] ${u.name} | Max Infil: ${u.infiltrationRateInHr}"/hr`);
          return { infiltrationRate: u.infiltrationRateInHr, availableWaterCapacity: u.availableWaterCapacity };
        }
        case 'logic-comparator': {
          const inVal = inputs.inputValue ?? 0;
          const th = Number(cfg.threshold ?? 2.0);
          let pass = false;
          if (cfg.operator === '>') pass = inVal > th;
          else if (cfg.operator === '>=') pass = inVal >= th;
          else if (cfg.operator === '<') pass = inVal < th;
          else if (cfg.operator === '<=') pass = inVal <= th;
          else pass = inVal === th;
          this.log(`⚖️ [Comparator] ${inVal} ${cfg.operator} ${th} -> ${pass ? 'TRUE (Trigger THEN)' : 'FALSE'}`);
          return { result: pass, thenPulse: pass, elsePulse: !pass };
        }
        case 'logic-water-deficit-calc': {
          const net = inputs.deficitInches ?? 0.23;
          const acres = Number(cfg.fieldAcres || 12.5);
          const gpm = inputs.systemFlowGpm || cfg.fallbackGpm || 120;
          const res = HydrologyCalculations.calcRequiredRunMinutes(net * (cfg.cropCoefficientKc || 1.05), acres, gpm);
          this.log(`💧 [Hydrology] Requires ${res.totalGallons.toLocaleString()} gal (~${res.runMinutes} min)`);
          return { gallonsRequired: res.totalGallons, runTimeMinutes: res.runMinutes };
        }
        case 'logic-infiltration-limiter': {
          const target = inputs.targetRunMinutes || 25;
          const infil = inputs.soilInfiltrationInHr || 1.1;
          const cycleMin = infil < 0.3 ? 10 : (infil < 0.8 ? 18 : target);
          const soakMin = infil < 0.3 ? 35 : (infil < 0.8 ? 25 : 0);
          this.log(`🛡️ [Soil Safeguard] Pulse: ${cycleMin}m ON / ${soakMin}m SOAK`);
          return { cycleRunMinutes: cycleMin, soakMinutes: soakMin, safeApplicationTrigger: true };
        }
        case 'logic-owrb-quota-guard': {
          const gal = inputs.cumulativeGallons || hw.pump.totalGallonsYtd;
          const acFt = HydrologyCalculations.gallonsToAcreFeet(gal);
          const cap = Number(cfg.annualAllocationAcFt || 25.0);
          const over = acFt >= cap;
          this.log(`🏛️ [OWRB Quota] ${acFt} / ${cap} Ac-Ft (${Math.round((acFt/cap)*100)}%)`);
          return { percentQuotaUsed: Math.round((acFt/cap)*100), emergencyCutoffTrigger: over };
        }
        case 'gate-peak-power': {
          const hr = new Date().getHours();
          const isPeak = hr >= (cfg.peakStartHour || 14) && hr < (cfg.peakEndHour || 19);
          return { allowOperation: !isPeak };
        }
        case 'action-wiseconn-valve': {
          const shouldTrigger = inputs.trigger !== false;
          const duration = inputs.durationMinutes || cfg.nominalDurationMinutes || 20;
          if (shouldTrigger) {
            hardwareSimulator.openWiseConnValve(cfg.valveId || 'VALVE-04', duration);
            this.log(`🚜 [WiseConn] Valve ${cfg.valveId} OPENED for ${duration} min via DropControl API`);
            return { valveStatus: 'OPEN', waterDischargedGallons: duration * (cfg.flowRateGpm || 120), completedPulse: true };
          }
          return { valveStatus: 'CLOSED', waterDischargedGallons: 0, completedPulse: false };
        }
        case 'action-vfd-pump': {
          if (inputs.commandStop) {
            hardwareSimulator.stopPump();
            this.log(`🛑 [VFD Pump] Emergency Interlock triggered. Pump STOPPED.`);
            return { isRunning: false };
          }
          if (inputs.commandStart !== false) {
            hardwareSimulator.startPump(inputs.targetGpm || cfg.targetGpm || 450);
            return { isRunning: true };
          }
          return { isRunning: hw.pump.status === 'RUNNING' };
        }
        case 'log-google-sheets': {
          const row = hardwareSimulator.appendGoogleSheetRow({
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
            valveId: 'VALVE-04', durationMin: 20, gallons: 2400,
            salinity: `${hw.ketosProbe.salinityMsCm} mS/cm`,
            notes: 'Auto-appended by Farm-Flow Google Sheet Integration'
          });
          this.log(`📋 [Google Sheets] Row #${row.rowId} logged for regulatory compliance.`);
          return { status: true };
        }
        case 'log-owrb-ledger': {
          const gal = inputs.gallonsPumped || 2400;
          const rec = hardwareSimulator.logOwrbExtraction(gal, 'VALVE-04');
          this.log(`🏛️ [OWRB Ledger] Audit entry logged: +${gal.toLocaleString()} gal (+${rec.acreFeet} Ac-Ft). Balance: ${rec.balanceRemainingAcFt} Ac-Ft`);
          return { auditRecorded: true };
        }
        case 'alert-sms-twilio': {
          this.log(`📱 [Twilio SMS] Dispatched to ${cfg.recipientPhone}: "High salinity (>2.0) detected. WiseConn Valve 4 flushing."`);
          return { messageSent: true };
        }
        default:
          return {};
      }
    }

    log(msg) {
      const entry = { id: Math.random().toString(36).substring(2, 9), timestamp: new Date().toLocaleTimeString(), text: msg };
      this.executionLog.unshift(entry);
      if (this.executionLog.length > 100) this.executionLog.pop();
      this.notify('LOG_APPENDED', entry);
    }
  }

  const workflowEngine = new WorkflowEngine();

  // ==================== CANVAS UI CONTROLLER ====================
  class CanvasUI {
    constructor(containerId, engine) {
      this.container = document.getElementById(containerId);
      this.engine = engine;
      this.panX = 40;
      this.panY = 40;
      this.scale = 1.0;
      this.isPanning = false;
      this.startPanX = 0;
      this.startPanY = 0;
      this.selectedNodeId = null;
      this.isDraggingNode = false;
      this.draggedNodeId = null;
      this.dragOffset = { x: 0, y: 0 };
      this.isConnecting = false;
      this.connectingSource = null;
      this.currentMousePos = { x: 0, y: 0 };

      this.initDOM();
      this.bindEvents();
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

      window.addEventListener('mouseup', () => {
        if (this.isPanning) { this.isPanning = false; this.container.style.cursor = 'default'; }
        if (this.isDraggingNode) { this.isDraggingNode = false; this.draggedNodeId = null; }
        if (this.isConnecting) this.cancelConnecting();
      });

      this.container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const factor = 1.08;
        const oldScale = this.scale;
        let newScale = e.deltaY < 0 ? oldScale * factor : oldScale / factor;
        newScale = Math.min(Math.max(0.4, newScale), 2.2);

        const rect = this.container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        this.panX = mouseX - (mouseX - this.panX) * (newScale / oldScale);
        this.panY = mouseY - (mouseY - this.panY) * (newScale / oldScale);
        this.scale = newScale;
        this.updateTransform();

        const badge = document.getElementById('zoom-percentage');
        if (badge) badge.textContent = `${Math.round(this.scale * 100)}%`;
      }, { passive: false });

      this.container.addEventListener('dragover', (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; });
      this.container.addEventListener('drop', (e) => {
        e.preventDefault();
        const nodeType = e.dataTransfer.getData('application/farm-flow-node');
        if (nodeType) {
          const rect = this.container.getBoundingClientRect();
          const dropX = (e.clientX - rect.left - this.panX) / this.scale - 110;
          const dropY = (e.clientY - rect.top - this.panY) / this.scale - 40;
          const node = this.engine.addNode(nodeType, dropX, dropY);
          if (node) this.selectNode(node.id);
        }
      });
    }

    updateTransform() {
      this.viewport.style.transform = `translate(${this.panX}px, ${this.panY}px) scale(${this.scale})`;
    }

    zoomIn() { this.scale = Math.min(2.2, this.scale * 1.15); this.updateTransform(); document.getElementById('zoom-percentage').textContent = `${Math.round(this.scale * 100)}%`; }
    zoomOut() { this.scale = Math.max(0.4, this.scale / 1.15); this.updateTransform(); document.getElementById('zoom-percentage').textContent = `${Math.round(this.scale * 100)}%`; }
    resetView() { this.scale = 1.0; this.panX = 60; this.panY = 60; this.updateTransform(); document.getElementById('zoom-percentage').textContent = '100%'; }

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
          if (this.selectedNodeId === data.nodeId) this.selectNode(null);
          break;
        case 'NODE_UPDATED':
          this.refreshNodeSummary(data);
          break;
        case 'CONNECTION_ADDED':
        case 'CONNECTION_REMOVED':
          this.renderWires();
          break;
        case 'NODE_STATUS_CHANGE':
          this.updateNodeStatusVisual(data.nodeId, data.state);
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
          <div class="node-summary-preview" id="summary-${node.id}">${summaryText}</div>
          <div class="node-ports-container">
            <div class="ports-column inputs-column">${inputsHtml}</div>
            <div class="ports-column outputs-column">${outputsHtml}</div>
          </div>
        </div>
      `;

      nodeEl.addEventListener('mousedown', (e) => {
        if (e.target.closest('.port-socket') || e.target.closest('.node-close-btn') || e.target.closest('select') || e.target.closest('input')) return;
        this.selectNode(node.id);
        this.isDraggingNode = true;
        this.draggedNodeId = node.id;
        this.dragOffset = { x: this.currentMousePos.x - node.x, y: this.currentMousePos.y - node.y };
        e.stopPropagation();
      });

      nodeEl.querySelector('[data-delete-node]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.engine.removeNode(node.id);
      });

      nodeEl.querySelectorAll('.output-port .port-socket').forEach(socket => {
        socket.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          const portEl = socket.closest('.output-port');
          const portId = portEl.getAttribute('data-port');
          const pos = this.getPortCenterCoords(portEl);
          this.isConnecting = true;
          this.connectingSource = { nodeId: node.id, portId, x: pos.x, y: pos.y };
          this.tempWirePath.style.display = 'block';
          this.updateTempWire(this.connectingSource, this.currentMousePos);
        });
      });

      nodeEl.querySelectorAll('.input-port .port-socket').forEach(socket => {
        socket.addEventListener('mouseup', (e) => {
          e.stopPropagation();
          if (this.isConnecting && this.connectingSource) {
            const portEl = socket.closest('.input-port');
            const toPort = portEl.getAttribute('data-port');
            this.engine.addConnection(this.connectingSource.nodeId, this.connectingSource.portId, node.id, toPort);
            this.cancelConnecting();
          }
        });
      });

      this.nodesLayer.appendChild(nodeEl);
    }

    updateNodePositionInDOM(node) {
      const el = document.getElementById(`node-el-${node.id}`);
      if (el) { el.style.left = `${node.x}px`; el.style.top = `${node.y}px`; }
    }

    refreshNodeSummary(node) {
      const def = NODE_DEFINITIONS[node.type];
      const sumEl = document.getElementById(`summary-${node.id}`);
      if (def && sumEl && def.renderSummary) sumEl.innerHTML = def.renderSummary(node.config);
    }

    updateNodeStatusVisual(nodeId, state) {
      const pill = document.getElementById(`status-pill-${nodeId}`);
      const nodeEl = document.getElementById(`node-el-${nodeId}`);
      if (!pill || !nodeEl) return;
      pill.className = `node-status-pill status-${state.toLowerCase()}`;
      pill.textContent = state;
      if (state === 'EVALUATING') {
        nodeEl.classList.add('node-evaluating');
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
        document.getElementById(`node-el-${this.selectedNodeId}`)?.classList.remove('selected-node');
      }
      this.selectedNodeId = nodeId;
      if (nodeId) document.getElementById(`node-el-${nodeId}`)?.classList.add('selected-node');
      window.dispatchEvent(new CustomEvent('node-selected', { detail: { nodeId } }));
    }

    renderWires() {
      this.wiresGroup.innerHTML = '';
      this.engine.connections.forEach(conn => {
        const fromEl = this.container.querySelector(`.output-port[data-node="${conn.fromNode}"][data-port="${conn.fromPort}"]`);
        const toEl = this.container.querySelector(`.input-port[data-node="${conn.toNode}"][data-port="${conn.toPort}"]`);
        if (!fromEl || !toEl) return;

        const p1 = this.getPortCenterCoords(fromEl);
        const p2 = this.getPortCenterCoords(toEl);
        const pathData = this.calculateBezierPath(p1.x, p1.y, p2.x, p2.y);

        const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathEl.setAttribute('d', pathData);
        pathEl.setAttribute('class', `flow-wire ${conn.active ? 'wire-active' : ''}`);
        pathEl.setAttribute('data-wire-id', conn.id);
        pathEl.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Delete this connection wire?')) this.engine.removeConnection(conn.id);
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
      const cRect = this.container.getBoundingClientRect();
      return {
        x: (rect.left + rect.width / 2 - cRect.left - this.panX) / this.scale,
        y: (rect.top + rect.height / 2 - cRect.top - this.panY) / this.scale
      };
    }

    getIconSvg(name) {
      const icons = {
        'droplets': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
        'droplet': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>`,
        'cloud-sun': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M20 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.947 12.65a4 4 0 0 0-5.925-4.128"/><path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z"/></svg>`,
        'activity': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
        'gauge': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>`,
        'map-pin': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
        'layers': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        'calculator': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/></svg>`,
        'shield-check': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><path d="m9 12 2 2 4-4"/></svg>`,
        'scale': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/></svg>`,
        'git-branch': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
        'clock': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
        'toggle-right': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"/><circle cx="16" cy="12" r="2"/></svg>`,
        'zap': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
        'compass': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
        'file-check': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg>`,
        'table': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>`,
        'bell': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
        'cpu': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/></svg>`,
        'file-text': `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>`
      };
      return icons[name] || icons['activity'];
    }
  }

  // ==================== MAIN APPLICATION CLASS ====================
  class FarmFlowApp {
    constructor() {
      this.canvasUI = null;
      this.selectedNodeId = null;
      this.continuousTimer = null;
    }

    init() {
      this.canvasUI = new CanvasUI('flow-canvas-container', workflowEngine);
      this.renderSidebarLibrary();
      this.initTemplateSelector();
      this.bindHardwareUI();
      this.bindNodeInspector();
      this.bindConsoleAndModals();
      this.loadTemplateById('hackathon-salinity-flush');
      this.bindToolbarButtons();
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
                  <div class="card-icon" style="color: ${node.accentColor}">${this.canvasUI.getIconSvg(node.icon)}</div>
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

      listContainer.querySelectorAll('.draggable-node-card').forEach(card => {
        card.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('application/farm-flow-node', card.getAttribute('data-node-type'));
          card.classList.add('dragging');
        });
        card.addEventListener('dragend', () => card.classList.remove('dragging'));
      });
    }

    initTemplateSelector() {
      const selectEl = document.getElementById('template-select');
      if (!selectEl) return;
      selectEl.innerHTML = WORKFLOW_TEMPLATES.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
      selectEl.addEventListener('change', (e) => this.loadTemplateById(e.target.value));
    }

    loadTemplateById(templateId) {
      const tmpl = WORKFLOW_TEMPLATES.find(t => t.id === templateId) || WORKFLOW_TEMPLATES[0];
      workflowEngine.loadGraph(tmpl);
      this.canvasUI.resetView();

      const banner = document.getElementById('active-template-banner');
      if (banner) {
        banner.innerHTML = `<span class="template-pill">${tmpl.badge}</span> <strong>${tmpl.name}:</strong> ${tmpl.description}`;
      }
      workflowEngine.log(`📂 Loaded Workflow Template: "${tmpl.name}"`);
    }

    bindToolbarButtons() {
      document.getElementById('btn-run-workflow')?.addEventListener('click', () => {
        workflowEngine.executeWorkflow('MANUAL_RUN_BUTTON');
      });

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

      document.getElementById('btn-zoom-in')?.addEventListener('click', () => this.canvasUI.zoomIn());
      document.getElementById('btn-zoom-out')?.addEventListener('click', () => this.canvasUI.zoomOut());
      document.getElementById('btn-zoom-fit')?.addEventListener('click', () => this.canvasUI.resetView());
      document.getElementById('btn-clear-canvas')?.addEventListener('click', () => {
        if (confirm('Clear the entire canvas?')) workflowEngine.loadGraph({ nodes: [], connections: [] });
      });

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

      document.getElementById('btn-scenario-salinity')?.addEventListener('click', () => {
        hardwareSimulator.setSalinity(2.45);
        workflowEngine.log('⚡ [SCENARIO] Injected KETOS Salinity Spike (2.45 mS/cm > 2.0 threshold)!');
        workflowEngine.executeWorkflow('SCENARIO_SALINITY_SPIKE');
      });

      document.getElementById('btn-scenario-drought')?.addEventListener('click', () => {
        hardwareSimulator.setSoilMoisture(14.8);
        hardwareSimulator.setEt0(0.35);
        hardwareSimulator.setRainfall(0.00);
        workflowEngine.log('⚡ [SCENARIO] Injected Heatwave: Moisture 14.8%, ET₀ 0.35"/day.');
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

      hardwareSimulator.subscribe((hw) => this.updateHardwareRackDOM(hw));
      this.updateHardwareRackDOM(hardwareSimulator.state);
    }

    updateHardwareRackDOM(hw) {
      const v4 = hw.valves['VALVE-04'];
      const v4El = document.getElementById('rack-valve-4-state');
      const v4Rem = document.getElementById('rack-valve-4-timer');
      const v4Tot = document.getElementById('rack-valve-4-volume');
      if (v4El) {
        v4El.className = v4.status === 'OPEN' ? 'status-tag status-open' : 'status-tag status-closed';
        v4El.textContent = v4.status === 'OPEN' ? 'OPEN (ACTUATED)' : 'CLOSED';
      }
      if (v4Rem) v4Rem.textContent = v4.remainingMinutes > 0 ? `${Math.ceil(v4.remainingMinutes)} min left` : 'Standby';
      if (v4Tot) v4Tot.textContent = `${Math.round(v4.totalGallonsDelivered).toLocaleString()} gal`;

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
      if (pumpYtd) pumpYtd.textContent = `${(hw.pump.totalGallonsYtd / 325851).toFixed(2)} Ac-Ft`;

      const permitBar = document.getElementById('rack-owrb-bar');
      const permitText = document.getElementById('rack-owrb-text');
      if (permitBar && permitText) {
        const pct = Math.min(100, Math.round((hw.owrbPermit.usedAcFt / hw.owrbPermit.annualQuotaAcFt) * 100));
        permitBar.style.width = `${pct}%`;
        permitBar.className = `permit-progress-bar ${pct > 90 ? 'bar-danger' : pct > 75 ? 'bar-warning' : 'bar-normal'}`;
        permitText.textContent = `${hw.owrbPermit.usedAcFt} / ${hw.owrbPermit.annualQuotaAcFt} Ac-Ft (${pct}%)`;
      }

      const whCount = document.getElementById('webhook-count-badge');
      if (whCount) whCount.textContent = hw.webhookLog.length;

      const gsCount = document.getElementById('sheets-count-badge');
      if (gsCount) gsCount.textContent = hw.googleSheetsLog.length;

      const salVal = document.getElementById('val-salinity');
      if (salVal) salVal.textContent = `${hw.ketosProbe.salinityMsCm.toFixed(2)} mS/cm`;
      const salSlider = document.getElementById('slider-salinity');
      if (salSlider && document.activeElement !== salSlider) salSlider.value = hw.ketosProbe.salinityMsCm;

      const moistVal = document.getElementById('val-moisture');
      if (moistVal) moistVal.textContent = `${hw.soilMoisture.vwcPercent.toFixed(1)}%`;
      const moistSlider = document.getElementById('slider-moisture');
      if (moistSlider && document.activeElement !== moistSlider) moistSlider.value = hw.soilMoisture.vwcPercent;
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
        } else {
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

        document.getElementById('btn-save-inspector')?.addEventListener('click', () => this.saveNodeInspectorValues(node));
        document.getElementById('btn-delete-node-inspector')?.addEventListener('click', () => workflowEngine.removeNode(node.id));

        document.getElementById('cfg-soil-unit')?.addEventListener('change', (e) => {
          node.config.selectedUnit = e.target.value;
          const detailEl = document.getElementById('inspector-soil-detail');
          if (detailEl) detailEl.innerHTML = this.renderSoilCardDetail(e.target.value);
          workflowEngine.updateNodeConfig(node.id, { selectedUnit: e.target.value });
        });
      });
    }

    renderSoilCardDetail(unitKey) {
      const s = CLEVELAND_COUNTY_SOILS[unitKey] || CLEVELAND_COUNTY_SOILS['stephenville-harrah-newalla'];
      return `
        <div class="soil-detail-card">
          <div class="soil-metric-row"><span>Permeability:</span> <strong class="badge-permeability">${s.overallPermeability}</strong></div>
          <div class="soil-metric-row"><span>Max Infiltration:</span> <strong>${s.infiltrationRateInHr}" / hr</strong></div>
          <div class="soil-metric-row"><span>Avail. Water Cap:</span> <strong>${s.availableWaterCapacity} in/in</strong></div>
          <div class="soil-metric-row"><span>Runoff Risk:</span> <strong style="color: ${s.infiltrationRateInHr < 0.3 ? '#ef4444' : '#10b981'}">${s.runoffRisk}</strong></div>
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
      }
      workflowEngine.updateNodeConfig(node.id, newConfig);
      workflowEngine.log(`⚙️ Saved configuration for node: ${node.id}`);
    }

    bindConsoleAndModals() {
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

      const sheetModal = document.getElementById('modal-google-sheets');
      document.getElementById('btn-open-sheets-modal')?.addEventListener('click', () => {
        this.populateGoogleSheetsModal();
        if (sheetModal) sheetModal.style.display = 'flex';
      });

      const owrbModal = document.getElementById('modal-owrb');
      document.getElementById('btn-open-owrb-modal')?.addEventListener('click', () => {
        this.populateOwrbModal();
        if (owrbModal) owrbModal.style.display = 'flex';
      });

      const whModal = document.getElementById('modal-webhooks');
      document.getElementById('btn-open-webhooks-modal')?.addEventListener('click', () => {
        this.populateWebhookModal();
        if (whModal) whModal.style.display = 'flex';
      });

      const soilModal = document.getElementById('modal-soil-survey');
      document.getElementById('btn-open-soil-modal')?.addEventListener('click', () => {
        this.populateSoilModal();
        if (soilModal) soilModal.style.display = 'flex';
      });

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
      tableBody.innerHTML = hardwareSimulator.state.googleSheetsLog.map(r => `
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
      const p = hardwareSimulator.state.owrbPermit;
      if (quotaHeader) {
        quotaHeader.innerHTML = `
          <strong>Permit:</strong> ${p.permitId} | <strong>Basin:</strong> ${p.basin} | <strong>Used:</strong> ${p.usedAcFt} / ${p.annualQuotaAcFt} Acre-Feet 
          <span class="status-tag ${p.status === 'IN_COMPLIANCE' ? 'status-open' : 'status-interlocked'}">${p.status}</span>
        `;
      }
      if (!tableBody) return;
      tableBody.innerHTML = p.ledgerRecords.map(r => `
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
        container.innerHTML = `<div class="empty-hint" style="color: #64748b; padding: 20px;">No webhook dispatches recorded yet. Run a workflow to trigger API calls.</div>`;
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
            <strong>Payload:</strong>
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

  // Auto-boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    const app = new FarmFlowApp();
    app.init();
    window.farmFlowApp = app;
    window.workflowEngine = workflowEngine;
    window.hardwareSimulator = hardwareSimulator;
  });
})();
