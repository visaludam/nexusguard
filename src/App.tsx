import React, { useState, useEffect } from 'react';
import { 
  mockIntegrations, 
  mockEvents, 
  mockCases, 
  mockPolicies, 
  mockReports 
} from './data';
import { 
  Integration, 
  AuditEvent, 
  InvestigationCase, 
  PolicyRule, 
  SecurityReport 
} from './types';
import { simulationScenarios, SimulatedEvent } from './data/simulationScenarios';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Overview from './components/Overview';
import Integrations from './components/Integrations';
import EventStream from './components/EventStream';
import Workspace from './components/Workspace';
import PolicyIntelligence from './components/PolicyIntelligence';
import ReportsPage from './components/ReportsPage';
import { ShieldAlert, Info, Sparkles, X } from 'lucide-react';

export default function App() {
  // Navigation & UI Layout State
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Data States
  const [integrations, setIntegrations] = useState<Integration[]>(mockIntegrations);
  const [events, setEvents] = useState<AuditEvent[]>(mockEvents);
  const [cases, setCases] = useState<InvestigationCase[]>(mockCases);
  const [policies, setPolicies] = useState<PolicyRule[]>(mockPolicies);
  const [reports, setReports] = useState<SecurityReport[]>(mockReports);

  // Simulation States
  const [simStatus, setSimStatus] = useState<'idle' | 'running' | 'paused'>('idle');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('normal_workday');
  const [simProcessedCount, setSimProcessedCount] = useState<number>(0);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [totalEventIngestCount, setTotalEventIngestCount] = useState<number>(1642500);
  const [platformRiskIndex, setPlatformRiskIndex] = useState<number>(74);

  // Gemini Analysis States
  const [analyses, setAnalyses] = useState<Record<string, any>>({});
  const [loadingAnalyses, setLoadingAnalyses] = useState<Record<string, boolean>>({});
  const [analysisErrors, setAnalysisErrors] = useState<Record<string, string>>({});
  
  // Global Alert State
  const [selectedCaseId, setSelectedCaseId] = useState<string>('NX-1042');
  const [lastIngestTime, setLastIngestTime] = useState<string>('Just now');
  const [bannerAlert, setBannerAlert] = useState<{title: string; desc: string; caseId: string} | null>(null);

  // Demo Script & Presentation Playbook States
  const [workspaceSubTab, setWorkspaceSubTab] = useState<'copilot' | 'timeline' | 'graph'>('copilot');
  const [demoChatMessage, setDemoChatMessage] = useState<string | null>(null);
  const [activeReportId, setActiveReportId] = useState<string>('REP-001');

  // Auto tick last ingestion time simulation
  useEffect(() => {
    const timer = setInterval(() => {
      const minutes = Math.floor(Math.random() * 5) + 1;
      setLastIngestTime(`${minutes} mins ago`);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Handlers for Integrations
  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = item.status === 'connected' ? 'disconnected' : 'connected';
        return {
          ...item,
          status: newStatus,
          lastSync: newStatus === 'connected' ? 'Just now' : item.lastSync,
          ingestRate: newStatus === 'connected' ? Math.floor(Math.random() * 80) + 10 : 0
        };
      }
      return item;
    }));
  };

  const handleAddIntegration = (name: string, type: Integration['type'], category: Integration['category']) => {
    const newIntegration: Integration = {
      id: `custom-${Date.now()}`,
      name,
      type,
      status: 'connected',
      icon: 'Workflow',
      eventsCount: 0,
      lastSync: 'Just now',
      category,
      ingestRate: Math.floor(Math.random() * 30) + 5
    };
    setIntegrations(prev => [newIntegration, ...prev]);
  };

  const handleDeleteIntegration = (id: string) => {
    setIntegrations(prev => prev.filter(item => item.id !== id));
  };

  // Handlers for Cases
  const handleToggleActionStatus = (caseId: string, actionId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return {
          ...c,
          humanActionPlan: c.humanActionPlan.map(act => {
            if (act.id === actionId) {
              return { 
                ...act, 
                status: act.status === 'completed' ? 'pending' : 'completed',
                notes: act.status === 'pending' ? 'Verified by SecOps Analyst via standard compliance review' : undefined
              };
            }
            return act;
          })
        };
      }
      return c;
    }));
  };

  const handleAddCaseComment = (caseId: string, commentText: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        // Appending comment to case summary for simulation (as mockup logs exist in the components)
        return {
          ...c,
          summary: `${c.summary}\n\n[Analyst Note]: ${commentText}`
        };
      }
      return c;
    }));
  };

  const handleUpdateCaseStatus = (caseId: string, status: InvestigationCase['status']) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId) {
        return { ...c, status };
      }
      return c;
    }));
  };

  // Handlers for Policy rules
  const handleTogglePolicy = (id: string) => {
    setPolicies(prev => prev.map(p => {
      if (p.id === id) {
        return { ...p, isActive: !p.isActive };
      }
      return p;
    }));
  };

  const handleAddPolicy = (newPol: Partial<PolicyRule>) => {
    const freshPolicy: PolicyRule = {
      id: `POL-0${policies.length + 1}`,
      name: newPol.name || 'Unnamed Rule',
      code: newPol.code || 'RULE_CUSTOM',
      description: newPol.description || '',
      category: newPol.category || 'Anomalous Activity',
      severity: newPol.severity || 'warning',
      isActive: true,
      triggerCount: 0,
      logicDescription: newPol.logicDescription || 'If true -> Alert'
    };
    setPolicies(prev => [freshPolicy, ...prev]);
  };

  // Handlers for Reports
  const handleGenerateReport = (title: string, type: SecurityReport['type'], caseId?: string) => {
    const newReport: SecurityReport = {
      id: `REP-00${reports.length + 1}`,
      title,
      type,
      generatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      generatedBy: 'SecOps Advisor (visalu.jp@gmail.com)',
      status: 'Ready',
      fileSize: `${(Math.random() * 4 + 1).toFixed(1)} MB`,
      caseId
    };
    setReports(prev => [newReport, ...prev]);
  };

  // Inject dynamic Mock Alert Ingestion Simulation!
  const handleTriggerMockAlert = () => {
    const timestamp = new Date().toISOString();
    
    // Create new Audit Event
    const newEvent: AuditEvent = {
      id: `evt-custom-${Date.now()}`,
      timestamp,
      source: 'Okta IDP',
      sourceType: 'okta',
      actor: {
        name: 'Alexander Frost',
        email: 'a.frost@enterprise.com',
        role: 'Senior Incident Analyst',
        department: 'Security Operations'
      },
      eventName: 'Anomalous Database Command Triggered',
      severity: 'critical',
      riskScore: 95,
      ipAddress: '185.190.140.22',
      location: 'Moscow, Russia (Unapproved VPN)',
      device: 'Curl-Agent / Docker Linux',
      description: 'Mass export of secure hashed customer records detected from production SQL servers.',
      metadata: {
        Command: 'pg_dump -t billing_ledger -d prod_db',
        RowsExported: 421900,
        TargetServer: 'gcp-sql-us-west-1',
        BypassMethod: 'API Session token hijacking'
      }
    };

    // Create a new corresponding Investigation Case
    const newCaseId = `NX-1045`;
    const newCase: InvestigationCase = {
      id: newCaseId,
      title: 'Database Session Hijack & SQL Dump',
      createdTime: timestamp,
      status: 'open',
      severity: 'critical',
      overallRiskScore: 95,
      assignedTo: 'Sarah Jenkins (SecOps Team Lead)',
      subject: {
        name: 'Alexander Frost',
        email: 'a.frost@enterprise.com',
        role: 'Senior Incident Analyst',
        department: 'Security Operations',
        riskTier: 'High'
      },
      summary: 'Critical alarm matching exfiltration patterns. Alexander Frost (the investigating senior analyst) triggered a root SQL pg_dump across confidential credit ledger databases from a Russian VPN IP address. Key indicators recommend immediate credential suspension and remote wiping of corporate assets.',
      possibleDataExposure: [
        {
          resourceName: 'billing_ledger_v2.sql',
          resourceType: 'Relational Cloud SQL Table',
          sensitivity: 'Restricted PII',
          action: 'Bulk Table Export',
          riskScore: 98
        }
      ],
      timeline: [
        {
          id: 't-cust-1',
          timestamp,
          source: 'okta',
          title: 'Unapproved VPN Login IP Tunnel',
          description: 'Okta session token reused from a known bulletproof proxy server registered in Eastern Europe.',
          severity: 'critical'
        },
        {
          id: 't-cust-2',
          timestamp,
          source: 'okta',
          title: 'SQL Database Dump Triggered',
          description: 'A pg_dump CLI task executed against target tables containing user hash strings and secure salts.',
          severity: 'critical'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-cust-1',
          task: 'Force-terminate Alexander Frost corporate laptop sessions immediately',
          status: 'pending',
          recommendedBy: 'NexusGuard Engine'
        },
        {
          id: 'h-cust-2',
          task: 'Lock SSH network routing keys assigned to postgres-db user accounts',
          status: 'pending',
          recommendedBy: 'Cloud SQL Protocol'
        }
      ]
    };

    // Update States
    setEvents(prev => [newEvent, ...prev]);
    setCases(prev => [newCase, ...prev]);
    
    // Increment trigger counts on policy rules
    setPolicies(prev => prev.map(p => {
      if (p.code === 'RULE_DATA_EXFIL_CLOUD_DRIVES') {
        return { ...p, triggerCount: p.triggerCount + 1 };
      }
      return p;
    }));

    // Increment integration signal counts
    setIntegrations(prev => prev.map(i => {
      if (i.type === 'okta') {
        return { ...i, eventsCount: i.eventsCount + 1 };
      }
      return i;
    }));

    // Trigger visual popover/banner toast alert in app
    setBannerAlert({
      title: '🚨 CRITICAL SECURITY ALARM INGESTED',
      desc: 'Anomalous PostgreSQL dump initiated by Alexander Frost from suspicious location.',
      caseId: newCaseId
    });

    setLastIngestTime('Just now');
  };

  // Quick Analyze utility to open Workspace from alert banner
  const handleAnalyzeFromBanner = (caseId: string) => {
    setSelectedCaseId(caseId);
    setActiveTab('workspace');
    setBannerAlert(null);
  };

  // Gemini Analysis Core Trigger
  const triggerGeminiAnalysis = async (caseId: string, caseObj?: InvestigationCase) => {
    const c = caseObj || cases.find(x => x.id === caseId);
    if (!c) return;

    setLoadingAnalyses(prev => ({ ...prev, [caseId]: true }));
    setAnalysisErrors(prev => ({ ...prev, [caseId]: '' }));

    try {
      const res = await fetch('/api/gemini/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentCase: c,
          events: events,
          policies: policies
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || errData.details || 'Failed to analyze');
      }

      const data = await res.json();
      setAnalyses(prev => ({ ...prev, [caseId]: data }));
    } catch (error: any) {
      console.error('Error during Gemini analysis:', error);
      setAnalysisErrors(prev => ({ ...prev, [caseId]: error.message || 'Unknown error' }));
    } finally {
      setLoadingAnalyses(prev => ({ ...prev, [caseId]: false }));
    }
  };

  // Simulation Reset Handler
  const handleResetSimulation = () => {
    setSimStatus('idle');
    setSimProcessedCount(0);
    setEvents(mockEvents);
    setCases(mockCases);
    setIntegrations(mockIntegrations);
    setTotalEventIngestCount(1642500);
    setPlatformRiskIndex(74);
    setBannerAlert(null);
    setAnalyses({});
    setLoadingAnalyses({});
    setAnalysisErrors({});
  };

  // Core Simulation Engine
  useEffect(() => {
    if (simStatus !== 'running') return;

    const activeScenario = simulationScenarios[selectedScenarioId];
    const eventsList = activeScenario?.events || [];
    
    if (simProcessedCount >= eventsList.length) {
      setSimStatus('idle');
      return;
    }

    // Interval time matches speed: x1 = 3000ms, x5 = 1000ms, x10 = 400ms
    const intervalTime = Math.max(300, 3000 / simSpeed);

    const timer = setTimeout(() => {
      const simEvent = eventsList[simProcessedCount];
      const timestamp = new Date().toISOString();
      
      const newEvent: AuditEvent = {
        id: `sim-evt-${Date.now()}-${simProcessedCount}`,
        timestamp,
        source: simEvent.source,
        sourceType: simEvent.sourceType,
        actor: simEvent.actor,
        eventName: simEvent.eventName,
        severity: simEvent.severity,
        riskScore: simEvent.riskScore,
        ipAddress: simEvent.ipAddress,
        location: simEvent.location,
        device: simEvent.device,
        description: simEvent.description,
        metadata: simEvent.metadata
      };

      // Add to events state
      setEvents(prev => [newEvent, ...prev]);

      // Update total events count
      setTotalEventIngestCount(prev => prev + 1);

      // Adjust platform risk index to reflect latest active risk score
      setPlatformRiskIndex(newEvent.riskScore);

      // Auto-trigger analysis for non-incident high-risk events (risk >= 75)
      if (newEvent.riskScore >= 75 && !(simEvent.triggerIncident && activeScenario.associatedCase)) {
        triggerGeminiAnalysis(selectedCaseId);
      }

      // Update Integration counter
      setIntegrations(prev => prev.map(i => {
        if (i.type === newEvent.sourceType) {
          return {
            ...i,
            eventsCount: i.eventsCount + 1,
            lastSync: 'Just now',
            ingestRate: Math.max(i.ingestRate, 10) + Math.floor(Math.random() * 5)
          };
        }
        return i;
      }));

      // Trigger incident / case if applicable
      if (simEvent.triggerIncident && activeScenario.associatedCase) {
        const caseId = `${activeScenario.associatedCase.idPrefix}-${1000 + cases.length + 1}`;
        const newCase: InvestigationCase = {
          id: caseId,
          title: activeScenario.associatedCase.title,
          createdTime: timestamp,
          status: 'open',
          severity: activeScenario.associatedCase.severity,
          overallRiskScore: activeScenario.associatedCase.overallRiskScore,
          assignedTo: activeScenario.associatedCase.assignedTo,
          subject: activeScenario.associatedCase.subject,
          summary: activeScenario.associatedCase.summary,
          possibleDataExposure: activeScenario.associatedCase.possibleDataExposure,
          timeline: activeScenario.associatedCase.timeline.map((t, idx) => ({
            ...t,
            id: `sim-t-${Date.now()}-${idx}`,
            timestamp: new Date(Date.now() - (activeScenario.associatedCase!.timeline.length - idx) * 60000).toISOString()
          })),
          humanActionPlan: activeScenario.associatedCase.humanActionPlan
        };

        setCases(prev => [newCase, ...prev]);
        setSelectedCaseId(caseId);

        // Notify with system alert banner
        setBannerAlert({
          title: `🚨 CRITICAL THREAT INGESTED [SIM]`,
          desc: `${newCase.title} for employee ${newCase.subject.name}`,
          caseId: caseId
        });

        // Auto-analyze newly created high-risk case with Gemini
        triggerGeminiAnalysis(caseId, newCase);
      }

      setSimProcessedCount(prev => prev + 1);
    }, intervalTime);

    return () => clearTimeout(timer);
  }, [simStatus, simProcessedCount, simSpeed, selectedScenarioId, cases.length]);

  const currentCriticalCount = cases.filter(c => c.status === 'open' && c.severity === 'critical').length;

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans select-none" id="nexus-app-root">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        collapsed={collapsed} 
        setCollapsed={setCollapsed} 
      />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Banner Alert Toast */}
        {bannerAlert && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-3 flex items-center justify-between gap-4 text-xs select-none">
            <div className="flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
              <div className="text-left">
                <span className="font-bold text-red-800 block uppercase tracking-wider text-[10px] font-mono">
                  {bannerAlert.title}
                </span>
                <p className="text-red-700 mt-0.5 leading-tight">{bannerAlert.desc}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => handleAnalyzeFromBanner(bannerAlert.caseId)}
                className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded transition-all cursor-pointer font-mono shadow-sm"
              >
                ANALYZE CASE [{bannerAlert.caseId}]
              </button>
              <button
                onClick={() => setBannerAlert(null)}
                className="text-red-400 hover:text-red-700 p-1 cursor-pointer"
                title="Dismiss warning toast"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Global System Header */}
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onTriggerMockAlert={handleTriggerMockAlert}
          systemAlertCount={currentCriticalCount}
          lastIngestTime={lastIngestTime}
        />

        {/* Sub-Header Breadcrumb ribbon */}
        <div className="bg-slate-50 border-b border-slate-200 h-10 px-6 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">NEXUSGUARD</span>
            <span>/</span>
            <span className="text-blue-600 font-semibold uppercase">{activeTab}</span>
            {searchQuery && (
              <>
                <span>/</span>
                <span className="text-slate-400 font-normal">Filtered: "{searchQuery}"</span>
              </>
            )}
          </div>
          <div className="hidden sm:flex items-center gap-3.5 text-[11px] text-slate-500">
            <span>SaaS Signal Pipeline: <strong className="text-emerald-600">NOMINAL</strong></span>
            <span>•</span>
            <span>GCP Project: <strong className="text-slate-700">nexus-secops-prod</strong></span>
          </div>
        </div>

        {/* Active Page View Wrapper */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <Overview 
                cases={cases}
                events={events}
                integrations={integrations}
                totalEventIngestCount={totalEventIngestCount}
                platformRiskIndex={platformRiskIndex}
                onSelectCase={(id) => {
                  setSelectedCaseId(id);
                  setActiveTab('workspace');
                }}
                setActiveTab={setActiveTab}
              />
            )}

            {activeTab === 'integrations' && (
              <Integrations 
                integrations={integrations}
                onToggleStatus={handleToggleIntegration}
                onAddIntegration={handleAddIntegration}
                onDeleteIntegration={handleDeleteIntegration}
              />
            )}

            {activeTab === 'events' && (
              <EventStream 
                events={events}
                integrations={integrations}
                simStatus={simStatus}
                setSimStatus={setSimStatus}
                selectedScenarioId={selectedScenarioId}
                setSelectedScenarioId={setSelectedScenarioId}
                simProcessedCount={simProcessedCount}
                simSpeed={simSpeed}
                setSimSpeed={setSimSpeed}
                handleResetSimulation={handleResetSimulation}
              />
            )}

            {activeTab === 'workspace' && (
              <Workspace 
                cases={cases}
                events={events}
                policies={policies}
                selectedCaseId={selectedCaseId}
                setSelectedCaseId={setSelectedCaseId}
                onToggleActionStatus={handleToggleActionStatus}
                onAddCaseComment={handleAddCaseComment}
                onUpdateCaseStatus={handleUpdateCaseStatus}
                analyses={analyses}
                loadingAnalyses={loadingAnalyses}
                analysisErrors={analysisErrors}
                onAnalyzeWithGemini={triggerGeminiAnalysis}
                activeSubTab={workspaceSubTab}
                onSubTabChange={setWorkspaceSubTab}
                demoChatMessage={demoChatMessage}
                onClearDemoChatMessage={() => setDemoChatMessage(null)}
              />
            )}

            {activeTab === 'policy' && (
              <PolicyIntelligence 
                policies={policies}
                onTogglePolicy={handleTogglePolicy}
                onAddPolicy={handleAddPolicy}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsPage 
                reports={reports}
                cases={cases}
                analyses={analyses}
                activeReportId={activeReportId}
                onSelectReportId={setActiveReportId}
                onGenerateReport={handleGenerateReport}
              />
            )}
          </div>
        </main>



      </div>

    </div>
  );
}
