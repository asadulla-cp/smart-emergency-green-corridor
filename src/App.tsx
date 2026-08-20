import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import type {
  IntersectionNode,
  RoadEdge,
  Hospital,
  Ambulance,
  RoadIncident,
  SystemLog,
  EmergencyPriority,
  IncidentType,
  RouteComparison
} from './types/emergency';
import { INITIAL_NODES, INITIAL_EDGES, INITIAL_HOSPITALS, INITIAL_AMBULANCES } from './data/cityGraph';
import { RoutingEngine } from './services/routingEngine';
import { SignalEngine } from './services/signalEngine';
import { SimulationEngine } from './services/simulationEngine';

import { Navbar } from './components/Navbar';
import { TopStatsBar } from './components/TopStatsBar';
import { CityMap } from './components/Map/CityMap';
import { ActiveEmergencyPanel } from './components/Dashboard/ActiveEmergencyPanel';
import { BeforeAfterComparison } from './components/Dashboard/BeforeAfterComparison';
import { SignalList } from './components/Dashboard/SignalList';
import { IncidentControl } from './components/Dashboard/IncidentControl';
import { DispatchModal } from './components/Modals/DispatchModal';
import { AnalyticsDashboard } from './components/Analytics/AnalyticsDashboard';
import { DemoController } from './components/Simulation/DemoController';

