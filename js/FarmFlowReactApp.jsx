/**
 * ==============================================================================
 * FARM-FLOW: MAIN REACT APPLICATION COMPONENT (APPLE SWIFT HIG DESIGN)
 * ==============================================================================
 * Focus: Water Quantity Optimization, Salinity Physics, USDA Soil Structure,
 * Google Maps / Leaflet Satellite GIS, and AgriSense AI Recommendation Agent.
 * 
 * Styled in an authentic Apple iOS HIG aesthetic with a curated spectrum of blues.
 * Fully documented with line-by-line explanatory comments.
 * ==============================================================================
 */

// Destructure standard React hooks from the global React 18 object
const { useState, useEffect, useRef } = React;

/**
 * Root React functional component for the Farm-Flow platform
 */
function FarmFlowReactApp() {

  // ----------------------------------------------------------------------------
  // 1. APPLICATION STATE HOOKS
  // ----------------------------------------------------------------------------

  // deviceMode: Toggles between 'iphone' (iPhone 16 Pro bezel) and 'fullscreen' (iPad / Desktop)
  const [deviceMode, setDeviceMode] = useState('iphone');

  // activeTab: Tracks the currently active iOS bottom tab ('map', 'water', 'ai', 'pedon', 'log')
  const [activeTab, setActiveTab] = useState('map');

  // selectedLocation: Holds the active geographic parcel in Cleveland County, Oklahoma
  const [selectedLocation, setSelectedLocation] = useState(
    window.USDA_CLEVELAND_SOIL_DATA.sampleLocations[0]
  );

  // selectedSoilUnit: Holds the detected USDA NRCS soil survey map unit for the selected parcel
  const [selectedSoilUnit, setSelectedSoilUnit] = useState(
    window.USDA_CLEVELAND_SOIL_DATA.soilUnits['stephenville-harrah-newalla']
  );
  
  // currentVwc: Real-time volumetric water content (% VWC measured in crop root zone)
  const [currentVwc, setCurrentVwc] = useState(18.2);

  // salinityEc: Soil pore water electrical conductivity in mS/cm (or dS/m)
  const [salinityEc, setSalinityEc] = useState(2.25);

  // fieldAcres: Total cultivated parcel acreage (used for Gallon volume calculations)
  const [fieldAcres, setFieldAcres] = useState(12.5);

  // searchQuery: Text input for geocoding / searching Cleveland County addresses
  const [searchQuery, setSearchQuery] = useState('');

  // recommendations: Array of active AI Agronomist recommendations
  const [recommendations, setRecommendations] = useState([]);

  // farmLogs: Array of farmer decision history entries (Implemented vs Ignored)
  const [farmLogs, setFarmLogs] = useState([]);

  // chatMessages: History of conversational exchanges with the AgriSense AI assistant
  const [chatMessages, setChatMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am AgriSense AI, your personal agronomist for Cleveland County, Oklahoma. I analyze USDA soil taxonomy, salinity, and water volume to optimize your yields.'
    }
  ]);

  // chatInput: Farmer's current typed chat query
  const [chatInput, setChatInput] = useState('');

  // ----------------------------------------------------------------------------
  // 2. DOM & MAP INSTANCE REFERENCES
  // ----------------------------------------------------------------------------

  // mapContainerRef: References the HTML <div> where the Leaflet GIS map renders
  const mapContainerRef = useRef(null);

  // mapInstanceRef: Stores the active Leaflet Map object to prevent redundant re-creations
  const mapInstanceRef = useRef(null);

  // markerRef: Stores the draggable pin marker placed on the farmer's active parcel
  const markerRef = useRef(null);

  // ----------------------------------------------------------------------------
  // 3. REACT EFFECT HOOKS
  // ----------------------------------------------------------------------------

  /**
   * Effect Hook 1: Synchronize USDA Soil Unit when Selected Location Changes
   * Whenever the user picks a new parcel, look up its corresponding soil unit,
   * baseline moisture, and salinity in the USDA dataset.
   */
  useEffect(() => {
    // Check if location exists and has an associated soil key
    if (selectedLocation && selectedLocation.soilUnitKey) {
      // Lookup the full soil definition in the USDA Cleveland County matrix
      const u = window.USDA_CLEVELAND_SOIL_DATA.soilUnits[selectedLocation.soilUnitKey];
      if (u) {
        // Update active soil unit state
        setSelectedSoilUnit(u);
        // Update root zone moisture to parcel baseline
        setCurrentVwc(selectedLocation.moistureVwc || 18.2);
        // Update salinity to parcel baseline
        setSalinityEc(selectedLocation.defaultSalinity || 2.0);
      }
    }
  }, [selectedLocation]);

  /**
   * Effect Hook 2: Trigger AI Agronomist Evaluation
   * Re-evaluates recommendations whenever soil unit, moisture, salinity, or acreage changes.
   */
  useEffect(() => {
    if (selectedSoilUnit) {
      // Call AI reasoning engine with latest parameters
      const recs = window.AIAgentEngine.evaluateLocation(
        selectedLocation,
        selectedSoilUnit,
        currentVwc,
        salinityEc,
        fieldAcres
      );
      // Update local state with latest recommendation deck
      setRecommendations([...recs]);
    }
  }, [selectedSoilUnit, currentVwc, salinityEc, fieldAcres]);

  /**
   * Effect Hook 3: Subscribe to AI Engine Event Bus
   * Keeps local React state synchronized if actions are performed elsewhere.
   */
  useEffect(() => {
    const unsub = window.AIAgentEngine.subscribe((recs, logs) => {
      setRecommendations([...recs]);
      setFarmLogs([...logs]);
    });
    // Cleanup subscription on unmount
    return unsub;
  }, []);

  /**
   * Effect Hook 4: Initialize and Update Leaflet GIS Map with Google / Esri Satellite Layer
   * Sets up tile layers, pin markers, drag handlers, and map click listeners.
   */
  useEffect(() => {
    // Only initialize if the user is on the 'map' tab and DOM container is mounted
    if (activeTab === 'map' && mapContainerRef.current && !mapInstanceRef.current) {
      // Create Leaflet map centered at current parcel coordinates
      const map = L.map(mapContainerRef.current, {
        center: [selectedLocation.lat, selectedLocation.lng],
        zoom: 12,
        zoomControl: false // disabled for clean iOS look
      });

      // Esri World Imagery Satellite Tile Layer (matches Google Satellite imagery)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        { attribution: 'Tiles &copy; Esri &mdash; USDA Farm Service Agency' }
      );

      // Clean street and municipal boundaries layer overlay
      const labelsLayer = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png',
        { attribution: '&copy; OpenStreetMap' }
      );

      // Add both layers to map
      satelliteLayer.addTo(map);
      labelsLayer.addTo(map);

      // Create draggable pin marker representing the farm parcel
      const marker = L.marker([selectedLocation.lat, selectedLocation.lng], {
        draggable: true
      }).addTo(map);

      // Bind informative popup displaying parcel name and USDA soil unit
      marker.bindPopup(`<b>${selectedLocation.name}</b><br/>${selectedSoilUnit.name}`).openPopup();

      // Listen for marker drag end: updates GPS coordinates when farmer moves the pin
      marker.on('dragend', function (e) {
        const coord = e.target.getLatLng();
        handleMapCoordinateSelect(coord.lat, coord.lng);
      });

      // Listen for direct map click: places pin at clicked coordinates
      map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        handleMapCoordinateSelect(e.latlng.lat, e.latlng.lng);
      });

      // Store instances in mutable refs
      mapInstanceRef.current = map;
      markerRef.current = marker;
    }

    // If map already exists, smoothly pan to new coordinates and update popup
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.setView([selectedLocation.lat, selectedLocation.lng], 13);
      markerRef.current.setLatLng([selectedLocation.lat, selectedLocation.lng]);
      markerRef.current.setPopupContent(`<b>${selectedLocation.name}</b><br/>${selectedSoilUnit.name}`).openPopup();
    }
  }, [activeTab, selectedLocation]);

  // ----------------------------------------------------------------------------
  // 4. USER INTERACTION HANDLERS
  // ----------------------------------------------------------------------------

  /**
   * Handle picking new coordinates on the map: finds nearest Cleveland County soil survey unit
   */
  const handleMapCoordinateSelect = (lat, lng) => {
    // Calculate Euclidean distance to find closest sample agricultural benchmark
    let closest = window.USDA_CLEVELAND_SOIL_DATA.sampleLocations[0];
    let minD = 999;
    window.USDA_CLEVELAND_SOIL_DATA.sampleLocations.forEach(loc => {
      const d = Math.hypot(loc.lat - lat, loc.lng - lng);
      if (d < minD) {
        minD = d;
        closest = loc;
      }
    });

    // Update selected location state with custom GPS coordinates
    setSelectedLocation({
      ...closest,
      lat: Number(lat.toFixed(4)),
      lng: Number(lng.toFixed(4)),
      name: `Custom Parcel (${lat.toFixed(3)}°N, ${lng.toFixed(3)}°W)`
    });
  };

  /**
   * Handle search bar submit: searches Cleveland County locations by name
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault(); // Prevent standard page reload
    if (!searchQuery.trim()) return;
    const query = searchQuery.toLowerCase();
    
    // Find matching parcel in sample locations array
    const match = window.USDA_CLEVELAND_SOIL_DATA.sampleLocations.find(l =>
      l.name.toLowerCase().includes(query) || l.area.toLowerCase().includes(query)
    );

    if (match) {
      setSelectedLocation(match);
      setSearchQuery('');
    } else {
      alert(`Location "${searchQuery}" matched within Cleveland County, OK boundary.`);
    }
  };

  /**
   * Farmer clicks "Implement Recommendation" button
   */
  const handleImplementRec = (recId) => {
    // Invoke AI engine implementation method which creates log and marks status
    window.AIAgentEngine.implementRecommendation(recId, 'Farmer confirmed via 1-Click');
  };

  /**
   * Farmer clicks "Ignore / Dismiss" button
   */
  const handleIgnoreRec = (recId) => {
    // Prompt farmer for optional override feedback to capture farmer agency
    const reason = prompt(
      'Optional: Reason for ignoring this recommendation (e.g. Rain in forecast, Electricity peak, Postponed):',
      'Postponed for later'
    );
    if (reason !== null) {
      window.AIAgentEngine.ignoreRecommendation(recId, reason);
    }
  };

  /**
   * Farmer submits message to the AgriSense AI Conversational Assistant
   */
  const handleSendChatMessage = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    // Append farmer message to chat list
    const newChat = [...chatMessages, { sender: 'user', text: userMsg }];
    setChatMessages(newChat);
    setChatInput('');

    // Generate AI response after brief delay
    setTimeout(() => {
      const reply = window.AIAgentEngine.generateChatResponse(
        userMsg,
        selectedSoilUnit,
        currentVwc,
        salinityEc
      );
      // Append AI response
      setChatMessages([...newChat, { sender: 'ai', text: reply }]);
    }, 550);
  };

  // ----------------------------------------------------------------------------
  // 5. HYDROLOGICAL MATHEMATICS EVALUATION
  // ----------------------------------------------------------------------------
  const calc = window.USDA_CLEVELAND_SOIL_DATA.Calculations;
  // Total Plant Available Water (inches)
  const taw = calc.calcTotalAvailableWaterInches(selectedSoilUnit.id);
  // Current Stored Water (inches depth)
  const curWaterDepth = calc.calcCurrentWaterDepthInches(selectedSoilUnit.id, currentVwc);
  // Current Stored Water Volume in Liquid Gallons across active acreage
  const curWaterGallons = calc.inchesToGallons(curWaterDepth, fieldAcres);
  // Osmotic salinity tension analysis (quantifies inaccessible water locked by salts)
  const waterAnalysis = calc.calcEffectiveWaterCapacity(selectedSoilUnit.id, currentVwc, salinityEc);
  // Salt leaching requirement calculation
  const leaching = calc.calcLeachingRequirement(salinityEc);

  // ----------------------------------------------------------------------------
  // 6. JSX COMPONENT RENDERING
  // ----------------------------------------------------------------------------
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {/* ==================== TOP CROSS-PLATFORM CONTROL BAR ==================== */}
      <header className="platform-toolbar">
        <div className="platform-title">
          {/* Blue-themed water glyph */}
          <div className="apple-logo-badge">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
            </svg>
          </div>
          <div>
            <span>Farm-Flow &bull; Water Optimization</span>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 500 }}>
              Hydrology Blue Edition &mdash; Cleveland County, OK
            </div>
          </div>
        </div>

        {/* Device Switcher Controls */}
        <div className="platform-modes">
          <button
            className={`mode-toggle-btn ${deviceMode === 'iphone' ? 'active' : ''}`}
            onClick={() => setDeviceMode('iphone')}
          >
            📱 iPhone 16 Pro View
          </button>
          <button
            className={`mode-toggle-btn ${deviceMode === 'fullscreen' ? 'active' : ''}`}
            onClick={() => setDeviceMode('fullscreen')}
          >
            💻 Cross-Platform / iPad
          </button>
        </div>
      </header>

      {/* ==================== MAIN HARDWARE / SIMULATOR VIEWPORT ==================== */}
      <div className="app-viewport-wrapper">
        <div className={deviceMode === 'iphone' ? 'device-frame-iphone' : 'device-frame-full'}>
          
          {/* iOS Status Bar with Dynamic Island Pill */}
          <div className="ios-status-bar">
            <span>9:41</span>
            {/* Dynamic Island displaying live water telemetry status */}
            <div className="dynamic-island">
              <span className="island-pulse-dot"></span>
              <span>Water Active</span>
            </div>
            <div className="status-right-icons">
              <span>5G</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
              </svg>
              <span>100%</span>
            </div>
          </div>

          {/* iOS Navigation Bar (Large Title Header) */}
          <div className="ios-nav-bar">
            <div className="ios-nav-top">
              <div className="ios-nav-title">
                Farm-Flow
                <span style={{ fontSize: '12px', color: '#38bdf8' }}>&bull; Water Opt</span>
              </div>
              {/* Location Pill */}
              <div className="ios-location-pill">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                {selectedLocation.area}
              </div>
            </div>
            <div className="ios-nav-subtitle">USDA NRCS Soil Survey &bull; Norman, OK Watershed</div>
          </div>

          {/* Cupertino Segmented Location Picker */}
          <div className="ios-segmented-control">
            {window.USDA_CLEVELAND_SOIL_DATA.sampleLocations.slice(0, 3).map(loc => (
              <div
                key={loc.id}
                className={`segment-item ${selectedLocation.id === loc.id ? 'active' : ''}`}
                onClick={() => setSelectedLocation(loc)}
              >
                {loc.name.split(' ')[0]}
              </div>
            ))}
          </div>

          {/* ==================== SCROLLABLE CONTENT AREA ==================== */}
          <div className="ios-scroll-content">

            {/* --------------------------------------------------------------
                TAB 1: GOOGLE SATELLITE MAP & SOIL STRUCTURE EXPLORER
                -------------------------------------------------------------- */}
            {activeTab === 'map' && (
              <>
                {/* Geocoding Search Bar */}
                <form onSubmit={handleSearchSubmit} className="ios-search-bar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2.5">
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input
                    type="text"
                    className="ios-search-input"
                    placeholder="Search Norman parcels, Lake Thunderbird, Noble..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" style={{ background: 'transparent', border: 'none', color: '#38bdf8', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                    Search
                  </button>
                </form>

                {/* Leaflet Google Satellite Map Frame */}
                <div className="map-viewport-container">
                  <div id="leaflet-soil-map" ref={mapContainerRef} style={{ width: '100%', height: '100%' }}></div>
                  <div className="map-control-overlay">
                    <button
                      className="map-icon-btn"
                      title="Center on Norman Uplands"
                      onClick={() => setSelectedLocation(window.USDA_CLEVELAND_SOIL_DATA.sampleLocations[0])}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/><polygon points="12 8 8 12 12 16 16 12 12 8"/>
                      </svg>
                    </button>
                    <button
                      className="map-icon-btn"
                      title="Center on Canadian River Bottomland"
                      onClick={() => setSelectedLocation(window.USDA_CLEVELAND_SOIL_DATA.sampleLocations[2])}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* USDA Soil Structure Card */}
                <div className="ios-card">
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">{selectedSoilUnit.name}</div>
                        <div className="card-caption-text">{selectedSoilUnit.countySharePercent}% of Cleveland County Area</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '10px', background: 'rgba(56, 189, 248, 0.2)', color: '#38bdf8' }}>
                      USDA Survey Verified
                    </span>
                  </div>

                  <p style={{ fontSize: '13px', color: '#e0f2fe', lineHeight: 1.45 }}>
                    {selectedSoilUnit.description}
                  </p>

                  {/* Sand / Silt / Clay Soil Fraction Bar */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }}>
                      <span style={{ color: '#bae6fd' }}>Sand: {selectedSoilUnit.sandPercent}%</span>
                      <span style={{ color: '#38bdf8' }}>Silt: {selectedSoilUnit.siltPercent}%</span>
                      <span style={{ color: '#0284c7' }}>Clay: {selectedSoilUnit.clayPercent}%</span>
                    </div>
                    {/* Visual Soil Texture Fraction Gradient Bar */}
                    <div style={{ display: 'flex', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
                      <div style={{ width: `${selectedSoilUnit.sandPercent}%`, background: '#bae6fd' }}></div>
                      <div style={{ width: `${selectedSoilUnit.siltPercent}%`, background: '#38bdf8' }}></div>
                      <div style={{ width: `${selectedSoilUnit.clayPercent}%`, background: '#0284c7' }}></div>
                    </div>
                  </div>

                  {/* Soil Physical Hydrology Grid */}
                  <div className="water-metrics-grid" style={{ marginTop: '4px' }}>
                    <div className="metric-tile">
                      <span className="metric-tile-label">Permeability Rating</span>
                      <span className="metric-tile-val" style={{ fontSize: '16px' }}>{selectedSoilUnit.permeabilityRating}</span>
                      <span className="metric-tile-sub">Max Infil: {selectedSoilUnit.infiltrationRateInHr}" / hr</span>
                    </div>
                    <div className="metric-tile">
                      <span className="metric-tile-label">Bulk Density</span>
                      <span className="metric-tile-val" style={{ fontSize: '16px' }}>{selectedSoilUnit.bulkDensityGcm3} g/cm³</span>
                      <span className="metric-tile-sub">Active Depth: {selectedSoilUnit.rootZoneDepthInches} inches</span>
                    </div>
                  </div>
                </div>

                {/* Quick Link Card to AI Agronomist */}
                <div
                  className="ios-card"
                  style={{ cursor: 'pointer', background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(37, 99, 235, 0.15))' }}
                  onClick={() => setActiveTab('ai')}
                >
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-sky">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">AgriSense AI Ready</div>
                        <div className="card-caption-text">{recommendations.length} water optimization actions available</div>
                      </div>
                    </div>
                    <span style={{ color: '#38bdf8', fontWeight: 700 }}>Review &rsaquo;</span>
                  </div>
                </div>
              </>
            )}

            {/* --------------------------------------------------------------
                TAB 2: WATER QUANTITY & SALINITY DYNAMICS
                -------------------------------------------------------------- */}
            {activeTab === 'water' && (
              <>
                {/* Available Water Storage Card */}
                <div className="ios-card">
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-cyan">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">Root Zone Water Storage</div>
                        <div className="card-caption-text">Root Zone Depth: {selectedSoilUnit.rootZoneDepthInches} inches</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#38bdf8' }}>
                      {curWaterDepth}" Stored
                    </span>
                  </div>

                  {/* Liquid Volume Readouts */}
                  <div className="water-metrics-grid">
                    <div className="metric-tile">
                      <span className="metric-tile-label">Current Stored Gallons</span>
                      <span className="metric-tile-val">{curWaterGallons.toLocaleString()}</span>
                      <span className="metric-tile-sub">across {fieldAcres} acres</span>
                    </div>
                    <div className="metric-tile">
                      <span className="metric-tile-label">Total Water Capacity</span>
                      <span className="metric-tile-val">{taw}"</span>
                      <span className="metric-tile-sub">AWC: {selectedSoilUnit.availableWaterCapacityInIn} in/in</span>
                    </div>
                  </div>

                  {/* Horizontal Water Depth Progress Gauge */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#93c5fd', marginBottom: '4px' }}>
                      <span>Wilting Point ({selectedSoilUnit.permanentWiltingPointVwc}%)</span>
                      <span style={{ color: '#fff', fontWeight: 700 }}>Moisture: {currentVwc}% VWC</span>
                      <span>Field Capacity ({selectedSoilUnit.fieldCapacityVwc}%)</span>
                    </div>
                    <div className="progress-container">
                      <div
                        className="progress-bar-fill fill-cyan"
                        style={{
                          width: `${Math.min(100, Math.max(10, ((currentVwc - selectedSoilUnit.permanentWiltingPointVwc) / (selectedSoilUnit.fieldCapacityVwc - selectedSoilUnit.permanentWiltingPointVwc)) * 100))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Salinity & Osmotic Reduction Card */}
                <div className="ios-card">
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">Soil Salinity (EC) Optimization</div>
                        <div className="card-caption-text">Sensitivity Threshold: {selectedSoilUnit.salinitySensitivityThreshold} mS/cm</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: salinityEc > selectedSoilUnit.salinitySensitivityThreshold ? '#38bdf8' : '#67e8f9' }}>
                      {salinityEc} mS/cm
                    </span>
                  </div>

                  {/* Osmotic Tension Explanation */}
                  <div className="rec-rationale-box">
                    <strong>Osmotic Tension Impact: </strong>
                    {waterAnalysis.osmoticStressPercent > 0 ? (
                      <span>Salinity of <b>{salinityEc} mS/cm</b> creates osmotic tension, reducing plant-usable water intake by <b>{waterAnalysis.osmoticStressPercent}%</b>. While {curWaterDepth}" physically exists, only <b>{waterAnalysis.effectiveWaterInches}"</b> is extractable by roots.</span>
                    ) : (
                      <span>Salinity is within the optimal range. Crop roots can freely absorb available water without osmotic drought.</span>
                    )}
                  </div>

                  {/* Salt Leaching Prescription Box */}
                  {leaching.needed && (
                    <div style={{ background: 'rgba(2, 132, 199, 0.2)', border: '1px solid rgba(56, 189, 248, 0.4)', borderRadius: '10px', padding: '10px 12px' }}>
                      <div style={{ fontWeight: 700, fontSize: '12px', color: '#38bdf8', marginBottom: '4px' }}>
                        💧 Salt Leaching Pulse Prescribed
                      </div>
                      <div style={{ fontSize: '12px', color: '#f0f9ff' }}>
                        To flush salts past the {selectedSoilUnit.rootZoneDepthInches}" root zone, apply an additional <b>{leaching.extraWaterInches}"</b> of water (~{calc.inchesToGallons(leaching.extraWaterInches, fieldAcres).toLocaleString()} gal).
                      </div>
                    </div>
                  )}

                  {/* Interactive Hydraulic Control Sliders */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '6px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#93c5fd' }}>Adjust Root Zone Moisture (% VWC):</span>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>{currentVwc}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="40"
                        step="0.5"
                        value={currentVwc}
                        onChange={(e) => setCurrentVwc(parseFloat(e.target.value))}
                        className="styled-range"
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#93c5fd' }}>Adjust Soil Salinity (EC):</span>
                        <span style={{ color: '#38bdf8', fontWeight: 700 }}>{salinityEc} mS/cm</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="4.0"
                        step="0.05"
                        value={salinityEc}
                        onChange={(e) => setSalinityEc(parseFloat(e.target.value))}
                        className="styled-range"
                      />
                    </div>

                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                        <span style={{ color: '#93c5fd' }}>Cultivated Parcel Acreage:</span>
                        <span style={{ color: '#fff', fontWeight: 700 }}>{fieldAcres} acres</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="100"
                        step="1"
                        value={fieldAcres}
                        onChange={(e) => setFieldAcres(parseFloat(e.target.value))}
                        className="styled-range"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* --------------------------------------------------------------
                TAB 3: AI AGRONOMIST AGENT (WITH IMPLEMENT / IGNORE CHOICES)
                -------------------------------------------------------------- */}
            {activeTab === 'ai' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>AgriSense AI Agronomist</div>
                  <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.2)', padding: '3px 10px', borderRadius: '12px', fontWeight: 700 }}>
                    Active Reasoning
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#93c5fd' }}>
                  Recommendations tailored to <strong>{selectedSoilUnit.name}</strong>. Choose <strong>Implement</strong> to auto-execute, or <strong>Ignore</strong> to dismiss.
                </p>

                {/* AI Recommendation Cards Deck */}
                {recommendations.map(rec => (
                  <div
                    key={rec.id}
                    className={`ai-recommendation-card priority-${rec.priority.toLowerCase()}`}
                  >
                    <div className="rec-header">
                      <div className="rec-title">{rec.title}</div>
                      <span className={`rec-priority-badge badge-${rec.priority.toLowerCase()}`}>
                        {rec.priority}
                      </span>
                    </div>

                    <div className="rec-body-text">{rec.summary}</div>

                    <div className="rec-rationale-box">
                      <strong>USDA Rationale: </strong> {rec.scientificRationale}
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#38bdf8' }}>
                      ⚡ Action: {rec.suggestedAction}
                    </div>

                    {/* Implement / Ignore Buttons */}
                    {rec.status === 'pending' ? (
                      <div className="rec-actions-row">
                        <button
                          className="btn-ios-implement"
                          onClick={() => handleImplementRec(rec.id)}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                          Implement Recommendation
                        </button>
                        <button
                          className="btn-ios-ignore"
                          onClick={() => handleIgnoreRec(rec.id)}
                        >
                          Ignore / Dismiss
                        </button>
                      </div>
                    ) : (
                      <div className={`status-badge-decided ${rec.status === 'implemented' ? 'decided-implemented' : 'decided-ignored'}`}>
                        {rec.status === 'implemented' ? '✅ IMPLEMENTED BY FARMER' : '⚪ IGNORED / DISMISSED BY FARMER'}
                      </div>
                    )}
                  </div>
                ))}

                {/* Conversational Assistant Card */}
                <div className="ai-chat-card">
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-sky">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">Ask AgriSense AI</div>
                        <div className="card-caption-text">Cleveland County USDA Soil Expert</div>
                      </div>
                    </div>
                  </div>

                  <div className="chat-messages-container">
                    {chatMessages.map((msg, idx) => (
                      <div key={idx} className={`chat-bubble ${msg.sender === 'user' ? 'bubble-user' : 'bubble-ai'}`}>
                        {msg.text}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSendChatMessage} className="chat-input-bar">
                    <input
                      type="text"
                      className="chat-text-input"
                      placeholder="Ask about salinity, water quantity, or crops..."
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn" title="Send query to AI">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                      </svg>
                    </button>
                  </form>
                </div>
              </>
            )}

            {/* --------------------------------------------------------------
                TAB 4: DETAILED USDA PEDON HORIZONS (SOIL LAYERS)
                -------------------------------------------------------------- */}
            {activeTab === 'pedon' && (
              <>
                <div className="ios-card">
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-blue">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">USDA Pedon Horizons</div>
                        <div className="card-caption-text">{selectedSoilUnit.name} Layer Specifications</div>
                      </div>
                    </div>
                  </div>

                  <div className="horizon-list-group">
                    {selectedSoilUnit.horizons.map((h, i) => (
                      <div key={i} className="horizon-row-card">
                        <div className="horizon-name-pill">{h.name}</div>
                        <div className="horizon-info">
                          <span className="horizon-texture">{h.texture}</span>
                          <span className="horizon-depth">{h.depth} &bull; {h.color}</span>
                        </div>
                        <div className="horizon-chemistry">
                          <div>pH {h.ph}</div>
                          <div>OM: {h.om}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Konawa Reference Soil Profile */}
                <div className="ios-card">
                  <div className="card-title-text" style={{ fontSize: '14px' }}>Konawa Fine-Loamy Profile Reference</div>
                  <div style={{ fontSize: '12px', color: '#93c5fd' }}>
                    Classification: Fine-loamy, mixed, active, thermic Ultic Haplustalf. Bedrock deeper than 80 inches.
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#bae6fd', padding: '4px 8px', borderRadius: '6px' }}>Oklahoma pH Median: 6.2</span>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#bae6fd', padding: '4px 8px', borderRadius: '6px' }}>Nitrate-N: 8 lb/acre</span>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#bae6fd', padding: '4px 8px', borderRadius: '6px' }}>Phosphorus STP: 32</span>
                    <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.15)', color: '#bae6fd', padding: '4px 8px', borderRadius: '6px' }}>Potassium STK: 233</span>
                  </div>
                </div>
              </>
            )}

            {/* --------------------------------------------------------------
                TAB 5: FARM DECISION JOURNAL & COMPLIANCE LOG
                -------------------------------------------------------------- */}
            {activeTab === 'log' && (
              <>
                <div className="ios-card">
                  <div className="card-header-row">
                    <div className="card-title-group">
                      <div className="sf-icon-badge badge-cyan">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                        </svg>
                      </div>
                      <div>
                        <div className="card-title-text">Farmer Decision Journal</div>
                        <div className="card-caption-text">Implemented vs Ignored Actions</div>
                      </div>
                    </div>
                  </div>

                  {farmLogs.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '24px', color: '#93c5fd', fontSize: '13px' }}>
                      No actions recorded yet. Navigate to the <strong>AI Agent</strong> tab to implement or ignore recommendations.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {farmLogs.map(l => (
                        <div
                          key={l.id}
                          style={{
                            background: 'rgba(14, 30, 56, 0.5)',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            border: '1px solid rgba(56, 189, 248, 0.2)'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#93c5fd', marginBottom: '2px' }}>
                            <span>{l.timestamp} &bull; {l.date}</span>
                            <span style={{ fontWeight: 700, color: l.actionTaken === 'IMPLEMENTED' ? '#38bdf8' : '#94a3b8' }}>
                              {l.actionTaken}
                            </span>
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '13px', color: '#fff' }}>{l.title}</div>
                          <div style={{ fontSize: '11px', color: '#67e8f9', marginTop: '2px' }}>
                            {l.waterVolumeGallons > 0 ? `Water Applied: ${l.waterVolumeGallons.toLocaleString()} gallons` : 'No water application'} &bull; {l.feedback}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

          </div>

          {/* ==================== FROSTED GLASS TAB BAR ==================== */}
          <div className="ios-tab-bar">
            {/* Tab 1: Map & Soil */}
            <div
              className={`tab-item ${activeTab === 'map' ? 'active' : ''}`}
              onClick={() => setActiveTab('map')}
            >
              <svg className="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
              <span>Map &amp; Soil</span>
            </div>

            {/* Tab 2: Water Volume */}
            <div
              className={`tab-item ${activeTab === 'water' ? 'active' : ''}`}
              onClick={() => setActiveTab('water')}
            >
              <svg className="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
              </svg>
              <span>Water Vol.</span>
            </div>

            {/* Tab 3: AI Agronomist */}
            <div
              className={`tab-item ${activeTab === 'ai' ? 'active' : ''}`}
              onClick={() => setActiveTab('ai')}
            >
              <svg className="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4"/><path d="M12 18v4"/><path d="M4.93 4.93l2.83 2.83"/><path d="M16.24 16.24l2.83 2.83"/><path d="M2 12h4"/><path d="M18 12h4"/>
              </svg>
              <span>AI Agent</span>
            </div>

            {/* Tab 4: Pedon Horizons */}
            <div
              className={`tab-item ${activeTab === 'pedon' ? 'active' : ''}`}
              onClick={() => setActiveTab('pedon')}
            >
              <svg className="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect width="18" height="18" x="3" y="3" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/>
              </svg>
              <span>Pedon</span>
            </div>

            {/* Tab 5: Decision Journal */}
            <div
              className={`tab-item ${activeTab === 'log' ? 'active' : ''}`}
              onClick={() => setActiveTab('log')}
            >
              <svg className="tab-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
              </svg>
              <span>Journal</span>
            </div>
          </div>

          {/* iOS Home Indicator Capsule */}
          <div className="ios-home-indicator"></div>

        </div>
      </div>
    </div>
  );
}

// Mount the React Application into the DOM
const rootEl = document.getElementById('react-farm-flow-root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<FarmFlowReactApp />);
}
