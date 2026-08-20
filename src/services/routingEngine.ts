import type { IntersectionNode, RoadEdge, EmergencyPriority, RouteComparison } from '../types/emergency';

export interface RouteResult {
  pathNodeIds: string[];
  totalDistanceKm: number;
  withCorridorEtaMin: number;
  withoutCorridorEtaMin: number;
  timeSavedMin: number;
  redSignalsAvoided: number;
  explanation: string;
  edges: RoadEdge[];
}

export class RoutingEngine {
  private nodes: Map<string, IntersectionNode>;
  private edges: RoadEdge[];
  private adjacencyMap: Map<string, { toNodeId: string; edge: RoadEdge }[]>;

  constructor(nodes: IntersectionNode[], edges: RoadEdge[]) {
    this.nodes = new Map(nodes.map(n => [n.id, n]));
    this.edges = edges;
    this.adjacencyMap = new Map();

    nodes.forEach(n => this.adjacencyMap.set(n.id, []));

    edges.forEach(e => {
      this.adjacencyMap.get(e.fromNodeId)?.push({ toNodeId: e.toNodeId, edge: e });
      this.adjacencyMap.get(e.toNodeId)?.push({ toNodeId: e.fromNodeId, edge: e });
    });
  }

  private calculateEdgeCost(
    edge: RoadEdge, 
    isGreenCorridor: boolean, 
    priority: EmergencyPriority
  ): number {
    if (edge.isBlocked) {
      return Infinity;
    }

    const baseMinutes = (edge.distanceKm / edge.speedLimitKmh) * 60;

    let trafficMultiplier = 1.0;
    switch (edge.trafficLevel) {
      case 'LOW': trafficMultiplier = 1.0; break;
      case 'MODERATE': trafficMultiplier = 1.35; break;
      case 'HIGH': trafficMultiplier = 1.85; break;
      case 'SEVERE': trafficMultiplier = 2.6; break;
    }

    let riskPenalty = 0;
    if (edge.riskLevel === 'HIGH') riskPenalty = 1.5;
    if (edge.riskLevel === 'MEDIUM') riskPenalty = 0.5;

    let effectiveTrafficMultiplier = trafficMultiplier;
    let incidentDelay = edge.expectedDelayMin;

    if (isGreenCorridor) {
      effectiveTrafficMultiplier = Math.max(1.0, trafficMultiplier * 0.55);
      incidentDelay = 0;
    }

    let priorityDiscount = 1.0;
    if (priority === 'CRITICAL' && edge.speedLimitKmh >= 60) {
      priorityDiscount = 0.85;
    }

    return (baseMinutes * effectiveTrafficMultiplier + incidentDelay + riskPenalty) * priorityDiscount;
  }

  private heuristic(fromNodeId: string, toNodeId: string): number {
    const from = this.nodes.get(fromNodeId);
    const to = this.nodes.get(toNodeId);
    if (!from || !to) return 0;

    const dx = from.x - to.x;
    const dy = from.y - to.y;
    return Math.sqrt(dx * dx + dy * dy) * 0.12;
  }

