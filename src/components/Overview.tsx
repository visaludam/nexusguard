import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Layers, 
  Workflow, 
  TrendingUp, 
  AlertTriangle, 
  ChevronRight, 
  Users, 
  ArrowUpRight, 
  Clock,
  Info
} from 'lucide-react';
import { AuditEvent, InvestigationCase, Integration } from '../types';

interface OverviewProps {
  cases: InvestigationCase[];
  events: AuditEvent[];
  integrations: Integration[];
  onSelectCase: (caseId: string) => void;
  setActiveTab: (tab: string) => void;
  totalEventIngestCount?: number;
  platformRiskIndex?: number;
}

export default function Overview({
  cases,
  events,
  integrations,
  onSelectCase,
  setActiveTab,
  totalEventIngestCount = 1642500,
  platformRiskIndex = 74
}: OverviewProps) {
  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<{dept: string, sys: string, score: number} | null>({
    dept: 'Engineering',
    sys: 'GWS Drive',
    score: 82
  });
  
  const [trendRange, setTrendRange] = useState<'24h' | '7d'>('7d');

  // Heatmap definitions
  const departments = ['Engineering', 'Sales-West', 'Finance', 'Human Resources', 'Marketing'];
  const systems = ['GWS Drive', 'Okta Logins', 'GitHub Code', 'Slack Channels', 'Salesforce'];
  
  // Custom heatmap risk matrix
  const riskMatrix: Record<string, Record<string, number>> = {
    'Engineering': { 'GWS Drive': 82, 'Okta Logins': 45, 'GitHub Code': 88, 'Slack Channels': 30, 'Salesforce': 12 },
    'Sales-West': { 'GWS Drive': 64, 'Okta Logins': 50, 'GitHub Code': 10, 'Slack Channels': 45, 'Salesforce': 92 },
    'Finance': { 'GWS Drive': 75, 'Okta Logins': 32, 'GitHub Code': 15, 'Slack Channels': 38, 'Salesforce': 10 },
    'Human Resources': { 'GWS Drive': 58, 'Okta Logins': 60, 'GitHub Code': 5, 'Slack Channels': 55, 'Salesforce': 5 },
    'Marketing': { 'GWS Drive': 40, 'Okta Logins': 30, 'GitHub Code': 8, 'Slack Channels': 42, 'Salesforce': 25 }
  };

  const getHeatmapColor = (score: number) => {
    if (score >= 85) return 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 font-semibold';
    if (score >= 70) return 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 font-semibold';
    if (score >= 40) return 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100 border border-yellow-200';
    return 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-slate-200';
  };

  // Mock Trend Chart points
  const weeklyTrendData = [
    { label: 'Mon', count: 1240, critical: 2 },
    { label: 'Tue', count: 1450, critical: 4 },
    { label: 'Wed', count: 1100, critical: 1 },
    { label: 'Thu', count: 1890, critical: 7 },
    { label: 'Fri', count: 2100, critical: 12 },
    { label: 'Sat', count: 1650, critical: 5 },
    { label: 'Sun', count: 1980, critical: 8 }
  ];

  const dailyTrendData = [
    { label: '00:00', count: 120, critical: 0 },
    { label: '04:00', count: 90, critical: 1 },
    { label: '08:00', count: 320, critical: 2 },
    { label: '12:00', count: 540, critical: 4 },
    { label: '16:00', count: 480, critical: 3 },
    { label: '20:00', count: 620, critical: 9 },
    { label: '24:00', count: 310, critical: 2 }
  ];

  const trendData = trendRange === '7d' ? weeklyTrendData : dailyTrendData;
  const maxCount = Math.max(...trendData.map(d => d.count));

  return (
    <div className="space-y-6 font-sans text-slate-700">
      
      {/* Platform Disclaimer Block - HIGH VISIBILITY AS REQUIRED */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-xs leading-relaxed" id="nexus-disclaimer">
        <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-800 block uppercase tracking-wider text-[10px] mb-1">NexusGuard Advisory Disclaimer</span>
          <p className="text-slate-600">
            NexusGuard assists human security investigations by analyzing complex enterprise audit events. 
            It is designed as an intelligence companion to synthesize signals, explain data exposures, and recommend actions. 
            <strong className="text-blue-900"> It does not determine employee intent, make employment decisions, or replace security, HR, or legal judgment.</strong>
          </p>
        </div>
      </div>

      {/* Overview Metric Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" id="nexus-metrics">
        
        {/* Metric 1 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Total Event Ingestion</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-display">
                {totalEventIngestCount.toLocaleString()}
              </span>
              <span className="text-[10px] font-mono text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">+24.8%</span>
            </div>
            <p className="text-[11px] text-slate-500">Across 6 connected active buses</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Active Investigations</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-display">
                {cases.filter(c => c.status === 'open' || c.status === 'under_review').length} Cases
              </span>
              <span className="text-[10px] font-mono text-red-700 font-semibold bg-red-50 border border-red-200 px-1.5 py-0.2 rounded">2 Critical</span>
            </div>
            <p className="text-[11px] text-slate-500">Assigned to SecOps analysts</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Integration Health</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-display">
                {integrations.filter(i => i.status === 'connected').length} / {integrations.length}
              </span>
              <span className="text-[10px] font-mono text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded">1 Syncing</span>
            </div>
            <p className="text-[11px] text-slate-500">Normal telemetry pipelines</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <Workflow className="w-5 h-5" />
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg flex items-center justify-between shadow-sm">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Platform Risk Index</span>
            <div className="flex items-baseline gap-2">
              <span className={`text-2xl font-bold font-display ${
                platformRiskIndex >= 85 ? 'text-red-600' : platformRiskIndex >= 60 ? 'text-amber-600' : 'text-blue-600'
              }`}>
                {platformRiskIndex}
                <span className="text-xs text-slate-400 font-sans font-normal">/100</span>
              </span>
              <span className={`text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded ${
                platformRiskIndex >= 85 ? 'text-red-700 bg-red-50 border border-red-200' : platformRiskIndex >= 60 ? 'text-amber-700 bg-amber-50 border border-amber-200' : 'text-blue-700 bg-blue-50 border border-blue-200'
              }`}>
                {platformRiskIndex >= 85 ? 'High Alert' : platformRiskIndex >= 60 ? 'Warning' : 'Nominal'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Triggered by exfiltration events</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Middle Section: Chart and Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Line Chart */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg lg:col-span-7 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-0.5 text-left">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Activity Trend Analytics</span>
                <h3 className="text-sm font-semibold text-slate-800">Aggregated Signal Stream Ingestion</h3>
              </div>
              <div className="flex gap-1.5 bg-slate-100 border border-slate-200 rounded p-0.5">
                <button
                  onClick={() => setTrendRange('24h')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${trendRange === '24h' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  24h
                </button>
                <button
                  onClick={() => setTrendRange('7d')}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono transition-colors cursor-pointer ${trendRange === '7d' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  7d
                </button>
              </div>
            </div>

            {/* Custom Interactive SVG Chart */}
            <div className="h-44 w-full relative mt-4">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Horizontal Guide Lines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="90" x2="100" y2="90" stroke="#cbd5e1" strokeWidth="0.5" opacity="0.8" />

                {/* Draw gradient area under curve */}
                <path
                  d={`M 0,100 ${trendData.map((d, idx) => {
                    const x = (idx / (trendData.length - 1)) * 100;
                    const y = 90 - (d.count / maxCount) * 80;
                    return `L ${x},${y}`;
                  }).join(' ')} L 100,100 Z`}
                  fill="url(#chart-gradient)"
                  opacity="0.12"
                />

                {/* Draw main line */}
                <path
                  d={trendData.map((d, idx) => {
                    const x = (idx / (trendData.length - 1)) * 100;
                    const y = 90 - (d.count / maxCount) * 80;
                    return `${idx === 0 ? 'M' : 'L'} ${x},${y}`;
                  }).join(' ')}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {/* Red Dots for Critical spikes */}
                {trendData.map((d, idx) => {
                  const x = (idx / (trendData.length - 1)) * 100;
                  const y = 90 - (d.count / maxCount) * 80;
                  if (d.critical > 3) {
                    return (
                      <g key={idx}>
                        <circle cx={x} cy={y} r="3.5" fill="#ef4444" />
                      </g>
                    );
                  }
                  return <circle key={idx} cx={x} cy={y} r="2.5" fill="#3b82f6" />;
                })}

                <defs>
                  <linearGradient id="chart-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart labels bottom */}
              <div className="absolute inset-x-0 -bottom-1 flex justify-between px-1 text-[9px] font-mono text-slate-400 font-semibold">
                {trendData.map((d, idx) => (
                  <span key={idx}>{d.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6 flex justify-between items-center text-xs font-mono text-slate-500">
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-sm" />
                <span>Audited Events</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-sm" />
                <span>Anomaly Spikes (&gt;3 signals)</span>
              </span>
            </div>
            <span>Average: {trendRange === '7d' ? '1,630 eps' : '350 eps'}</span>
          </div>

        </div>

        {/* Heatmap Grid */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg lg:col-span-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="space-y-0.5 mb-4 text-left">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Enterprise Risk Mapping</span>
              <h3 className="text-sm font-semibold text-slate-800">Cross-Division Heatmap Matrix</h3>
            </div>

            <div className="space-y-2 mt-4">
              {/* Heatmap Column Headers (Systems) */}
              <div className="grid grid-cols-6 gap-1 text-[8px] font-mono text-slate-400 text-center uppercase tracking-wider font-semibold">
                <div className="text-left font-sans text-slate-400 font-semibold">Dept</div>
                {systems.map((sys) => (
                  <div key={sys} className="truncate" title={sys}>{sys.split(' ')[0]}</div>
                ))}
              </div>

              {/* Heatmap Rows (Depts) */}
              <div className="space-y-1">
                {departments.map((dept) => (
                  <div key={dept} className="grid grid-cols-6 gap-1 items-center">
                    <div className="text-[10px] font-medium text-slate-500 truncate text-left font-sans pr-1">
                      {dept}
                    </div>
                    {systems.map((sys) => {
                      const score = riskMatrix[dept]?.[sys] || 10;
                      const isSelected = selectedHeatmapCell?.dept === dept && selectedHeatmapCell?.sys === sys;
                      return (
                        <button
                          key={sys}
                          onClick={() => setSelectedHeatmapCell({ dept, sys, score })}
                          className={`h-7 rounded text-[10px] font-semibold flex items-center justify-center cursor-pointer transition-all ${getHeatmapColor(score)} ${
                            isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-white scale-[1.05]' : ''
                          }`}
                          title={`${dept} in ${sys}: Score ${score}`}
                        >
                          {score}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Cell Audit Insights */}
          <div className="border-t border-slate-100 pt-4 mt-4 bg-slate-50 p-3 rounded border border-slate-200 text-left">
            {selectedHeatmapCell ? (
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Selected Hub Cell:</span>
                  <span className="text-blue-600 font-semibold">{selectedHeatmapCell.dept} ↗ {selectedHeatmapCell.sys}</span>
                </div>
                <div className="flex justify-between items-baseline mt-1">
                  <span className="text-xs text-slate-600">Signals Aggregated Index:</span>
                  <span className={`text-xs font-bold ${
                    selectedHeatmapCell.score >= 80 ? 'text-red-600' : selectedHeatmapCell.score >= 60 ? 'text-amber-600' : 'text-blue-600'
                  }`}>
                    {selectedHeatmapCell.score >= 80 ? 'CRITICAL RISK' : selectedHeatmapCell.score >= 60 ? 'ELEVATED WARNING' : 'MINIMAL'} ({selectedHeatmapCell.score}/100)
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed">
                  {selectedHeatmapCell.score >= 80 
                    ? 'Immediate security evaluation is running. Anomalous behavior match for data-transfer rules detected within this department.'
                    : 'Activity indicators reside within standard corporate threshold tolerances. No human intervention requested.'
                  }
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-slate-400 text-center py-2 font-semibold">Click a heatmap sector cell to inspect active metrics</p>
            )}
          </div>

        </div>

      </div>

      {/* Bottom Area: Active Investigations List */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <div className="space-y-0.5 text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Active SecOps Action Items</span>
            <h3 className="text-sm font-semibold text-slate-800">Active Investigation Workspace Cases</h3>
          </div>
          <button
            onClick={() => setActiveTab('workspace')}
            className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer transition-colors"
          >
            <span>Go to Workspace</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase tracking-wider font-semibold">
                <th className="py-2.5 px-3">Case ID</th>
                <th className="py-2.5 px-3">Incident Topic / Scope</th>
                <th className="py-2.5 px-3">Subject Employee</th>
                <th className="py-2.5 px-3">Assigned SecOps Owner</th>
                <th className="py-2.5 px-3 text-center">Exposure Index</th>
                <th className="py-2.5 px-3 text-center">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cases.map((c) => (
                <tr 
                  key={c.id} 
                  className="hover:bg-slate-50 transition-colors group"
                >
                  <td className="py-3 px-3 font-mono font-semibold text-blue-600">
                    {c.id}
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-800 text-left">{c.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 max-w-sm truncate text-left">{c.summary}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="font-medium text-slate-700 text-left">{c.subject.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono text-left">{c.subject.email}</div>
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-left">
                    {c.assignedTo.split(' (')[0]}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      c.overallRiskScore >= 85 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {c.overallRiskScore} / 100
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-sans font-medium uppercase tracking-wider ${
                      c.status === 'open' 
                        ? 'bg-blue-50 text-blue-600 border border-blue-100' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {c.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onSelectCase(c.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-600 rounded text-[10px] font-medium transition-all cursor-pointer"
                    >
                      <span>Analyze</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
