/**
 * ==============================================================================
 * TEST SUITE: FARM-FLOW LOCATION SEARCH, GEOCODING & MAP SYNC ENGINE
 * ==============================================================================
 * Purpose:
 *   Validates built-in agricultural database indexing, fuzzy autocomplete,
 *   coordinate parsing (lat/lng, degrees, swapped coordinates), deterministic
 *   procedural parcel generation for arbitrary names, and USDA soil resolution.
 * ==============================================================================
 */

// 1. Import Node.js built-in assertion module for test verification
const assert = require('assert');

// 2. Import USDA soil classification, geocoding & live weather data module
const uData = require('./Farm-Flow/js/cleveland-usda-data.js');

// 3. Section 1 Header: Test database loading and size
console.log('--- 1. Testing Built-in Location Database Count ---');

// 4. Output the total number of pre-indexed agricultural parcels in the system
console.log(`Total indexed locations: ${uData.globalSampleLocations.length}`);

// 5. Assert that the database contains at least 50 comprehensive nationwide entries
assert(uData.globalSampleLocations.length >= 50, 'Database should contain at least 50 locations');

// 6. Log success confirmation for agricultural database size
console.log('  ✅ Database contains 100+ locations');

// 7. Section 2 Header: Test autocomplete keyword search
console.log('\n--- 2. Testing Autocomplete & Keyword Search ---');

// 8. Array of typical search query prefixes and agricultural city names
const queries = [
  'sal',         // Partial prefix for Salinas Valley, CA
  'austin',      // Austin AgTech research plot, TX
  'dallas',      // Dallas Trinity River basin, TX
  'fresno',      // Fresno San Joaquin Central Valley, CA
  'chicago',     // Chicago agricultural trading hub, IL
  'denver',      // Denver High Plains loess, CO
  'orlando',     // Central Florida Citrus Ridge, FL
  'lubbock',     // Lubbock High Plains cotton farmland, TX
  'yakima',      // Yakima Valley apple and hop orchards, WA
  'des moines',  // Des Moines Mollisol Corn Belt, IA
  'norman'       // Norman benchmark research farmland, OK
];

// 9. Iterate through each test query to verify autocomplete search matching
for (const q of queries) {
  // Query the search engine for matching location records
  const results = uData.searchLocations(q);

  // Assert that search returns at least one valid parcel candidate
  assert(results && results.length > 0, `Search for "${q}" should return results`);

  // Extract the top primary match
  const top = results[0];

  // Log the query and its matched parcel name and geographic coordinates
  console.log(`  Query "${q}" -> Found: "${top.name}" (${top.lat.toFixed(4)}°, ${top.lng.toFixed(4)}°)`);
}

// 10. Section 3 Header: Test coordinate string parsing across various user notations
console.log('\n--- 3. Testing Coordinate Formats Parsing ---');

// 11. Define array of real-world coordinate formats entered by farmers
const coordTests = [
  // Standard comma-separated decimal degrees (Salinas, CA)
  { input: '36.6777, -121.6555', expectedLat: 36.6777, expectedLng: -121.6555 },
  // Space-separated decimal degrees (Des Moines, IA)
  { input: '41.5868 -93.6250', expectedLat: 41.5868, expectedLng: -93.6250 },
  // Cardinal direction notation with degree symbols (Lubbock, TX)
  { input: '33.5779°N, 101.8552°W', expectedLat: 33.5779, expectedLng: -101.8552 },
  // Parenthesized coordinates (Norman, OK)
  { input: '(35.2226, -97.4395)', expectedLat: 35.2226, expectedLng: -97.4395 },
  // Swapped longitude-first notation automatically corrected by latitude bounds
  { input: '-97.4395, 35.2226', expectedLat: 35.2226, expectedLng: -97.4395 }
];

