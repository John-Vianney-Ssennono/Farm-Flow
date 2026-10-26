/**
 * Farm-Flow: Pre-built Low-Code Agricultural Workflow Templates
 * Includes the Hackathon Prompt demo (KETOS > 2.0 -> WiseConn Valve 4 20 min -> Google Sheets)
 * and Cleveland County Soil-Adaptive Water Quantity Orchestration.
 */

export const WORKFLOW_TEMPLATES = [
  {
    id: 'hackathon-salinity-flush',
    name: '1. KETOS Salinity Flush & Regulatory Log',
    badge: 'Hackathon Prompt',
    description: 'IF KETOS detects salinity > 2.0 mS/cm, THEN trigger WiseConn Valve 4 for 20 mins, AND log water volume to Google Sheets & OWRB ledger for regulatory compliance.',
    nodes: [
      {
        id: 'node-ketos-1',
        type: 'sensor-ketos-salinity',
        x: 60,
        y: 180,
        config: {
          sensorModel: 'KETOS SHIELD-2 In-Line',
          currentSalinity: 2.25,
          thresholdMsCm: 2.00
        }
      },
      {
        id: 'node-comp-1',
        type: 'logic-comparator',
        x: 360,
        y: 180,
        config: {
          operator: '>',
          threshold: 2.0,
          metricLabel: 'Salinity (mS/cm)'
        }
      },
      {
        id: 'node-valve-4',
        type: 'action-wiseconn-valve',
        x: 660,
        y: 120,
        config: {
          valveId: 'VALVE-04',
          zoneName: 'Block C - Pecan Orchard',
          nominalDurationMinutes: 20,
          flowRateGpm: 120,
          currentStatus: 'CLOSED'
        }
      },
      {
        id: 'node-sheet-1',
        type: 'log-google-sheets',
        x: 980,
        y: 80,
        config: {
          sheetName: '2026_Irrigation_Water_Volume_Norman',
          columns: 'Timestamp, ValveID, DurationMinutes, Gallons, SalinityEC',
          cloudSync: true
        }
      },
      {
        id: 'node-owrb-1',
        type: 'log-owrb-ledger',
        x: 980,
        y: 300,
        config: {
          basinName: 'Garber-Wellington Aquifer',
          permitOwner: 'Norman Agritech Holdings LLC',
          permitId: 'OWRB-GW-2026-0814',
          autoSyncOklahomaPortal: true
        }
      },
      {
        id: 'node-sms-1',
        type: 'alert-sms-twilio',
        x: 660,
        y: 360,
        config: {
          recipientPhone: '+1 (405) 555-FARM',
          alertPrefix: '🚨 [SALINITY FLUSH]',
          defaultTemplate: 'Salinity exceeded 2.0 mS/cm. WiseConn Valve 4 flushing 20 min.'
        }
      }
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
    description: 'Uses Cleveland County (Stephenville-Harrah) soil infiltration rates (1.2 in/hr) to calculate Cycle & Soak pulses, preventing surface runoff and deep percolation.',
    nodes: [
      {
        id: 'node-soil-1',
        type: 'soil-cleveland-unit',
        x: 60,
        y: 120,
        config: {
          selectedUnit: 'stephenville-harrah-newalla',
          rootZoneDepthInches: 24,
          irrigationEfficiency: 0.88
        }
      },
      {
        id: 'node-moisture-1',
        type: 'sensor-soil-moisture',
        x: 60,
        y: 340,
        config: {
          sensorId: 'PROBE-NORM-01',
          fieldZone: 'Zone 4 - North Orchard',
          depthInches: 24,
          currentVwc: 17.5,
          refillThreshold: 22.0
        }
      },
      {
        id: 'node-limiter-1',
        type: 'logic-infiltration-limiter',
        x: 420,
        y: 200,
        config: {
          maxSinglePulseMinutes: 25,
          minSoakMinutes: 20,
          strictSoilProtection: true
        }
      },
      {
        id: 'node-valve-soak',
        type: 'action-wiseconn-valve',
        x: 740,
        y: 200,
        config: {
          valveId: 'VALVE-04',
          zoneName: 'Block C - Pecan Orchard',
          nominalDurationMinutes: 25,
          flowRateGpm: 120,
          currentStatus: 'CLOSED'
        }
      },
      {
        id: 'node-sheet-2',
        type: 'log-google-sheets',
        x: 1040,
        y: 200,
        config: {
          sheetName: 'Soil_Infiltration_Water_Logs_Norman',
          columns: 'Timestamp, SoilMapUnit, Permeability, AppliedInches, RunoffRisk',
          cloudSync: true
        }
      }
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
    description: 'Calculates net water lost from evapotranspiration minus rain, determines exact required gallons for 12.5 acres, and operates WiseConn valve to replenish soil reservoir.',
    nodes: [
      {
        id: 'node-weather-1',
        type: 'sensor-weather-et0',
        x: 60,
        y: 160,
        config: {
          stationId: 'DAVIS-OK-NORM',
          dailyEt0: 0.28,
          rainfall24h: 0.05,
          tempF: 88
        }
      },
      {
        id: 'node-deficit-1',
        type: 'logic-water-deficit-calc',
        x: 400,
        y: 160,
        config: {
          fieldAcres: 12.5,
          cropCoefficientKc: 1.05,
          distributionUniformity: 0.88,
          fallbackGpm: 120
        }
      },
      {
        id: 'node-gate-power',
        type: 'gate-peak-power',
        x: 720,
        y: 160,
        config: {
          utilityProvider: 'OG&E Smart Hours Ag',
          peakStartHour: 14,
          peakEndHour: 19
        }
      },
      {
        id: 'node-valve-et',
        type: 'action-wiseconn-valve',
        x: 1020,
        y: 160,
        config: {
          valveId: 'VALVE-04',
          zoneName: 'Block C - Pecan Orchard',
          nominalDurationMinutes: 45,
          flowRateGpm: 120
        }
      }
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
    description: 'Guards the farm’s 25.0 Acre-Foot annual Garber-Wellington groundwater permit. Halts VFD Well Pump #1 when extraction reaches 100% and alerts the farm manager.',
    nodes: [
      {
        id: 'node-meter-1',
        type: 'sensor-well-meter',
        x: 80,
        y: 200,
        config: {
          meterId: 'FLOW-MCR-801',
          nominalGpm: 450,
          currentGpm: 450,
          totalGallonsYtd: 7850000 // near cap
        }
      },
      {
        id: 'node-quota-1',
        type: 'logic-owrb-quota-guard',
        x: 420,
        y: 200,
        config: {
          permitNumber: 'OWRB-GW-2026-0814',
          annualAllocationAcFt: 25.0,
          warningThresholdPercent: 85.0
        }
      },
      {
        id: 'node-pump-1',
        type: 'action-vfd-pump',
        x: 760,
        y: 140,
        config: {
          pumpId: 'WELL-PUMP-01',
          horsepower: 60,
          operatingStatus: 'RUNNING',
          targetGpm: 450
        }
      },
      {
        id: 'node-sms-quota',
        type: 'alert-sms-twilio',
        x: 760,
        y: 340,
        config: {
          recipientPhone: '+1 (405) 555-FARM',
          alertPrefix: '🚨 [OWRB QUOTA BREACH]',
          defaultTemplate: 'CRITICAL: Annual groundwater permit quota reached (25.0 Ac-Ft). Well Pump 1 interlocked.'
        }
      }
    ],
    connections: [
      { id: 'c401', fromNode: 'node-meter-1', fromPort: 'totalGallonsYtd', toNode: 'node-quota-1', toPort: 'cumulativeGallons' },
      { id: 'c402', fromNode: 'node-quota-1', fromPort: 'emergencyCutoffTrigger', toNode: 'node-pump-1', toPort: 'commandStop' },
      { id: 'c403', fromNode: 'node-quota-1', fromPort: 'emergencyCutoffTrigger', toNode: 'node-sms-quota', toPort: 'alertTrigger' }
    ]
  }
];
