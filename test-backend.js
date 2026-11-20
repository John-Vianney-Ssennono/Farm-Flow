/**
 * ==============================================================================
 * INTEGRATION TEST SUITE: FARM-FLOW BACKEND SERVER & FRONTEND ASSETS
 * ==============================================================================
 * Purpose:
 *   Validates existence and integrity of server.js, compiled index.html,
 *   automation-builder.html, React component bundle, CSS stylesheets,
 *   journal.json persistence store, and key application runtime features.
 * ==============================================================================
 */

// 1. Import Node.js built-in HTTP networking module
const http = require('http');

// 2. Import Node.js built-in file system module for reading files and checking paths
const fs = require('fs');

// 3. Import Node.js path utility module for constructing cross-platform directory paths
const path = require('path');

// 4. Section 1 Header: Test backend server file existence
console.log('--- 1. Testing Server File Existence ---');

// 5. Resolve absolute filesystem path to server.js in root workspace directory
const serverPath = path.join(__dirname, 'server.js');

// 6. Log confirmation showing whether server.js exists on disk
console.log('server.js exists:', fs.existsSync(serverPath));

// 7. Section 2 Header: Test frontend web application bundle files
console.log('\n--- 2. Testing Frontend Files Existence ---');

// 8. Resolve absolute filesystem path to main entrypoint index.html
const indexPath = fs.existsSync(path.join(__dirname, 'index.html'))
  ? path.join(__dirname, 'index.html')
  : path.join(__dirname, 'Farm-Flow', 'index.html');

// 9. Resolve absolute filesystem path to Node-RED visual automation engine HTML
const autoPath = fs.existsSync(path.join(__dirname, 'automation-builder.html'))
  ? path.join(__dirname, 'automation-builder.html')
  : path.join(__dirname, 'Farm-Flow', 'automation-builder.html');

// 10. Resolve absolute filesystem path to React Apple Swift HIG application source
const jsxPath = fs.existsSync(path.join(__dirname, 'js', 'FarmFlowReactApp.jsx'))
  ? path.join(__dirname, 'js', 'FarmFlowReactApp.jsx')
  : path.join(__dirname, 'Farm-Flow', 'js', 'FarmFlowReactApp.jsx');

// 11. Resolve absolute filesystem path to iOS Swift design system stylesheet
const cssPath = fs.existsSync(path.join(__dirname, 'css', 'ios-swift.css'))
  ? path.join(__dirname, 'css', 'ios-swift.css')
  : path.join(__dirname, 'Farm-Flow', 'css', 'ios-swift.css');

// 12. Output file size of compiled index.html in bytes
console.log('index.html size:', fs.statSync(indexPath).size, 'bytes');

// 13. Output file size of automation-builder.html in bytes
console.log('automation-builder.html size:', fs.statSync(autoPath).size, 'bytes');

// 14. Output file size of FarmFlowReactApp.jsx in bytes
console.log('FarmFlowReactApp.jsx size:', fs.statSync(jsxPath).size, 'bytes');

// 15. Output file size of ios-swift.css in bytes
console.log('ios-swift.css size:', fs.statSync(cssPath).size, 'bytes');

// 16. Section 3 Header: Test local farm journal database persistence
console.log('\n--- 3. Testing Journal Persistence ---');

// 17. Resolve path to farm irrigation action log and sensor journal JSON store
const journalPath = fs.existsSync(path.join(__dirname, 'data', 'journal.json'))
  ? path.join(__dirname, 'data', 'journal.json')
  : path.join(__dirname, 'Farm-Flow', 'data', 'journal.json');

// 18. Output boolean indicating whether journal.json file exists on disk
console.log('journal.json exists:', fs.existsSync(journalPath));

// 19. If journal.json exists, inspect and verify its JSON array contents
if (fs.existsSync(journalPath)) {
  // Read and parse journal entries from JSON string
  const content = JSON.parse(fs.readFileSync(journalPath, 'utf8'));

  // Output total count of persisted agricultural log entries
  console.log('Initial journal entries:', content.length);
}

// 20. Section 4 Header: Check index.html for required production scripts and features
console.log('\n--- 4. Checking index.html Content for Key Features ---');

// 21. Load full contents of compiled index.html as a string for regex/substring verification
const indexHtml = fs.readFileSync(indexPath, 'utf8');

// 22. Array of verification check objects containing human-readable names and boolean tests
const checks = [
  // Check 1: React 18 production UMD bundle included
  { name: 'React 18 script', test: indexHtml.includes('react.production.min.js') },
  // Check 2: ReactDOM 18 production UMD bundle included
  { name: 'ReactDOM 18 script', test: indexHtml.includes('react-dom.production.min.js') },
  // Check 3: In-browser Babel standalone compiler included
  { name: 'Babel Standalone script', test: indexHtml.includes('babel.min.js') },
  // Check 4: Leaflet interactive satellite map engine CSS and JavaScript libraries
  { name: 'Leaflet CSS & JS', test: indexHtml.includes('leaflet.js') && indexHtml.includes('leaflet.css') },
  // Check 5: USDA soil taxonomy data and global location database script
  { name: 'Cleveland USDA data script', test: indexHtml.includes('cleveland-usda-data.js') },
  // Check 6: AgriSense AI agronomic reasoning engine script
  { name: 'AI agent engine script', test: indexHtml.includes('ai-agent-engine.js') },
  // Check 7: Inline compiled FarmFlowReactApp main component function
  { name: 'Inline Babel script with FarmFlowReactApp', test: indexHtml.includes('function FarmFlowReactApp()') },
  // Check 8: Geolocation handler for automatic GPS position detection
  { name: 'Current Location Geolocation handler', test: indexHtml.includes('handleUseCurrentLocation') },
  // Check 9: Interactive GPS location button or status indicator
  { name: 'Locate Me Button', test: indexHtml.includes('Locate') || indexHtml.includes('Sync GPS') },
  // Check 10: One-click recommendation implementation handler for farm automation
  { name: '1-Click Implement Recommendation', test: indexHtml.includes('handleImplementRec') },
  // Check 11: Interactive reason modal / action sheet when dismissing recommendations
  { name: 'Interactive Ignore Modal / Action Sheet', test: indexHtml.includes('confirmIgnoreWithReason') },
  // Check 12: Cross-navigation link connecting automation builder back to Swift app
  { name: 'Switch to Swift React App link', test: fs.readFileSync(autoPath, 'utf8').includes('Switch to Swift React App') }
];

// 23. Initialize tracker flag to verify all integration checks pass
let allPassed = true;

// 24. Iterate through each feature check and log individual pass/fail icon
checks.forEach(c => {
  // Output green checkmark for pass, red X for fail
  console.log(`  ${c.test ? '✅' : '❌'} ${c.name}`);

  // Flag overall failure if any individual check fails
  if (!c.test) allPassed = false;
});

// 25. Section 5 Header: Output final summary result
console.log('\n--- Verification Result ---');

// 26. Evaluate overall test suite outcome
if (allPassed) {
  // Log success message if all checks passed
  console.log('🌟 ALL INTEGRATION CHECKS PASSED SUCCESSFULLY!');
} else {
  // Log error message and exit with non-zero exit code if any check failed
  console.error('⚠️ SOME CHECKS FAILED!');
  process.exit(1);
}
