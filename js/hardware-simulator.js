/**
 * Farm-Flow: Virtual Ag Hardware & IoT Equipment Simulator
 * Simulates WiseConn Valves, VFD Well Pumps, McCrometer Flow Meters, KETOS probes,
 * Weather Stations, and OWRB Compliance Logging.
 */

export class FarmHardwareSimulator {
  constructor() {
    this.state = {
      // WiseConn DropControl Valves
      valves: {
        'VALVE-04': {
          id: 'VALVE-04',
          name: 'Block C - Pecan Orchard',
          status: 'CLOSED', // 'OPEN' | 'CLOSED'
          flowRateGpm: 120,
          targetDurationMinutes: 0,
          remainingMinutes: 0,
          timerInterval: null,
          totalGallonsDelivered: 14200
        },
        'VALVE-02': {
          id: 'VALVE-02',
          name: 'Block A - Wheat & Cover Crop',
          status: 'CLOSED',
          flowRateGpm: 180,
          targetDurationMinutes: 0,
          remainingMinutes: 0,
          timerInterval: null,
          totalGallonsDelivered: 28500
        }
      },

      // VFD Well Pump (Norman Municipal & Ag Aquifer)
      pump: {
        id: 'WELL-PUMP-01',
        name: 'Norman Well #1 (Garber-Wellington)',
        status: 'STOPPED', // 'RUNNING' | 'STOPPED'
        currentGpm: 0,
        ratedMaxGpm: 500,
        pressurePsi: 0,
        frequencyHz: 0,
        interlockedByQuota: false,
        totalGallonsYtd: 4850000 // ~14.88 Acre-Feet
      },

      // KETOS Salinity / EC Sensor
      ketosProbe: {
        salinityMsCm: 2.25, // Default > 2.0 to trigger Hackathon prompt scenario!
        nitratePpm: 14.2,
        waterTempF: 68.4
      },

      // Soil Moisture (AquaSpy 24-inch profile)
      soilMoisture: {
        vwcPercent: 17.5, // Below 22% refill point
        temperatureF: 72.1,
        refillThreshold: 22.0,
        fieldCapacity: 34.0
      },

      // Weather & Evapotranspiration
      weather: {
        et0Inches: 0.28,
        rainfallInches: 0.00,
        solarRadiationWm2: 820,
        ambientTempF: 91
      },

      // OWRB Regulatory Compliance Ledger
      owrbPermit: {
        permitId: 'OWRB-GW-2026-0814',
        basin: 'Garber-Wellington Aquifer (Cleveland Co.)',
        annualQuotaAcFt: 25.0,
        usedAcFt: 14.88,
        status: 'IN_COMPLIANCE', // 'IN_COMPLIANCE' | 'WARNING' | 'EXCEEDED'
        ledgerRecords: [
          {
            timestamp: new Date(Date.now() - 3600000 * 24 * 3).toISOString().replace('T', ' ').substring(0, 19),
            source: 'WELL-PUMP-01',
            gallons: 384000,
            acreFeet: 1.18,
            balanceRemainingAcFt: 11.30,
            status: 'VERIFIED'
          },
          {
            timestamp: new Date(Date.now() - 3600000 * 24).toISOString().replace('T', ' ').substring(0, 19),
            source: 'WELL-PUMP-01',
            gallons: 240000,
            acreFeet: 0.74,
            balanceRemainingAcFt: 10.56,
            status: 'VERIFIED'
          }
        ]
      },

      // Google Sheets Compliance Table
      googleSheetsLog: [
        {
          rowId: 101,
          timestamp: new Date(Date.now() - 86400000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          valveId: 'VALVE-04',
          durationMin: 20,
          gallons: 2400,
          salinity: '2.18 mS/cm',
          notes: 'Salinity flush cycle executed'
        }
      ],

      // Remote Webhook Dispatch Log
      webhookLog: []
    };

    this.listeners = new Set();
    this.startHardwareTick();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this.state));
  }

  /**
   * Periodic tick simulating water accumulation and valve timers
   */
  startHardwareTick() {
    setInterval(() => {
      let stateChanged = false;

      // Handle active valves
      for (const valveId in this.state.valves) {
        const valve = this.state.valves[valveId];
        if (valve.status === 'OPEN') {
          // Add water volume (simulating 1 minute flow per 2 seconds in fast simulation mode)
          const gallonsThisTick = (valve.flowRateGpm / 30);
          valve.totalGallonsDelivered += gallonsThisTick;

          if (valve.remainingMinutes > 0) {
            valve.remainingMinutes = Math.max(0, valve.remainingMinutes - 0.2);
            if (valve.remainingMinutes <= 0) {
              valve.status = 'CLOSED';
              this.logWebhook(`VALVE_AUTO_CLOSE`, { valveId: valve.id, reason: 'Duration timer expired' });
            }
          }
          stateChanged = true;
        }
      }

      // Handle running pump
      if (this.state.pump.status === 'RUNNING') {
        const pumpGallons = (this.state.pump.currentGpm / 30);
        this.state.pump.totalGallonsYtd += pumpGallons;
        this.state.owrbPermit.usedAcFt = Number((this.state.pump.totalGallonsYtd / 325851).toFixed(3));

        if (this.state.owrbPermit.usedAcFt >= this.state.owrbPermit.annualQuotaAcFt) {
          this.state.owrbPermit.status = 'EXCEEDED';
          this.state.pump.status = 'STOPPED';
          this.state.pump.interlockedByQuota = true;
          this.logWebhook(`OWRB_EMERGENCY_SHUTDOWN`, {
            pumpId: this.state.pump.id,
            reason: 'Annual groundwater allocation quota reached (25.0 Ac-Ft)'
          });
        } else if (this.state.owrbPermit.usedAcFt >= this.state.owrbPermit.annualQuotaAcFt * 0.85) {
          this.state.owrbPermit.status = 'WARNING';
        }
        stateChanged = true;
      }

      if (stateChanged) {
        this.notify();
      }
    }, 1000);
  }

  // ==================== EQUIPMENT CONTROL COMMANDS ====================

  /**
   * Actuate WiseConn Valve (as specified in Hackathon Prompt)
   */
  openWiseConnValve(valveId = 'VALVE-04', durationMinutes = 20) {
    const valve = this.state.valves[valveId] || this.state.valves['VALVE-04'];
    valve.status = 'OPEN';
    valve.targetDurationMinutes = durationMinutes;
    valve.remainingMinutes = durationMinutes;

    const estimatedGallons = durationMinutes * valve.flowRateGpm;

    // Log the API Webhook Call
    const webhookCall = {
      id: 'WH-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      endpoint: `https://api.wiseconn.cloud/v2/valves/${valve.id}/actuate`,
      method: 'POST',
      payload: {
        command: 'OPEN_VALVE',
        valveId: valve.id,
        durationMinutes: durationMinutes,
        expectedFlowRateGpm: valve.flowRateGpm,
        estVolumeGallons: estimatedGallons
      },
      response: {
        status: 200,
        message: `WiseConn DropControl node ACK. Valve ${valve.id} opened for ${durationMinutes} minutes.`
      }
    };
    this.state.webhookLog.unshift(webhookCall);

    // Also auto-append to Google Sheets (as requested in Hackathon prompt!)
    this.appendGoogleSheetRow({
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      valveId: valve.id,
      durationMin: durationMinutes,
      gallons: estimatedGallons,
      salinity: `${this.state.ketosProbe.salinityMsCm} mS/cm`,
      notes: `Triggered by Farm-Flow Automation`
    });

    this.notify();
    return webhookCall;
  }

  closeWiseConnValve(valveId = 'VALVE-04') {
    const valve = this.state.valves[valveId] || this.state.valves['VALVE-04'];
    valve.status = 'CLOSED';
    valve.remainingMinutes = 0;
    this.notify();
  }

  /**
   * Control VFD Well Pump
   */
  startPump(targetGpm = 450) {
    if (this.state.pump.interlockedByQuota) {
      console.warn('Cannot start pump: OWRB quota exceeded!');
      return false;
    }
    this.state.pump.status = 'RUNNING';
    this.state.pump.currentGpm = targetGpm;
    this.state.pump.pressurePsi = 58;
    this.state.pump.frequencyHz = 55;
    this.notify();
    return true;
  }

  stopPump() {
    this.state.pump.status = 'STOPPED';
    this.state.pump.currentGpm = 0;
    this.state.pump.pressurePsi = 0;
    this.state.pump.frequencyHz = 0;
    this.notify();
  }

  /**
   * Log entry to official OWRB regulatory ledger
   */
  logOwrbExtraction(gallons, source = 'WELL-PUMP-01') {
    const acFt = Number((gallons / 325851).toFixed(3));
    this.state.pump.totalGallonsYtd += gallons;
    this.state.owrbPermit.usedAcFt = Number((this.state.pump.totalGallonsYtd / 325851).toFixed(3));
    const remaining = Number((this.state.owrbPermit.annualQuotaAcFt - this.state.owrbPermit.usedAcFt).toFixed(3));

    const record = {
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source,
      gallons: Math.round(gallons),
      acreFeet: acFt,
      balanceRemainingAcFt: remaining,
      status: 'VERIFIED'
    };

    this.state.owrbPermit.ledgerRecords.unshift(record);
    this.notify();
    return record;
  }

  /**
   * Append row to Google Sheets
   */
  appendGoogleSheetRow(data) {
    const row = {
      rowId: this.state.googleSheetsLog.length + 101,
      ...data
    };
    this.state.googleSheetsLog.unshift(row);
    if (this.state.googleSheetsLog.length > 50) this.state.googleSheetsLog.pop();
    this.notify();
    return row;
  }

  /**
   * Helper to push into webhook dispatch log
   */
  logWebhook(title, payload) {
    this.state.webhookLog.unshift({
      id: 'EVT-' + Math.random().toString(36).substring(2, 7).toUpperCase(),
      timestamp: new Date().toLocaleTimeString(),
      endpoint: title,
      method: 'SIMULATED_EVENT',
      payload,
      response: { status: 200, message: 'Processed successfully' }
    });
    if (this.state.webhookLog.length > 30) this.state.webhookLog.pop();
    this.notify();
  }

  // ==================== SENSOR OVERRIDES (SLIDERS) ====================
  setSalinity(value) {
    this.state.ketosProbe.salinityMsCm = Number(Number(value).toFixed(2));
    this.notify();
  }

  setSoilMoisture(value) {
    this.state.soilMoisture.vwcPercent = Number(Number(value).toFixed(1));
    this.notify();
  }

  setEt0(value) {
    this.state.weather.et0Inches = Number(Number(value).toFixed(2));
    this.notify();
  }

  setRainfall(value) {
    this.state.weather.rainfallInches = Number(Number(value).toFixed(2));
    this.notify();
  }

  resetOwrbQuota() {
    this.state.pump.totalGallonsYtd = 4850000;
    this.state.pump.interlockedByQuota = false;
    this.state.owrbPermit.usedAcFt = 14.88;
    this.state.owrbPermit.status = 'IN_COMPLIANCE';
    this.notify();
  }
}

// Global singleton instance for easy access across the entire app
export const hardwareSimulator = new FarmHardwareSimulator();