  public findOptimalRoute(
    startNodeId: string,
    endNodeId: string,
    priority: EmergencyPriority = 'CRITICAL',
    isGreenCorridorActive: boolean = true
  ): RouteResult | null {
    if (!this.nodes.has(startNodeId) || !this.nodes.has(endNodeId)) {
      return null;
    }

    const openSet = new Set<string>([startNodeId]);
    const cameFrom = new Map<string, { nodeId: string; edge: RoadEdge }>();

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();

    this.nodes.forEach((_, id) => {
      gScore.set(id, Infinity);
      fScore.set(id, Infinity);
    });

    gScore.set(startNodeId, 0);
    fScore.set(startNodeId, this.heuristic(startNodeId, endNodeId));

    while (openSet.size > 0) {
      let current: string | null = null;
      let lowestF = Infinity;
      for (const id of openSet) {
        const f = fScore.get(id) ?? Infinity;
        if (f < lowestF) {
          lowestF = f;
          current = id;
        }
      }

      if (!current) break;

      if (current === endNodeId) {
        return this.reconstructRoute(cameFrom, current, priority);
      }

      openSet.delete(current);

      const neighbors = this.adjacencyMap.get(current) || [];
      for (const { toNodeId, edge } of neighbors) {
        const edgeCost = this.calculateEdgeCost(edge, isGreenCorridorActive, priority);
        if (edgeCost === Infinity) continue;

        const tentativeG = (gScore.get(current) ?? Infinity) + edgeCost;

        if (tentativeG < (gScore.get(toNodeId) ?? Infinity)) {
          cameFrom.set(toNodeId, { nodeId: current, edge });
          gScore.set(toNodeId, tentativeG);
          fScore.set(toNodeId, tentativeG + this.heuristic(toNodeId, endNodeId));
          openSet.add(toNodeId);
        }
      }
    }

    return null;
  }

  private reconstructRoute(
    cameFrom: Map<string, { nodeId: string; edge: RoadEdge }>,
    currentId: string,
    priority: EmergencyPriority
  ): RouteResult {
    const pathNodeIds: string[] = [currentId];
    const pathEdges: RoadEdge[] = [];
    let curr = currentId;

    while (cameFrom.has(curr)) {
      const { nodeId, edge } = cameFrom.get(curr)!;
      pathNodeIds.unshift(nodeId);
      pathEdges.unshift(edge);
      curr = nodeId;
    }

    let totalDistanceKm = 0;
    let withCorridorEtaMin = 0;
    let withoutCorridorEtaMin = 0;
    let redSignalsAvoided = 0;

    pathEdges.forEach((edge, idx) => {
      totalDistanceKm += edge.distanceKm;

      const corridorCost = this.calculateEdgeCost(edge, true, priority);
      const normalCost = this.calculateEdgeCost(edge, false, priority);

      withCorridorEtaMin += corridorCost;
      
      const targetNode = this.nodes.get(pathNodeIds[idx + 1]);
      const signalDelay = (targetNode && targetNode.hasSignal) ? 0.85 : 0;
      if (targetNode && targetNode.hasSignal) redSignalsAvoided++;

      withoutCorridorEtaMin += normalCost + signalDelay;
    });

    const timeSavedMin = Math.max(0, withoutCorridorEtaMin - withCorridorEtaMin);

    let explanation = `A* Path selected (${totalDistanceKm.toFixed(1)} km). `;
    const blockedEdges = this.edges.filter(e => e.isBlocked);
    if (blockedEdges.length > 0) {
      explanation += `Avoided ${blockedEdges.length} blocked road segment(s). `;
    }
    explanation += `Green Corridor reduces estimated travel time from ${withoutCorridorEtaMin.toFixed(1)} min to ${withCorridorEtaMin.toFixed(1)} min (saving ${timeSavedMin.toFixed(1)} min).`;

    return {
      pathNodeIds,
      totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
      withCorridorEtaMin: Number(withCorridorEtaMin.toFixed(1)),
      withoutCorridorEtaMin: Number(withoutCorridorEtaMin.toFixed(1)),
      timeSavedMin: Number(timeSavedMin.toFixed(1)),
      redSignalsAvoided,
      explanation,
      edges: pathEdges
    };
  }

  public calculateComparison(routeResult: RouteResult): RouteComparison {
    return {
      withoutCorridorEta: routeResult.withoutCorridorEtaMin,
      withCorridorEta: routeResult.withCorridorEtaMin,
      timeSavedMinutes: routeResult.timeSavedMin,
      withoutCorridorRedSignals: routeResult.redSignalsAvoided,
      withCorridorRedSignals: 0,
      trafficDelayMinutes: Number((routeResult.withoutCorridorEtaMin - (routeResult.totalDistanceKm / 50) * 60).toFixed(1)),
      distanceKm: routeResult.totalDistanceKm
    };
  }
}
