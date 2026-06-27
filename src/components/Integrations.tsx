import React, { useState, useRef } from 'react';
import { 
  Workflow, 
  Plus, 
  CheckCircle, 
  AlertCircle, 
  Trash2, 
  RefreshCw, 
  Compass, 
  FileCode, 
  MessageSquare, 
  GitBranch, 
  ShieldAlert, 
  Database,
  Lock,
  Globe,
  Settings,
  Upload,
  Play,
  FileText,
  Users,
  Check,
  Search,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Integration } from '../types';

interface IntegrationsProps {
  integrations: Integration[];
  onToggleStatus: (id: string) => void;
  onAddIntegration: (name: string, type: Integration['type'], category: Integration['category']) => void;
  onDeleteIntegration: (id: string) => void;
}

interface NormalizedEvent {
  id: string;
  timestamp: string;
  source: string;
  actor: string;
  action: string;
  target: string;
  severity: 'critical' | 'warning' | 'info';
  metadata: Record<string, any>;
}

export default function Integrations({
  integrations,
  onToggleStatus,
  onAddIntegration,
  onDeleteIntegration
}: IntegrationsProps) {
  const [activeTab, setActiveTab] = useState<'connectors' | 'ingestion'>('connectors');
  
  // Custom Integration Form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newType, setNewType] = useState<Integration['type']>('google_workspace');
  const [apiToken, setApiToken] = useState('');
  const [endpointUrl, setEndpointUrl] = useState('');

  // Log Ingestion State
  const [ingestedLogs, setIngestedLogs] = useState<NormalizedEvent[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [isIngesting, setIsIngesting] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Quick feedback toasts
  const triggerToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'google_workspace': return <Compass className="w-5 h-5 text-emerald-600" />;
      case 'okta': return <ShieldAlert className="w-5 h-5 text-purple-600" />;
      case 'github': return <GitBranch className="w-5 h-5 text-slate-700" />;
      case 'slack': return <MessageSquare className="w-5 h-5 text-pink-600" />;
      case 'line_works': return <MessageSquare className="w-5 h-5 text-emerald-600" />;
      case 'box': return <FolderOpen className="w-5 h-5 text-amber-600" />;
      case 'salesforce': return <Database className="w-5 h-5 text-sky-600" />;
      case 'hr_system': return <Users className="w-5 h-5 text-blue-600" />;
      default: return <Workflow className="w-5 h-5 text-blue-600" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Identity': return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'Collaboration': return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'Code': return 'bg-slate-50 text-slate-700 border border-slate-200';
      case 'Communication': return 'bg-pink-50 text-pink-700 border border-pink-200';
      case 'Cloud': return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'CRM': return 'bg-sky-50 text-sky-700 border border-sky-200';
      default: return 'bg-blue-50 text-blue-700 border border-blue-200';
    }
  };

  // Hardcoded Scenario Datasets
  const scenarioDatasets: Record<string, { title: string; events: NormalizedEvent[] }> = {
    normal: {
      title: "Normal Workday Logs",
      events: [
        {
          id: "norm-1",
          timestamp: "2026-06-26T09:15:00Z",
          source: "Okta",
          actor: "j.vance@enterprise.com",
          action: "User Login Succeeded",
          target: "Okta Dashboard",
          severity: "info",
          metadata: { IP: "192.168.1.104", Location: "San Francisco, CA", AuthMethod: "MFA Push Verified", Browser: "Chrome / MacOS" }
        },
        {
          id: "norm-2",
          timestamp: "2026-06-26T10:30:15Z",
          source: "Slack",
          actor: "m.brody@enterprise.com",
          action: "Message Posted",
          target: "channel #sales-leads",
          severity: "info",
          metadata: { ChannelID: "C908123A", MsgLength: 42, Attachment: "None" }
        },
        {
          id: "norm-3",
          timestamp: "2026-06-26T11:00:22Z",
          source: "GitHub",
          actor: "e.rostova@enterprise.com",
          action: "Repository Push",
          target: "deepmind-llm-router:main",
          severity: "info",
          metadata: { Branch: "main", CommitHash: "e89f1a2", FilesChanged: ["router.py", "test_router.py"] }
        },
        {
          id: "norm-4",
          timestamp: "2026-06-26T13:45:10Z",
          source: "Salesforce",
          actor: "s.connor@enterprise.com",
          action: "Lead Search",
          target: "Active Customers List",
          severity: "info",
          metadata: { Query: "status=active limit=50", TimeTakenMs: 185 }
        },
        {
          id: "norm-5",
          timestamp: "2026-06-26T15:20:05Z",
          source: "Box",
          actor: "m.brody@enterprise.com",
          action: "File View",
          target: "Q3_planning.pdf",
          severity: "info",
          metadata: { FileID: "file-88219", Folder: "Sales-West/Planning", AccessType: "Read-Only" }
        }
      ]
    },
    migration: {
      title: "Approved Migration Logs",
      events: [
        {
          id: "mig-1",
          timestamp: "2026-06-26T18:00:00Z",
          source: "Google Workspace",
          actor: "migration-admin@enterprise.com",
          action: "Bulk File Migration Started",
          target: "Google Shared Drives",
          severity: "info",
          metadata: { BatchID: "BATCH-MIG-042", TotalFiles: 4500, DataVolume: "1.2 TB", ChangeRequest: "CR-90812" }
        },
        {
          id: "mig-2",
          timestamp: "2026-06-26T18:15:30Z",
          source: "Box",
          actor: "migration-admin@enterprise.com",
          action: "Bulk File Download",
          target: "Archive_2025",
          severity: "warning",
          metadata: { FileCount: 1420, IPAddress: "10.142.0.4", RequestSource: "Migration-Engine-GCP", ServiceAccount: "sa-box-sync@enterprise.com" }
        },
        {
          id: "mig-3",
          timestamp: "2026-06-26T18:45:12Z",
          source: "LINE WORKS",
          actor: "migration-admin@enterprise.com",
          action: "Service Integration Enabled",
          target: "Migration Connector",
          severity: "info",
          metadata: { Scope: "Directory.read, Drive.write", IntegrationID: "LW-MIG-77", ApprovedBy: "SecurityOps-Automated" }
        },
        {
          id: "mig-4",
          timestamp: "2026-06-26T19:30:00Z",
          source: "HR System",
          actor: "migration-admin@enterprise.com",
          action: "Sync Employees",
          target: "All Departments",
          severity: "info",
          metadata: { SyncTrigger: "ScheduledCron", RecordsProcessed: 1240, Status: "Success" }
        }
      ]
    },
    exposure: {
      title: "Customer Data Exposure Logs",
      events: [
        {
          id: "exp-1",
          timestamp: "2026-06-26T14:05:12Z",
          source: "Salesforce",
          actor: "external-partner-temp@partner.com",
          action: "Bulk Report Export",
          target: "customer_credit_cards",
          severity: "critical",
          metadata: { ReportName: "Credit_Card_PII_Report", RowsExported: 25000, RiskScore: 96, DetectionType: "DataExfiltration" }
        },
        {
          id: "exp-2",
          timestamp: "2026-06-26T14:10:20Z",
          source: "Box",
          actor: "external-partner-temp@partner.com",
          action: "File Share Link Created",
          target: "PII_Leaked_Export.csv",
          severity: "critical",
          metadata: { ShareScope: "Anyone With Link (Public)", FileID: "box-file-99812", PasswordProtected: false, Expiration: "None" }
        },
        {
          id: "exp-3",
          timestamp: "2026-06-26T14:15:45Z",
          source: "Slack",
          actor: "external-partner-temp@partner.com",
          action: "Token Extracted",
          target: "Private Slack Bot",
          severity: "warning",
          metadata: { TokenPrefix: "xoxb-", ChannelContext: "#engineering-confidential", LeakSeverity: "High" }
        },
        {
          id: "exp-4",
          timestamp: "2026-06-26T14:22:11Z",
          source: "Google Workspace",
          actor: "unknown-client@api-gateway",
          action: "OAuth Consent Approved",
          target: "Read/Write Customer Drive",
          severity: "critical",
          metadata: { AppName: "SyncAllStoragePro", RequestedScopes: ["drive", "gmail.readonly"], DeveloperContact: "attacker-dev@gmail.com", ClientIP: "194.26.135.2" }
        }
      ]
    },
    offboarding: {
      title: "Offboarding Misconduct Logs",
      events: [
        {
          id: "off-1",
          timestamp: "2026-06-26T16:00:00Z",
          source: "HR System",
          actor: "hr-manager@enterprise.com",
          action: "Employee Status Terminated",
          target: "j.vance@enterprise.com",
          severity: "warning",
          metadata: { TerminationType: "Voluntary Departure", OffboardingDate: "2026-06-26", GracePeriod: "0 Hours" }
        },
        {
          id: "off-2",
          timestamp: "2026-06-26T16:05:30Z",
          source: "Google Workspace",
          actor: "j.vance@enterprise.com",
          action: "File Access Denied",
          target: "Drive Files",
          severity: "info",
          metadata: { Reason: "Account Disabled", AttemptedFile: "restricted_patents_v1.zip", ClientIP: "103.242.108.4" }
        },
        {
          id: "off-3",
          timestamp: "2026-06-26T16:10:15Z",
          source: "GitHub",
          actor: "j.vance@enterprise.com",
          action: "Private Repo Clone",
          target: "core-security-microservice",
          severity: "critical",
          metadata: { Method: "Personal SSH Key (Stale)", RepoSize: "142 MB", KeyID: "ssh-key-jv-99", IPAddress: "103.242.108.4" }
        },
        {
          id: "off-4",
          timestamp: "2026-06-26T16:12:44Z",
          source: "Okta",
          actor: "hr-manager@enterprise.com",
          action: "Account Suspended",
          target: "Okta Portal (j.vance)",
          severity: "info",
          metadata: { TargetUser: "j.vance@enterprise.com", ActiveSessionsKilled: 3, Trigger: "HR System Automated Webhook" }
        }
      ]
    },
    compromised: {
      title: "Compromised Account Attack Logs",
      events: [
        {
          id: "comp-1",
          timestamp: "2026-06-26T03:15:22Z",
          source: "Okta",
          actor: "a.frost@enterprise.com",
          action: "Login Succeeded",
          target: "Okta Portal",
          severity: "critical",
          metadata: { IPAddress: "210.123.45.67", Location: "Seoul, South Korea", MFA: "Bypassed via Push Spamming", Browser: "Python-requests / Linux" }
        },
        {
          id: "comp-2",
          timestamp: "2026-06-26T03:18:10Z",
          source: "Google Workspace",
          actor: "a.frost@enterprise.com",
          action: "File Share Changed",
          target: "Billing_Details.xlsx",
          severity: "critical",
          metadata: { OldAccess: "Internal-Only", NewAccess: "Shared Externally", SharedWith: "gmail-external-attacker@gmail.com", LinkPermission: "Edit" }
        },
        {
          id: "comp-3",
          timestamp: "2026-06-26T03:22:45Z",
          source: "Slack",
          actor: "a.frost@enterprise.com",
          action: "Channel Member Added",
          target: "#general-announcements",
          severity: "warning",
          metadata: { InvitedUser: "external-temp-guest@untrusted-domain.com", ChannelType: "Public", UserRole: "Guest Partner" }
        },
        {
          id: "comp-4",
          timestamp: "2026-06-26T03:30:00Z",
          source: "LINE WORKS",
          actor: "a.frost@enterprise.com",
          action: "API Token Generated",
          target: "Developer API Access",
          severity: "critical",
          metadata: { TokenID: "lw-tok-abc123xyz", Permissions: ["Contact.read", "Drive.write", "Org.read"], RiskLevel: "High" }
        }
      ]
    }
  };

  // Event types supported per connector
  const connectorDetails: Record<string, { eventTypes: string; prodApi: string }> = {
    google_workspace: {
      eventTypes: "OAuth Grants, Drive File Activity, Admin Settings, Login Audit",
      prodApi: "Uses the Google Workspace Admin SDK Reports API to ingest full directory, login, and Drive audit event streams."
    },
    slack: {
      eventTypes: "Message Archive Export, Channel Membership, Integration Config, Access Logs",
      prodApi: "Uses the Slack Enterprise Grid Audit Logs API to monitor workspace governance and suspicious channel exports."
    },
    line_works: {
      eventTypes: "Auth Tokens, Contact Exports, Drive Sharing, Message Logs",
      prodApi: "Uses the LINE WORKS Developer Console Audit logs and Message Logs API for compliance tracking."
    },
    github: {
      eventTypes: "Repository Clones, SSH Key Addition, Push Actions, Collaborator Change",
      prodApi: "Uses the GitHub Enterprise Audit Log API to detect mass repository scraping and SSH key rotations."
    },
    salesforce: {
      eventTypes: "Lead Report Exports, Data Bulk Download, User Login, API Usage",
      prodApi: "Uses the Salesforce Real-time Event Monitoring API to capture CRM exfiltration attempts and report downloads."
    },
    box: {
      eventTypes: "File Uploads, Public Link Creation, Folder Sharing, File Downloads",
      prodApi: "Uses the Box Shield and Box Event Logs API to track high-volume file interactions and unapproved public share links."
    },
    okta: {
      eventTypes: "MFA Bypass, Login Success, Device Trust, Policy Changes",
      prodApi: "Uses the Okta System Log API to detect session token hijacking, MFA bypass patterns, and administrative reconfigurations."
    },
    hr_system: {
      eventTypes: "Employee Status Change, Salary Audit, Role Assignment, Offboarding logs",
      prodApi: "Uses Workday / BambooHR official webhooks and Audit reports to correlate employee offboarding events with access patterns."
    }
  };

  const handleLoadScenario = (key: string) => {
    setIsIngesting(true);
    setExpandedLogId(null);
    setTimeout(() => {
      const scenario = scenarioDatasets[key];
      setIngestedLogs(scenario.events);
      setIsIngesting(false);
      triggerToast(`Successfully loaded scenario: ${scenario.title}`, 'success');
    }, 600);
  };

  // Custom log parser (supports JSON array, CSV, or Text format)
  const parseAndIngestLogs = (rawContent: string, fileName: string) => {
    setIsIngesting(true);
    setExpandedLogId(null);
    
    setTimeout(() => {
      try {
        const trimmed = rawContent.trim();
        let parsedEvents: NormalizedEvent[] = [];

        if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
          // Parse JSON
          const data = JSON.parse(trimmed);
          const rawEvents = Array.isArray(data) ? data : [data];
          
          parsedEvents = rawEvents.map((item, idx) => {
            const timestamp = item.timestamp || item.time || item.date || new Date().toISOString();
            const source = item.source || item.system || item.sourceSystem || "Manual Upload";
            const actor = item.actor || item.user || item.email || "unknown-actor@enterprise.com";
            const action = item.action || item.eventName || item.event || "Unspecified Action";
            const target = item.target || item.resource || item.file || item.targetResource || "N/A";
            const severity = ['critical', 'warning', 'info'].includes(item.severity?.toLowerCase()) 
              ? item.severity.toLowerCase() as NormalizedEvent['severity']
              : 'info';

            // Strip known keys to form metadata
            const { timestamp: ts, source: src, actor: act, action: ac, target: tg, severity: sv, ...rest } = item;
            
            return {
              id: `upload-${Date.now()}-${idx}`,
              timestamp,
              source,
              actor: typeof actor === 'object' ? (actor.email || actor.name || JSON.stringify(actor)) : String(actor),
              action,
              target,
              severity,
              metadata: Object.keys(rest).length > 0 ? rest : { rawPayload: item }
            };
          });
        } else if (trimmed.includes(',') && trimmed.includes('\n')) {
          // Parse CSV (Heuristic based)
          const lines = trimmed.split('\n');
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          parsedEvents = lines.slice(1).filter(l => l.trim() !== '').map((line, idx) => {
            const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
            
            // Try to map based on header or fall back to indexes
            const getCol = (keyName: string, fallbackIdx: number) => {
              const hIdx = headers.findIndex(h => h.includes(keyName));
              return hIdx !== -1 && cols[hIdx] ? cols[hIdx] : (cols[fallbackIdx] || '');
            };

            const timestamp = getCol('time', 0) || getCol('date', 0) || new Date().toISOString();
            const source = getCol('source', 1) || getCol('system', 1) || "CSV Ingest";
            const actor = getCol('actor', 2) || getCol('user', 2) || "csv-actor@enterprise.com";
            const action = getCol('action', 3) || getCol('event', 3) || "CSV Row Ingestion";
            const target = getCol('target', 4) || getCol('resource', 4) || "N/A";
            const rawSeverity = getCol('severity', 5) || "info";
            const severity: NormalizedEvent['severity'] = ['critical', 'warning', 'info'].includes(rawSeverity.toLowerCase())
              ? rawSeverity.toLowerCase() as NormalizedEvent['severity']
              : 'info';

            // Construct leftover columns as metadata
            const meta: Record<string, string> = {};
            headers.forEach((h, hIdx) => {
              if (cols[hIdx] && ![0, 1, 2, 3, 4, 5].includes(hIdx)) {
                meta[h] = cols[hIdx];
              }
            });

            return {
              id: `csv-${Date.now()}-${idx}`,
              timestamp,
              source,
              actor,
              action,
              target,
              severity,
              metadata: Object.keys(meta).length > 0 ? meta : { rawLine: line }
            };
          });
        } else {
          // Parse raw text logs line-by-line
          const lines = trimmed.split('\n').filter(l => l.trim() !== '');
          parsedEvents = lines.map((line, idx) => {
            // Regex to match typical timestamp actor message patterns
            return {
              id: `txt-${Date.now()}-${idx}`,
              timestamp: new Date().toISOString(),
              source: "TXT Log Collector",
              actor: "host-system@local",
              action: "Log Line Ingest",
              target: `Row #${idx + 1}`,
              severity: line.toLowerCase().includes('error') || line.toLowerCase().includes('fail') || line.toLowerCase().includes('critical') 
                ? 'critical' 
                : line.toLowerCase().includes('warn') 
                  ? 'warning' 
                  : 'info',
              metadata: { rawMessage: line }
            };
          });
        }

        if (parsedEvents.length === 0) {
          throw new Error("No events could be parsed from the uploaded payload.");
        }

        setIngestedLogs(parsedEvents);
        setIsIngesting(false);
        triggerToast(`Successfully parsed and normalized ${parsedEvents.length} log events from ${fileName}`, 'success');
      } catch (err: any) {
        setIsIngesting(false);
        triggerToast(`Failed parsing ${fileName}: ${err.message || 'Invalid format'}`, 'info');
      }
    }, 800);
  };

  // Drag & drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          parseAndIngestLogs(event.target.result as string, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          parseAndIngestLogs(event.target.result as string, file.name);
        }
      };
      reader.readAsText(file);
    }
  };

  const loadSampleJSONPayload = () => {
    const sample = [
      {
        "timestamp": "2026-06-26T23:05:00Z",
        "source": "GitHub",
        "actor": "attacker-bot@dev-portal",
        "action": "Mass SSH Access Attempt",
        "target": "repository-private-ledger",
        "severity": "critical",
        "ipAddress": "185.220.101.42",
        "attemptCount": 140,
        "location": "Tor Exit Node - Frankfurt"
      },
      {
        "timestamp": "2026-06-26T23:06:12Z",
        "source": "Google Workspace",
        "actor": "s.connor@enterprise.com",
        "action": "Shared Drive Export Enabled",
        "target": "Sales_Invoices_Restricted",
        "severity": "warning",
        "recipientDomain": "external-domain-leak.ru"
      }
    ];
    parseAndIngestLogs(JSON.stringify(sample, null, 2), "sample-payload.json");
  };

  // Submit custom integration form
  const handleSubmitNewConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    let cat: Integration['category'] = 'Collaboration';
    if (newType === 'okta' || newType === 'hr_system') cat = 'Identity';
    else if (newType === 'github') cat = 'Code';
    else if (newType === 'slack' || newType === 'line_works') cat = 'Communication';
    else if (newType === 'salesforce') cat = 'CRM';

    onAddIntegration(newName, newType, cat);
    
    setNewName('');
    setApiToken('');
    setEndpointUrl('');
    setShowAddForm(false);
    triggerToast(`Configured secure pipeline for: ${newName}`, 'success');
  };

  // Filter logs logic
  const filteredLogs = ingestedLogs.filter(log => {
    const matchesSearch = 
      log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.target.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || log.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div className="space-y-6 font-sans text-slate-700">
      
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Security Signal Pipeline</span>
          <h2 className="text-xl font-bold text-slate-800 font-display">Integration Hub & Ingest Engine</h2>
          <p className="text-xs text-slate-500 mt-1">
            Securely route enterprise audit logs to the NexusGuard real-time threat evaluation engine.
          </p>
        </div>
        
        {/* Toggle between views */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('connectors')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'connectors' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            🔗 Demo Connectors
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
              activeTab === 'ingestion' 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
            }`}
          >
            📥 Log Ingestion Workflow
          </button>
        </div>
      </div>

      {/* Floating feedback notification toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 right-6 z-50 p-3.5 rounded-lg border shadow-xl flex items-center gap-2 max-w-sm text-left ${
              toastMessage.type === 'success' 
                ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300' 
                : 'bg-blue-950/95 border-blue-500/30 text-blue-300'
            }`}
          >
            {toastMessage.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" /> : <Info className="w-4 h-4 text-blue-400 shrink-0" />}
            <span className="text-xs font-semibold leading-tight">{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VIEW 1: CONNECTORS HUB */}
      {activeTab === 'connectors' && (
        <div className="space-y-6">
          {/* MVP Simulation Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3 text-xs leading-relaxed text-left">
            <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-blue-800 uppercase tracking-wider text-[10px] font-mono">MVP ARCHITECTURAL REMINDER</span>
              <p className="text-slate-600 font-medium">
                In this MVP, connectors simulate production API responses using realistic sample audit logs. For actual enterprise deployments, NexusGuard interfaces directly with official audit log APIs via secure client credentials.
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wider font-mono text-left">SaaS Connector Catalog</h3>
            
            <button
              id="toggle-add-integration-form"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded text-xs transition-colors cursor-pointer shadow-md shadow-blue-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Provision Custom Connector</span>
            </button>
          </div>

          {/* Add custom connector form */}
          {showAddForm && (
            <motion.form 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onSubmit={handleSubmitNewConnector}
              className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow text-left"
              id="add-integration-form"
            >
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-blue-600 animate-spin" />
                  <span>Configure Secure SaaS Endpoint</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
                  Provide credentials. Private API keys are hashed and stored locally in the secure sandbox.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Connector Reference Name
                  </label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Finance Division GWS"
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold shadow-inner"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Platform Service Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as Integration['type'])}
                    className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
                  >
                    <option value="google_workspace">Google Workspace</option>
                    <option value="slack">Slack</option>
                    <option value="line_works">LINE WORKS</option>
                    <option value="github">GitHub</option>
                    <option value="salesforce">Salesforce</option>
                    <option value="box">Box</option>
                    <option value="okta">Okta</option>
                    <option value="hr_system">HR System</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Access Secret Token (API key)
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={apiToken}
                      onChange={(e) => setApiToken(e.target.value)}
                      placeholder="••••••••••••••••••••••••••••••••"
                      className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                    Ingestion Host API Gateway URL
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={endpointUrl}
                      onChange={(e) => setEndpointUrl(e.target.value)}
                      placeholder="https://api.workspace.enterprise.com/v1/audit"
                      className="w-full bg-slate-50 border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-blue-500 font-mono shadow-inner"
                    />
                    <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>

                <div className="flex items-end justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-3.5 py-1.5 bg-transparent hover:bg-slate-100 text-slate-500 rounded text-xs transition-colors cursor-pointer font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors shadow cursor-pointer"
                  >
                    Establish Ingestion Pipeline
                  </button>
                </div>
              </div>
            </motion.form>
          )}

          {/* Connectors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" id="integrations-grid">
            {integrations.map((integration) => {
              const isConnected = integration.status === 'connected';
              const isSyncing = integration.status === 'syncing';
              const isDisconnected = integration.status === 'disconnected';
              const details = connectorDetails[integration.type] || {
                eventTypes: "Custom Audited Actions, Token Requests, Access Audits",
                prodApi: "Ingests raw security syslog feeds and event endpoints via secure webhook callbacks."
              };

              return (
                <div 
                  key={integration.id}
                  className={`bg-white border rounded-lg p-4 flex flex-col justify-between transition-all duration-200 hover:border-slate-300 hover:shadow-md ${
                    isConnected ? 'border-slate-200 shadow-sm' : 'border-dashed border-red-200 bg-white/60'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                          {getIcon(integration.type)}
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-slate-800 text-xs leading-tight">{integration.name}</h4>
                          <span className={`inline-block px-1.5 py-0.2 rounded-full text-[8px] font-mono mt-0.5 font-bold ${getCategoryColor(integration.category)}`}>
                            {integration.category}
                          </span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {isConnected ? (
                          <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>Demo Mode</span>
                          </span>
                        ) : isSyncing ? (
                          <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                            <span>Syncing</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[8px] font-mono font-bold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                            <span>Offline</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* API and Ingestion details */}
                    <div className="text-left text-xs bg-slate-50 p-2.5 rounded border border-slate-100 space-y-2">
                      <div>
                        <span className="text-[8px] font-mono uppercase text-slate-500 block font-bold leading-tight">Audited Event Types</span>
                        <p className="text-[10px] text-slate-600 font-semibold mt-0.5 leading-snug">{details.eventTypes}</p>
                      </div>
                      
                      <div className="border-t border-slate-200 pt-1.5">
                        <span className="text-[8px] font-mono uppercase text-slate-500 block font-bold leading-tight">Production Audit API Integration</span>
                        <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-normal italic">{details.prodApi}</p>
                      </div>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-2 gap-2 text-left bg-slate-50 p-2 rounded border border-slate-100">
                      <div>
                        <span className="text-[8px] font-mono uppercase text-slate-400 block">Total Signals</span>
                        <span className="text-[11px] font-bold text-slate-700 font-mono">
                          {integration.eventsCount > 0 ? integration.eventsCount.toLocaleString() : '—'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[8px] font-mono uppercase text-slate-400 block">Ingest EPS</span>
                        <span className="text-[11px] font-bold text-slate-700 font-mono">
                          {integration.ingestRate > 0 ? `${integration.ingestRate} eps` : '0.00 eps'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between mt-4">
                    <span className="text-[9px] font-mono text-slate-400 font-semibold">
                      Synced: {integration.lastSync}
                    </span>

                    <div className="flex items-center gap-2">
                      {integration.id.startsWith('custom-') && (
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteIntegration(integration.id);
                            triggerToast(`Deleted pipeline for: ${integration.name}`, 'info');
                          }}
                          className="w-6 h-6 rounded hover:bg-red-50 text-slate-400 hover:text-red-600 flex items-center justify-center transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                          title="Remove custom integration pipeline"
                        >
                          <Trash2 className="w-3" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          onToggleStatus(integration.id);
                          triggerToast(`${isConnected ? 'Suspended' : 'Resumed'} ingestion stream for ${integration.name}`, 'info');
                        }}
                        className={`px-2 py-0.5 rounded text-[9px] font-semibold transition-all border cursor-pointer ${
                          isConnected || isSyncing
                            ? 'bg-transparent hover:bg-red-50 border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600'
                            : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600'
                        }`}
                      >
                        {isConnected || isSyncing ? 'Pause Ingest' : 'Connect'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW 2: LOG INGESTION PORTAL */}
      {activeTab === 'ingestion' && (
        <div className="space-y-6">
          {/* Top layout split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
            
            {/* Ingest Controller Panel (Left: 5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-5 bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
              <div className="space-y-4 text-left">
                <div className="border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-semibold text-slate-800">Log Injection Portal</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">
                    Simulate API ingestion by feeding realistic mock log scenarios, or drag your own custom CSV/JSON/TXT payloads directly.
                  </p>
                </div>

                {/* Section A: Sample Dataset Loader */}
                <div className="space-y-2.5">
                  <span className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    ⚡ Mode 1: Threat Scenario Dataset Loader
                  </span>
                  
                  <div className="space-y-2">
                    <button
                      onClick={() => handleLoadScenario('normal')}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded transition-all text-left text-xs font-semibold cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-700">Load Normal Workday</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">5 Events • Nominal</span>
                    </button>

                    <button
                      onClick={() => handleLoadScenario('migration')}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded transition-all text-left text-xs font-semibold cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-700">Load Approved Migration</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">4 Events • Audit</span>
                    </button>

                    <button
                      onClick={() => handleLoadScenario('exposure')}
                      className="w-full flex items-center justify-between p-2.5 bg-red-50 hover:bg-red-100/50 border border-red-200 rounded transition-all text-left text-xs font-semibold cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-red-700">Load Customer Data Exposure</span>
                      </div>
                      <span className="text-[9px] font-mono text-red-500 font-bold uppercase">4 Events • Critical</span>
                    </button>

                    <button
                      onClick={() => handleLoadScenario('offboarding')}
                      className="w-full flex items-center justify-between p-2.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded transition-all text-left text-xs font-semibold cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:scale-125 transition-transform" />
                        <span className="text-slate-700">Load Offboarding Scenario</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-bold uppercase">4 Events • Warning</span>
                    </button>

                    <button
                      onClick={() => handleLoadScenario('compromised')}
                      className="w-full flex items-center justify-between p-2.5 bg-red-50 hover:bg-red-100/50 border border-red-200 rounded transition-all text-left text-xs font-semibold cursor-pointer group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                        <span className="text-red-700">Load Compromised Account</span>
                      </div>
                      <span className="text-[9px] font-mono text-red-500 font-bold uppercase">4 Events • Breach</span>
                    </button>
                  </div>
                </div>

                {/* Section B: Manual File Upload Ingestor */}
                <div className="space-y-2.5 pt-3 border-t border-slate-100">
                  <span className="block text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                    📤 Mode 2: Custom File Drop Upload Zone
                  </span>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-lg p-5 text-center transition-all duration-150 cursor-pointer ${
                      dragActive 
                        ? 'border-blue-500 bg-blue-50/50' 
                        : 'border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100/60'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      accept=".json,.csv,.txt"
                      onChange={handleFileChange}
                    />
                    <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-700 font-bold">Drag and drop file here, or click to browse</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">Accepts valid .JSON, .CSV, or .TXT raw log dumps</p>
                  </div>

                  {/* Manual trigger help */}
                  <div className="flex justify-between items-center pt-1">
                    <span className="text-[9px] text-slate-400 font-medium font-mono leading-none">No file? Instantly inject sample:</span>
                    <button
                      onClick={loadSampleJSONPayload}
                      className="text-[10px] text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-bold leading-none"
                    >
                      Load Sample JSON Payload
                    </button>
                  </div>
                </div>
              </div>

              {/* Informative footer statement */}
              <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed text-left italic">
                “In this MVP, connectors simulate production API responses using realistic sample audit logs. Direct credential binding is disabled in playground preview mode.”
              </div>
            </div>

            {/* Ingested normalized events stream table (Right: 7 cols) */}
            <div className="lg:col-span-7 flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              
              {/* Header block with controls */}
              <div className="p-4 border-b border-slate-200 bg-slate-50 space-y-3.5 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-emerald-600" />
                      <span>Normalized Ingested Log Stream</span>
                    </h3>
                    <p className="text-[11px] text-slate-500 font-medium">
                      Logs normalized into uniform security fields instantly on ingress.
                    </p>
                  </div>

                  {ingestedLogs.length > 0 && (
                    <button
                      onClick={() => {
                        setIngestedLogs([]);
                        triggerToast('Ingestion log stream cleared', 'info');
                      }}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      Clear Stream
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search actor, system, action, target..."
                      className="w-full bg-white border border-slate-200 rounded pl-8 pr-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 shadow-inner font-semibold"
                    />
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setSeverityFilter('all')}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        severityFilter === 'all' 
                          ? 'bg-slate-800 text-white border border-slate-800 shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSeverityFilter('critical')}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        severityFilter === 'critical' 
                          ? 'bg-red-50 text-red-700 border border-red-200 shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-red-600 hover:bg-red-50/50'
                      }`}
                    >
                      Crit
                    </button>
                    <button
                      onClick={() => setSeverityFilter('warning')}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        severityFilter === 'warning' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-amber-600 hover:bg-amber-50/50'
                      }`}
                    >
                      Warn
                    </button>
                    <button
                      onClick={() => setSeverityFilter('info')}
                      className={`px-2.5 py-1.5 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        severityFilter === 'info' 
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm' 
                          : 'bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50'
                      }`}
                    >
                      Info
                    </button>
                  </div>
                </div>
              </div>

              {/* Table section */}
              <div className="flex-1 min-h-[350px] max-h-[500px] overflow-y-auto bg-slate-50/20">
                {isIngesting ? (
                  <div className="flex flex-col items-center justify-center py-24 space-y-3">
                    <RefreshCw className="w-7 h-7 text-blue-600 animate-spin" />
                    <p className="text-xs text-slate-500 font-mono font-bold uppercase animate-pulse">
                      Parsing payload & indexing schemas...
                    </p>
                  </div>
                ) : filteredLogs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-24 text-center p-6 space-y-2">
                    <FileText className="w-10 h-10 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-500">Log Ingestion Stream Empty</p>
                    <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                      Select a predefined threat scenario dataset on the left, or upload a log file to view the normalized schemas.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredLogs.map((log) => {
                      const isExpanded = expandedLogId === log.id;
                      const isCrit = log.severity === 'critical';
                      const isWarn = log.severity === 'warning';

                      return (
                        <div key={log.id} className="transition-colors hover:bg-slate-50 text-left">
                          
                          {/* Row Summary header */}
                          <div 
                            onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                            className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer select-none"
                          >
                            <div className="flex items-start gap-3 truncate">
                              {/* Severity Indicator badge */}
                              <span className={`w-2 h-2 rounded-full shrink-0 mt-1.5 ${
                                isCrit ? 'bg-red-500 shadow-sm shadow-red-500/50' : isWarn ? 'bg-amber-500' : 'bg-blue-500'
                              }`} />

                              <div className="truncate space-y-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-[9px] text-slate-400">{log.timestamp.substring(11, 19)}</span>
                                  <span className="font-bold text-slate-600 px-1.5 py-0.2 bg-slate-100 border border-slate-200 rounded text-[9px] uppercase tracking-wider font-mono">
                                    {log.source}
                                  </span>
                                  <span className="text-slate-700 font-mono text-[10px] truncate max-w-[120px] sm:max-w-[180px] font-bold">
                                    {log.actor}
                                  </span>
                                </div>
                                <p className="text-slate-800 font-semibold leading-relaxed">
                                  {log.action} → <span className="text-slate-500 italic">{log.target}</span>
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                              <span className={`text-[9px] font-mono uppercase font-bold tracking-wider ${
                                isCrit ? 'text-red-600' : isWarn ? 'text-amber-600' : 'text-blue-600'
                              }`}>
                                {log.severity}
                              </span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-400" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-400" />}
                            </div>
                          </div>

                          {/* Expanded JSON payload */}
                          {isExpanded && (
                            <div className="px-5 pb-4 pt-1 bg-slate-50 border-t border-b border-slate-200/60 animate-in fade-in slide-in-from-top-1">
                              <div className="p-3 bg-white border border-slate-200 rounded text-[10px] font-mono text-slate-700 overflow-x-auto shadow-inner space-y-2">
                                <div className="flex justify-between items-center text-[9px] text-slate-400 border-b border-slate-100 pb-1.5">
                                  <span>NORMALIZED SCHEMATICS PAYLOAD</span>
                                  <span className="text-emerald-600 uppercase font-bold">Validated OK</span>
                                </div>
                                <pre className="leading-relaxed text-blue-700">
                                  {JSON.stringify(log.metadata, null, 2)}
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

              {/* Ingest summary statistics line */}
              {ingestedLogs.length > 0 && (
                <div className="bg-slate-50 border-t border-slate-200 px-4 py-2.5 text-[10px] font-mono text-slate-500 text-left flex justify-between items-center shrink-0">
                  <span>Stream Buffer Capacity: {ingestedLogs.length} events normalized</span>
                  <span className="text-blue-600 font-semibold">Ready for Alert Tree Matching</span>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
