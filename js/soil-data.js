/**
 * Farm-Flow: Cleveland County, OK (Norman) NRCS Soil Data & Hydrology Matrix
 * Based on 1987 USDA NRCS Cleveland County Soil Survey & Oklahoma State University Soil Tests
 */

export const CLEVELAND_COUNTY_SOILS = {
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
    infiltrationRateInHr: 1.1, // inches per hour
    availableWaterCapacity: 0.15, // in/in
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

/**
 * Detailed Konawa Series Horizon Breakdown (Official NRCS Pedon Specification)
 */
export const KONAWA_SERIES_PROFILE = {
  seriesName: 'Konawa Fine-Loamy Ultic Haplustalf',
  classification: 'Fine-loamy, mixed, active, thermic Ultic Haplustalf',
  drainage: 'Well drained, moderately permeable',
  bedrockDepthInches: '> 80',
  horizons: [
    {
      horizon: 'Ap',
      depthCm: '0–23',
      depthInches: '0–9',
      color: 'Dark brown (7.5YR 3/2)',
      texture: 'Fine sandy loam',
      structure: 'Weak fine granular',
      reaction: 'Slightly acid (pH 6.1)',
      clayPercent: 12,
      cec: 8.5
    },
    {
      horizon: 'E',
      depthCm: '23–43',
      depthInches: '9–17',
      color: 'Reddish brown (5YR 4/4)',
      texture: 'Fine sandy loam',
      structure: 'Weak fine granular',
      reaction: 'Slightly acid (pH 6.0)',
      clayPercent: 14,
      cec: 7.2
    },
    {
      horizon: 'Bt',
      depthCm: '43–135',
      depthInches: '17–53',
      color: 'Dark red (2.5YR 3/6)',
      texture: 'Sandy clay loam',
      structure: 'Moderate medium subangular blocky',
      reaction: 'Moderately acid (pH 5.8)',
      clayPercent: 24,
      cec: 19.5
    },
    {
      horizon: 'BC',
      depthCm: '135–183',
      depthInches: '53–72',
      color: 'Red (2.5YR 4/6)',
      texture: 'Fine sandy loam',
      structure: 'Weak coarse subangular blocky',
      reaction: 'Neutral (pH 6.8)',
      clayPercent: 15,
      cec: 12.0
    }
  ],
  oklahomaMedianBaseline: {
    soilPh: 6.2,
    nitrateN_lbAcre: 8,
    phosphorusSTP: 32,
    potassiumSTK: 233,
    organicMatterPercent: 1.05
  }
};

/**
 * Hydrology & Water Quantity Calculations for Farm-Flow Node Engine
 */
export const HydrologyCalculations = {
  calcMaxApplicationDepthInches(soilInfiltrationRateInHr, applicationDurationMinutes) {
    const hours = applicationDurationMinutes / 60;
    return Number((soilInfiltrationRateInHr * hours * 0.85).toFixed(2));
  },

  gallonsToAcreFeet(gallons) {
    return Number((gallons / 325851).toFixed(4));
  },

  gallonsToAcreInches(gallons) {
    return Number((gallons / 27154).toFixed(3));
  },

  acreInchesToGallons(acreInches) {
    return Math.round(acreInches * 27154);
  },

  calcRequiredRunMinutes(netDeficitInches, fieldAcres, systemFlowRateGpm, irrigationEfficiency = 0.85) {
    if (netDeficitInches <= 0 || systemFlowRateGpm <= 0) return { runMinutes: 0, totalGallons: 0, acreFeet: 0 };
    const requiredGallons = (netDeficitInches * 27154 * fieldAcres) / irrigationEfficiency;
    const runMinutes = Math.round(requiredGallons / systemFlowRateGpm);
    return {
      runMinutes,
      totalGallons: Math.round(requiredGallons),
      acreFeet: Number((requiredGallons / 325851).toFixed(3))
    };
  },

  calculateCycleAndSoak(intendedRunMinutes, soilUnitKey) {
    const soil = CLEVELAND_COUNTY_SOILS[soilUnitKey] || CLEVELAND_COUNTY_SOILS['stephenville-harrah-newalla'];
    if (soil.infiltrationRateInHr < 0.3) {
      const cycleTime = 12;
      const cycles = Math.ceil(intendedRunMinutes / cycleTime);
      return {
        cycles,
        onMinutes: cycleTime,
        soakMinutes: 35,
        totalElapsedMinutes: cycles * (cycleTime + 35) - 35,
        note: `Heavy clay subsoil (${soil.name}). Strict pulse irrigation enforced to prevent surface runoff.`
      };
    } else if (soil.infiltrationRateInHr < 0.8) {
      const cycleTime = 25;
      const cycles = Math.ceil(intendedRunMinutes / cycleTime);
      return {
        cycles,
        onMinutes: cycleTime,
        soakMinutes: 20,
        totalElapsedMinutes: cycles * (cycleTime + 20) - 20,
        note: `Loamy soil (${soil.name}). 20-minute soak recommended to maintain uniform root zone infiltration.`
      };
    } else {
      return {
        cycles: 1,
        onMinutes: intendedRunMinutes,
        soakMinutes: 0,
        totalElapsedMinutes: intendedRunMinutes,
        note: `Well-drained sandy loam (${soil.name}). Direct continuous run permitted without surface ponding.`
      };
    }
  }
};
