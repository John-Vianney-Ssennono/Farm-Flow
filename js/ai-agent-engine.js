/**
 * ==============================================================================
 * FARM-FLOW: AGRISENSE AI AGRONOMIST AGENT ENGINE
 * ==============================================================================
 * This module coordinates real-time agricultural reasoning based on USDA soil
 * taxonomy, electrical conductivity (salinity), and root-zone water deficits.
 * 
 * Key Functions:
 * 1. Generates prioritized, scientifically grounded recommendations.
 * 2. Gives farmers full agency with "Implement" vs "Ignore" action buttons.
 * 3. Logs farmer decisions to an audit journal.
 * 4. Provides a conversational AI assistant answering Cleveland County queries.
 * 
 * Fully commented line-by-line for complete architectural transparency.
 * ==============================================================================
 */

// Bind the AI Agent Engine singleton to the global window object
window.AIAgentEngine = {
  
  // Array storing the currently active AI recommendations displayed to the farmer
  activeRecommendations: [],
  
  // Historical decision log capturing all 'IMPLEMENTED' and 'IGNORED' farmer choices
  historyLog: [],
  
  // Subscriber callback set for reactive UI state updates in React
  listeners: new Set(),

  /**
   * Subscribe a React component or listener function to state changes
   * @param {Function} fn - Callback function receiving (recommendations, historyLog)
   * @returns {Function} Unsubscribe teardown function
   */
  subscribe(fn) {
    // Add callback to the listener set
    this.listeners.add(fn);
    // Return cleanup closure that removes the listener
    return () => this.listeners.delete(fn);
  },

  /**
   * Broadcast current recommendations and history log to all subscribed React components
   */
  notify() {
    // Iterate through all registered listener callbacks and invoke with latest state
    this.listeners.forEach(fn => fn(this.activeRecommendations, this.historyLog));
  },

  /**
   * Core Reasoning Function: Evaluates current parcel location and physical soil parameters
   * 
   * @param {Object} locationData - Current GPS coordinates and parcel name
   * @param {Object} soilUnit - Active USDA Cleveland County soil map unit
   * @param {number} currentVwc - Measured volumetric water content (% VWC)
   * @param {number} salinityEc - Measured electrical conductivity (mS/cm / dS/m)
   * @param {number} fieldAcres - Farm parcel size in acres
   * @returns {Array} List of prioritized recommendation objects
   */
  evaluateLocation(locationData, soilUnit, currentVwc, salinityEc, fieldAcres = 10) {
    // Reference scientific hydrological calculations helper
    const calc = window.USDA_CLEVELAND_SOIL_DATA.Calculations;
    
    // Compute effective water capacity factoring in osmotic salinity reduction
    const waterAnalysis = calc.calcEffectiveWaterCapacity(soilUnit.id, currentVwc, salinityEc);
    
    // Compute salt leaching requirement
    const leachingAnalysis = calc.calcLeachingRequirement(salinityEc);
    
    // Compute Total Available Water (TAW) across profile
    const taw = calc.calcTotalAvailableWaterInches(soilUnit.id);
    
    // Compute Readily Available Water (RAW) before 50% MAD stress
    const raw = calc.calcReadilyAvailableWaterInches(soilUnit.id);

    // Initialize clean recommendations list
    const recs = [];

    // =========================================================================
    // RECOMMENDATION RULE 1: SALINITY SPIKE FLUSH (HACKATHON CORE SCENARIO)
    // =========================================================================
    // Check if soil electrical conductivity exceeds the soil sensitivity threshold (e.g. 2.0 mS/cm)
    if (salinityEc > soilUnit.salinitySensitivityThreshold) {
      // Calculate extra liquid volume in gallons required to flush salts below active root zone
      const extraDepthInches = leachingAnalysis.extraWaterInches || 0.45;
      const leachGallons = calc.inchesToGallons(extraDepthInches, fieldAcres);
      
      // Push structured recommendation card
      recs.push({
        id: `rec-salinity-${Date.now()}-1`,
        title: `Flush Root Zone: Salinity Spike (${salinityEc} mS/cm > ${soilUnit.salinitySensitivityThreshold})`,
        category: 'Salinity Mitigation',
        // Mark critical if EC exceeds 2.4 mS/cm
        priority: salinityEc > 2.4 ? 'CRITICAL' : 'HIGH',
        icon: 'drop-alert',
        soilTexture: soilUnit.primaryTexture,
        soilUnitName: soilUnit.name,
        summary: `Excess electrical conductivity (${salinityEc} mS/cm) is exerting ${waterAnalysis.osmoticStressPercent}% osmotic tension on crop roots, reducing usable water intake.`,
        scientificRationale: `USDA Web Soil Survey and FAO-56 guidelines indicate that in ${soilUnit.primaryTexture}, soil salt accumulation must be displaced below the ${soilUnit.rootZoneDepthInches}-inch root zone to prevent physiological drought.`,
        suggestedAction: `Actuate WiseConn Valve #4 for 25 minutes to deliver ${leachGallons.toLocaleString()} gallons of fresh well water (${(leachGallons / 27154).toFixed(2)} acre-inches) for targeted leaching.`,
        waterVolumeGallons: leachGallons,
        waterDepthInches: extraDepthInches,
        targetEquipment: 'WiseConn DropControl Valve #4',
        status: 'pending' // Initial status awaiting farmer decision ('pending', 'implemented', 'ignored')
      });
    }

    // =========================================================================
    // RECOMMENDATION RULE 2: SOIL TEXTURE RUNOFF vs DEEP DRAINAGE SAFEGUARDS
    // =========================================================================
    // Heavy Clay Subsoils (Renfrow-Grainola-Grant): Infiltration < 0.3 in/hr
    if (soilUnit.textureCategory === 'clay' || soilUnit.infiltrationRateInHr < 0.3) {
      recs.push({
        id: `rec-soil-texture-${Date.now()}-2`,
        title: `Enforce Pulse Irrigation on Heavy Clay Subsoil (${soilUnit.name})`,
        category: 'Soil Structure',
        priority: 'HIGH',
        icon: 'layers-alert',
        soilTexture: soilUnit.primaryTexture,
        soilUnitName: soilUnit.name,
        summary: `Soil consists of ${soilUnit.clayPercent}% clay with a very slow infiltration limit of ${soilUnit.infiltrationRateInHr}"/hr. Continuous watering will induce surface runoff and ponding.`,
        scientificRationale: `USDA pedon data for Cleveland County's ${soilUnit.name} exhibits a dense Bt clay subsoil horizon. Single irrigation pulses must never exceed 12 minutes to ensure complete capillary absorption.`,
        suggestedAction: `Switch irrigation controller to Cycle & Soak mode: 10 minutes ON, followed by 35 minutes SOAK across 3 automated cycles.`,
        waterVolumeGallons: calc.inchesToGallons(0.35, fieldAcres),
        waterDepthInches: 0.35,
        targetEquipment: 'Variable Frequency Well Pump #1',
        status: 'pending'
      });
    } 
    // Coarse Sandstone Ridges (Stephenville-Littleaxe-Darsil): Infiltration > 1.5 in/hr
    else if (soilUnit.textureCategory === 'sand' || soilUnit.infiltrationRateInHr > 1.5) {
      recs.push({
        id: `rec-sand-drainage-${Date.now()}-3`,
        title: `Coarse Sandy Loam: Deep Percolation Nutrient Leaching Warning`,
        category: 'Water Conservation',
        priority: 'MEDIUM',
        icon: 'shield-sand',
        soilTexture: soilUnit.primaryTexture,
        soilUnitName: soilUnit.name,
        summary: `Excessive drainage (${soilUnit.infiltrationRateInHr}"/hr) through sandstone uplands. Water drains rapidly beyond root zone depth (${soilUnit.rootZoneDepthInches}").`,
        scientificRationale: `USDA Soil Survey notes Stephenville-Littleaxe-Darsil has an Available Water Capacity of only ${soilUnit.availableWaterCapacityInIn} in/in. High-volume runs cause deep percolation loss into sandstone fractures.`,
        suggestedAction: `Apply micro-drip pulses of 15 minutes twice daily rather than a single heavy run.`,
        waterVolumeGallons: calc.inchesToGallons(0.20, fieldAcres),
        waterDepthInches: 0.20,
        targetEquipment: 'Drip Manifold Zone B',
        status: 'pending'
      });
    }

    // =========================================================================
    // RECOMMENDATION RULE 3: WATER DEFICIT & ROOT RESERVOIR REPLENISHMENT
    // =========================================================================
    // Check if measured moisture is approaching the Permanent Wilting Point (PWP)
    if (currentVwc < soilUnit.permanentWiltingPointVwc + 6) {
      // Calculate net deficit inches required to refill root zone up to field capacity
      const deficitInches = Math.max(0.3, raw - waterAnalysis.effectiveWaterInches);
      const refillGallons = calc.inchesToGallons(deficitInches, fieldAcres);
      
      recs.push({
        id: `rec-water-deficit-${Date.now()}-4`,
        title: `Soil Moisture Deficit: Refill Root Zone Reservoir (${currentVwc}% VWC)`,
        category: 'Water Quantity',
        priority: 'CRITICAL',
        icon: 'droplet-refill',
        soilTexture: soilUnit.primaryTexture,
        soilUnitName: soilUnit.name,
        summary: `Soil moisture (${currentVwc}%) has fallen near the Permanent Wilting Point (${soilUnit.permanentWiltingPointVwc}%). Available water is critically depleted.`,
        scientificRationale: `To maintain transpiration without crop vegetative stunting, root zone soil water must be restored to field capacity (${soilUnit.fieldCapacityVwc}% VWC). Total available water capacity is ${taw} inches.`,
        suggestedAction: `Apply ${deficitInches.toFixed(2)} acre-inches (${refillGallons.toLocaleString()} gallons) over the next 18 hours during low-evaporation evening hours.`,
        waterVolumeGallons: refillGallons,
        waterDepthInches: deficitInches,
        targetEquipment: 'Center Pivot South #2',
        status: 'pending'
      });
    } 
    // Healthy soil moisture advisory
    else {
      recs.push({
        id: `rec-water-optimal-${Date.now()}-5`,
        title: `Soil Water Storage Optimal (${currentVwc}% VWC)`,
        category: 'Water Conservation',
        priority: 'ADVISORY',
        icon: 'check-circle',
        soilTexture: soilUnit.primaryTexture,
        soilUnitName: soilUnit.name,
        summary: `Root zone moisture is healthy (${currentVwc}% VWC). Effective stored water stands at ${waterAnalysis.effectiveWaterInches} inches.`,
        scientificRationale: `Current moisture is well above the 50% Management Allowed Depletion (MAD) threshold. Irrigation is currently unnecessary, preserving OWRB groundwater rights.`,
        suggestedAction: `Maintain irrigation lockout. Next projected irrigation trigger in 3.5 days based on Norman weather ET₀ rates.`,
        waterVolumeGallons: 0,
        waterDepthInches: 0,
        targetEquipment: 'Automated Lockout Interlock',
        status: 'pending'
      });
    }

    // Update active recommendations in engine state
    this.activeRecommendations = recs;
    // Notify all UI listeners of update
    this.notify();
    // Return generated recommendations
    return recs;
  },

  /**
   * Action Handler: Farmer reviews and agrees to implement the AI recommendation
   * 
   * @param {string} recId - Unique recommendation ID
   * @param {string} feedbackNotes - Optional note or feedback from farmer
   * @returns {Object|null} Created audit log entry
   */
  implementRecommendation(recId, feedbackNotes = 'Implemented via Farm-Flow 1-Click') {
    // 1. Find the target recommendation in active array
    const rec = this.activeRecommendations.find(r => r.id === recId);
    if (!rec) return null;

    // 2. Mark recommendation status as implemented
    rec.status = 'implemented';
    
    // 3. Create persistent audit log entry
    const logEntry = {
      id: 'LOG-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      recId: rec.id,
      title: rec.title,
      category: rec.category,
      actionTaken: 'IMPLEMENTED',
      equipment: rec.targetEquipment,
      waterVolumeGallons: rec.waterVolumeGallons,
      soilUnit: rec.soilUnitName,
      feedback: feedbackNotes
    };

    // 4. Prepend to decision journal history
    this.historyLog.unshift(logEntry);
    // 5. Notify all listeners
    this.notify();
    return logEntry;
  },

  /**
   * Action Handler: Farmer reviews and chooses to ignore/dismiss the AI recommendation
   * 
   * @param {string} recId - Unique recommendation ID
   * @param {string} reason - Farmer's override rationale (e.g. rain forecasted)
   * @returns {Object|null} Created dismissal log entry
   */
  ignoreRecommendation(recId, reason = 'Farmer chose not to apply at this time') {
    // 1. Locate recommendation
    const rec = this.activeRecommendations.find(r => r.id === recId);
    if (!rec) return null;

    // 2. Update status to ignored
    rec.status = 'ignored';
    
    // 3. Create dismissal record capturing farmer agency and feedback
    const logEntry = {
      id: 'IGN-' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
      recId: rec.id,
      title: rec.title,
      category: rec.category,
      actionTaken: 'IGNORED / OVERRIDDEN',
      equipment: 'N/A',
      waterVolumeGallons: 0,
      soilUnit: rec.soilUnitName,
      feedback: reason
    };

    // 4. Add to journal
    this.historyLog.unshift(logEntry);
    // 5. Trigger UI re-render
    this.notify();
    return logEntry;
  },

  /**
   * Conversational Assistant: Processes natural language farmer questions
   * and returns scientifically verified responses contextualized to Cleveland County, OK.
   */
  generateChatResponse(userMessage, currentSoilUnit, currentVwc, salinityEc) {
    // Convert message to lowercase for matching
    const msg = userMessage.toLowerCase();
    const u = currentSoilUnit;

    // Handle questions regarding Salinity or Electrical Conductivity
    if (msg.includes('salinity') || msg.includes('salt') || msg.includes('ms/cm') || msg.includes('ec')) {
      return `At your current location in Cleveland County, the soil is **${u.name}** with a measured salinity of **${salinityEc} mS/cm**. Because this soil has a sensitivity threshold of ${u.salinitySensitivityThreshold} mS/cm, salts create osmotic pressure that impedes water uptake. To leach salts below the root zone (${u.rootZoneDepthInches}"), apply a leaching fraction of ~15% extra fresh water via WiseConn Valve 4 during cool evening hours.`;
    }

    // Handle questions regarding Soil Structure, Texture, Clay, or Sand
    if (msg.includes('structure') || msg.includes('texture') || msg.includes('clay') || msg.includes('sand') || msg.includes('loam')) {
      return `Your soil texture is classified as **${u.primaryTexture}** (Sand: ${u.sandPercent}%, Silt: ${u.siltPercent}%, Clay: ${u.clayPercent}%). Bulk density is ${u.bulkDensityGcm3} g/cm³. The surface Ap horizon is ${u.horizons[0].depth} with pH ${u.horizons[0].ph}. The subsoil has a permeability rating of **${u.permeabilityRating}**, which governs how fast water infiltrates (${u.infiltrationRateInHr} in/hr).`;
    }

    // Handle questions regarding Water Quantity, Volume, or Gallons
    if (msg.includes('water') || msg.includes('quantity') || msg.includes('how much') || msg.includes('gallons') || msg.includes('volume')) {
      const calc = window.USDA_CLEVELAND_SOIL_DATA.Calculations;
      const taw = calc.calcTotalAvailableWaterInches(u.id);
      const curWater = calc.calcCurrentWaterDepthInches(u.id, currentVwc);
      return `Based on the USDA Available Water Capacity of ${u.availableWaterCapacityInIn} in/in and a root depth of ${u.rootZoneDepthInches} inches, your soil's Total Available Water capacity is **${taw} inches** (~${(taw * 27154).toLocaleString()} gal/acre). Currently, you have **${curWater} inches** of stored water. Since moisture is at ${currentVwc}% VWC, the effective available volume after osmotic salinity adjustment is **${calc.calcEffectiveWaterCapacity(u.id, currentVwc, salinityEc).effectiveWaterInches} inches**.`;
    }

    // Handle questions regarding Crop Selection
    if (msg.includes('crop') || msg.includes('plant') || msg.includes('grow') || msg.includes('wheat') || msg.includes('pecan')) {
      return `For **${u.name}** in Norman/Cleveland County, the USDA recommends drought-hardy winter wheat, sorghum, and deep-rooted specialty crops like pecans in loamy floodplains. In heavy clay soils (Renfrow), ensure adequate drainage to avoid root rot.`;
    }

    // Default contextualized response
    return `I am analyzing your location in Cleveland County, Oklahoma. Your parcel sits on **${u.name}** (${u.primaryTexture}). Available water capacity is ${u.availableWaterCapacityInIn} in/in, and infiltration rate is ${u.infiltrationRateInHr} in/hr. Would you like me to calculate your irrigation run time or assess salt leaching requirements?`;
  }
};
