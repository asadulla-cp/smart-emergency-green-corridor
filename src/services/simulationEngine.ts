import type { Ambulance, IntersectionNode, RoadEdge, SystemLog } from '../types/emergency';
import { RoutingEngine } from './routingEngine';
import { SignalEngine } from './signalEngine';

export class SimulationEngine {
  private routingEngine: RoutingEngine;
  private signalEngine: SignalEngine;

  constructor(nodes: IntersectionNode[], edges: RoadEdge[]) {
    this.routingEngine = new RoutingEngine(nodes, edges);
    this.signalEngine = new SignalEngine();
  }

  public updateNetwork(nodes: IntersectionNode[], edges: RoadEdge[]) {
    this.routingEngine = new RoutingEngine(nodes, edges);
  }

  public stepAmbulance(
    ambulance: Ambulance,
    nodes: IntersectionNode[],
    edges: RoadEdge[],
    dtSeconds: number = 0.5
  ): {
    updatedAmbulance: Ambulance;
    updatedNodes: IntersectionNode[];
    logs: SystemLog[];
    arrivalOccurred: boolean;
  } {
    const logs: SystemLog[] = [];

    if (ambulance.status !== 'EN_ROUTE' && ambulance.status !== 'DISPATCHED') {
      return { updatedAmbulance: ambulance, updatedNodes: nodes, logs, arrivalOccurred: false };
    }

    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const route = ambulance.assignedRoute;

    if (!route || route.length < 2 || ambulance.currentEdgeIndex >= route.length - 1) {
      const updatedAmb: Ambulance = {
        ...ambulance,
        status: 'ARRIVED',
        currentSpeedKmh: 0,
        progressPercent: 1.0,
        corridorSignals: []
      };

      const resetNodes = nodes.map(n => ({
        ...n,
        isGreenCorridorActive: false,
        emergencyOverride: false
      }));

      logs.push({
        id: `log-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'ARRIVAL',
        title: 'Destination Reached',
        description: `${ambulance.vehicleId} arrived safely at hospital. Total time saved: ${ambulance.timeSavedMin.toFixed(1)} mins.`,
        severity: 'success'
      });

      return { updatedAmbulance: updatedAmb, updatedNodes: resetNodes, logs, arrivalOccurred: true };
    }

    const fromNodeId = route[ambulance.currentEdgeIndex];
    const toNodeId = route[ambulance.currentEdgeIndex + 1];

    const fromNode = nodeMap.get(fromNodeId);
    const toNode = nodeMap.get(toNodeId);

    const currentEdge = edges.find(
      e => (e.fromNodeId === fromNodeId && e.toNodeId === toNodeId) ||
           (e.fromNodeId === toNodeId && e.toNodeId === fromNodeId)
    );

    if (currentEdge && currentEdge.isBlocked) {
      const newRouteResult = this.routingEngine.findOptimalRoute(
        fromNodeId,
        ambulance.targetHospitalId ? ambulance.targetHospitalId : route[route.length - 1],
        ambulance.patientSeverity,
        true
      );

      if (newRouteResult && newRouteResult.pathNodeIds.length >= 2) {
        logs.push({
          id: `log-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'REROUTE',
          title: 'Obstruction Detected - Path Recalculated',
          description: `Road ${currentEdge.name} blocked! A* rerouted ${ambulance.vehicleId} via alternate clear corridor.`,
          severity: 'warning'
        });

        const reroutedAmb: Ambulance = {
          ...ambulance,
          assignedRoute: newRouteResult.pathNodeIds,
          currentEdgeIndex: 0,
          progressPercent: 0,
          currentEtaMin: newRouteResult.withCorridorEtaMin,
          withoutCorridorEtaMin: newRouteResult.withoutCorridorEtaMin,
          timeSavedMin: newRouteResult.timeSavedMin,
          rerouteCount: ambulance.rerouteCount + 1,
          lastRerouteReason: `Road ${currentEdge.name} blocked by ${currentEdge.incidentType || 'incident'}`
        };

        const updatedNodes = this.signalEngine.coordinateGreenCorridor(
          nodes,
          newRouteResult.pathNodeIds,
          0
        );

        return { updatedAmbulance: reroutedAmb, updatedNodes, logs, arrivalOccurred: false };
      }
    }

    const speedKmh = ambulance.patientSeverity === 'CRITICAL' ? 75 : 65;
    const distanceKm = currentEdge ? currentEdge.distanceKm : 1.5;
    
    const distanceCoveredKm = (speedKmh / 3600) * dtSeconds * 35;
    const deltaProgress = distanceCoveredKm / distanceKm;

    let newProgress = ambulance.progressPercent + deltaProgress;
    let newEdgeIndex = ambulance.currentEdgeIndex;
    let greenCleared = ambulance.greenSignalsCleared;

    if (newProgress >= 1.0) {
      newProgress = 0;
      newEdgeIndex += 1;
      greenCleared += 1;
      
      if (toNode && toNode.hasSignal) {
        logs.push({
          id: `log-${Date.now()}-${Math.random()}`,
          timestamp: new Date().toLocaleTimeString(),
          type: 'SIGNAL',
          title: 'Green Corridor Signal Cleared',
          description: `${ambulance.vehicleId} cleared Signal ${toNode.name} without stopping (GREEN).`,
          severity: 'info'
        });
      }
    }

    let currentLat = ambulance.currentLat;
    let currentLng = ambulance.currentLng;
    if (fromNode && toNode) {
      currentLat = fromNode.lat + (toNode.lat - fromNode.lat) * newProgress;
      currentLng = fromNode.lng + (toNode.lng - fromNode.lng) * newProgress;
    }

    const remainingDistance = (route.length - 1 - newEdgeIndex) * 1.8;
    const remainingEta = Number(Math.max(0.5, (remainingDistance / speedKmh) * 60).toFixed(1));

    const updatedAmb: Ambulance = {
      ...ambulance,
      status: 'EN_ROUTE',
      currentLocationNodeId: route[newEdgeIndex] || fromNodeId,
      currentEdgeIndex: newEdgeIndex,
      progressPercent: newProgress,
      currentSpeedKmh: Math.round(speedKmh + (Math.random() * 6 - 3)),
      currentEtaMin: remainingEta,
      greenSignalsCleared: greenCleared,
      currentLat,
      currentLng
    };

    const updatedNodes = this.signalEngine.coordinateGreenCorridor(
      nodes,
      route,
      newEdgeIndex
    );

    return { updatedAmbulance: updatedAmb, updatedNodes, logs, arrivalOccurred: false };
  }
}
