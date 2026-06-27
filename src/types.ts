export interface Integration {
  id: string;
  name: string;
  type: 'google_workspace' | 'slack' | 'jira' | 'github' | 'okta' | 'salesforce' | 'aws' | 'line_works' | 'box' | 'hr_system';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  icon: string;
  eventsCount: number;
  lastSync: string;
  category: 'Identity' | 'Communication' | 'Collaboration' | 'Code' | 'Cloud' | 'CRM';
  ingestRate: number; // eps (events per second)
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  source: string;
  sourceType: Integration['type'];
  actor: {
    name: string;
    email: string;
    role: string;
    department: string;
    avatar?: string;
  };
  eventName: string;
  severity: 'critical' | 'warning' | 'info';
  riskScore: number; // 0 - 100
  ipAddress: string;
  location: string;
  device: string;
  description: string;
  metadata: Record<string, string | number | boolean>;
}

export interface InvestigationCase {
  id: string;
  title: string;
  createdTime: string;
  status: 'open' | 'under_review' | 'resolved' | 'archived';
  severity: 'critical' | 'warning' | 'info';
  overallRiskScore: number;
  assignedTo: string;
  subject: {
    name: string;
    email: string;
    role: string;
    department: string;
    riskTier: 'High' | 'Medium' | 'Low';
    avatarUrl?: string;
  };
  summary: string;
  possibleDataExposure: {
    resourceName: string;
    resourceType: string;
    sensitivity: 'Confidential' | 'Internal-Only' | 'Public' | 'Restricted PII';
    action: string;
    riskScore: number;
  }[];
  timeline: {
    id: string;
    timestamp: string;
    source: Integration['type'];
    title: string;
    description: string;
    severity: 'critical' | 'warning' | 'info';
    metadata?: Record<string, string>;
  }[];
  humanActionPlan: {
    id: string;
    task: string;
    status: 'pending' | 'completed';
    recommendedBy: string;
    notes?: string;
  }[];
}

export interface PolicyRule {
  id: string;
  name: string;
  code: string;
  description: string;
  category: 'Data Exfiltration' | 'Identity & Access' | 'Anomalous Activity' | 'Privileged Operations';
  severity: 'critical' | 'warning' | 'info';
  isActive: boolean;
  triggerCount: number;
  logicDescription: string;
}

export interface SecurityReport {
  id: string;
  title: string;
  type: 'Executive Brief' | 'Compliance Audit' | 'Incident Summary' | 'Activity Report';
  generatedAt: string;
  generatedBy: string;
  status: 'Ready' | 'Generating';
  fileSize: string;
  caseId?: string;
}
