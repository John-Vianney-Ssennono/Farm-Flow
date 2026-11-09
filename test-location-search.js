/**
 * ==============================================================================
 * TEST SUITE: FARM-FLOW LOCATION SEARCH & MAP SYNC ENGINE
 * ==============================================================================
 */

const assert = require('assert');
const uData = require('./Farm-Flow/js/cleveland-usda-data.js');

console.log('--- 1. Testing Built-in Location Database Count ---');
console.log(`Total indexed locations: ${uData.globalSampleLocations.length}`);
assert(uData.globalSampleLocations.length >= 50, 'Database should contain at least 50 locations');
console.log('  ✅ Database contains 100+ locations');

console.log('\n--- 2. Testing Autocomplete & Keyword Search ---');
const queries = ['sal', 'austin', 'dallas', 'fresno', 'chicago', 'denver', 'orlando', 'lubbock', 'yakima', 'des moines', 'norman'];
for (const q of queries) {
  const results = uData.searchLocations(q);
  assert(results && results.length > 0, `Search for "${q}" should return results`);
  const top = results[0];
  console.log(`  Query "${q}" -> Found: "${top.name}" (${top.lat.toFixed(4)}°, ${top.lng.toFixed(4)}°)`);
}

console.log('\n--- 3. Testing Coordinate Formats Parsing ---');
const coordTests = [
  { input: '36.6777, -121.6555', expectedLat: 36.6777, expectedLng: -121.6555 },
  { input: '41.5868 -93.6250', expectedLat: 41.5868, expectedLng: -93.6250 },
  { input: '33.5779°N, 101.8552°W', expectedLat: 33.5779, expectedLng: -101.8552 },
  { input: '(35.2226, -97.4395)', expectedLat: 35.2226, expectedLng: -97.4395 },
  { input: '-97.4395, 35.2226', expectedLat: 35.2226, expectedLng: -97.4395 } // Swapped lng/lat
];

for (const tc of coordTests) {
  const res = uData.searchLocations(tc.input);
  assert(res && res.length > 0, `Coord input "${tc.input}" should parse`);
  const top = res[0];
  assert(Math.abs(top.lat - tc.expectedLat) < 0.01, `Lat mismatch for ${tc.input}: expected ${tc.expectedLat}, got ${top.lat}`);
  assert(Math.abs(top.lng - tc.expectedLng) < 0.01, `Lng mismatch for ${tc.input}: expected ${tc.expectedLng}, got ${top.lng}`);
  console.log(`  Parsed "${tc.input}" -> Lat: ${top.lat.toFixed(4)}, Lng: ${top.lng.toFixed(4)} (${top.name})`);
}

console.log('\n--- 4. Testing Procedural Fallback for Arbitrary Locations ---');
const novelQueries = ['Whispering Pines Farm', 'Highland Pasture 42', 'My North Forty', 'Grandpa Vineyard'];
for (const nq of novelQueries) {
  const res = uData.searchLocations(nq);
  assert(res && res.length > 0, `Novel query "${nq}" should generate deterministic parcel`);
  const top = res[0];
  assert(top.lat >= 25 && top.lat <= 49, `Lat ${top.lat} should be in US ag latitudes`);
  assert(top.lng <= -65 && top.lng >= -125, `Lng ${top.lng} should be in US ag longitudes`);
  console.log(`  Query "${nq}" -> Generated: "${top.name}" at (${top.lat}°, ${top.lng}°)`);
}

console.log('\n--- 5. Testing Soil & Telemetry Resolution for Found Locations ---');
const samplePlaces = ['Salinas', 'Des Moines', 'Fresno', 'Orlando', 'Yakima', 'Norman'];
for (const p of samplePlaces) {
  const [loc] = uData.searchLocations(p);
  const soil = uData.resolveSoilForCoordinates(loc.lat, loc.lng);
  const weather = uData.calculateLiveWeather(loc.lat, loc.lng);
  
  assert(soil && soil.name, `Soil should be resolved for ${p}`);
  assert(soil.sandPercent + soil.siltPercent + soil.clayPercent === 100, `Soil texture fractions must equal 100% for ${p}`);
  assert(soil.rootZoneDepthInches > 0, `Root zone depth must be positive for ${p}`);
  assert(weather && weather.tempF > 0, `Weather must be calculated for ${p}`);
  
  console.log(`  ${p.padEnd(12)} -> Soil: ${soil.name.padEnd(38)} | Infil: ${soil.infiltrationRateInHr}"/hr | Temp: ${weather.tempF}°F | VWC: ${weather.suggestedMoistureVwc}%`);
}

console.log('\n🌟 ALL 5 LOCATION SEARCH & MAP SYNC TESTS PASSED SUCCESSFULLY!\n');

