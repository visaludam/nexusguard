import React, { useState } from 'react';
import { 
  Clock, Compass, Lock, GitBranch, FileText, ShieldAlert, AlertTriangle, 
  ChevronRight, TrendingUp, TrendingDown, BookOpen, FileQuestion, ArrowRight,
  Database, Info, Layers, Eye
} from 'lucide-react';
import { InvestigationCase, Integration } from '../types';

interface IncidentTimelineProps {
  currentCase: InvestigationCase;
}

interface EventImpactDetails {
  whyMatters: string;
  concern: 'increases' | 'reduces' | 'neutral';
  concernReason: string;
  evidence: string;
  policy: {
    id: string;
    name: string;
    relevance: string;
  } | null;
}

export default function IncidentTimeline({ currentCase }: IncidentTimelineProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(
    currentCase.timeline[0]?.id || ''
  );

  // Helper to map event ID to detailed forensic explanation
  const getEventImpactDetails = (
    id: string,
    title: string,
    desc: string,
    source: string
  ): EventImpactDetails => {
    // 1. Check known IDs for Jonathan Vance Case (NX-1042)
    if (id === 't-1' || title.toLowerCase().includes('impossible') || title.toLowerCase().includes('geographic')) {
      return {
        whyMatters: "A simultaneous authorization from Singapore occurred immediately following authentication from standard local office hours. This physical separation is mathematically travel-impossible (geo-velocity impossibility), strongly indicating credential exposure or session-token hijacking.",
        concern: 'increases',
        concernReason: "Significantly raises suspicion of external state-actor proxy routing or stolen session-cookie reuse from a high-frequency offshore tunnel.",
        evidence: "Okta IDP log IP: 103.242.108.4 (Telecom Singapore). Speed comparison: >10,000 km traveled in 15 minutes.",
        policy: {
          id: "POL-02",
          name: "Multi-Region Concurrent Authentication Rule",
          relevance: "Explicitly triggers Critical Severity alerts when concurrent sessions reside beyond 1,000km and TimeDelta is under 4 hours."
        }
      };
    }

    if (id === 't-2' || title.toLowerCase().includes('bypass') || title.toLowerCase().includes('helpdesk')) {
      return {
        whyMatters: "Bypassing the standard physical multi-factor token via telephonic reset logs indicates the threat actor leveraged social-engineering against IT HelpDesk operators, successfully exploiting human trust to gain full directory access.",
        concern: 'increases',
        concernReason: "Verifies that security bypass was active and that physical multi-factor tokens were actively circumvented to facilitate access.",
        evidence: "ServiceDesk Incident Request #HD-9081 telephone reset verification logs matching automated cellular caller ID spoof records.",
        policy: {
          id: "POL-04",
          name: "Unverified OAuth Application Consent",
          relevance: "Contravenes strict guidelines concerning unvetted, telephone-only administrative credential re-keying protocols."
        }
      };
    }

    if (id === 't-3' || title.toLowerCase().includes('ledger') || title.toLowerCase().includes('downloaded')) {
      return {
        whyMatters: "The file 'customer_pii_ledger_v2.parquet' contains encrypted billing parameters and columns of highly sensitive consumer attributes. Bulk downloading this offline extracts it from secure IAM boundaries into the local filesystem.",
        concern: 'increases',
        concernReason: "Direct corporate data exposure. Highly consistent with systematic preparation for exfiltration or database scraping.",
        evidence: "Google Workspace Audit: Drive Bulk Download payload of 412.4 MB from team folder '/Finances_2026_Restricted'.",
        policy: {
          id: "POL-01",
          name: "Data Exfiltration via Unapproved Cloud Storage",
          relevance: "Imposes strict restrictions against extracting structured databases containing customer ledger metrics offline."
        }
      };
    }

    if (id === 't-4' || title.toLowerCase().includes('oauth') || title.toLowerCase().includes('unverified client')) {
      return {
        whyMatters: "Approving unverified clients (like 'SheetsExportAI') registers persistent API scopes directly on the Workspace container. This lets foreign third-party developer keys read and sync files without requiring the user's laptop to remain online.",
        concern: 'increases',
        concernReason: "Establishes a persistent, cloud-to-cloud backchannel for data extraction that is completely invisible to standard endpoint security clients.",
        evidence: "GWS Admin console audit: OAuth client_id: 942-8851-gws approved scopes: 'drive.readonly, drive.metadata.readonly'.",
        policy: {
          id: "POL-04",
          name: "Unverified OAuth Application Consent",
          relevance: "Triggers immediate containment protocols when unvetted client applications request broad metadata or file-reading privileges."
        }
      };
    }

    // 2. Dr. Elena Rostova Case (NX-1043)
    if (id === 't-11' || title.toLowerCase().includes('ssh key') || title.toLowerCase().includes('ssh authentication')) {
      return {
        whyMatters: "Adding a personal SSH key off-VPN permits persistent, direct command-line cloning of proprietary codebase folders directly to household servers, bypassing standardized corporate network visibility rules.",
        concern: 'increases',
        concernReason: "Introduces alternative access routes that bypass the secure gateway and allow direct repository synchronization.",
        evidence: "GitHub Portal audit logs: Registered key 'Elena-HomeWS' from residential IP allocation in Geneva.",
        policy: {
          id: "POL-03",
          name: "Anomalous Late Night Repository Activity",
          relevance: "Monitors and limits the registration of personal SSH credentials outside of standard VPN proxy hours."
        }
      };
    }

    if (id === 't-12' || title.toLowerCase().includes('bulk clone') || title.toLowerCase().includes('cloned')) {
      return {
        whyMatters: "Cloning 14 code repositories containing core deep learning model routers and secure weights in a single night is highly anomalous. While engineering staff develop daily, typical workflow uses cached models, not raw directory clones.",
        concern: 'increases',
        concernReason: "Signals systematic acquisition of proprietary AI designs, intellectual property, and routing scripts for potential offboarding misuse.",
        evidence: "GitHub SSH audit stream: SSH-2.0-OpenSSH_8.9p1 connection pull requests for 14 repositories within 20 minutes.",
        policy: {
          id: "POL-03",
          name: "Anomalous Late Night Repository Activity",
          relevance: "Triggers on high volume code repository sync actions completed during off-VPN hours (11:00 PM to 5:00 AM)."
        }
      };
    }

    // 3. Sarah Connor Case (NX-1044)
    if (id === 't-21' || title.toLowerCase().includes('crm leads') || title.toLowerCase().includes('report exported')) {
      return {
        whyMatters: "Exporting CRM subscriber reports extracts direct enterprise ARR columns and client cell numbers. If shared or taken, this allows direct poaching of competitive active customer listings.",
        concern: 'increases',
        concernReason: "Represents direct, highly focused data harvesting of the highest-value sales directories.",
        evidence: "Salesforce CRM Transaction Log: CSV export triggered for report 'West_Active_Subscribers_Q2' by s.connor@enterprise.com.",
        policy: {
          id: "POL-01",
          name: "Data Exfiltration via Unapproved Cloud Storage",
          relevance: "Restricts bulk exports of client ARR statistics, lead pipelines, and subscription logs."
        }
      };
    }

    if (id === 't-22' || title.toLowerCase().includes('extension') || title.toLowerCase().includes('uploader')) {
      return {
        whyMatters: "Installing 'BoxUploaderPro' to establish direct SSL handshakes with box.com upload servers deliberately bypasses secure gateway firewalls, encrypting files on-the-fly to prevent inspection.",
        concern: 'increases',
        concernReason: "Verifies active deployment of specialized bypass proxy software to execute file transfers.",
        evidence: "Endpoint security extension alert: Direct upload tunnel established to upload.box.com uploading 4.2 GB of unstructured files.",
        policy: {
          id: "POL-01",
          name: "Data Exfiltration via Unapproved Cloud Storage",
          relevance: "Bans use of unapproved browser plugins that encrypt uploads to unmonitored personal cloud drives."
        }
      };
    }

    // 4. Alexander Frost (NX-1045)
    if (id === 't-cust-1' || title.toLowerCase().includes('unapproved vpn') || title.toLowerCase().includes('moscow')) {
      return {
        whyMatters: "Logging in via high-risk VPN servers located in Eastern Europe with active session reuse bypasses standard geopolitical routing boundaries, highly matching token stealing tactics.",
        concern: 'increases',
        concernReason: "High risk of credential trading or active session hijack by foreign darknet brokers.",
        evidence: "Okta session IP mapping: 185.190.140.22 (Eastern Europe unapproved VPN node).",
        policy: {
          id: "POL-02",
          name: "Multi-Region Concurrent Authentication Rule",
          relevance: "Bars credentials originating from unapproved networks and VPN blocks associated with darknet routing."
        }
      };
    }

    if (id === 't-cust-2' || title.toLowerCase().includes('sql') || title.toLowerCase().includes('dump')) {
      return {
        whyMatters: "Using the command-line utility 'pg_dump' extracts the entire billing ledger structure including passwords and salts. Running this administrative tool off-VPN bypasses standard API gateway logging layers.",
        concern: 'increases',
        concernReason: "Full-scale database extraction. Represents complete exfiltration of sensitive transactional tables.",
        evidence: "Cloud SQL postgres-db daemon audit: EXEC pg_dump -t billing_ledger -d prod_db.",
        policy: {
          id: "POL-05",
          name: "Mass File Access with Deletion Signature",
          relevance: "Restricts raw database exports to vetted administrative maintenance schedules."
        }
      };
    }

    // Fallback/Reducing concern case (e.g. if analyst confirmed it, or dynamic simulated events)
    if (title.toLowerCase().includes('confirm') || title.toLowerCase().includes('verified') || title.toLowerCase().includes('legitimate') || desc.toLowerCase().includes('spoke briefly') || desc.toLowerCase().includes('confirmed')) {
      return {
        whyMatters: "Direct human-to-human verification provides crucial out-of-band context. If the employee confirms they added a key, performed a training task, or ran a debug sequence, this significantly clarifies intent.",
        concern: 'reduces',
        concernReason: "Lowers concern as there is a clear, valid business justification behind the anomalous logs, indicating it is likely a benign or authorized testing task.",
        evidence: "Analyst follow-up telephone review, validated by direct voice contact with subject employee.",
        policy: null
      };
    }

    // Default dynamic fallback
    const isReducing = desc.toLowerCase().includes('allow') || desc.toLowerCase().includes('nominal') || desc.toLowerCase().includes('approve') || desc.toLowerCase().includes('legit');
    return {
      whyMatters: `This event recorded a specific operation (${title}) from system source '${source.toUpperCase()}'. Auditing the precise file path, user parameters, and timestamps helps trace security anomalies.`,
      concern: isReducing ? 'reduces' : 'increases',
      concernReason: isReducing 
        ? "Lowers concern because it matches standard operational workflows or explicit business authorizations." 
        : "Raises concern by registering anomalous behaviors that diverge from standard team development templates.",
      evidence: `System audit event: "${desc}"`,
      policy: null
    };
  };

  const getSourceIcon = (source: string) => {
    switch (source.toLowerCase()) {
      case 'google_workspace':
      case 'google':
        return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'okta':
      case 'okta_idp':
        return <Lock className="w-4 h-4 text-purple-400" />;
      case 'github':
        return <GitBranch className="w-4 h-4 text-gray-200" />;
      case 'slack':
        return <FileText className="w-4 h-4 text-pink-400" />;
      case 'salesforce':
        return <Database className="w-4 h-4 text-blue-400" />;
      default:
        return <ShieldAlert className="w-4 h-4 text-amber-400" />;
    }
  };

  const activeEvent = currentCase.timeline.find(e => e.id === selectedEventId) || currentCase.timeline[0];
  const activeImpact = activeEvent 
    ? getEventImpactDetails(activeEvent.id, activeEvent.title, activeEvent.description, activeEvent.source)
    : null;

  return (
    <div className="space-y-4" id="nexus-incident-timeline">
      
      {/* Visual Subtitle banner */}
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Incident File</span>
          <h4 className="text-xs font-bold text-slate-700 font-mono">
            {currentCase.id} Timeline: {currentCase.timeline.length} Aggregated Forensic Signals
          </h4>
        </div>
        <div className="text-[9px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-mono font-bold uppercase">
          FORENSIC TRAIL
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left column (6 cols): The vertical timeline of events */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider text-left border-b border-slate-100 pb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Event Chronological Sequence</span>
          </h3>

          <div className="relative border-l border-slate-200 ml-4 pl-6 space-y-5 py-2">
            {currentCase.timeline.map((item) => {
              const isSelected = item.id === selectedEventId;
              const impact = getEventImpactDetails(item.id, item.title, item.description, item.source);
              
              return (
                <div 
                  key={item.id} 
                  onClick={() => setSelectedEventId(item.id)}
                  className={`relative text-left p-3 rounded-lg transition-all border cursor-pointer select-none ${
                    isSelected 
                      ? 'bg-blue-50/50 border-blue-200 shadow-sm scale-[1.01]' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  {/* Circle dot on vertical line */}
                  <div className={`absolute -left-[37px] top-4.5 w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                    isSelected 
                      ? 'bg-blue-50 border-blue-300 scale-110' 
                      : 'bg-white border-slate-200'
                  }`}>
                    {getSourceIcon(item.source)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <h4 className={`text-xs font-bold transition-colors ${isSelected ? 'text-slate-900' : 'text-slate-700'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[9px] font-mono text-slate-500 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} UTC
                      </span>
                    </div>
                    
                    <p className="text-[11px] text-slate-600 leading-relaxed truncate max-w-lg">
                      {item.description}
                    </p>

                    <div className="flex items-center gap-3 pt-1 text-[9px] font-mono text-slate-500 font-bold">
                      <span className="uppercase">{item.source.replace('_', ' ')}</span>
                      <span>•</span>
                      <span className={item.severity === 'critical' ? 'text-red-600' : 'text-amber-600'}>
                        {item.severity.toUpperCase()}
                      </span>
                      <span>•</span>
                      <span className={`inline-flex items-center gap-1 ${
                        impact.concern === 'increases' ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        {impact.concern === 'increases' ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>{impact.concern === 'increases' ? 'Raises Concern' : 'Reduces Concern'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column (5 cols): Dynamic Forensic Detail Investigator */}
        <div className="lg:col-span-5 space-y-4">
          {activeEvent && activeImpact ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left space-y-4 animate-fade-in relative overflow-hidden">
              {/* Highlight background glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full filter blur-3xl pointer-events-none ${
                activeImpact.concern === 'increases' ? 'bg-red-500/5' : 'bg-emerald-500/5'
              }`} />

              <div className="border-b border-slate-100 pb-3">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Signal Analyzer Inspector</span>
                <h3 className="text-sm font-bold text-slate-800 font-display mt-0.5">{activeEvent.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[9px] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded font-mono font-semibold text-slate-500 uppercase">
                    ID: {activeEvent.id}
                  </span>
                  <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border flex items-center gap-1 uppercase ${
                    activeImpact.concern === 'increases' 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {activeImpact.concern === 'increases' ? (
                      <>
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span>Raises Concern</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Reduces Concern</span>
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* WHY IT MATTERS */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                  <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
                  <span>Why this Matters</span>
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded border border-slate-150 shadow-inner">
                  {activeImpact.whyMatters}
                </p>
              </div>

              {/* SECURITY CONCERN CHANGE EXPLANATION */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  <span>Concern Assessment</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {activeImpact.concernReason}
                </p>
              </div>

              {/* FORENSIC EVIDENCE DETAIL */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" />
                  <span>Related Audit Evidence</span>
                </h4>
                <div className="bg-slate-50 border border-slate-150 p-3 rounded text-[11px] font-mono text-slate-600 leading-relaxed break-all">
                  {activeImpact.evidence}
                </div>
              </div>

              {/* RELATED POLICY RULE MATCH */}
              {activeImpact.policy && (
                <div className="space-y-2 border-t border-slate-100 pt-3">
                  <h4 className="text-[10px] font-mono font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>Related Corporate Policy</span>
                  </h4>
                  <div className="bg-amber-50/50 border border-amber-200/60 rounded-md p-3.5 text-xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded border border-amber-200 uppercase shrink-0">
                        {activeImpact.policy.id}
                      </span>
                      <span className="font-bold text-slate-800 text-xs">{activeImpact.policy.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed font-semibold italic">
                      Relevance: {activeImpact.policy.relevance}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 italic text-xs shadow-sm">
              Select an event from the chronological sequence to inspect deep forensic assessments.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
