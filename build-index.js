const fs = require('fs');
const path = require('path');

const jsxPath = fs.existsSync(path.join(__dirname, 'js', 'FarmFlowReactApp.jsx'))
  ? path.join(__dirname, 'js', 'FarmFlowReactApp.jsx')
  : path.join(__dirname, 'Farm-Flow', 'js', 'FarmFlowReactApp.jsx');
const indexPath = fs.existsSync(path.join(__dirname, 'index.html'))
  ? path.join(__dirname, 'index.html')
  : path.join(__dirname, 'Farm-Flow', 'index.html');

const jsx = fs.readFileSync(jsxPath, 'utf8');

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Farm-Flow — Water Quantity Optimization &amp; USDA Soil Science</title>
  <meta name="description" content="Cross-platform React mobile application in Apple Swift HIG design for farmers. USDA soil structure analysis, salinity-adjusted water quantity, live current location detection, and AgriSense AI Agent recommendations.">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="Farm-Flow">

  <!-- Leaflet GIS Map CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <!-- Leaflet GIS JavaScript Engine -->
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

  <!-- React 18 Production UMD -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <!-- ReactDOM 18 Production UMD -->
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <!-- Babel Standalone -->
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <!-- Apple Swift / iOS Human Interface Guidelines Stylesheet (Hydrology Blue Palette) -->
  <link rel="stylesheet" href="css/ios-swift.css">

  <!-- Water Droplet Favicon -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2306b6d4'%3E%3Cpath d='M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z'/%3E%3C/svg%3E">
</head>
<body>

  <!-- GLOBAL PLATFORM HEADER WITH APP MODE SWITCHER -->
  <header style="width: 100%; max-width: 1200px; padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(56, 189, 248, 0.2); background: rgba(3, 7, 18, 0.7); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);">
    <div style="display: flex; align-items: center; gap: 10px;">
      <span style="font-size: 20px;">💧</span>
      <div>
        <strong style="color: #fff; font-size: 16px; letter-spacing: -0.3px;">Farm-Flow</strong>
        <span style="font-size: 11px; background: rgba(14, 165, 233, 0.2); color: #38bdf8; padding: 2px 8px; border-radius: 12px; font-weight: 700; margin-left: 6px; border: 1px solid rgba(56, 189, 248, 0.3);">
          WATER QUANTITY OPTIMIZATION
        </span>
      </div>
    </div>
    
    <!-- Mode Switcher Navigation Links -->
    <nav style="display: flex; gap: 10px;">
      <a href="index.html" id="nav-btn-swift" style="text-decoration: none; font-size: 12px; font-weight: 700; color: #fff; background: linear-gradient(135deg, #1d4ed8, #0284c7); border: 1px solid #38bdf8; padding: 6px 14px; border-radius: 8px; box-shadow: 0 0 12px rgba(2, 132, 199, 0.4); display: flex; align-items: center; gap: 6px;">
        📱 React Swift App
      </a>
      <a href="automation-builder.html" id="nav-btn-nodered" style="text-decoration: none; font-size: 12px; font-weight: 600; color: #93c5fd; background: rgba(14, 30, 56, 0.6); border: 1px solid rgba(56, 189, 248, 0.2); padding: 6px 14px; border-radius: 8px; display: flex; align-items: center; gap: 6px;">
        ⚡ Visual Node-RED Engine
      </a>
    </nav>
  </header>

  <!-- REACT MOUNTING ROOT -->
  <main id="react-farm-flow-root" style="width: 100%;"></main>

  <!-- APPLICATION DATA & ENGINE SCRIPTS -->
  <script src="js/cleveland-usda-data.js"></script>
  <script src="js/ai-agent-engine.js"></script>

  <!-- INLINE BABEL REACT SWIFT APP (Executes seamlessly on file:// AND http:// localhost) -->
  <script type="text/babel">
${jsx}
  </script>

</body>
</html>`;

fs.writeFileSync(indexPath, html, 'utf8');
if (fs.existsSync(path.join(__dirname, 'Farm-Flow', 'index.html'))) {
  fs.writeFileSync(path.join(__dirname, 'Farm-Flow', 'index.html'), html, 'utf8');
}
if (fs.existsSync(path.join(__dirname, 'index.html'))) {
  fs.writeFileSync(path.join(__dirname, 'index.html'), html, 'utf8');
}
console.log('✅ index.html successfully updated with inline component!');

