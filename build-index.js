/**
 * ==============================================================================
 * BUILD SCRIPT: INLINE BUNDLER FOR FARM-FLOW REACT APPLICATION
 * ==============================================================================
 * Purpose:
 *   Reads the source FarmFlowReactApp.jsx and embeds it directly into index.html
 *   as an inlined Babel script tag. This eliminates browser CORS / MIME-type errors
 *   when opening index.html directly from local files (file://) or static servers.
 * ==============================================================================
 */

// 1. Import Node.js built-in filesystem module for reading and writing files
const fs = require('fs');

// 2. Import Node.js path module for resolving cross-platform directory paths
const path = require('path');

// 3. Resolve the path to FarmFlowReactApp.jsx in root or subfolder
const jsxPath = fs.existsSync(path.join(__dirname, 'js', 'FarmFlowReactApp.jsx'))
  ? path.join(__dirname, 'js', 'FarmFlowReactApp.jsx')
  : path.join(__dirname, 'Farm-Flow', 'js', 'FarmFlowReactApp.jsx');

// 4. Resolve the target path to index.html in root or subfolder
const indexPath = fs.existsSync(path.join(__dirname, 'index.html'))
  ? path.join(__dirname, 'index.html')
  : path.join(__dirname, 'Farm-Flow', 'index.html');

// 5. Read the complete raw React JSX source code as a UTF-8 string
const jsx = fs.readFileSync(jsxPath, 'utf8');

// 6. Construct the production HTML document template with injected React source
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <!-- Document character encoding -->
  <meta charset="UTF-8">
  <!-- Viewport settings: edge-to-edge scaling on mobile devices without unwanted pinch-zoom -->
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <!-- Application Title -->
  <title>Farm-Flow — Water Quantity Optimization &amp; USDA Soil Science</title>
  <!-- Search engine and social metadata description -->
  <meta name="description" content="Cross-platform React mobile application in Apple Swift HIG design for farmers. USDA soil structure analysis, salinity-adjusted water quantity, live current location detection, and AgriSense AI Agent recommendations.">
  <!-- Apple iOS web app capability: standalone fullscreen display -->
  <meta name="apple-mobile-web-app-capable" content="yes">
  <!-- Apple iOS status bar appearance -->
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <!-- Apple iOS homescreen bookmark title -->
  <meta name="apple-mobile-web-app-title" content="Farm-Flow">

  <!-- Leaflet GIS Map CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <!-- Leaflet GIS JavaScript Engine -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- React 18 Production UMD -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <!-- ReactDOM 18 Production UMD -->
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- Babel Standalone: Compiles in-browser JSX seamlessly under file:// and http:// protocols -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Apple Swift / iOS Human Interface Guidelines Stylesheet (Hydrology Blue Palette) -->
  <link rel="stylesheet" href="css/ios-swift.css">

  <!-- Water Droplet Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306b6d4'%3E%3Cpath d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'/%3E%3C/svg%3E">
</head>
<body>

  <!-- REACT MOUNTING ROOT -->
  <main id="react-farm-flow-root" style="width: 100%;"></main>

  <!-- APPLICATION DATA & ENGINE SCRIPTS -->
  <!-- USDA Cleveland County Soil Survey dataset & 100+ location geocoding index -->
  <script src="js/cleveland-usda-data.js"></script>
  <!-- AgriSense AI Agent reasoning engine & mathematical irrigation calculators -->
  <script src="js/ai-agent-engine.js"></script>

  <!-- INLINE BABEL REACT SWIFT APP (Executes seamlessly on file:// AND http:// localhost) -->
  <script type="text/babel">
${jsx}
  </script>

</body>
</html>`;

// 7. Write the assembled HTML document to primary resolved index.html
fs.writeFileSync(indexPath, html, 'utf8');

// 8. If Farm-Flow/index.html subfolder exists, synchronize the compiled build there as well
if (fs.existsSync(path.join(__dirname, 'Farm-Flow', 'index.html'))) {
  fs.writeFileSync(path.join(__dirname, 'Farm-Flow', 'index.html'), html, 'utf8');
}

// 9. If root index.html exists, synchronize the compiled build there
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
}

// 10. Output success message to console
console.log('✅ index.html successfully updated with inline component!');
