/**
 * ==============================================================================
 * FARM-FLOW: USDA NRCS CLEVELAND COUNTY, OKLAHOMA SOIL & WATER SCIENCE DATABASE
 * ==============================================================================
 * This module encapsulates the 1987 USDA NRCS Soil Survey for Cleveland County,
 * Oklahoma, physical pedon horizon definitions, and scientific hydrological formulas.
 * 
 * Every parameter, object, and calculation is thoroughly documented below
 * to provide a clear understanding of water quantity dynamics and optimization.
 * ==============================================================================
 */

// Bind to window object for zero-dependency global accessibility across components
window.USDA_CLEVELAND_SOIL_DATA = {
  
  /**
   * ----------------------------------------------------------------------------
   * 1. GEOREFERENCED SAMPLE LOCATIONS ACROSS CLEVELAND COUNTY, OKLAHOMA
   * ----------------------------------------------------------------------------
   * These sample parcels represent real agricultural, watershed, and prairie zones
   * within Cleveland County, centered around Norman, Noble, Moore, and Lexington.
   */
  sampleLocations: [
    {
      // Unique location identifier
      id: 'norman-central',
      // Human-readable farm title
      name: 'Central Norman Research Farmland',
      // Regional geographic description within Cleveland County
      area: 'Norman Uplands',
      // GPS Latitude coordinate (Norman center)
      lat: 35.2226,
      // GPS Longitude coordinate
      lng: -97.4395,
      // Key linking to the dominant USDA soil map unit below
      soilUnitKey: 'stephenville-harrah-newalla',
      // Baseline soil salinity in electrical conductivity: dS/m or mS/cm
      defaultSalinity: 1.85,
      // Baseline volumetric water content (% VWC measured in root zone)
      moistureVwc: 18.2,
      // Representative regional crop rotation
      crop: 'Winter Wheat & Specialty Pecan'
    },
    {
      id: 'lake-thunderbird-east',
      name: 'Lake Thunderbird Watershed (Little Axe)',
      area: 'Eastern Cleveland County Sandstone',
      lat: 35.2150,
      lng: -97.2650,
      soilUnitKey: 'stephenville-littleaxe-darsil',
      defaultSalinity: 1.20,
      moistureVwc: 14.5,
      crop: 'Pasture & Forage Grasses'
    },
    {
      id: 'canadian-river-floodplain',
      name: 'South Canadian River Bottomland (Noble)',
      area: 'River Alluvial Valley',
      lat: 35.1380,
      lng: -97.3950,
      soilUnitKey: 'port-weswood',
      defaultSalinity: 2.45, // Elevated salinity due to shallow river alluvium
      moistureVwc: 28.0,
      crop: 'Alfalfa & Silage Corn'
    },
    {
      id: 'north-cleveland-moore',
      name: 'North Cleveland Prairie (Moore Border)',
      area: 'Rolling Prairie Divide',
      lat: 35.3385,
      lng: -97.4865,
      soilUnitKey: 'norge-teller-vanoss',
      defaultSalinity: 1.40,
      moistureVwc: 22.4,
      crop: 'Grain Sorghum & Soybeans'
    },
    {
      id: 'lexington-south',
      name: 'Lexington Uplands & Wildlife Corridor',
      area: 'Southern Cleveland County Ridge',
      lat: 35.0160,
      lng: -97.3320,
      soilUnitKey: 'renfrow-grainola-grant',
      defaultSalinity: 2.65, // Clay subsoil prone to salt retention
      moistureVwc: 19.8,
      crop: 'Rangeland & Bermuda Grass'
    },
    {
      id: 'norman-west-doolin',
      name: 'West Norman Loam Terraces',
      area: 'Ten Mile Flat & Doolin Uplands',
      lat: 35.2450,
      lng: -97.5100,
      soilUnitKey: 'doolin-bethany-urban',
      defaultSalinity: 2.15,
      moistureVwc: 21.0,
      crop: 'Cover Crops & Mixed Vegetables'
    }
  ],

  /**
   * ----------------------------------------------------------------------------
   * 2. OFFICIAL USDA NRCS 1987 SOIL MAP UNITS & PEDON HORIZON PROFILES
   * ----------------------------------------------------------------------------
   * Derived from the official Soil Survey of Cleveland County, Oklahoma.
   * Quantifies soil particle size fractions, bulk densities, root zone depths,
   * available water capacities (AWC), and infiltration limits.
   */
  soilUnits: {
    // ----------------- UNIT 1: STEPHENVILLE-HARRAH-NEWALLA (40%) -----------------
    'stephenville-harrah-newalla': {
      id: 'stephenville-harrah-newalla',
      name: 'Stephenville-Harrah-Newalla Unit',
      // Share of total Cleveland County land area (from 1987 NRCS survey text)
      countySharePercent: 40,
      // Dominant soil texture name according to USDA texture triangle
      primaryTexture: 'Fine Sandy Loam over Sandy Clay Loam',
      // Generalized category for UI filtering: 'sandy-loam' | 'clay' | 'loam' | 'sand'
      textureCategory: 'sandy-loam',
      // Particle fraction: Sand percentage (0.05 to 2.0 mm diameter particles)
      sandPercent: 62,
      // Particle fraction: Silt percentage (0.002 to 0.05 mm diameter particles)
      siltPercent: 24,
      // Particle fraction: Clay percentage (< 0.002 mm diameter particles)
      clayPercent: 14,
      // Soil dry mass per unit volume (g/cm³). Influences compaction and pore space.
      bulkDensityGcm3: 1.48,
      // Geological origin of parent minerals
      parentMaterial: 'Sandstone, colluvium, and shale',
      // Natural water movement through the soil profile
      drainageClass: 'Well Drained',
      // USDA permeability rating
      permeabilityRating: 'Moderate',
      // Maximum infiltration rate (inches/hour) before water begins to pool or runoff
      infiltrationRateInHr: 1.15,
      // Available Water Capacity: Inches of water stored per inch of soil depth
      availableWaterCapacityInIn: 0.15,
      // Effective active crop root penetration depth in inches
      rootZoneDepthInches: 36,
      // Field Capacity: Volumetric water content (% VWC) retained against gravity
      fieldCapacityVwc: 28.0,
      // Permanent Wilting Point: % VWC below which plant roots cannot extract moisture
      permanentWiltingPointVwc: 13.0,
      // Salinity threshold (mS/cm): EC level above which osmotic stress decreases yield
      salinitySensitivityThreshold: 2.0,
      description: 'The most extensive agricultural soil in Cleveland County (~40% of land area). Consists of well-drained upland fine sandy loams over sandstone bedrock.',
      // Morphological pedon horizon layer breakdown
      horizons: [
        { name: 'Ap', depth: '0–9 in (0–23 cm)', texture: 'Fine sandy loam', color: 'Dark brown 7.5YR 3/2', ph: 6.1, cec: 8.5, om: '1.2%' },
        { name: 'E', depth: '9–17 in (23–43 cm)', texture: 'Fine sandy loam', color: 'Reddish brown 5YR 4/4', ph: 6.0, cec: 7.2, om: '0.6%' },
        { name: 'Bt', depth: '17–53 in (43–135 cm)', texture: 'Sandy clay loam', color: 'Dark red 2.5YR 3/6', ph: 5.8, cec: 19.5, om: '0.3%' },
        { name: 'BC', depth: '53–72 in (135–183 cm)', texture: 'Fine sandy loam', color: 'Red 2.5YR 4/6', ph: 6.8, cec: 12.0, om: '0.1%' }
      ]
    },

    // ----------------- UNIT 2: RENFROW-GRAINOLA-GRANT (15%) -----------------
    'renfrow-grainola-grant': {
      id: 'renfrow-grainola-grant',
      name: 'Renfrow-Grainola-Grant Unit',
      countySharePercent: 15,
      primaryTexture: 'Silty Clay Loam to Dense Clay',
      textureCategory: 'clay',
      sandPercent: 18,
      siltPercent: 42,
      clayPercent: 40, // High clay content causes swelling and slow infiltration
      bulkDensityGcm3: 1.62,
      parentMaterial: 'Weathered shale, siltstone, and sandstone',
      drainageClass: 'Moderately Well to Poorly Drained',
      permeabilityRating: 'Very Slow (Clayey Subsoil)',
      infiltrationRateInHr: 0.18, // Very low rate: applying > 0.20 in/hr induces severe runoff
      availableWaterCapacityInIn: 0.18,
      rootZoneDepthInches: 28,
      fieldCapacityVwc: 36.0,
      permanentWiltingPointVwc: 20.0,
      salinitySensitivityThreshold: 1.8,
      description: 'Heavy clay soils on rolling prairie slopes. Subsoils are dense and swell when wet, creating high surface runoff risk and slow water intake.',
      horizons: [
        { name: 'A', depth: '0–7 in (0–18 cm)', texture: 'Silt loam', color: 'Dark grayish brown 10YR 4/2', ph: 6.4, cec: 16.0, om: '1.8%' },
        { name: 'Bt1', depth: '7–22 in (18–56 cm)', texture: 'Dense clay', color: 'Dark reddish brown 5YR 3/4', ph: 6.0, cec: 28.5, om: '0.8%' },
        { name: 'Bt2', depth: '22–45 in (56–114 cm)', texture: 'Clay', color: 'Red 2.5YR 4/6', ph: 6.7, cec: 24.0, om: '0.4%' },
        { name: 'C', depth: '45–60 in (114–152 cm)', texture: 'Shaly clay', color: 'Brownish yellow 10YR 6/6', ph: 7.2, cec: 18.0, om: '0.2%' }
      ]
    },

    // ----------------- UNIT 3: NORGE-TELLER-VANOSS (14%) -----------------
    'norge-teller-vanoss': {
      id: 'norge-teller-vanoss',
      name: 'Norge-Teller-Vanoss Unit',
      countySharePercent: 14,
      primaryTexture: 'Deep Loam and Silt Loam (Prime Farmland)',
      textureCategory: 'loam',
      sandPercent: 38,
      siltPercent: 44,
      clayPercent: 18,
      bulkDensityGcm3: 1.38,
      parentMaterial: 'Old loamy alluvium river terraces',
      drainageClass: 'Well Drained',
      permeabilityRating: 'Moderately Slow to Moderate',
      infiltrationRateInHr: 0.75,
      availableWaterCapacityInIn: 0.20, // Highest water holding capacity in county
      rootZoneDepthInches: 48,
      fieldCapacityVwc: 32.0,
      permanentWiltingPointVwc: 14.0,
      salinitySensitivityThreshold: 2.2,
      description: 'The highest quality agricultural soil in Cleveland County. Deep, fertile loams with high water storage capacity and optimal root penetration.',
      horizons: [
        { name: 'Ap', depth: '0–10 in (0–25 cm)', texture: 'Loam', color: 'Dark brown 7.5YR 3/2', ph: 6.3, cec: 14.5, om: '2.1%' },
        { name: 'BA', depth: '10–18 in (25–46 cm)', texture: 'Loam', color: 'Brown 7.5YR 4/4', ph: 6.2, cec: 15.0, om: '1.2%' },
        { name: 'Bt', depth: '18–48 in (46–122 cm)', texture: 'Clay loam', color: 'Reddish brown 5YR 4/4', ph: 6.0, cec: 22.0, om: '0.6%' },
        { name: 'BC', depth: '48–70 in (122–178 cm)', texture: 'Loam', color: 'Yellowish red 5YR 5/6', ph: 6.5, cec: 16.0, om: '0.2%' }
      ]
    },

    // ----------------- UNIT 4: DOOLIN-BETHANY-URBAN (8%) -----------------
    'doolin-bethany-urban': {
      id: 'doolin-bethany-urban',
      name: 'Doolin-Bethany-Urban Land Unit',
      countySharePercent: 8,
      primaryTexture: 'Silt Loam over Dense Claypan',
      textureCategory: 'clay',
      sandPercent: 25,
      siltPercent: 48,
      clayPercent: 27,
      bulkDensityGcm3: 1.55,
      parentMaterial: 'Old clayey and loamy alluvium on flat plains',
      drainageClass: 'Moderately Well Drained',
      permeabilityRating: 'Very Slow',
      infiltrationRateInHr: 0.15,
      availableWaterCapacityInIn: 0.16,
      rootZoneDepthInches: 30,
      fieldCapacityVwc: 34.0,
      permanentWiltingPointVwc: 18.0,
      salinitySensitivityThreshold: 1.9,
      description: 'Level uplands with a tight subsoil claypan that restricts vertical percolation. Prone to surface waterlogging during wet Oklahoma springs.',
      horizons: [
        { name: 'Ap', depth: '0–8 in (0–20 cm)', texture: 'Silt loam', color: 'Dark brown 10YR 3/3', ph: 6.2, cec: 15.2, om: '1.5%' },
        { name: 'Bt1', depth: '8–24 in (20–61 cm)', texture: 'Heavy clay', color: 'Dark grayish brown 10YR 4/2', ph: 6.0, cec: 30.0, om: '0.7%' },
        { name: 'Bt2', depth: '24–50 in (61–127 cm)', texture: 'Clay loam', color: 'Brown 7.5YR 4/4', ph: 6.8, cec: 22.5, om: '0.3%' }
      ]
    },

    // ----------------- UNIT 5: STEPHENVILLE-LITTLEAXE-DARSIL (7%) -----------------
    'stephenville-littleaxe-darsil': {
      id: 'stephenville-littleaxe-darsil',
      name: 'Stephenville-Littleaxe-Darsil Unit',
      countySharePercent: 7,
      primaryTexture: 'Coarse Sandy Loam over Sandstone Bedrock',
      textureCategory: 'sand',
      sandPercent: 78,
      siltPercent: 14,
      clayPercent: 8,
      bulkDensityGcm3: 1.45,
      parentMaterial: 'Sandstone ridges and hills',
      drainageClass: 'Somewhat Excessively Drained',
      permeabilityRating: 'Rapid',
      infiltrationRateInHr: 1.85, // High intake rate
      availableWaterCapacityInIn: 0.10, // Low water holding capacity
      rootZoneDepthInches: 24,
      fieldCapacityVwc: 18.0,
      permanentWiltingPointVwc: 7.0,
      salinitySensitivityThreshold: 1.5,
      description: 'Shallow, coarse upland soils common around Lake Thunderbird. Rapid drainage means water passes quickly through root zone, requiring frequent light pulses.',
      horizons: [
        { name: 'A', depth: '0–6 in (0–15 cm)', texture: 'Loamy sand', color: 'Brown 7.5YR 4/3', ph: 5.9, cec: 5.4, om: '0.8%' },
        { name: 'E', depth: '6–14 in (15–35 cm)', texture: 'Sandy loam', color: 'Reddish brown 5YR 5/4', ph: 5.7, cec: 4.8, om: '0.4%' },
        { name: 'R', depth: '14–30+ in (35–76 cm)', texture: 'Fractured sandstone bedrock', color: 'Reddish brown 2.5YR 4/4', ph: 6.2, cec: 2.0, om: '0.0%' }
      ]
    },

    // ----------------- UNIT 6: PORT-WESWOOD FLOODPLAIN (5%) -----------------
    'port-weswood': {
      id: 'port-weswood',
      name: 'Port-Weswood Alluvial Bottomland',
      countySharePercent: 5,
      primaryTexture: 'Deep Silt Loam & Loamy Alluvium',
      textureCategory: 'loam',
      sandPercent: 32,
      siltPercent: 52,
      clayPercent: 16,
      bulkDensityGcm3: 1.35,
      parentMaterial: 'Recent loamy alluvium along Canadian River',
      drainageClass: 'Well Drained (Subject to flooding)',
      permeabilityRating: 'Moderate',
      infiltrationRateInHr: 0.88,
      availableWaterCapacityInIn: 0.20,
      rootZoneDepthInches: 60, // Deepest profile in county
      fieldCapacityVwc: 35.0,
      permanentWiltingPointVwc: 15.0,
      salinitySensitivityThreshold: 2.0,
      description: 'Rich bottomland along the South Canadian River and Little River. Very deep and productive, with high available water capacity.',
      horizons: [
        { name: 'Ap', depth: '0–12 in (0–30 cm)', texture: 'Silt loam', color: 'Reddish brown 5YR 4/3', ph: 7.0, cec: 18.0, om: '2.4%' },
        { name: 'C1', depth: '12–36 in (30–91 cm)', texture: 'Silt loam', color: 'Reddish brown 5YR 4/4', ph: 7.2, cec: 17.5, om: '1.4%' },
        { name: 'C2', depth: '36–60 in (91–152 cm)', texture: 'Stratified loam and very fine sandy loam', color: 'Yellowish red 5YR 5/6', ph: 7.4, cec: 15.0, om: '0.8%' }
      ]
    }
  },

  /**
   * ----------------------------------------------------------------------------
   * 3. SCIENTIFIC HYDROLOGICAL & SALINITY FORMULAS
   * ----------------------------------------------------------------------------
   * Implements FAO-56 Irrigation and USDA NRCS Soil Mechanics equations.
   */
  Calculations: {
    /**
     * Compute Total Plant Available Water (TAW) in inches across the root zone
     * Formula: TAW (inches) = Available Water Capacity (in/in) * Root Depth (inches)
     * Line-by-line:
     * 1. Retrieve the soil unit object using its key.
     * 2. Multiply available water capacity by root zone depth.
     * 3. Round to 2 decimal places for precise agronomic display.
     */
    calcTotalAvailableWaterInches(soilUnitKey) {
      // 1. Fetch soil unit from database or fallback to Stephenville
      const u = window.USDA_CLEVELAND_SOIL_DATA.soilUnits[soilUnitKey] || window.USDA_CLEVELAND_SOIL_DATA.soilUnits['stephenville-harrah-newalla'];
      // 2. Multiply in/in capacity by root depth in inches
      const rawInches = u.availableWaterCapacityInIn * u.rootZoneDepthInches;
      // 3. Return formatted numeric value
      return Number(rawInches.toFixed(2));
    },

    /**
     * Compute Readily Available Water (RAW) before plant moisture stress occurs.
     * Management Allowed Depletion (MAD) is typically set to 50% (0.50) for field crops.
     * Formula: RAW = TAW * MAD fraction
     */
    calcReadilyAvailableWaterInches(soilUnitKey, madFraction = 0.50) {
      // 1. Compute total available water first
      const taw = this.calcTotalAvailableWaterInches(soilUnitKey);
      // 2. Multiply by allowable depletion threshold (e.g. 50%)
      return Number((taw * madFraction).toFixed(2));
    },

    /**
     * Compute Current Stored Water Depth (inches) based on measured Volumetric Water Content (% VWC)
     * Formula: Stored Water Depth = ((Current VWC - Permanent Wilting Point) / 100) * Root Depth
     */
    calcCurrentWaterDepthInches(soilUnitKey, currentVwc) {
      // 1. Retrieve soil properties
      const u = window.USDA_CLEVELAND_SOIL_DATA.soilUnits[soilUnitKey] || window.USDA_CLEVELAND_SOIL_DATA.soilUnits['stephenville-harrah-newalla'];
      // 2. Calculate moisture present above permanent wilting point (never negative)
      const extractableVwc = Math.max(0, currentVwc - u.permanentWiltingPointVwc);
      // 3. Convert percent fraction to linear water depth across root zone
      const depthInches = (extractableVwc / 100) * u.rootZoneDepthInches;
      // 4. Return formatted inches of stored water
      return Number(depthInches.toFixed(2));
    },

    /**
     * Convert Linear Water Depth (inches) over a field acreage to Liquid Volume (Gallons)
     * Conversion factor: 1 Acre-Inch = 27,154 U.S. Gallons
     */
    inchesToGallons(depthInches, fieldAcres) {
      // 1. Multiply depth in inches by standard acre-inch conversion factor (27,154)
      const gallonsPerAcre = depthInches * 27154;
      // 2. Multiply by total field acreage and round to nearest whole gallon
      return Math.round(gallonsPerAcre * fieldAcres);
    },

    /**
     * Salinity Impact on Plant Water Availability (Osmotic Potential Reduction)
     * High salt concentration in soil pore water creates osmotic tension.
     * This makes water physically present in soil unreachable to crop roots!
     * 
     * Formula:
     * If Salinity EC > Soil Threshold:
     *   Osmotic Reduction % = (Current EC - Threshold) * 15% per dS/m
     *   Effective Extractable Water = Physical Water * (1 - Osmotic Reduction %)
     */
    calcEffectiveWaterCapacity(soilUnitKey, currentVwc, salinityEc) {
      // 1. Retrieve target soil unit
      const u = window.USDA_CLEVELAND_SOIL_DATA.soilUnits[soilUnitKey] || window.USDA_CLEVELAND_SOIL_DATA.soilUnits['stephenville-harrah-newalla'];
      // 2. Compute physical water depth currently stored in root zone
      const physicalWaterInches = this.calcCurrentWaterDepthInches(soilUnitKey, currentVwc);
      
      // 3. Evaluate osmotic stress factor if salinity exceeds threshold
      let osmoticReduction = 0;
      if (salinityEc > u.salinitySensitivityThreshold) {
        // FAO-56 salinity depression slope (~15% reduction in transpiration per 1.0 dS/m excess)
        const excessSalinity = salinityEc - u.salinitySensitivityThreshold;
        osmoticReduction = Math.min(0.60, excessSalinity * 0.15); // capped at 60% maximum depression
      }

      // 4. Calculate actual effective water available to roots
      const effectiveWaterInches = Number((physicalWaterInches * (1 - osmoticReduction)).toFixed(2));

      // 5. Return complete analysis object
      return {
        physicalWaterInches,
        effectiveWaterInches,
        osmoticStressPercent: Math.round(osmoticReduction * 100),
        salinityStatus: salinityEc <= 1.5 ? 'Low (Optimal)' : salinityEc <= 2.2 ? 'Moderate' : 'High (Leaching Needed)'
      };
    },

    /**
     * USDA Leaching Requirement (LR) Formula
     * Calculates the additional fraction of irrigation water required to flush
     * accumulated salts past the root zone boundary to protect crop health.
     * 
     * Formula: LR = ECw / ((5 * ECe_target) - ECw)
     * Where:
     *   ECw = Electrical conductivity of irrigation water (assume 0.8 dS/m fresh well water)
     *   ECe_target = Target root zone salinity (e.g. 1.8 dS/m)
     */
    calcLeachingRequirement(currentSalinityEc, targetSalinityEc = 1.8, irrigationWaterEc = 0.8) {
      // 1. Check if current salinity is already below target threshold
      if (currentSalinityEc <= targetSalinityEc) {
        return { lrFraction: 0, extraWaterInches: 0, needed: false };
      }

      // 2. Compute denominator: (5 * ECe) - ECw
      const denominator = (5 * targetSalinityEc) - irrigationWaterEc;
      // 3. Compute leaching fraction (bounded between 5% and 35%)
      const lrFraction = Math.min(0.35, Math.max(0.05, Number((irrigationWaterEc / denominator).toFixed(3))));
      // 4. Compute recommended depth of leaching pulse in inches (typically 0.45" to 0.75")
      const extraWaterInches = Number((lrFraction * 1.8).toFixed(2));

      // 5. Return leaching prescription
      return {
        lrFraction,
        extraWaterInches,
        needed: true
      };
    }
  }
};
