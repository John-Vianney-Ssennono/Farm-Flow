# 🌾 Farm-Flow — Water Quantity Optimization & USDA Soil Science
> **Cross-Platform React Application in Apple Swift (iOS HIG) Design**  
> *Theme: Hydrology Blue Spectrum (Deep Abyssal Blue, Oceanic Navy, Cobalt, Sky Blue, and Aquamarine)*  
> *Sample Study Area: Cleveland County, Oklahoma, USA (Norman, Lake Thunderbird, Noble, Moore, Lexington)*

---

## 🌊 Hydrology Blue Theme & Focus on Water Optimization

The entire design system of **Farm-Flow** is styled in a curated spectrum of blues specifically chosen to symbolize water states, irrigation dynamics, and hydraulic optimization:

* **Deep Abyssal Blue (`#030712`) & Oceanic Navy (`#081120`)**: Foundations representing deep groundwater reserves (e.g., the Garber-Wellington Aquifer).
* **Cobalt Royal Blue (`#1d4ed8` / `#2563eb`)**: Primary UI surfaces, active Apple segmented controls, and user chat bubbles.
* **Flowing Aquamarine Cyan (`#06b6d4` / `#22d3ee`)**: Real-time water telemetry, active irrigation valves, and optimal moisture readouts.
* **Sky Cerulean (`#38bdf8`)**: Water depth progress bars, linear acre-inch indicators, and interactive map pins.
* **Glacier Mist (`#f0f9ff` / `#bae6fd`)**: High-contrast typography and horizon layer markers.

---

## 📖 Code Documentation & Line-by-Line Commenting

Every source file in the application is thoroughly documented with detailed line-by-line explanatory comments to ensure complete clarity for engineers, agronomists, and students:

1. [`js/cleveland-usda-data.js`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/js/cleveland-usda-data.js):
   * Explains each property of the 1987 USDA Soil Survey (sand/silt/clay fractions, bulk density, permeability rating, root zone depth).
   * Fully annotates the mathematical derivation of **Total Available Water (TAW)**, **Readily Available Water (RAW)**, **Osmotic Salinity Depression**, and the **USDA Salt Leaching Requirement ($LR$)**.
2. [`js/ai-agent-engine.js`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/js/ai-agent-engine.js):
   * Documents the step-by-step reasoning logic of **AgriSense AI**.
   * Details how recommendations are generated, categorized, and how farmer agency is preserved through **"Implement"** vs **"Ignore"** state mutations.
3. [`js/FarmFlowReactApp.jsx`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/js/FarmFlowReactApp.jsx):
   * Annotates every React hook (`useState`, `useEffect`, `useRef`), Leaflet satellite GIS integration, geocoding search handlers, and Cupertino UI components.
4. [`css/ios-swift.css`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/css/ios-swift.css):
   * Explains every CSS custom property, frosted glass blur, Dynamic Island animation, and Apple HIG layout decision.
5. [`index.html`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/index.html) & [`automation-builder.html`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/automation-builder.html):
   * Documents every metadata tag, script import, navigation link, and modal container.

---

## 🗺️ Cleveland County, OK Soil Taxonomy Matrix

| Map Unit Name | County Share | Primary USDA Texture | Infiltration Rate ($I_{\text{max}}$) | Available Water Capacity | Runoff Risk | Soil Behavior |
|---|---|---|---|---|---|---|
| **Stephenville-Harrah-Newalla** | **40%** | **Fine Sandy Loam** over Sandy Clay Loam | $1.15\text{ in/hr}$ (Moderate) | $0.15\text{ in/in}$ | Low to Moderate | Extensively farmed upland sandy loam over sandstone; optimal for specialty crops & winter wheat. |
| **Renfrow-Grainola-Grant** | **15%** | **Dense Clay & Silty Clay Loam** | $0.18\text{ in/hr}$ (**Very Slow**) | $0.18\text{ in/in}$ | **Extreme Runoff** | Heavy clayey subsoils that swell when wet; requires micro-pulse watering to avoid surface ponding. |
| **Norge-Teller-Vanoss** | **14%** | **Deep Loam & Silt Loam** | $0.75\text{ in/hr}$ (Moderate) | $0.20\text{ in/in}$ | Moderate | Prime agricultural river terraces; high water storage and deep root penetration. |
| **Doolin-Bethany-Urban** | **8%** | **Silt Loam over Claypan** | $0.15\text{ in/hr}$ (Very Slow) | $0.16\text{ in/in}$ | High | Flat uplands with tight claypan restricting vertical percolation; prone to spring waterlogging. |
| **Stephenville-Littleaxe-Darsil** | **7%** | **Coarse Sandy Loam** | $1.85\text{ in/hr}$ (**Rapid**) | $0.10\text{ in/in}$ | Low (Deep Leaching) | Excessively drained shallow sand over fractured sandstone around Lake Thunderbird; needs light frequent watering. |
| **Port-Weswood Bottomland** | **5%** | **Silt Loam & Loamy Alluvium** | $0.88\text{ in/hr}$ (Moderate) | $0.20\text{ in/in}$ | Flooding Hazard | Fertile Canadian River floodplain; deep profile with high moisture retention. |

