# 🌾 Farm-Flow — Water Quantity Optimization & USDA Soil Science
> **Intelligent Agricultural Hydrology, Real-Time Soil Physics & AI Irrigation Optimization**  
> 🌐 **Live Web Application**: [https://john-vianney-ssennono.github.io/Farm-Flow/](https://john-vianney-ssennono.github.io/Farm-Flow/)  
> ⚡ **Visual Automation Engine**: [https://john-vianney-ssennono.github.io/Farm-Flow/automation-builder.html](https://john-vianney-ssennono.github.io/Farm-Flow/automation-builder.html)

---

## 📋 Executive Overview

**Farm-Flow** is an intelligent agricultural water optimization platform engineered to bridge the gap between soil physics, atmospheric telemetry, and irrigation hardware.

Agriculture accounts for over **70% of global freshwater withdrawals**. In semi-arid agricultural regions and intensively farmed basins, conventional irrigation methods rely heavily on static calendar timers or manual intuition. This frequently results in:
* **Over-irrigation and leaching**, wasting millions of gallons of groundwater and washing expensive fertilizers below the root zone.
* **Surface runoff and soil erosion** on dense clayey soils where application rates exceed saturated hydraulic conductivity.
* **Secondary soil salinization**, where dissolved salts accumulate in the root zone, creating osmotic stress that prevents crops from absorbing water even when the soil appears moist.
* **Aquifer depletion and energy waste**, inflating utility costs for high-horsepower deep-well turbine pumps.

**Farm-Flow** addresses these challenges by integrating **USDA Natural Resources Conservation Service (NRCS) Soil Survey taxonomy**, live atmospheric weather telemetry, and the **AgriSense AI reasoning engine**. The system calculates real-time soil moisture deficits, enforces infiltration thresholds, computes osmotic salinity leaching flushes, and generates actionable, mathematically validated irrigation schedules for farmers.

---

## 🎯 Key Capabilities & System Features

### 📍 1. Dynamic Location-Aware Agricultural Telemetry
* **Automatic GPS & Global Geocoding**: Automatically detects the farm parcel's geographic location or allows users to search any city, county, or raw coordinate pair (`lat, lng`) worldwide.
* **Instantaneous Data Synchronization**: Selecting a parcel instantly aligns GIS satellite imagery, USDA soil series profiles, live temperature, relative humidity, precipitation forecasts, and Penman-Monteith reference evapotranspiration ($ET_0$).
* **Synchronized Local Civil Time**: Automatically calculates standard civil time for any parcel worldwide, ensuring irrigation schedules match local solar and diurnal evaporation windows.
* **Quick Agricultural Hub Presets**: One-tap access to benchmark farming regions, including Norman Uplands (OK), Salinas Valley (CA), Des Moines Corn Belt (IA), Yakima Valley (WA), Lubbock High Plains (TX), Fresno Central Valley (CA), and Central Florida Citrus (FL).

### 🔬 2. High-Resolution USDA Soil Taxonomy & Physical Mechanics
* **Horizon-by-Horizon Soil Profiles**: Analyzes USDA soil survey horizons (depth, sand/silt/clay fractions, bulk density, permeability, and available water capacity).
* **Infiltration Rate Enforcement**: Identifies maximum hydraulic conductivity ($I_{\text{max}}$) to prevent surface ponding and runoff on tight claypans and clayey subsoils.
* **Volumetric Water Content (VWC) Monitoring**: Tracks real-time moisture between **Permanent Wilting Point (PWP)** and **Field Capacity (FC)**, alerting growers before crops enter moisture-stress induced stomatal closure.

### 🧪 3. Osmotic Salinity Physics & Desalination Leaching
* **Osmotic Water Depression**: Implements soil chemistry formulas showing that when electrical conductivity ($EC$) exceeds crop sensitivity thresholds, effective plant-available water drops significantly despite physical moisture presence.
* **USDA Salt Leaching Requirement ($LR$)**: Uses USDA Agriculture Handbook 60 equations to calculate the exact volume of freshwater required to flush toxic root-zone salts beyond active horizons.

### 🤖 4. AgriSense AI Agronomic Advisory & Calculation Engine
* **Quantitative Calculation Tools**: Farmers can submit natural-language inquiries to calculate:
  * **Gallons to Field Capacity**: Converts volumetric moisture deficits ($\Delta VWC$) into total water volume required across field acreage.
  * **Pump Run-Times**: Computes exact duration (hours and minutes) to pump required gallonage given well pump flow rate (GPM).
  * **Rainfall Capture & Cost Savings**: Calculates groundwater gallons conserved and electricity tariff dollars saved from upcoming storms.
  * **Total Available Water (TAW)**: Computes root-zone reservoir storage volume.
  * **Crop Evapotranspiration ($ET_c$)**: Calculates daily water loss based on atmospheric demand and crop coefficient ($K_c$).
* **Prioritized Action Plans**: Classifies recommendations into **CRITICAL** (e.g., severe moisture deficit or root-limiting salinity), **HIGH** (e.g., clay runoff mitigation), and **ADVISORY**.
* **Farmer Agency**: Every recommendation includes a 1-click **Implement** action (logging to the farm journal and triggering virtual hardware) and an **Ignore** action with structured operational reasons.

### 📱 5. Fluid Responsive Architecture
* **Seamless Cross-Device Scaling**: Automatically adapts between mobile phones (full-width edge-to-edge layout with safe-area navigation) and tablets/desktops (centered workstation layout with persistent telemetry) without manual mode toggling.
* **Visual Node-RED Automation Engine**: Companion low-code drag-and-drop workflow builder simulating automated field hardware (solenoid valves, VFD well pumps, moisture probes, and OWRB water permit metering).

---

## 🗺️ Cleveland County, OK Soil Taxonomy Matrix

The benchmark study area models Cleveland County, Oklahoma, cross-referencing published USDA NRCS Soil Survey data:

| Map Unit Name | County Share | Primary USDA Texture | Infiltration Rate ($I_{\text{max}}$) | Available Water Capacity | Runoff Risk | Soil Behavior & Management |
|---|---|---|---|---|---|---|
| **Stephenville-Harrah-Newalla** | **40%** | **Fine Sandy Loam** over Sandy Clay Loam | $1.15\text{ in/hr}$ (Moderate) | $0.15\text{ in/in}$ | Low to Moderate | Extensively farmed upland sandy loam over sandstone; optimal for specialty crops and winter wheat. |
| **Renfrow-Grainola-Grant** | **15%** | **Dense Clay & Silty Clay Loam** | $0.18\text{ in/hr}$ (**Very Slow**) | $0.18\text{ in/in}$ | **Extreme Runoff** | Heavy clayey subsoils that swell when wet; requires micro-pulse cycle-and-soak watering to avoid surface ponding. |
| **Norge-Teller-Vanoss** | **14%** | **Deep Loam & Silt Loam** | $0.75\text{ in/hr}$ (Moderate) | $0.20\text{ in/in}$ | Moderate | Prime agricultural river terraces; high water storage and deep root penetration. |
| **Doolin-Bethany-Urban** | **8%** | **Silt Loam over Claypan** | $0.15\text{ in/hr}$ (Very Slow) | $0.16\text{ in/in}$ | High | Flat uplands with tight claypan restricting vertical percolation; prone to seasonal waterlogging. |
| **Stephenville-Littleaxe-Darsil** | **7%** | **Coarse Sandy Loam** | $1.85\text{ in/hr}$ (**Rapid**) | $0.10\text{ in/in}$ | Low (Deep Leaching) | Excessively drained shallow sand over fractured sandstone; requires light, frequent micro-dosing. |
| **Port-Weswood Bottomland** | **5%** | **Silt Loam & Loamy Alluvium** | $0.88\text{ in/hr}$ (Moderate) | $0.20\text{ in/in}$ | Flooding Hazard | Fertile Canadian River floodplain; deep profile with high moisture retention. |

---

## 💧 Scientific Hydrology & Salinity Physics

### 1. Plant Available Water Capacity
$$\text{Total Available Water (TAW, inches)} = \text{AWC} \times \text{Root Zone Depth (inches)}$$

$$\text{Current Stored Water (inches)} = \left(\frac{\text{Current VWC} - \text{Permanent Wilting Point}}{100}\right) \times \text{Root Zone Depth}$$

$$\text{Water Volume (Gallons)} = \text{Depth (inches)} \times 27,154 \times \text{Field Acres}$$

### 2. Osmotic Salinity Depression
When soil electrical conductivity ($EC$) exceeds the crop sensitivity threshold ($EC_{\text{thresh}} = 2.0\text{ mS/cm}$ for fine sandy loam, $1.8\text{ mS/cm}$ for clay):

$$\text{Effective Available Water} = \text{Physical Water} \times \left(1 - \min\left(0.60, [EC - EC_{\text{thresh}}] \times 0.15\right)\right)$$

*Elevated salt concentrations increase soil solution osmotic pressure, preventing root osmotic uptake even in wet soils.*

### 3. USDA Salt Leaching Requirement ($LR$)
Derived from USDA Agriculture Handbook 60:

$$LR = \frac{EC_w}{5 \cdot EC_e - EC_w}$$

Where:
* $EC_w$ = Electrical conductivity of irrigation water (mS/cm).
* $EC_e$ = Electrical conductivity of saturation extract tolerated by the crop.
* $LR$ = Fraction of applied water that must pass through the root zone to control salinity.

$$\text{Leaching Flush Volume (Gallons)} = LR \times \text{Irrigation Depth} \times 27,154 \times \text{Acres}$$

---

## 🛠️ System Architecture & Technology Stack

* **Frontend Client**: React 18, Leaflet GIS Satellite Mapping, responsive CSS layout.
* **AI & Calculation Engine**: In-browser AgriSense reasoning engine evaluating NRCS soil taxonomy and FAO-56 irrigation models.
* **Backend REST Server**: High-performance Node.js REST API providing geocoding, meteorological ingestion, telemetry synthesis, and decision journal persistence.
* **Offline Resilience**: Built-in fallback database containing 100+ global agricultural regions and procedural coordinate reverse geocoders.

---

## 🚀 Live Access & Quick Start

### 🌐 Direct Browser Access (No Setup Required)
Access the live deployment on any mobile or desktop web browser:
* **Farm-Flow Application**: [https://john-vianney-ssennono.github.io/Farm-Flow/](https://john-vianney-ssennono.github.io/Farm-Flow/)
* **Visual Automation Engine**: [https://john-vianney-ssennono.github.io/Farm-Flow/automation-builder.html](https://john-vianney-ssennono.github.io/Farm-Flow/automation-builder.html)

### 💻 Local Development Setup (Optional)
1. Clone the repository and navigate to the project directory:
   ```bash
   git clone git@github.com:John-Vianney-Ssennono/Farm-Flow.git
   cd Farm-Flow
   ```
2. Start the backend server:
   ```bash
   npm start
   # Or directly with Node:
   node server.js
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 📁 Repository Structure

```
Farm-Flow/
├── index.html                   # Primary React application entrypoint
├── automation-builder.html      # Visual Node-RED workflow engine
├── server.js                    # Node.js REST API and telemetry server
├── build-index.js               # Production inline bundler script
├── README.md                    # Project documentation & scientific overview
├── css/
│   ├── ios-swift.css            # Responsive design system & component styles
│   └── styles.css               # Visual workflow builder layout
├── js/
│   ├── FarmFlowReactApp.jsx     # Main React application components
│   ├── cleveland-usda-data.js   # USDA soil taxonomy database & geocoder
│   ├── ai-agent-engine.js       # AgriSense AI & agronomic calculation engine
│   ├── hardware-simulator.js    # Virtual farm equipment state machine
│   └── workflow-engine.js       # Visual workflow graph execution engine
└── data/
    └── journal.json             # Persisted farm decision log
```

---
*Farm-Flow — Advanced Hydrology, Soil Science & Precision Irrigation Optimization.*
