import type { IntersectionNode, SignalState } from '../types/emergency';

export class SignalEngine {
  public updateSignals(nodes: IntersectionNode[], dtSeconds: number = 1): IntersectionNode[] {
    return nodes.map(node => {
      if (node.isGreenCorridorActive || node.emergencyOverride) {
        return {
          ...node,
          signalState: 'GREEN' as SignalState,
          signalTimer: 99
        };
      }

      let timer = node.signalTimer - dtSeconds;
      let state = node.signalState;

      if (timer <= 0) {
        switch (node.signalState) {
          case 'GREEN':
            state = 'YELLOW';
            timer = 5;
            break;
          case 'YELLOW':
            state = 'RED';
            timer = 30;
            break;
          case 'RED':
            state = 'GREEN';
            timer = 25;
            break;
        }
      }

      return {
        ...node,
        signalState: state,
        signalTimer: timer
      };
    });
  }

  public coordinateGreenCorridor(
    nodes: IntersectionNode[],
    assignedRouteNodeIds: string[],
    currentEdgeIndex: number,
    lookAheadCount: number = 3
  ): IntersectionNode[] {
    const activeCorridorNodeIds = new Set<string>();

    if (assignedRouteNodeIds && assignedRouteNodeIds.length > 0) {
      const startIndex = Math.max(0, currentEdgeIndex);
      const endIndex = Math.min(assignedRouteNodeIds.length, startIndex + lookAheadCount + 1);

      for (let i = startIndex; i < endIndex; i++) {
        activeCorridorNodeIds.add(assignedRouteNodeIds[i]);
      }
    }

    return nodes.map(node => {
      const isCorridorNode = activeCorridorNodeIds.has(node.id);

      if (isCorridorNode) {
        return {
          ...node,
          signalState: 'GREEN' as SignalState,
          isGreenCorridorActive: true,
          emergencyOverride: true,
          signalTimer: 45
        };
      } else if (node.isGreenCorridorActive) {
        return {
          ...node,
          signalState: 'GREEN' as SignalState,
          isGreenCorridorActive: false,
          emergencyOverride: false,
          signalTimer: 15
        };
      }

      return node;
    });
  }
}
