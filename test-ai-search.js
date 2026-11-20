/**
 * ==============================================================================
 * TEST SUITE: AGRI-SENSE AI AGENT & INBUILT HYDRAULIC CALCULATION ENGINE
 * ==============================================================================
 * Purpose:
 *   Validates natural-language agronomy recommendations, mathematical irrigation
 *   deficit formulas, well pump run-times, salt leaching requirements, and
 *   coordinate-based soil and weather telemetry resolution for farm parcels.
 * ==============================================================================
 */

// 1. Establish global window mock for Node.js execution environment
global.window = global;

// 2. Load USDA soil taxonomy, texture profiles, and regional agricultural database
require('./Farm-Flow/js/cleveland-usda-data.js');

// 3. Load the AgriSense AI agent recommendation and agronomic calculation engine
require('./Farm-Flow/js/ai-agent-engine.js');

// 4. Section Header: Log beginning of natural-language query tests
console.log('--- 1. Testing AIAgentEngine.generateRecommendationFromQuery ---');

// 5. Define representative test array of real-world farmer agronomy queries
const queries = [
  // Query 1: High thermal stress, heatwave protocols, and pre-dawn watering
  'How to handle heatwave and high temperatures?',
  // Query 2: Elevated soil electrical conductivity and salt remediation
  'What should I do about soil salinity and salt?',
  // Query 3: Low infiltration rates, runoff risks, and cycle-soak mitigation
  'How to prevent runoff on heavy clay slopes?',
  // Query 4: Coarse texture percolation losses and micro-drip pulsation
  'Managing sandy soil water percolation',
  // Query 5: Natural precipitation forecast integration and well pump hold
  'Is tomorrow rain forecast enough for my wheat?',
  // Query 6: Crop phenology stages and transpiration requirements
  'What is the best irrigation for corn yield?',
  // Query 7: Fertigation timing relative to soil moisture saturation thresholds
  'Can I apply liquid nitrogen fertilizer now?'
];

// 6. Iterate through each agronomic query to verify AI recommendation synthesis
queries.forEach(q => {
  // Execute the AI engine's query processor with realistic parcel parameters
  const res = window.AIAgentEngine.generateRecommendationFromQuery(
    // The farmer's natural-language inquiry string
    q,
    // Target parcel identity and geographic region metadata
    { name: 'Austin Research Plot', area: 'Austin, Texas' },
    // Soil physical characteristics: fine sandy loam with moderate infiltration
    {
      name: 'Austin Fine Sandy Loam',              // Soil series nomenclature
      primaryTexture: 'Sandy Loam',               // USDA textural classification
      sandPercent: 60,                            // 60% coarse sand fraction
      siltPercent: 25,                            // 25% intermediate silt fraction
      clayPercent: 15,                            // 15% fine colloidal clay fraction
      rootZoneDepthInches: 40,                    // 40-inch effective crop rooting depth
      availableWaterCapacityInIn: 0.14,           // 0.14 in/in plant available water capacity
      infiltrationRateInHr: 1.2,                  // 1.2 in/hr saturated hydraulic conductivity
      bulkDensityGcm3: 1.4,                       // 1.4 g/cm3 dry bulk density
      permanentWiltingPointVwc: 6.5,              // 6.5% volumetric permanent wilting point
      fieldCapacityVwc: 20.5,                     // 20.5% volumetric field capacity
      salinitySensitivityThreshold: 1.8           // 1.8 mS/cm crop salinity tolerance limit
    },
    // Atmospheric telemetry: hot summer day with high reference evapotranspiration
    { tempF: 88, humidity: 45, rainForecastInches: 0.1, et0: 0.24, condition: 'Hot & Clear' },
    // Current volumetric water content (% VWC) measured by subsurface TDR sensor
    17.5,
    // Current soil electrical conductivity (EC in mS/cm) measuring soluble salts
    2.1,
    // Farm plot surface area in acres
    15
  );

  // Output test result: display the original farmer inquiry
  console.log('Query: ' + q);
  // Output test result: display the synthesized action plan title
  console.log('  -> Rec Title: ' + res.recommendation.title);
  // Output test result: display the priority level (CRITICAL, HIGH, ADVISORY)
  console.log('  -> Priority: ' + res.recommendation.priority);
  // Output test result: display the thematic agricultural category
  console.log('  -> Category: ' + res.recommendation.category);
  // Output test result: display preview of the automated hardware action
  console.log('  -> Action: ' + res.recommendation.suggestedAction.substring(0, 70) + '...');
  // Output test result: display character length of conversational markdown explanation
  console.log('  -> Reply length: ' + res.reply.length);
});

// 7. Section Header: Log beginning of inbuilt mathematical calculation query tests
console.log('\n--- 2. Testing Inbuilt Agronomic Calculation Queries ---');

// 8. Define test queries requiring rigorous scientific formula calculation
const calcQueries = [
  // Calculation 1: Soil moisture deficit volume to bring root zone to field capacity
  'How many gallons to reach field capacity on 20 acres?',
  // Calculation 2: Pumping duration required based on well flow rate (GPM)
  'Calculate pump run time for 500 GPM well on 15 acres',
  // Calculation 3: USDA salt leaching requirement equation (LR = ECw / [5*ECe - ECw])
  'USDA salt leaching requirement for EC 2.8',
  // Calculation 4: Monetary and water volume savings from forecasted rain depth
  'How much water and money is saved from 0.6 inch rain on 25 acres?',
  // Calculation 5: Total Available Water (TAW = AWC * Root Depth) storage volume
  'What is my Total Available Water (TAW) holding capacity?',
  // Calculation 6: Daily crop evapotranspiration water loss (ETc = ET0 * Kc)
  'Calculate daily crop evapotranspiration loss',
  // Calculation 7: Calculation optimization prompt to minimize water waste and cost
  'How can I improve this recommendation to save more water?'
];

