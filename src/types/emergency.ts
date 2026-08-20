export type SignalState = 'RED' | 'YELLOW' | 'GREEN';
export type TrafficLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'SEVERE';
export type EmergencyPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AmbulanceStatus = 'AVAILABLE' | 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED';
export type IncidentType = 'ACCIDENT' | 'ROAD_CLOSURE' | 'CONSTRUCTION' | 'FLOODING' | 'FIRE' | 'TRAFFIC_JAM';

export interface IntersectionNode {
  id: string;
  name: string;
  x: number; // 0-100 map percentage coord
  y: number; // 0-100 map percentage coord
  lat: number;
  lng: number;
  hasSignal: boolean;
  signalState: SignalState;
  signalTimer: number; // seconds remaining in current state
  isGreenCorridorActive: boolean;
  emergencyOverride: boolean;
}

export interface RoadEdge {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  name: string;
  distanceKm: number;
  speedLimitKmh: number;
  trafficLevel: TrafficLevel;
  isBlocked: boolean;
  incidentType: IncidentType | null;
  incidentSeverity: EmergencyPriority | null;
  expectedDelayMin: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface Hospital {
  id: string;
  name: string;
  nodeId: string;
  address: string;
  totalBeds: number;
  availableBeds: number;
  icuBedsAvailable: number;
  emergencyDeptStatus: 'OPEN' | 'BUSY' | 'CRITICAL_ONLY';
  specialties: string[];
  contactPhone: string;
  lat: number;
  lng: number;
}

export interface Ambulance {
  id: string;
  vehicleId: string; // e.g. AMB-104
  type: string;
  status: AmbulanceStatus;
  currentLocationNodeId: string;
  targetHospitalId: string | null;
  emergencyType: string;
  patientSeverity: EmergencyPriority;
  priorityScore: number; // 0..100
  currentSpeedKmh: number;
  progressPercent: number; // 0..1 along edge between route[currentEdgeIndex] and route[currentEdgeIndex+1]
  currentEdgeIndex: number;
  assignedRoute: string[]; // Node IDs
  corridorSignals: string[]; // Node IDs with active green corridor
  initialEtaMin: number;
  currentEtaMin: number;
  withoutCorridorEtaMin: number;
  timeSavedMin: number;
  redSignalsEncountered: number;
  greenSignalsCleared: number;
  rerouteCount: number;
  lastRerouteReason: string | null;
  currentLat?: number;
  currentLng?: number;
}

export interface RoadIncident {
  id: string;
  edgeId: string;
  locationName: string;
  type: IncidentType;
  severity: EmergencyPriority;
  reportedAt: string;
  expectedDelayMin: number;
  isResolved: boolean;
}

export interface EmergencyRequest {
  id: string;
  emergencyType: string;
  severity: EmergencyPriority;
  patientCount: number;
  pickupLocationNodeId: string;
  destinationHospitalId: string;
  priority: EmergencyPriority;
  vehicleId: string;
  notes?: string;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  type: 'DISPATCH' | 'ROUTE' | 'CORRIDOR' | 'SIGNAL' | 'INCIDENT' | 'REROUTE' | 'ARRIVAL';
  title: string;
  description: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface RouteComparison {
  withoutCorridorEta: number;
  withCorridorEta: number;
  timeSavedMinutes: number;
  withoutCorridorRedSignals: number;
  withCorridorRedSignals: number;
  trafficDelayMinutes: number;
  distanceKm: number;
}