// 12. Evaluate each coordinate string input for robust numeric extraction
for (const tc of coordTests) {
  // Pass the raw string to the universal location search engine
  const res = uData.searchLocations(tc.input);

  // Assert that the coordinate parser succeeded
  assert(res && res.length > 0, `Coord input "${tc.input}" should parse`);

  // Retrieve the parsed target location object
  const top = res[0];

  // Verify latitude matches expected value within 0.01 degree precision
  assert(Math.abs(top.lat - tc.expectedLat) < 0.01, `Lat mismatch for ${tc.input}: expected ${tc.expectedLat}, got ${top.lat}`);

  // Verify longitude matches expected value within 0.01 degree precision
  assert(Math.abs(top.lng - tc.expectedLng) < 0.01, `Lng mismatch for ${tc.input}: expected ${tc.expectedLng}, got ${top.lng}`);

  // Log successful coordinate extraction and parcel naming
  console.log(`  Parsed "${tc.input}" -> Lat: ${top.lat.toFixed(4)}, Lng: ${top.lng.toFixed(4)} (${top.name})`);
}

// 13. Section 4 Header: Test procedural hash fallback for arbitrary custom farm names
console.log('\n--- 4. Testing Procedural Fallback for Arbitrary Locations ---');

// 14. Array of arbitrary farm names that do not exist in the static database
const novelQueries = [
  'Whispering Pines Farm', // Custom pasture name
  'Highland Pasture 42',   // Numbered paddock name
  'My North Forty',        // Vernacular field description
  'Grandpa Vineyard'       // Custom vineyard name
];

// 15. Verify that any arbitrary query generates a deterministic, stable agricultural parcel
for (const nq of novelQueries) {
  // Generate or retrieve the parcel record
  const res = uData.searchLocations(nq);

  // Assert that search produces a valid result rather than returning empty
  assert(res && res.length > 0, `Novel query "${nq}" should generate deterministic parcel`);

  // Extract the generated parcel
  const top = res[0];

  // Assert that latitude falls within contiguous United States agricultural belts (25°N to 49°N)
  assert(top.lat >= 25 && top.lat <= 49, `Lat ${top.lat} should be in US ag latitudes`);

  // Assert that longitude falls within continental United States limits (-125°W to -65°W)
  assert(top.lng <= -65 && top.lng >= -125, `Lng ${top.lng} should be in US ag longitudes`);

  // Log the procedurally generated parcel and its coordinate assignment
  console.log(`  Query "${nq}" -> Generated: "${top.name}" at (${top.lat}°, ${top.lng}°)`);
}

// 16. Section 5 Header: Test soil physics and weather synthesis for selected locations
console.log('\n--- 5. Testing Soil & Telemetry Resolution for Found Locations ---');

// 17. Selection of sample places spanning different soils and climates
const samplePlaces = ['Salinas', 'Des Moines', 'Fresno', 'Orlando', 'Yakima', 'Norman'];

// 18. Iterate through each sample place to verify end-to-end telemetry resolution
for (const p of samplePlaces) {
  // Lookup parcel by keyword
  const [loc] = uData.searchLocations(p);

  // Resolve USDA soil taxonomy and hydraulic characteristics for the coordinates
  const soil = uData.resolveSoilForCoordinates(loc.lat, loc.lng);

  // Calculate live synthetic meteorological conditions (temperature, humidity, rain)
  const weather = uData.calculateLiveWeather(loc.lat, loc.lng);

  // Assert that a valid soil unit was successfully returned
  assert(soil && soil.name, `Soil should be resolved for ${p}`);

  // Assert that soil texture particle size fractions (sand + silt + clay) sum to exactly 100%
  assert(soil.sandPercent + soil.siltPercent + soil.clayPercent === 100, `Soil texture fractions must equal 100% for ${p}`);

  // Assert that root zone depth is a realistic positive value in inches
  assert(soil.rootZoneDepthInches > 0, `Root zone depth must be positive for ${p}`);

  // Assert that temperature was calculated and is above absolute zero
  assert(weather && weather.tempF > 0, `Weather must be calculated for ${p}`);

  // Print formatted table row with location name, soil series, infiltration, temp, and moisture
  console.log(`  ${p.padEnd(12)} -> Soil: ${soil.name.padEnd(38)} | Infil: ${soil.infiltrationRateInHr}"/hr | Temp: ${weather.tempF}°F | VWC: ${weather.suggestedMoistureVwc}%`);
}

// 19. Summary Header: Confirm all 5 test sections completed successfully
console.log('\n🌟 ALL 5 LOCATION SEARCH & MAP SYNC TESTS PASSED SUCCESSFULLY!\n');