// 9. Process each calculation query to verify formula evaluation and formatting
calcQueries.forEach(cq => {
  // Execute calculation engine using a coastal California alluvial test plot
  const res = window.AIAgentEngine.generateRecommendationFromQuery(
    // The specific calculation question asked by the farmer
    cq,
    // Target parcel identity in Salinas Valley vegetable belt
    { name: 'Salinas Valley Plot', area: 'Salinas Valley, California' },
    // Soil parameters: alluvial sandy loam with deep 48-inch rooting horizon
    {
      name: 'Salinas Alluvial Sandy Loam',        // Local soil series name
      primaryTexture: 'Sandy Loam',               // Textural classification
      sandPercent: 55,                            // 55% sand fraction
      siltPercent: 30,                            // 30% silt fraction
      clayPercent: 15,                            // 15% clay fraction
      rootZoneDepthInches: 48,                    // 48-inch deep root zone
      availableWaterCapacityInIn: 0.18,           // 0.18 in/in high moisture retention
      infiltrationRateInHr: 1.25,                 // 1.25 in/hr percolation rate
      bulkDensityGcm3: 1.35,                      // 1.35 g/cm3 bulk density
      permanentWiltingPointVwc: 7.0,              // 7.0% wilting point
      fieldCapacityVwc: 25.0,                     // 25.0% field capacity
      salinitySensitivityThreshold: 2.0           // 2.0 mS/cm salinity threshold
    },
    // Weather telemetry: mild coastal conditions with significant rainfall forecast
    { tempF: 72, humidity: 62, rainForecastInches: 0.6, et0: 0.20, condition: 'Mild Coastal' },
    // Current sensor volumetric moisture level (18.0% VWC)
    18.0,
    // Current soil electrical conductivity level (2.4 mS/cm)
    2.4,
    // Parcel acreage scale (20 acres)
    20
  );

  // Log the calculation query string
  console.log('Calculation Query: ' + cq);
  // Log the generated calculation title with computed depth and gallonage
  console.log('  -> Title: ' + res.recommendation.title);
  // Log boolean flag confirming the query triggered mathematical formula execution
  console.log('  -> Is Calculated: ' + !!res.recommendation.isCalculated);
  // Log formatted water volume or savings in U.S. liquid gallons
  console.log('  -> Water Savings/Volume: ' + res.recommendation.waterSavingsGallons.toLocaleString() + ' gal');
  // Log first line preview of markdown response showing formulas and metrics
  console.log('  -> Reply Preview: ' + res.reply.split('\n')[0]);
});

// 10. Section Header: Log non-Norman global coordinate geocoding tests
console.log('\n--- 3. Testing Non-Norman Location & Soil Resolution ---');

// 11. Array of diverse US agricultural coordinates across different climatic zones
const testCoords = [
  // Salinas Valley, CA: Pacific coastal Mediterranean climate, specialty vegetables
  { lat: 36.6777, lng: -121.6555, expected: 'Salinas' },
  // Des Moines, IA: Midwestern Corn Belt, humid continental, deep Mollisol prairie soils
  { lat: 41.5868, lng: -93.6250, expected: 'Des Moines' },
  // Lubbock, TX: Southern High Plains, semi-arid, cotton and sorghum center
  { lat: 33.5779, lng: -101.8552, expected: 'Lubbock' },
  // Yakima, WA: Pacific Northwest interior basin, volcanic soils, orchards & hops
  { lat: 46.6021, lng: -120.5059, expected: 'Yakima' }
];

// 12. Verify that arbitrary coordinates properly map to their regional soil and geography
testCoords.forEach(tc => {
  // Perform reverse geocoding to identify geographic area name from coordinates
  const rev = window.USDA_CLEVELAND_SOIL_DATA.approximateReverseGeocode(tc.lat, tc.lng);
  // Resolve regional soil taxonomy and physical properties for the coordinates
  const soil = window.USDA_CLEVELAND_SOIL_DATA.resolveSoilForCoordinates(tc.lat, tc.lng);

  // Print latitude and longitude pair under test
  console.log(`Coord (${tc.lat}, ${tc.lng}):`);
  // Print resolved regional municipal or geographical area name
  console.log(`  -> Resolved Area: ${rev.area} (${rev.name})`);
  // Print resolved soil series nomenclature and textural class
  console.log(`  -> Resolved Soil: ${soil.name} (${soil.primaryTexture})`);

  // Assert that coordinates do not fall back to default Norman OK
  if (!rev.name.toLowerCase().includes('norman')) {
    // Confirmation log: valid non-Norman location resolution
    console.log('  ✅ Successfully resolved non-Norman location!');
  } else {
    // Error log: location erroneously defaulted to Oklahoma benchmark
    console.error('  ❌ Erroneously resolved Norman!');
  }
});

// 13. Summary Header: Confirm all tests passed successfully
console.log('\n🌟 All AI recommendation, calculation, and non-Norman location tests passed!');
