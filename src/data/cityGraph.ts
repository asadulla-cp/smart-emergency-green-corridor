import type { IntersectionNode, RoadEdge, Hospital, Ambulance } from '../types/emergency';

export const INITIAL_NODES: IntersectionNode[] = [
  { id: 'N1', name: 'MG Circle', x: 15, y: 25, lat: 12.9716, lng: 77.5946, hasSignal: true, signalState: 'RED', signalTimer: 18, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N2', name: 'Central Square', x: 35, y: 25, lat: 12.9745, lng: 77.6012, hasSignal: true, signalState: 'GREEN', signalTimer: 25, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N3', name: 'Metro Interchange', x: 60, y: 25, lat: 12.9780, lng: 77.6105, hasSignal: true, signalState: 'RED', signalTimer: 12, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N4', name: 'East Plaza', x: 85, y: 25, lat: 12.9810, lng: 77.6200, hasSignal: true, signalState: 'GREEN', signalTimer: 30, isGreenCorridorActive: false, emergencyOverride: false },
  
  { id: 'N5', name: 'West Park Junction', x: 15, y: 50, lat: 12.9650, lng: 77.5920, hasSignal: true, signalState: 'GREEN', signalTimer: 15, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N6', name: 'City Hall Junction', x: 35, y: 50, lat: 12.9680, lng: 77.6000, hasSignal: true, signalState: 'RED', signalTimer: 22, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N7', name: 'Apex Tower Crossing', x: 60, y: 50, lat: 12.9710, lng: 77.6080, hasSignal: true, signalState: 'GREEN', signalTimer: 8, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N8', name: 'Tech Park Flyover', x: 85, y: 50, lat: 12.9740, lng: 77.6180, hasSignal: true, signalState: 'RED', signalTimer: 16, isGreenCorridorActive: false, emergencyOverride: false },
  
  { id: 'N9', name: 'South End Circle', x: 15, y: 75, lat: 12.9580, lng: 77.5890, hasSignal: true, signalState: 'RED', signalTimer: 10, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N10', name: 'Hospital Gate 1', x: 35, y: 75, lat: 12.9610, lng: 77.5980, hasSignal: true, signalState: 'GREEN', signalTimer: 20, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N11', name: 'St. Jude Avenue', x: 60, y: 75, lat: 12.9640, lng: 77.6060, hasSignal: true, signalState: 'RED', signalTimer: 14, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N12', name: 'Ring Road East', x: 85, y: 75, lat: 12.9670, lng: 77.6150, hasSignal: true, signalState: 'GREEN', signalTimer: 28, isGreenCorridorActive: false, emergencyOverride: false },

  { id: 'N13', name: 'Outer Ring Bypass', x: 50, y: 90, lat: 12.9520, lng: 77.6020, hasSignal: true, signalState: 'GREEN', signalTimer: 15, isGreenCorridorActive: false, emergencyOverride: false },
  { id: 'N14', name: 'North Highway Link', x: 50, y: 10, lat: 12.9850, lng: 77.6050, hasSignal: true, signalState: 'RED', signalTimer: 5, isGreenCorridorActive: false, emergencyOverride: false },
];

export const INITIAL_EDGES: RoadEdge[] = [
  { id: 'E1', fromNodeId: 'N1', toNodeId: 'N2', name: 'MG Road Segment 1', distanceKm: 1.8, speedLimitKmh: 50, trafficLevel: 'HIGH', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 4, riskLevel: 'MEDIUM' },
  { id: 'E2', fromNodeId: 'N2', toNodeId: 'N3', name: 'MG Road Segment 2', distanceKm: 2.1, speedLimitKmh: 60, trafficLevel: 'MODERATE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 2, riskLevel: 'LOW' },
  { id: 'E3', fromNodeId: 'N3', toNodeId: 'N4', name: 'East Boulevard', distanceKm: 2.4, speedLimitKmh: 60, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },

  { id: 'E4', fromNodeId: 'N5', toNodeId: 'N6', name: 'Central Avenue West', distanceKm: 1.5, speedLimitKmh: 45, trafficLevel: 'SEVERE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 6, riskLevel: 'HIGH' },
  { id: 'E5', fromNodeId: 'N6', toNodeId: 'N7', name: 'Central Expressway', distanceKm: 1.9, speedLimitKmh: 70, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E6', fromNodeId: 'N7', toNodeId: 'N8', name: 'Tech Park Way', distanceKm: 2.2, speedLimitKmh: 55, trafficLevel: 'MODERATE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 1, riskLevel: 'LOW' },

  { id: 'E7', fromNodeId: 'N9', toNodeId: 'N10', name: 'South Park Road', distanceKm: 1.6, speedLimitKmh: 40, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E8', fromNodeId: 'N10', toNodeId: 'N11', name: 'Hospital Access Road', distanceKm: 1.7, speedLimitKmh: 50, trafficLevel: 'MODERATE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 1, riskLevel: 'LOW' },
  { id: 'E9', fromNodeId: 'N11', toNodeId: 'N12', name: 'South Ring Link', distanceKm: 2.0, speedLimitKmh: 60, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },

  { id: 'E10', fromNodeId: 'N1', toNodeId: 'N5', name: 'West Ring Road', distanceKm: 2.2, speedLimitKmh: 50, trafficLevel: 'MODERATE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 2, riskLevel: 'LOW' },
  { id: 'E11', fromNodeId: 'N5', toNodeId: 'N9', name: 'West Bypass South', distanceKm: 2.0, speedLimitKmh: 50, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },

  { id: 'E12', fromNodeId: 'N2', toNodeId: 'N6', name: 'City Center Corridor', distanceKm: 2.0, speedLimitKmh: 40, trafficLevel: 'SEVERE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 7, riskLevel: 'HIGH' },
  { id: 'E13', fromNodeId: 'N6', toNodeId: 'N10', name: 'Hospital Expressway North', distanceKm: 2.1, speedLimitKmh: 60, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },

  { id: 'E14', fromNodeId: 'N3', toNodeId: 'N7', name: 'Metro Flyover', distanceKm: 2.3, speedLimitKmh: 65, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E15', fromNodeId: 'N7', toNodeId: 'N11', name: 'St. Jude Link', distanceKm: 2.1, speedLimitKmh: 50, trafficLevel: 'MODERATE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 2, riskLevel: 'LOW' },

  { id: 'E16', fromNodeId: 'N4', toNodeId: 'N8', name: 'East Ring North', distanceKm: 2.2, speedLimitKmh: 60, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E17', fromNodeId: 'N8', toNodeId: 'N12', name: 'East Ring South', distanceKm: 2.0, speedLimitKmh: 60, trafficLevel: 'MODERATE', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 1, riskLevel: 'LOW' },

  { id: 'E18', fromNodeId: 'N10', toNodeId: 'N13', name: 'Outer Ring South Access', distanceKm: 1.8, speedLimitKmh: 70, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E19', fromNodeId: 'N11', toNodeId: 'N13', name: 'Outer Ring Bypass Link', distanceKm: 1.9, speedLimitKmh: 75, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E20', fromNodeId: 'N2', toNodeId: 'N14', name: 'North Highway Access', distanceKm: 2.0, speedLimitKmh: 75, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
  { id: 'E21', fromNodeId: 'N3', toNodeId: 'N14', name: 'North Bypass Connector', distanceKm: 2.2, speedLimitKmh: 70, trafficLevel: 'LOW', isBlocked: false, incidentType: null, incidentSeverity: null, expectedDelayMin: 0, riskLevel: 'LOW' },
];

export const INITIAL_HOSPITALS: Hospital[] = [
  {
    id: 'H1',
    name: 'City General Hospital',
    nodeId: 'N10',
    address: '100 Hospital Gate, City Center',
    totalBeds: 450,
    availableBeds: 42,
    icuBedsAvailable: 6,
    emergencyDeptStatus: 'OPEN',
    specialties: ['Cardiac Care', 'Trauma Unit', 'Stroke Center', 'General Emergency'],
    contactPhone: '+1 (555) 911-0100',
    lat: 12.9610,
    lng: 77.5980
  },
  {
    id: 'H2',
    name: 'Apex Heart & Vascular Institute',
    nodeId: 'N7',
    address: '45 Apex Tower Ave, Tech Corridor',
    totalBeds: 300,
    availableBeds: 18,
    icuBedsAvailable: 8,
    emergencyDeptStatus: 'OPEN',
    specialties: ['Cardiac Emergency', 'Advanced ICU', 'Vascular Surgery'],
    contactPhone: '+1 (555) 911-0200',
    lat: 12.9710,
    lng: 77.6080
  },
  {
    id: 'H3',
    name: 'St. Jude Emergency & Trauma Center',
    nodeId: 'N11',
    address: '88 St. Jude Way, South District',
    totalBeds: 380,
    availableBeds: 29,
    icuBedsAvailable: 4,
    emergencyDeptStatus: 'OPEN',
    specialties: ['Severe Trauma', 'Burn Unit', 'Pediatric ICU', 'Neurology'],
    contactPhone: '+1 (555) 911-0300',
    lat: 12.9640,
    lng: 77.6060
  }
];

export const INITIAL_AMBULANCES: Ambulance[] = [
  {
    id: 'A1',
    vehicleId: 'AMB-104',
    type: 'Advanced Cardiac Care Unit',
    status: 'AVAILABLE',
    currentLocationNodeId: 'N1',
    targetHospitalId: 'H1',
    emergencyType: 'Cardiac Emergency',
    patientSeverity: 'CRITICAL',
    priorityScore: 98,
    currentSpeedKmh: 0,
    progressPercent: 0,
    currentEdgeIndex: 0,
    assignedRoute: ['N1', 'N2', 'N6', 'N10'],
    corridorSignals: ['N1', 'N2', 'N6', 'N10'],
    initialEtaMin: 14.5,
    currentEtaMin: 8.2,
    withoutCorridorEtaMin: 14.5,
    timeSavedMin: 6.3,
    redSignalsEncountered: 0,
    greenSignalsCleared: 0,
    rerouteCount: 0,
    lastRerouteReason: null,
    currentLat: 12.9716,
    currentLng: 77.5946
  },
  {
    id: 'A2',
    vehicleId: 'AMB-208',
    type: 'Trauma Rescue Ambulance',
    status: 'AVAILABLE',
    currentLocationNodeId: 'N4',
    targetHospitalId: 'H3',
    emergencyType: 'Severe Trauma',
    patientSeverity: 'HIGH',
    priorityScore: 85,
    currentSpeedKmh: 0,
    progressPercent: 0,
    currentEdgeIndex: 0,
    assignedRoute: ['N4', 'N8', 'N12', 'N11'],
    corridorSignals: [],
    initialEtaMin: 11.0,
    currentEtaMin: 11.0,
    withoutCorridorEtaMin: 11.0,
    timeSavedMin: 0,
    redSignalsEncountered: 0,
    greenSignalsCleared: 0,
    rerouteCount: 0,
    lastRerouteReason: null,
    currentLat: 12.9810,
    currentLng: 77.6200
  }
];
