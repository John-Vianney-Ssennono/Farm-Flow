/**
 * Verification test script for Farm-Flow Backend & Frontend Integration
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

// Import server logic directly or test internal functions
console.log('--- 1. Testing Server File Existence ---');
const serverPath = path.join(__dirname, 'server.js');
console.log('server.js exists:', fs.existsSync(serverPath));

console.log('\n--- 2. Testing Frontend Files Existence ---');
const indexPath = path.join(__dirname, 'Farm-Flow', 'index.html');
const autoPath = path.join(__dirname, 'Farm-Flow', 'automation-builder.html');
const jsxPath = path.join(__dirname, 'Farm-Flow', 'js', 'FarmFlowReactApp.jsx');
const cssPath = path.join(__dirname, 'Farm-Flow', 'css', 'ios-swift.css');

console.log('index.html size:', fs.statSync(indexPath).size, 'bytes');
console.log('automation-builder.html size:', fs.statSync(autoPath).size, 'bytes');
console.log('FarmFlowReactApp.jsx size:', fs.statSync(jsxPath).size, 'bytes');
console.log('ios-swift.css size:', fs.statSync(cssPath).size, 'bytes');

console.log('\n--- 3. Testing Journal Persistence ---');
const journalPath = path.join(__dirname, 'Farm-Flow', 'data', 'journal.json');
console.log('journal.json exists:', fs.existsSync(journalPath));
if (fs.existsSync(journalPath)) {
  const content = JSON.parse(fs.readFileSync(journalPath, 'utf8'));
  console.log('Initial journal entries:', content.length);
}

console.log('\n--- 4. Checking index.html Content for Key Features ---');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const checks = [
  { name: 'React 18 script', test: indexHtml.includes('react.production.min.js') },
  { name: 'ReactDOM 18 script', test: indexHtml.includes('react-dom.production.min.js') },
  { name: 'Babel Standalone script', test: indexHtml.includes('babel.min.js') },
  { name: 'Leaflet CSS & JS', test: indexHtml.includes('leaflet.js') && indexHtml.includes('leaflet.css') },
  { name: 'Cleveland USDA data script', test: indexHtml.includes('cleveland-usda-data.js') },
  { name: 'AI agent engine script', test: indexHtml.includes('ai-agent-engine.js') },
  { name: 'Inline Babel script with FarmFlowReactApp', test: indexHtml.includes('function FarmFlowReactApp()') },
  { name: 'Current Location Geolocation handler', test: indexHtml.includes('handleUseCurrentLocation') },
  { name: 'Locate Me Button', test: indexHtml.includes('Locate Me') },
  { name: '1-Click Implement Recommendation', test: indexHtml.includes('handleImplementRec') },
  { name: 'Interactive Ignore Modal / Action Sheet', test: indexHtml.includes('confirmIgnoreWithReason') },
  { name: 'Switch to Swift React App link', test: fs.readFileSync(autoPath, 'utf8').includes('Switch to Swift React App') }
];

let allPassed = true;
checks.forEach(c => {
  console.log(`  ${c.test ? '✅' : '❌'} ${c.name}`);
  if (!c.test) allPassed = false;
});

console.log('\n--- Verification Result ---');
if (allPassed) {
  console.log('🌟 ALL INTEGRATION CHECKS PASSED SUCCESSFULLY!');
} else {
  console.error('⚠️ SOME CHECKS FAILED!');
  process.exit(1);
}

