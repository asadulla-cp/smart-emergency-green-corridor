# 🚑 AEGIS - Smart Emergency Vehicle Green Corridor System
### Comprehensive Click-by-Click User Manual & Operational Guide

> **Welcome to the AEGIS Command Center User Manual!**  
> This guide explains **every single button, form field, toggle, tab, and visual element** on the website so anyone—whether a first-time user, evaluator, dispatcher, or traffic controller—can operate the application with 100% confidence.

---

## 📌 Quick Start (Accessing the App)

1. Open your web browser and go to: **`http://localhost:3002/`**
2. You will immediately see the dark tactical **Emergency Traffic Command Center** dashboard.

---

## 🗺️ Interface Map: What You See On Screen

```text
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│ [1] TOP NAVBAR: System Clock • Navigation Tabs • Action Buttons (Demo, Dispatch, Reroute)│
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [2] TOP METRICS BAR: Active Emergencies • Ambulances • Corridors • Avg ETA • Traffic • Hazards│
├──────────────────────────────────────────────────────────────────────────────────────────┤
│ [3] DEMO CONTROLLER BAR: Play/Pause • Reset • Workflow Step Rationale • Progress Bar     │
├───────────────────────────────────────────┬──────────────────────────────────────────────┤
│                                           │ [5] ACTIVE EMERGENCY TELEMETRY PANEL        │
│                                           │     (Speed, Position, ETA Countdown)         │
│                                           ├──────────────────────────────────────────────┤
│ [4] INTERACTIVE TACTICAL CITY MAP         │ [6] BEFORE VS. AFTER IMPACT CARD             │
│     - 14 Intersections (Signal Nodes)     │     (Time Saved Benchmark: 6.3 Mins Saved)   │
│     - 21 Road Segments (Traffic Color)    ├──────────────────────────────────────────────┤
│     - Neon Green Corridor Glow            │ [7] ACTIVE CORRIDOR TRAFFIC SIGNALS LIST     │
│     - Moving Ambulance Sirens             │     (Real-Time Signal Lock States)           │
│     - Hospitals & Hazard Pins             ├──────────────────────────────────────────────┤
│                                           │ [8] ROAD HAZARD & BLOCKAGE ADMIN             │
│                                           │     (Inject Accidents & Test Detours)        │
└───────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

## 📖 Click-by-Click Operating Instructions

---

### SCENARIO 1: How to Run the Automated 12-Step Demo Simulation
*(Recommended for first-time visitors to see the full automated workflow)*

#### Step 1: Click the Green Play Button
At the top right of the screen (or in the Demo Controller bar), click:  
👉 **`▶ DEMO SIMULATION`**

#### Step 2: Watch the 12-Step Automated Workflow
The system will run through the complete emergency journey automatically:
- **Steps 1–3 (Dispatch & Hospital Selection)**: Emergency unit **AMB-104** is dispatched from *MG Circle* for a critical Cardiac Emergency. The hospital engine selects *City General Hospital* as the optimal target.
- **Step 4 (Path Calculation & Signal Lock)**: The A* pathfinding algorithm finds the clearest route (`N1 → N2 → N6 → N10`). Upcoming traffic signals automatically turn **GREEN** and show a `CORRIDOR GREEN` lock badge.
- **Steps 5–6 (Live Vehicle Motion)**: You will see **AMB-104 visibly driving** along the pulsing neon green corridor line on the map.
- **Steps 7–10 (Dynamic Hazard Rerouting)**: Mid-journey, an accident is injected onto *City Center Corridor*. The system immediately detects the blockage, recalculates a detour route (`N1 → N2 → N3 → N7 → N11 → N10`), and shifts the green corridor to the new path in real time!
- **Steps 11–12 (Arrival & Celebration)**: AMB-104 reaches the hospital safely. Confetti 🎉 will animate on screen, and the dashboard displays the total time saved (**6.3 minutes saved**).

---

### SCENARIO 2: How to Dispatch a Custom Ambulance Manually

#### Step 1: Open the Dispatch Modal
Click the **`Dispatch Unit`** button located in the top header navbar or inside the right-side panel.

#### Step 2: Fill Out the Emergency Dispatch Form
A pop-up modal will appear with the following options:

1. **Emergency Category**: Select the medical condition:
   - 🫀 *Cardiac Emergency* (Highest priority discount)
   - 🩹 *Severe Trauma*
   - 🧠 *Acute Stroke*
   - 🫁 *Respiratory Failure*
   - 👶 *Pediatric Crisis*
2. **Patient Severity**: Select priority level:
   - 🔴 **CRITICAL**: Level 1 highest speed & corridor preference.
   - 🟠 **HIGH**: Level 2 priority.
   - 🟡 **MEDIUM**: Level 3 priority.
   - 🟢 **LOW**: Level 4 standard priority.
3. **Vehicle Identifier**: Type any custom ambulance ID (e.g. `AMB-999`).
4. **Pickup Location Node**: Select where the emergency occurred from the dropdown menu (e.g. *N1 - MG Circle*, *N4 - East Plaza*, *N5 - West Park Junction*).
5. **Destination Hospital Selection**:
   - The system automatically ranks all city hospitals using an AI suitability score based on **Travel ETA**, **Available ICU Beds**, **Emergency Department Status**, and **Specialty Match**.
   - The top hospital will feature a **`BEST MATCH`** badge. Click any hospital in the list to select it.

#### Step 3: Confirm Dispatch
Click the big green button: **`CONFIRM DISPATCH & LOCK GREEN CORRIDOR`**.  
The modal closes, the A* algorithm plots the route, traffic signals along the path turn green, and your vehicle begins driving on the map!

---

### SCENARIO 3: How to Inject a Road Hazard & Test Dynamic Rerouting

You can test how the system reacts when a road gets blocked mid-journey using **3 different methods**:

#### Method A: The One-Click Hazard Button (Easiest)
Click the red button in the top header or right panel:  
👉 **`⚡ SIMULATE SUDDEN ACCIDENT ON AMBULANCE ROUTE`**

#### Method B: Interactive Map Clicking
Directly click **any road line** on the city map. That road segment will instantly toggle into a blocked state (turning red with a ⚠️ hazard icon).

#### Method C: Using the Road Hazard Admin Panel
1. Look at the bottom-right panel labeled **Road Hazard & Blockage Admin**.
2. **Target Road Segment**: Select any road from the dropdown menu (e.g., *City Center Corridor*, *MG Road Segment 1*).
3. **Incident Type**: Select the hazard type:
   - 🚗 *Major Vehicle Accident*
   - 🚧 *Emergency Road Closure*
   - 🌧️ *Flash Flooding*
   - 🏗️ *Road Construction*
   - 🚙 *Gridlock Jam*
4. Click **`Toggle Road Block`**.

#### What Happens When a Road is Blocked:
1. The road segment immediately turns **RED** on the map with a hazard icon (⚠️).
2. The system logs a warning alert: `Road blocked! Dynamic path recalculation initiated.`
3. The A* engine instantly recalculates an alternate clear route around the hazard.
4. The **neon green corridor line updates to the new path**.
5. Traffic signals on the new path turn **GREEN**, and the ambulance seamlessly detours without stopping!

---

### SCENARIO 4: How to Read & Inspect Live Dashboard Telemetry

#### 1. Active Emergency Panel (Right Column, Top)
- **Vehicle ID & Case**: Shows active unit (e.g. `AMB-104 • Cardiac Emergency`).
- **Severity Badge**: Displays `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.
- **Current Position & Hospital**: Shows live intersection name and destination.
- **Optimized ETA Box**: Displays live travel time countdown and time saved callout (e.g. `8.2 min | -6.3 min saved`).
- **Progress Bar**: Fills from 0% to 100% as the vehicle moves along the route.
- **Speed & Signal Counters**:
  - *Current Speed*: Live speed in km/h (e.g., `72 km/h`).
  - *Signals Cleared*: Count of green lights cleared without stopping.
  - *Reroute Count*: Number of dynamic reroutes triggered during the trip.