---

## 💧 Scientific Hydrology & Salinity Physics

### 1. Plant Available Water Capacity
$$\text{Total Available Water (TAW, inches)} = \text{AWC} \times \text{Root Depth (inches)}$$
$$\text{Current Stored Water (inches)} = \left(\frac{\text{Current VWC} - \text{Permanent Wilting Point}}{100}\right) \times \text{Root Depth}$$
$$\text{Water Volume (Gallons)} = \text{Depth (inches)} \times 27,154 \times \text{Field Acres}$$

### 2. Osmotic Salinity Impact
When soil salinity ($EC$) exceeds the sensitivity threshold ($EC_{\text{thresh}} = 2.0\text{ mS/cm}$ for fine sandy loam, $1.8\text{ mS/cm}$ for clay):
$$\text{Effective Water} = \text{Physical Water} \times \left(1 - \min(0.60, [EC - EC_{\text{thresh}}] \times 0.15)\right)$$
*Even when the soil contains moisture physically, elevated salinity locks water away from crop roots.*

### 3. USDA Salt Leaching Requirement ($LR$)
$$LR = \frac{EC_w}{5 \cdot EC_e - EC_w}$$
Farm-Flow computes the exact additional gallonage required to flush toxic salts below the active root zone.

---

## 🤖 The AgriSense AI Agent Workflow

1. **Continuous Evaluation**: Whenever the farmer moves the map pin, types a parcel address, or adjusts salinity/moisture sliders, the AI recalculates recommendations.
2. **Prioritization**: Categorized into **CRITICAL** (e.g. salinity $> 2.4\text{ mS/cm}$ or severe moisture deficit near wilting point), **HIGH** (e.g. clay runoff risk), and **ADVISORY**.
3. **Transparent Scientific Rationale**: Cites USDA NRCS pedon data, horizon depths, and FAO-56 irrigation guidelines so farmers understand the *why* behind every suggestion.
4. **Action Agency**:
   - 🟢 **Implement**: Triggers the simulated action and appends to the permanent farm log.
   - ⚪ **Ignore**: Dismisses the recommendation with an optional reason.
5. **Interactive Assistant**: Farmers can chat directly with the AI using natural language to clarify advice.

---

## 📱 How to Run & Explore

### Option 1: Mobile React Swift App (Primary Interface)
Open [`index.html`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/index.html) in your browser:
* Explore the interactive **Google Satellite Map** with Cleveland County parcels.
* View the **Water Volume & Salinity** tab to experiment with live moisture and salinity sliders.
* Open the **AI Agent** tab to test the **Implement** vs **Ignore** buttons and conversational chat.
* Switch between **iPhone 16 Pro** view and **Cross-Platform / iPad** view via the top toggle.

### Option 2: Visual Node-RED / Zapier Automation Engine
Open [`automation-builder.html`](file:///Users/john.vianney.ssennono-1/Desktop/Nanoflow/automation-builder.html) in your browser:
* Visual drag-and-drop workflow canvas with animated SVG water flow wires.
* Virtual hardware rack with live WiseConn valves, VFD pumps, and OWRB water ledger.

---

## 📂 Source Code Layout

```
Nanoflow/
├── index.html                   # Primary React application (Apple Swift HIG design in Hydrology Blue)
├── automation-builder.html      # Visual Node-RED / Zapier workflow builder
├── README.md                    # Engineering, soil taxonomy & scientific documentation
├── css/
│   ├── ios-swift.css            # Apple iOS / Swift design system (Hydrology Blue spectrum, fully commented)
│   └── styles.css               # Visual workflow builder theme (Hydrology Blue, fully commented)
└── js/
    ├── FarmFlowReactApp.jsx     # Main React components (Map, Water, AI, Pedon, Log, fully commented)
    ├── cleveland-usda-data.js   # 1987 USDA Cleveland County soil database & math (fully commented)
    ├── ai-agent-engine.js       # AI Agronomist with Implement/Ignore engine & chat (fully commented)
    ├── farm-flow.bundle.js      # Zero-dependency bundle for workflow engine
    ├── hardware-simulator.js    # Virtual farm equipment state machine
    └── workflow-engine.js       # Node graph execution engine
```

---
*Developed for Smart Agriculture & Precision Water Quantity Management in Cleveland County, Oklahoma.*
