import React, { useState } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  SlidersHorizontal, 
  Play, 
  Pause, 
  AlertTriangle, 
  Info, 
  ShieldAlert, 
  ArrowUpRight, 
  RefreshCw,
  Terminal
} from 'lucide-react';
import { AuditEvent, Integration } from '../types';
import { simulationScenarios } from '../data/simulationScenarios';
import { RotateCcw } from 'lucide-react';

interface EventStreamProps {
  events: AuditEvent[];
  integrations: Integration[];
  simStatus?: 'idle' | 'running' | 'paused';
  setSimStatus?: (status: 'idle' | 'running' | 'paused') => void;
  selectedScenarioId?: string;
  setSelectedScenarioId?: (id: string) => void;
  simProcessedCount?: number;
  simSpeed?: number;
  setSimSpeed?: (speed: number) => void;
  handleResetSimulation?: () => void;
}

export default function EventStream({ 
  events, 
  integrations,
  simStatus = 'idle',
  setSimStatus,
  selectedScenarioId = 'normal_workday',
  setSelectedScenarioId,
  simProcessedCount = 0,
  simSpeed = 1,
  setSimSpeed,
  handleResetSimulation
}: EventStreamProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [paused, setPaused] = useState(false);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Filter events
  const filteredEvents = events.filter((evt) => {
    const matchesSearch = 
      evt.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.actor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.actor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.ipAddress.includes(searchTerm) ||
      evt.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = selectedSeverity === 'all' || evt.severity === selectedSeverity;
    const matchesSource = selectedSource === 'all' || evt.source === selectedSource;

    return matchesSearch && matchesSeverity && matchesSource;
  });

  const getSeverityBadge = (sev: AuditEvent['severity']) => {
    switch (sev) {
      case 'critical':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-red-400 bg-red-950/40 border border-red-900/50 px-2 py-0.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse" />
            CRITICAL
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-amber-400 bg-amber-950/40 border border-amber-900/50 px-2 py-0.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-amber-500" />
            WARNING
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-blue-400 bg-blue-950/40 border border-blue-900/50 px-2 py-0.5 rounded-full">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            INFO
          </span>
        );
    }
  };

  const getSourceStyle = (source: string) => {
    switch (source) {
      case 'Google Workspace': return 'text-emerald-400 font-semibold';
      case 'Okta IDP': return 'text-purple-400 font-semibold';
      case 'GitHub Enterprise': return 'text-slate-300 font-semibold';
      case 'Slack Enterprise': return 'text-pink-400 font-semibold';
      case 'Salesforce CRM': return 'text-sky-400 font-semibold';
      default: return 'text-blue-400 font-semibold';
    }
  };

  return (
    <div className="space-y-6 font-sans text-slate-600">
      
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Continuous Telemetry Bus</span>
          <h2 className="text-xl font-bold text-slate-800 font-display">Live Event Stream</h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time unified audit logs indexed across authorized enterprise applications.
          </p>
        </div>

        {/* Live Stream Status Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-mono text-slate-500 bg-white px-2.5 py-1.5 rounded border border-slate-200 font-bold flex items-center gap-2 shadow-sm">
            <span className={`w-1.5 h-1.5 rounded-full ${simStatus === 'running' ? 'bg-emerald-500 animate-pulse' : simStatus === 'paused' ? 'bg-amber-500' : 'bg-slate-400'}`} />
            <span>Pipeline Status: <span className="uppercase font-bold text-slate-700">{simStatus === 'idle' ? 'Listening' : simStatus}</span></span>
          </div>
          <div className="text-[10px] font-mono text-slate-500 bg-white px-2.5 py-1.5 rounded border border-slate-200 font-bold shadow-sm">
            Telemetry Feed: {filteredEvents.length} items parsed
          </div>
        </div>
      </div>

      {/* Real-time Enterprise Threat Simulator Deck */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4" id="threat-simulator-deck">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div className="text-left">
            <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 animate-pulse" />
              <span>Enterprise Telemetry Simulation Center</span>
            </span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Simulate production API audit responses by streaming realistic signal sequences.
            </p>
          </div>

          {/* Active Sim State Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Start / Pause / Resume */}
            {simStatus === 'idle' && (
              <button
                onClick={() => setSimStatus && setSimStatus('running')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer select-none transition-all shadow shadow-blue-100"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Start Simulation</span>
              </button>
            )}

            {simStatus === 'running' && (
              <button
                onClick={() => setSimStatus && setSimStatus('paused')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-700 rounded text-xs font-semibold cursor-pointer select-none transition-all"
              >
                <Pause className="w-3.5 h-3.5 animate-pulse" />
                <span>Pause</span>
              </button>
            )}

            {simStatus === 'paused' && (
              <button
                onClick={() => setSimStatus && setSimStatus('running')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold cursor-pointer select-none transition-all shadow shadow-emerald-100"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </button>
            )}

            {/* Reset */}
            <button
              onClick={() => handleResetSimulation && handleResetSimulation()}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-600 rounded text-xs font-semibold cursor-pointer select-none border border-slate-200 transition-all shadow-sm"
              title="Reset state to default telemetry dataset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            {/* Speeds */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded p-0.5 ml-2">
              <button
                onClick={() => setSimSpeed && setSimSpeed(1)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${simSpeed === 1 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Speed x1
              </button>
              <button
                onClick={() => setSimSpeed && setSimSpeed(5)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${simSpeed === 5 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Speed x5
              </button>
              <button
                onClick={() => setSimSpeed && setSimSpeed(10)}
                className={`px-2 py-1 rounded text-[10px] font-mono font-bold transition-all ${simSpeed === 10 ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Speed x10
              </button>
            </div>
          </div>
        </div>

        {/* Current Active Scenario Terminal Board */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4 text-left font-mono text-[11px] space-y-1.5 relative overflow-hidden shadow-inner">
          <div className="flex justify-between items-center text-slate-400">
            <span className="uppercase text-[9px] text-blue-700 font-bold tracking-wider">Active Pipeline Activity Log</span>
            <span className="font-semibold">API Feed: Connected</span>
          </div>
          {simStatus !== 'idle' ? (
            <div className="space-y-1">
              <p className="text-emerald-700 font-bold">
                &gt; Loaded Scenario: <span className="text-slate-800 font-bold">{simulationScenarios[selectedScenarioId]?.title}</span>
              </p>
              <p className="text-slate-600 leading-relaxed font-semibold">
                Description: {simulationScenarios[selectedScenarioId]?.description}
              </p>
              <p className="text-slate-500 text-[10px] font-semibold">
                Progress: Ingested <span className="text-blue-700 font-bold">{simProcessedCount}</span> of <span className="text-slate-700 font-bold">{simulationScenarios[selectedScenarioId]?.events?.length}</span> telemetry logs.
                {simStatus === 'running' && <span className="text-emerald-600 animate-pulse ml-2 font-bold">● Ingestion pipeline active...</span>}
                {simStatus === 'paused' && <span className="text-amber-600 ml-2 font-bold">▮ Ingestion paused</span>}
              </p>
            </div>
          ) : (
            <div className="py-2 text-center text-slate-400 font-bold">
              Simulator Idle. Select a scenario injection trigger from the board below, then click "Start Simulation".
            </div>
          )}
        </div>

        {/* Scenario Injection Buttons Board */}
        <div className="space-y-2 text-left">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Scenario Injection Triggers</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
            {Object.values(simulationScenarios).map((sc) => {
              const isActive = selectedScenarioId === sc.id;
              
              const getSevBorder = (scen: typeof sc) => {
                const isS = scen.severity;
                if (isS === 'critical') return isActive ? 'border-red-500 bg-red-50 text-red-800 font-bold shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300';
                if (isS === 'warning') return isActive ? 'border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300';
                return isActive ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold shadow-sm' : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300';
              };

              const getSevBadge = (sev: string) => {
                if (sev === 'critical') return <span className="text-[7px] font-bold text-red-600 font-mono">CRIT</span>;
                if (sev === 'warning') return <span className="text-[7px] font-bold text-amber-600 font-mono">WARN</span>;
                return <span className="text-[7px] font-bold text-blue-600 font-mono">INFO</span>;
              };

              return (
                <button
                  key={sc.id}
                  disabled={simStatus !== 'idle'}
                  onClick={() => setSelectedScenarioId && setSelectedScenarioId(sc.id)}
                  className={`border rounded p-2.5 transition-all cursor-pointer flex flex-col justify-between items-start text-left h-[72px] relative ${getSevBorder(sc)} ${
                    simStatus !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title={sc.description}
                >
                  <div className="flex justify-between items-center w-full">
                    {getSevBadge(sc.severity)}
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-700 mt-1 line-clamp-2 leading-tight">{sc.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informational Disclaimer Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs text-slate-600 text-left flex gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span className="text-[10px] leading-relaxed font-medium">
            <strong>MVP Simulation Environment:</strong> In this interactive workspace, API connectors simulate genuine real-time production audit streams using realistic enterprise event scenarios. Action logs automatically update threat indices and generate active cases in the investigation workspace.
          </span>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col lg:flex-row gap-3.5 items-center justify-between shadow-sm">
        
        {/* Search Input */}
        <div className="relative w-full lg:max-w-md">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter stream by file name, IP, actor, description..."
            className="w-full bg-white border border-slate-200 rounded pl-10 pr-4 py-1.5 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-semibold"
          />
        </div>

        {/* Action Selects */}
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          {/* Source Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Source:</span>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none border-none pr-1 font-semibold cursor-pointer"
            >
              <option value="all">All Sources</option>
              {integrations.map((i) => (
                <option key={i.id} value={i.name}>{i.name}</option>
              ))}
            </select>
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded px-3 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Level:</span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-xs text-slate-700 focus:outline-none border-none pr-1 font-semibold cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical Only</option>
              <option value="warning">Warning Only</option>
              <option value="info">Info Only</option>
            </select>
          </div>

          {/* Reset Filters button */}
          {(searchTerm || selectedSeverity !== 'all' || selectedSource !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSeverity('all');
                setSelectedSource('all');
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold px-2 py-1 cursor-pointer"
            >
              Clear filters
            </button>
          )}

        </div>

      </div>

      {/* Main Stream Log List */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <Terminal className="w-8 h-8 text-slate-300 mx-auto animate-pulse" />
            <p className="text-slate-500 text-sm font-semibold">No security telemetry signals matched your active filter query.</p>
            <p className="text-xs text-slate-400">Try adjusting your search criteria or triggering a simulated live event above.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredEvents.map((evt) => {
              const isExpanded = expandedEventId === evt.id;
              
              return (
                <div 
                  key={evt.id}
                  className={`transition-colors duration-150 ${
                    isExpanded ? 'bg-slate-50' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Grid Row */}
                  <div 
                    onClick={() => setExpandedEventId(isExpanded ? null : evt.id)}
                    className="grid grid-cols-12 gap-3.5 items-center p-3.5 text-xs cursor-pointer select-none text-left"
                  >
                    {/* Timestamp */}
                    <div className="col-span-2 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      <span className="text-[10px] text-slate-400 block font-bold">
                        {new Date(evt.timestamp).toLocaleDateString([], { month: 'short', day: '2-digit' })}
                      </span>
                    </div>

                    {/* Source */}
                    <div className="col-span-2">
                      <span className={`text-[11px] uppercase tracking-wider font-mono font-bold ${getSourceStyle(evt.source)}`}>
                        {evt.source}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-mono font-semibold">{evt.ipAddress}</span>
                    </div>

                    {/* Actor */}
                    <div className="col-span-3">
                      <span className="font-bold text-slate-800 block">{evt.actor.name}</span>
                      <span className="text-[10px] text-slate-400 block truncate font-mono font-semibold">{evt.actor.email}</span>
                    </div>

                    {/* Event Name */}
                    <div className="col-span-3">
                      <span className="font-bold text-slate-800 block truncate">{evt.eventName}</span>
                      <span className="text-[10px] text-slate-500 block truncate mt-0.5">{evt.description}</span>
                    </div>

                    {/* Severity Badge */}
                    <div className="col-span-1.5 flex justify-center">
                      {getSeverityBadge(evt.severity)}
                    </div>

                    {/* Risk Score */}
                    <div className="col-span-0.5 text-right font-mono font-bold text-slate-600">
                      <span className={evt.riskScore >= 80 ? 'text-red-600' : evt.riskScore >= 60 ? 'text-amber-600' : 'text-blue-600'}>
                        {evt.riskScore}
                      </span>
                    </div>
                  </div>

                  {/* Expanded Metadata details row */}
                  {isExpanded && (
                    <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 border-b border-slate-200 text-left space-y-4">
                      
                      {/* Flex layout for columns of context */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        
                        {/* Column 1: Actor Context */}
                        <div className="space-y-1 bg-white p-3.5 rounded border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold mb-1 border-b border-slate-100 pb-1">
                            Evaluated Entity Context
                          </span>
                          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                            <span className="text-slate-400 font-bold">Name:</span>
                            <span className="text-slate-700 font-semibold">{evt.actor.name}</span>
                            <span className="text-slate-400 font-bold">Role:</span>
                            <span className="text-slate-700 truncate font-semibold" title={evt.actor.role}>{evt.actor.role}</span>
                            <span className="text-slate-400 font-bold">Department:</span>
                            <span className="text-slate-700 font-semibold">{evt.actor.department}</span>
                          </div>
                        </div>

                        {/* Column 2: Environmental Details */}
                        <div className="space-y-1 bg-white p-3.5 rounded border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold mb-1 border-b border-slate-100 pb-1">
                            Environment parameters
                          </span>
                          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                            <span className="text-slate-400 font-bold">Geographic:</span>
                            <span className="text-slate-700 font-semibold">{evt.location}</span>
                            <span className="text-slate-400 font-bold">Network IP:</span>
                            <span className="text-slate-700 font-mono font-bold">{evt.ipAddress}</span>
                            <span className="text-slate-400 font-bold">Host Agent / UA:</span>
                            <span className="text-slate-700 truncate font-semibold" title={evt.device}>{evt.device}</span>
                          </div>
                        </div>

                        {/* Column 3: Event Core properties */}
                        <div className="space-y-1 bg-white p-3.5 rounded border border-slate-200 shadow-sm">
                          <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold mb-1 border-b border-slate-100 pb-1">
                            Pipeline Parameters
                          </span>
                          <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                            <span className="text-slate-400 font-bold">Signal ID:</span>
                            <span className="text-slate-700 font-mono text-[10px] font-semibold">{evt.id}</span>
                            <span className="text-slate-400 font-bold">Inbound Type:</span>
                            <span className="text-slate-700 font-mono font-semibold">{evt.sourceType}</span>
                            <span className="text-slate-400 font-bold">Anomaly Rating:</span>
                            <span className="text-slate-700 font-mono text-red-600 font-bold">{evt.riskScore} / 100</span>
                          </div>
                        </div>

                      </div>

                      {/* Detailed raw JSON view */}
                      <div className="bg-white border border-slate-200 rounded p-3 font-mono text-[11px] shadow-inner">
                        <div className="flex justify-between items-center text-slate-400 mb-2 border-b border-slate-100 pb-1">
                          <span className="font-bold uppercase tracking-wider text-[9px] text-blue-600 flex items-center gap-1.5">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>Audit Metadata Payload Block</span>
                          </span>
                          <span className="font-bold">JSON schema v1.0.2</span>
                        </div>
                        <pre className="text-blue-700 overflow-x-auto whitespace-pre-wrap leading-relaxed text-left">
                          {JSON.stringify(evt.metadata, null, 2)}
                        </pre>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