#### 2. Before vs. After Impact Panel (Left Column, Bottom)
Compares standard uncoordinated city traffic vs. AEGIS Green Corridor:
- **Left Box (Standard Uncoordinated Traffic)**:
  - Estimated travel time: `14.5 min`
  - Red signal light delays: `5 red signals (~225 seconds wasted)`
  - Traffic congestion delay: `+6.0 minutes`
  - Average vehicle speed: `28 km/h`
- **Right Box (AEGIS Green Corridor Active)**:
  - Estimated travel time: `8.2 min`
  - Red signal light delays: `0 signals (100% Cleared)`
  - Traffic congestion delay: `0.0 minutes`
  - Average vehicle speed: `68 km/h`
- **Bottom Banner**: Highlights total life-saving benefit: **`6.3 MINUTES FASTER (43% Reduction)`**.

#### 3. Active Corridor Traffic Signals List (Right Column, Middle)
Shows a live table of all traffic signals on the ambulance's path:
- **Circle Light**: Shows 🟢 GREEN, 🟡 YELLOW, or 🔴 RED.
- **Intersection Name**: e.g., *MG Circle*, *Central Square*, *Hospital Gate 1*.
- **Status Tag**: Displays whether the signal is *Passed*, *Approaching Now*, or *Queued Ahead*.
- **Timer**: Shows `45s LOCK` for signals under priority emergency override.

---

### SCENARIO 5: Switching Dashboard Views

Use the center tabs in the top header navbar to switch views:

1. **Command Center Tab**: The main active operational dashboard containing the map, live telemetry, before/after cards, and hazard controls.
2. **Road Network & Signals Tab**: Dedicated view focusing on the city map grid and full signal status list.
3. **Analytics & Performance Tab**: Displays interactive charts including:
   - *Emergency Journey Travel Time Benchmark*: Bar chart comparing travel times with vs. without corridor across trips.
   - *Cumulative Time Saved Trend*: Area chart tracking cumulative life-saving minutes saved over time.
   - *Key Stat Cards*: Total trips completed (106), average response time saved (6.8 mins), signals cleared (742), and hazards rerouted (14).

---

### SCENARIO 6: Pausing, Resuming, or Resetting the Simulation

- **Pause Simulation**: Click **`PAUSE SIMULATION`** at any time to freeze vehicle movement and signal timers for inspection.
- **Resume Simulation**: Click **`▶ START EMERGENCY SIMULATION`** to unfreeze and resume motion.
- **Reset State**: Click the circular reset icon button (**🔄**) in the Demo Controller bar to clear active emergencies, unblock all roads, and restore the map to its default state.

---

## ❓ Frequently Asked Questions (FAQ)

#### Q: How do I know if a Green Corridor is active on the map?
**Answer**: Look at the road lines on the map. An active Green Corridor displays a **vibrant, glowing neon green pulsing line** with animated dashes. You will also see a green badge in the top header saying `1 CORRIDOR ACTIVE`.

#### Q: What do the red road lines mean on the map?
**Answer**: Red lines represent severe traffic congestion or a blocked road hazard (such as an accident or flood). If an ambulance approaches a red segment, the system automatically reroutes around it.

#### Q: Can I run multiple ambulances at once?
**Answer**: Yes! Dispatch additional units using the `Dispatch Unit` modal. The map will display all active ambulances with their individual vehicle badges and siren indicators.

---

## 📜 License
Distributed under the MIT License. AEGIS Emergency Command Center.