export function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'network' | 'analytics'>('dashboard');

  const [nodes, setNodes] = useState<IntersectionNode[]>(INITIAL_NODES);
  const [edges, setEdges] = useState<RoadEdge[]>(INITIAL_EDGES);
  const [hospitals] = useState<Hospital[]>(INITIAL_HOSPITALS);
  const [ambulances, setAmbulances] = useState<Ambulance[]>(INITIAL_AMBULANCES);
  const [incidents, setIncidents] = useState<RoadIncident[]>([]);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState<string>('A1');

  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simStep, setSimStep] = useState<number>(0);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState<boolean>(false);

  const [, setLogs] = useState<SystemLog[]>([
    {
      id: 'l1',
      timestamp: new Date().toLocaleTimeString(),
      type: 'DISPATCH',
      title: 'AEGIS Command Center Ready',
      description: 'Traffic Signal Coordinator & Graph Routing Engine initialized.',
      severity: 'info'
    }
  ]);

  const signalEngineRef = useRef(new SignalEngine());
  const simulationEngineRef = useRef(new SimulationEngine(INITIAL_NODES, INITIAL_EDGES));

  const activeAmb = ambulances.find(a => a.id === selectedAmbulanceId) || ambulances[0];
  const targetHospital = hospitals.find(h => h.id === activeAmb.targetHospitalId) || hospitals[0];

  const routingEngine = new RoutingEngine(nodes, edges);
  const routeResult = routingEngine.findOptimalRoute(
    activeAmb.currentLocationNodeId,
    targetHospital.nodeId,
    activeAmb.patientSeverity,
    true
  );

  const comparison: RouteComparison = routeResult
    ? routingEngine.calculateComparison(routeResult)
    : {
        withoutCorridorEta: activeAmb.withoutCorridorEtaMin,
        withCorridorEta: activeAmb.currentEtaMin,
        timeSavedMinutes: activeAmb.timeSavedMin,
        withoutCorridorRedSignals: 5,
        withCorridorRedSignals: 0,
        trafficDelayMinutes: 6.0,
        distanceKm: 5.8
      };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isSimulating) {
      interval = setInterval(() => {
        setNodes(prevNodes => signalEngineRef.current.updateSignals(prevNodes, 0.5));

        setAmbulances(prevAmbulances => {
          return prevAmbulances.map(amb => {
            if (amb.status === 'EN_ROUTE' || amb.status === 'DISPATCHED') {
              const res = simulationEngineRef.current.stepAmbulance(
                amb,
                nodes,
                edges,
                0.5
              );

              if (res.logs.length > 0) {
                setLogs(l => [...res.logs, ...l]);
              }

              if (res.arrivalOccurred) {
                confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.6 }
                });
                setIsSimulating(false);
              }

              setNodes(res.updatedNodes);
              return res.updatedAmbulance;
            }
            return amb;
          });
        });
      }, 300);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSimulating, nodes, edges]);

  const handleStartSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false);
      return;
    }

    const resetAmb: Ambulance = {
      ...INITIAL_AMBULANCES[0],
      status: 'EN_ROUTE',
      currentEdgeIndex: 0,
      progressPercent: 0,
      assignedRoute: ['N1', 'N2', 'N6', 'N10'],
      corridorSignals: ['N1', 'N2', 'N6', 'N10'],
      greenSignalsCleared: 0,
      rerouteCount: 0,
      lastRerouteReason: null
    };

    setAmbulances([resetAmb, INITIAL_AMBULANCES[1]]);
    setSelectedAmbulanceId('A1');

    const updatedNodes = signalEngineRef.current.coordinateGreenCorridor(
      nodes,
      ['N1', 'N2', 'N6', 'N10'],
      0
    );
    setNodes(updatedNodes);

    setSimStep(1);
    setIsSimulating(true);

    setLogs(l => [
      {
        id: `l-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'DISPATCH',
        title: 'Emergency Dispatched: AMB-104',
        description: 'Cardiac Emergency dispatched from MG Circle to City General Hospital.',
        severity: 'info'
      },
      ...l
    ]);
  };

  const handleTriggerFailureScenario = () => {
    const updatedEdges = edges.map(e => {
      if (e.id === 'E12') {
        return {
          ...e,
          isBlocked: true,
          incidentType: 'ACCIDENT' as IncidentType,
          expectedDelayMin: 12
        };
      }
      return e;
    });

    setEdges(updatedEdges);
    simulationEngineRef.current.updateNetwork(nodes, updatedEdges);

    setIncidents(prev => [
      ...prev,
      {
        id: `inc-${Date.now()}`,
        edgeId: 'E12',
        locationName: 'City Center Corridor',
        type: 'ACCIDENT',
        severity: 'HIGH',
        reportedAt: new Date().toLocaleTimeString(),
        expectedDelayMin: 12,
        isResolved: false
      }
    ]);

    setLogs(l => [
      {
        id: `l-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        type: 'INCIDENT',
        title: 'Hazard Injected: Major Accident',
        description: 'Accident reported on City Center Corridor. Dynamic path recalculation initiated.',
        severity: 'warning'
      },
      ...l
    ]);
  };

  const handleDispatchAmbulance = (dispatchData: {
    vehicleId: string;
    emergencyType: string;
    severity: EmergencyPriority;
    startNodeId: string;
    targetHospitalId: string;
    vehicleType: string;
  }) => {
    const route = routingEngine.findOptimalRoute(
      dispatchData.startNodeId,
      hospitals.find(h => h.id === dispatchData.targetHospitalId)?.nodeId || 'N10',
      dispatchData.severity,
      true
    );

    const path = route ? route.pathNodeIds : ['N1', 'N2', 'N6', 'N10'];

    const newAmb: Ambulance = {
      id: `A-${Date.now()}`,
      vehicleId: dispatchData.vehicleId,
      type: dispatchData.vehicleType,
      status: 'EN_ROUTE',
      currentLocationNodeId: dispatchData.startNodeId,
      targetHospitalId: dispatchData.targetHospitalId,
      emergencyType: dispatchData.emergencyType,
      patientSeverity: dispatchData.severity,
      priorityScore: dispatchData.severity === 'CRITICAL' ? 98 : 80,
      currentSpeedKmh: 68,
      progressPercent: 0,
      currentEdgeIndex: 0,
      assignedRoute: path,
      corridorSignals: path,
      initialEtaMin: route ? route.withoutCorridorEtaMin : 14.5,
      currentEtaMin: route ? route.withCorridorEtaMin : 8.2,
      withoutCorridorEtaMin: route ? route.withoutCorridorEtaMin : 14.5,
      timeSavedMin: route ? route.timeSavedMin : 6.3,
      redSignalsEncountered: 0,
      greenSignalsCleared: 0,
      rerouteCount: 0,
      lastRerouteReason: null
    };

    setAmbulances(prev => [newAmb, ...prev]);
    setSelectedAmbulanceId(newAmb.id);
    setIsSimulating(true);

    const updatedNodes = signalEngineRef.current.coordinateGreenCorridor(nodes, path, 0);
    setNodes(updatedNodes);
  };

  const handleToggleBlockEdge = (edgeId: string, incidentType: IncidentType) => {
    const updatedEdges = edges.map(e => {
      if (e.id === edgeId) {
        return {
          ...e,
          isBlocked: !e.isBlocked,
          incidentType: !e.isBlocked ? incidentType : null
        };
      }
      return e;
    });

    setEdges(updatedEdges);
    simulationEngineRef.current.updateNetwork(nodes, updatedEdges);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-black">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDispatch={() => setIsDispatchModalOpen(true)}
        onStartSimulation={handleStartSimulation}
        onTriggerFailureScenario={handleTriggerFailureScenario}
        isSimulating={isSimulating}
        activeCorridorCount={ambulances.filter(a => a.status === 'EN_ROUTE').length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-4">
        <TopStatsBar
          activeEmergenciesCount={ambulances.filter(a => a.status === 'EN_ROUTE').length}
          activeAmbulancesCount={ambulances.length}
          activeCorridorsCount={ambulances.filter(a => a.status === 'EN_ROUTE').length}
          avgEtaMin={activeAmb.currentEtaMin}
          congestionLevel="HIGH"
          roadClosuresCount={edges.filter(e => e.isBlocked).length}
        />

        <DemoController
          isSimulating={isSimulating}
          simStep={simStep}
          totalSteps={12}
          currentStepLabel={
            simStep === 0
              ? 'Click ▶ DEMO SIMULATION to run full 12-step emergency journey scenario'
              : simStep === 12
              ? '🎉 Arrival Complete! Ambulance reached hospital safely with 6.3 min saved.'
              : `Step ${simStep}: AMB-104 navigating green corridor signal nodes...`
          }
          onStart={handleStartSimulation}
          onPause={() => setIsSimulating(false)}
          onReset={() => {
            setIsSimulating(false);
            setNodes(INITIAL_NODES);
            setEdges(INITIAL_EDGES);
            setAmbulances(INITIAL_AMBULANCES);
            setSimStep(0);
          }}
          onTriggerReroute={handleTriggerFailureScenario}
        />

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-5">
              <CityMap
                nodes={nodes}
                edges={edges}
                hospitals={hospitals}
                ambulances={ambulances}
                incidents={incidents}
                onSelectNode={n => console.log('Selected node:', n)}
                onSelectEdge={e => handleToggleBlockEdge(e.id, 'ACCIDENT')}
                onSelectHospital={h => console.log('Selected hospital:', h)}
                activeAmbulanceId={selectedAmbulanceId}
              />

              <BeforeAfterComparison comparison={comparison} />
            </div>

            <div className="space-y-5">
              <ActiveEmergencyPanel
                ambulance={activeAmb}
                destinationHospital={targetHospital}
                nodes={nodes}
                onOpenDispatch={() => setIsDispatchModalOpen(true)}
                onTriggerReroute={handleTriggerFailureScenario}
              />

              <SignalList
                nodes={nodes}
                corridorNodeIds={activeAmb.assignedRoute}
                currentEdgeIndex={activeAmb.currentEdgeIndex}
              />

              <IncidentControl
                edges={edges}
                onToggleBlockEdge={handleToggleBlockEdge}
                onTriggerRerouteDemo={handleTriggerFailureScenario}
              />
            </div>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <CityMap
                nodes={nodes}
                edges={edges}
                hospitals={hospitals}
                ambulances={ambulances}
                incidents={incidents}
                onSelectNode={n => console.log(n)}
                onSelectEdge={e => handleToggleBlockEdge(e.id, 'ACCIDENT')}
                onSelectHospital={h => console.log(h)}
                activeAmbulanceId={selectedAmbulanceId}
              />
            </div>
            <div className="space-y-5">
              <SignalList
                nodes={nodes}
                corridorNodeIds={activeAmb.assignedRoute}
                currentEdgeIndex={activeAmb.currentEdgeIndex}
              />
              <IncidentControl
                edges={edges}
                onToggleBlockEdge={handleToggleBlockEdge}
                onTriggerRerouteDemo={handleTriggerFailureScenario}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard />}
      </main>

      <DispatchModal
        isOpen={isDispatchModalOpen}
        onClose={() => setIsDispatchModalOpen(false)}
        nodes={nodes}
        edges={edges}
        hospitals={hospitals}
        onDispatchAmbulance={handleDispatchAmbulance}
      />
    </div>
  );
}

export default App;
