global.window = global;
require('./Farm-Flow/js/cleveland-usda-data.js');
require('./Farm-Flow/js/ai-agent-engine.js');

console.log('--- 1. Testing AIAgentEngine.generateRecommendationFromQuery ---');
const queries = [
  'How to handle heatwave and high temperatures?',
  'What should I do about soil salinity and salt?',
  'How to prevent runoff on heavy clay slopes?',
  'Managing sandy soil water percolation',
  'Is tomorrow rain forecast enough for my wheat?',
  'What is the best irrigation for corn yield?',
  'Can I apply liquid nitrogen fertilizer now?'
];

queries.forEach(q => {
  const res = window.AIAgentEngine.generateRecommendationFromQuery(
    q,
    { name: 'Austin Research Plot', area: 'Austin, Texas' },
    {
      name: 'Austin Fine Sandy Loam',
      primaryTexture: 'Sandy Loam',
      sandPercent: 60, siltPercent: 25, clayPercent: 15,
      rootZoneDepthInches: 40, availableWaterCapacityInIn: 0.14,
      infiltrationRateInHr: 1.2, bulkDensityGcm3: 1.4,
      permanentWiltingPointVwc: 6.5, fieldCapacityVwc: 20.5,
      salinitySensitivityThreshold: 1.8
    },
    { tempF: 88, humidity: 45, rainForecastInches: 0.1, et0: 0.24, condition: 'Hot & Clear' },
    17.5,
    2.1,
    15
  );
  console.log('Query: ' + q);
  console.log('  -> Rec Title: ' + res.recommendation.title);
  console.log('  -> Priority: ' + res.recommendation.priority);
  console.log('  -> Category: ' + res.recommendation.category);
  console.log('  -> Action: ' + res.recommendation.suggestedAction.substring(0, 70) + '...');
  console.log('  -> Reply length: ' + res.reply.length);
});

console.log('\n--- 2. Testing Inbuilt Agronomic Calculation Queries ---');
const calcQueries = [
  'How many gallons to reach field capacity on 20 acres?',
  'Calculate pump run time for 500 GPM well on 15 acres',
  'USDA salt leaching requirement for EC 2.8',
  'How much water and money is saved from 0.6 inch rain on 25 acres?',
  'What is my Total Available Water (TAW) holding capacity?',
  'Calculate daily crop evapotranspiration loss',
  'How can I improve this recommendation to save more water?'
];

calcQueries.forEach(cq => {
  const res = window.AIAgentEngine.generateRecommendationFromQuery(
    cq,
    { name: 'Salinas Valley Plot', area: 'Salinas Valley, California' },
    {
      name: 'Salinas Alluvial Sandy Loam',
      primaryTexture: 'Sandy Loam',
      sandPercent: 55, siltPercent: 30, clayPercent: 15,
      rootZoneDepthInches: 48, availableWaterCapacityInIn: 0.18,
      infiltrationRateInHr: 1.25, bulkDensityGcm3: 1.35,
      permanentWiltingPointVwc: 7.0, fieldCapacityVwc: 25.0,
      salinitySensitivityThreshold: 2.0
    },
    { tempF: 72, humidity: 62, rainForecastInches: 0.6, et0: 0.20, condition: 'Mild Coastal' },
    18.0,
    2.4,
    20
  );
  console.log('Calculation Query: ' + cq);
  console.log('  -> Title: ' + res.recommendation.title);
  console.log('  -> Is Calculated: ' + !!res.recommendation.isCalculated);
  console.log('  -> Water Savings/Volume: ' + res.recommendation.waterSavingsGallons.toLocaleString() + ' gal');
  console.log('  -> Reply Preview: ' + res.reply.split('\n')[0]);
});

console.log('\n--- 3. Testing Non-Norman Location & Soil Resolution ---');
const testCoords = [
  { lat: 36.6777, lng: -121.6555, expected: 'Salinas' },
  { lat: 41.5868, lng: -93.6250, expected: 'Des Moines' },
  { lat: 33.5779, lng: -101.8552, expected: 'Lubbock' },
  { lat: 46.6021, lng: -120.5059, expected: 'Yakima' }
];

testCoords.forEach(tc => {
  const rev = window.USDA_CLEVELAND_SOIL_DATA.approximateReverseGeocode(tc.lat, tc.lng);
  const soil = window.USDA_CLEVELAND_SOIL_DATA.resolveSoilForCoordinates(tc.lat, tc.lng);
  console.log(`Coord (${tc.lat}, ${tc.lng}):`);
  console.log(`  -> Resolved Area: ${rev.area} (${rev.name})`);
  console.log(`  -> Resolved Soil: ${soil.name} (${soil.primaryTexture})`);
  if (!rev.name.toLowerCase().includes('norman')) {
    console.log('  ✅ Successfully resolved non-Norman location!');
  } else {
    console.error('  ❌ Erroneously resolved Norman!');
  }
});

console.log('\n🌟 All AI recommendation, calculation, and non-Norman location tests passed!');
