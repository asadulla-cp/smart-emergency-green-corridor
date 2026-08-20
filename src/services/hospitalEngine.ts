import type { Hospital, EmergencyPriority, IntersectionNode, RoadEdge } from '../types/emergency';
import { RoutingEngine } from './routingEngine';

export interface HospitalRecommendation {
  hospital: Hospital;
  score: number;
  etaMin: number;
  distanceKm: number;
  icuAvailable: boolean;
  specialtyMatched: boolean;
  recommendationReason: string;
  isBestMatch: boolean;
}

export class HospitalEngine {
  public rankHospitals(
    hospitals: Hospital[],
    startNodeId: string,
    emergencyType: string,
    severity: EmergencyPriority,
    nodes: IntersectionNode[],
    edges: RoadEdge[]
  ): HospitalRecommendation[] {
    const routingEngine = new RoutingEngine(nodes, edges);

    const recommendations: HospitalRecommendation[] = hospitals.map(hospital => {
      const routeResult = routingEngine.findOptimalRoute(startNodeId, hospital.nodeId, severity, true);
      const etaMin = routeResult ? routeResult.withCorridorEtaMin : 999;
      const distanceKm = routeResult ? routeResult.totalDistanceKm : 999;

      const emergencyLower = emergencyType.toLowerCase();
      const specialtyMatched = hospital.specialties.some(spec => 
        spec.toLowerCase().includes(emergencyLower) ||
        (emergencyLower.includes('cardiac') && spec.toLowerCase().includes('cardiac')) ||
        (emergencyLower.includes('trauma') && spec.toLowerCase().includes('trauma')) ||
        (emergencyLower.includes('stroke') && spec.toLowerCase().includes('stroke'))
      );

      const icuAvailable = hospital.icuBedsAvailable > 0;

      let etaScore = Math.max(0, 50 - etaMin * 3);
      let capacityScore = Math.min(20, hospital.icuBedsAvailable * 4);
      if (hospital.emergencyDeptStatus === 'OPEN') capacityScore += 10;
      if (hospital.emergencyDeptStatus === 'CRITICAL_ONLY' && severity === 'CRITICAL') capacityScore += 5;

      let specialtyScore = specialtyMatched ? 20 : 5;
      const totalScore = Math.min(100, Math.round(etaScore + capacityScore + specialtyScore));

      let reason = `ETA ${etaMin.toFixed(1)} min (${distanceKm.toFixed(1)} km). `;
      if (specialtyMatched) reason += `Specialized in ${emergencyType}. `;
      if (icuAvailable) reason += `${hospital.icuBedsAvailable} ICU beds available.`;
      else reason += `⚠️ ICU beds full (${hospital.icuBedsAvailable} left).`;

      return {
        hospital,
        score: totalScore,
        etaMin,
        distanceKm,
        icuAvailable,
        specialtyMatched,
        recommendationReason: reason,
        isBestMatch: false
      };
    });

    recommendations.sort((a, b) => b.score - a.score);

    if (recommendations.length > 0) {
      recommendations[0].isBestMatch = true;
    }

    return recommendations;
  }
}
