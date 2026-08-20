# 🚑 AEGIS - Smart Emergency Vehicle Green Corridor System
### Comprehensive User Guide & System Manual

> **Welcome to the AEGIS Emergency Traffic Command Center!**  
> This platform intelligently coordinates city traffic signals to create a continuous **Green Corridor** for emergency vehicles (ambulances, rescue trucks), ensuring they reach hospitals in the fastest and safest time possible without getting stuck at red lights or traffic jams.

---

## 📌 Table of Contents
1. [What is AEGIS? (Overview)](#-what-is-aegis-overview)
2. [What is a "Green Corridor"?](#-what-is-a-green-corridor)
3. [How the System Works (Core Technology)](#-how-the-system-works-core-technology)
4. [Step-by-Step Guide: How to Use the Website](#-step-by-step-guide-how-to-use-the-website)
   - [Method 1: Run the Automated 12-Step Demo Simulation](#method-1-run-the-automated-12-step-demo-simulation)
   - [Method 2: Manually Dispatch an Ambulance](#method-2-manually-dispatch-an-ambulance)
   - [Method 3: Simulate a Road Hazard & Test Dynamic Rerouting](#method-3-simulate-a-road-hazard--test-dynamic-rerouting)
5. [Understanding the Dashboard (Interface Tour)](#-understanding-the-dashboard-interface-tour)
   - [1. Top Header & Navigation](#1-top-header--navigation)
   - [2. Top Statistics Bar](#2-top-statistics-bar)
   - [3. Interactive Tactical City Map](#3-interactive-tactical-city-map)
   - [4. Active Emergency Telemetry Panel](#4-active-emergency-telemetry-panel)
   - [5. Before vs. After Impact Panel](#5-before-vs-after-impact-panel)
   - [6. Active Corridor Traffic Signals List](#6-active-corridor-traffic-signals-list)
   - [7. Road Hazard & Blockage Admin](#7-road-hazard--blockage-admin)
6. [Key Metrics & Performance Benefits](#-key-metrics--performance-benefits)
7. [Installation & Setup Guide (For Developers)](#-installation--setup-guide-for-developers)
8. [Frequently Asked Questions (FAQ)](#-frequently-asked-questions-faq)

---

## 🌟 What is AEGIS? (Overview)

When a critical medical emergency occurs—such as a heart attack, severe trauma, or stroke—every second counts. Traditional ambulances waste **30% to 50% of travel time** waiting at red lights or maneuvering through heavy gridlock.

**AEGIS Green Corridor OS** is an intelligent command center that:
1. **Finds the Best Hospital**: Recommends the optimal hospital based on travel time, ICU bed availability, and medical specialty.
2. **Calculates the Fastest Safe Route**: Uses graph pathfinding algorithms (A*) to pick roads with the lowest traffic density.
3. **Locks Traffic Signals GREEN**: Automatically turns upcoming traffic signals green as the ambulance approaches, clearing cross-traffic in advance.
4. **Reroutes Around Hazards Instantly**: If an accident or flood suddenly blocks the road, AEGIS immediately detects it and calculates an alternate route without stopping the vehicle.

---

## 🟢 What is a "Green Corridor"?

A **Green Corridor** is a dynamically cleared traffic lane where all traffic signals along an emergency vehicle's route are synchronized to stay **GREEN**. 

Instead of an ambulance stopping at 5 to 7 red lights during a journey:
- Signals 1 to 3 intersections ahead turn **GREEN** automatically.
- Crossing roads receive a **RED** light to prevent accidents.
- As soon as the ambulance clears an intersection, the signal returns to standard traffic rotation.

---

## ⚡ How the System Works (Core Technology)

```text
Emergency Request Received
            ↓
AI Ranks Hospitals (Distance + ICU Beds + Emergency Type)
            ↓
City Graph Analyzed (Intersections = Nodes, Roads = Edges)
            ↓
A* Algorithm Calculates Fastest Safe Route
            ↓
Green Corridor Activated (Signals Locked GREEN)
            ↓
Ambulance Telemetry Tracked Live (60 FPS)
            ↓
[Dynamic Hazard Detected?] ─── YES ───► Recalculate Detour Route via A*
            ↓ NO
Ambulance Clears Signals & Reaches Hospital Safely
            ↓
Celebration & Performance Summary (Time Saved Calculated)
```

---

## 🎯 Step-by-Step Guide: How to Use the Website

### Method 1: Run the Automated 12-Step Demo Simulation
*(Best for first-time visitors and presentations)*

1. Open the app in your browser (`http://localhost:3002/`).
2. Look at the top control bar and click the green button: **`▶ START EMERGENCY SIMULATION`**.
3. **Watch the live scenario unfold**:
   - **Step 1-3**: AMB-104 is dispatched from *MG Circle* for a critical Cardiac Emergency.
   - **Step 4**: The system calculates the fastest route to *City General Hospital* and locks signals into Green Corridor mode.
   - **Step 5-6**: You will see **AMB-104 visibly moving** along the glowing green path on the map.
   - **Step 7-10**: Mid-journey, an accident is injected onto *City Center Corridor*. The system immediately detects the blockage, recalculates a detour route, and shifts the green corridor to the new path!
   - **Step 11-12**: AMB-104 reaches the hospital safely. Confetti 🎉 will fire on screen, displaying the final time saved summary (e.g., **6.3 minutes faster**).

---

### Method 2: Manually Dispatch an Ambulance

1. Click the **`Dispatch Unit`** button in the top right header (or inside the Active Emergency panel).
2. A pop-up window will appear:
   - **Emergency Category**: Select *Cardiac Emergency*, *Severe Trauma*, *Acute Stroke*, etc.
   - **Patient Severity**: Choose *CRITICAL*, *HIGH*, *MEDIUM*, or *LOW*.
   - **Vehicle Identifier**: Type a vehicle ID (e.g., `AMB-999`).
   - **Pickup Location**: Select an intersection on the city map.
   - **Destination Hospital**: Review the AI-ranked hospitals (ranked by ICU beds, distance, and ETA) and click your preferred hospital.
3. Click **`CONFIRM DISPATCH & LOCK GREEN CORRIDOR`**.
4. The system instantly plots the new path, activates signal locking, and starts vehicle tracking on the map.

---

### Method 3: Simulate a Road Hazard & Test Dynamic Rerouting

To see how the system handles sudden road blockages:
1. While an ambulance is moving on the map, click the red button: **`⚡ SIMULATE SUDDEN ACCIDENT ON AMBULANCE ROUTE`** (or use the *Road Hazard Admin* panel on the right).
2. The road segment will turn red with a hazard warning icon (⚠️).
3. **Watch the instant reroute**: The system will log a warning notification, recalculate an alternate clear corridor around the accident using A*, and update the green corridor signal path seamlessly!

---

## 🖥️ Understanding the Dashboard (Interface Tour)

```text
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                1. TOP HEADER                                     │
├──────────────────────────────────────────────────────────────────────────────────┤
│                         2. TOP STATISTICS COUNTER BAR                            │
├──────────────────────────────────────────┬───────────────────────────────────────┤
│                                          │  4. ACTIVE EMERGENCY TELEMETRY        │
│                                          ├───────────────────────────────────────┤
│    3. INTERACTIVE TACTICAL CITY MAP      │  5. BEFORE VS. AFTER IMPACT CARD      │
│       (Nodes, Roads, Signals, Vehicles)  ├───────────────────────────────────────┤
│                                          │  6. TRAFFIC SIGNAL SYNC LIST          │
│                                          ├───────────────────────────────────────┤
│                                          │  7. ROAD HAZARD & BLOCKAGE ADMIN      │
└──────────────────────────────────────────┴───────────────────────────────────────┘
```

### 1. Top Header & Navigation
- **AEGIS Title & Status**: Shows active corridor count and clock.
- **View Tabs**:
  - **Command Center**: Main live monitoring dashboard.
  - **Road Network & Signals**: Grid map and signal status breakdown.
  - **Analytics & Performance**: Interactive charts and response metrics.
- **Action Buttons**: `▶ DEMO SIMULATION`, `Test Rerouting Failure`, and `Dispatch Unit`.

### 2. Top Statistics Bar
Displays real-time system metrics:
- **Active Emergencies**: Count of critical cases currently en route.
- **Active Ambulances**: Number of ambulances operating.
- **Green Corridors**: Active priority corridor count.
- **Average ETA**: Estimated time of arrival to hospital.
- **Traffic Congestion**: City-wide traffic level (`LOW`, `MODERATE`, `HIGH`, `SEVERE`).
- **Road Hazards**: Active road blockages.

### 3. Interactive Tactical City Map
- **Intersections (Nodes)**: Marked with circle indicators showing current signal light state (🟢 GREEN, 🟡 YELLOW, 🔴 RED).
- **Road Segments (Edges)**: Color-coded by traffic density.
- **Green Corridor Overlay**: Vibrant glowing neon green line with animated arrows showing the active priority path.
- **Ambulance Marker**: Moving vehicle marker displaying vehicle ID (e.g. `AMB-104`), flashing siren ring, and live speed badge (`72 km/h`).
- **Hospitals**: Blue hospital pins with ICU bed counters.
- **Hazards**: Hazard icons (⚠️) on blocked roads. Clicking any road allows you to block/unblock it.

### 4. Active Emergency Telemetry Panel
Located on the right side of the screen, showing live data for the selected ambulance:
- **Vehicle ID & Emergency Type**: Case details (e.g. AMB-104 • Cardiac Emergency).
- **Patient Priority**: Color-coded severity badge (CRITICAL / HIGH / MEDIUM / LOW).
- **Current Position & Target Hospital**: Live location node and destination.
- **Optimized ETA Box**: Live countdown timer showing ETA and total minutes saved.
- **Route Progress Bar**: Percentage completion of the journey.
- **Speed Dial & Signals Cleared**: Speed in km/h and count of signals cleared without stopping.

### 5. Before vs. After Impact Panel
Provides a direct side-by-side benchmark comparing standard uncoordinated traffic vs. the AEGIS Green Corridor:
- **Without Corridor**: Shows estimated delays, red light wait times (~45s per red signal), and traffic penalties.
- **With AEGIS Corridor**: Shows 0 red light delays and 0 traffic penalty.
- **Total Time Saved**: Highlights total minutes saved and arrival speed improvement (e.g., **6.3 min saved / 43% faster**).

### 6. Active Corridor Traffic Signals List
Lists every traffic signal along the active ambulance route, showing:
- Signal ID & Intersection name
- Current state (🟢 GREEN / 🟡 YELLOW / 🔴 RED)
- Status (*Passed*, *Approaching Now*, *Queued Ahead*)
- Green Corridor Priority Lock timer

### 7. Road Hazard & Blockage Admin
Allows control room operators to:
- Select any road segment from a dropdown menu.
- Inject hazards (*Vehicle Accident*, *Road Closure*, *Flooding*, *Construction*).
- Toggle road blocks on/off to test live rerouting algorithms.

---

## 📊 Key Metrics & Performance Benefits

| Metric | Without Green Corridor | With AEGIS Green Corridor | System Benefit |
| :--- | :--- | :--- | :--- |
| **Average ETA** | 14.5 Minutes | 8.2 Minutes | **6.3 Mins Saved (43% Faster)** |
| **Red Light Halts** | 5 to 7 Red Lights | 0 Red Lights | **100% Signal Clearance** |
| **Traffic Delays** | +6.0 Minutes | 0.0 Minutes | **Priority Lane Clearing** |
| **Reroute Time** | Manual / Delayed | Instant (< 50ms) | **Automatic Hazard Avoidance** |

---

## 💻 Installation & Setup Guide (For Developers)

### System Requirements
- Node.js (v18 or higher)
- npm or yarn

### Quick Start Commands

```bash
# 1. Clone the repository
git clone https://github.com/asadulla-cp/smart-emergency-green-corridor.git

# 2. Navigate into project directory
cd smart-emergency-green-corridor

# 3. Install dependencies
npm install

# 4. Launch development server
npm run dev

# 5. Open browser at http://localhost:3002/
```

---

## ❓ Frequently Asked Questions (FAQ)

#### Q1: Does the system turn all city lights green at the same time?
**No.** Turning all lights green permanently would cause city-wide traffic chaos. AEGIS uses **coordinated window locking**—it only turns signals green 1 to 3 intersections ahead of the approaching ambulance. As soon as the ambulance passes an intersection, that signal automatically returns to standard traffic rotation.

#### Q2: What happens if a road is blocked by an accident during the trip?
The system performs continuous obstruction monitoring. If an edge becomes blocked ($cost = \infty$), the A* routing engine instantly calculates an alternate clear route, updates the green corridor signal locks, and guides the ambulance via the detour without requiring the driver to stop.

#### Q3: How does the system choose which hospital to send the patient to?
The **Hospital Recommendation Engine** ranks available hospitals based on:
1. Distance and travel ETA under Green Corridor conditions.
2. Available ICU beds and total bed capacity.
3. Emergency department load status (`OPEN`, `BUSY`, `CRITICAL_ONLY`).
4. Medical specialty match (e.g., matching a Cardiac emergency to a hospital with a dedicated Cardiac Care Unit).

---

## 📜 License & Credits

Distributed under the MIT License. Built for emergency traffic optimization and life-saving transit research.
