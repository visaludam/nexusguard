import { Integration, AuditEvent, InvestigationCase, PolicyRule, SecurityReport } from './types';

export const mockIntegrations: Integration[] = [
  {
    id: 'int-gws',
    name: 'Google Workspace',
    type: 'google_workspace',
    status: 'connected',
    icon: 'Compass',
    eventsCount: 342900,
    lastSync: '1 min ago',
    category: 'Collaboration',
    ingestRate: 48.5
  },
  {
    id: 'int-slack',
    name: 'Slack',
    type: 'slack',
    status: 'connected',
    icon: 'MessageSquare',
    eventsCount: 894000,
    lastSync: '2 mins ago',
    category: 'Communication',
    ingestRate: 98.2
  },
  {
    id: 'int-lineworks',
    name: 'LINE WORKS',
    type: 'line_works',
    status: 'connected',
    icon: 'MessageSquare',
    eventsCount: 12500,
    lastSync: '5 mins ago',
    category: 'Communication',
    ingestRate: 4.5
  },
  {
    id: 'int-gh',
    name: 'GitHub',
    type: 'github',
    status: 'connected',
    icon: 'GitBranch',
    eventsCount: 92100,
    lastSync: '4 mins ago',
    category: 'Code',
    ingestRate: 5.8
  },
  {
    id: 'int-salesforce',
    name: 'Salesforce',
    type: 'salesforce',
    status: 'connected',
    icon: 'Database',
    eventsCount: 121000,
    lastSync: 'Syncing...',
    category: 'CRM',
    ingestRate: 15.4
  },
  {
    id: 'int-box',
    name: 'Box',
    type: 'box',
    status: 'connected',
    icon: 'FolderKanban',
    eventsCount: 43200,
    lastSync: '10 mins ago',
    category: 'Collaboration',
    ingestRate: 8.7
  },
  {
    id: 'int-okta',
    name: 'Okta',
    type: 'okta',
    status: 'connected',
    icon: 'ShieldAlert',
    eventsCount: 184500,
    lastSync: 'Just now',
    category: 'Identity',
    ingestRate: 12.2
  },
  {
    id: 'int-hr',
    name: 'HR System',
    type: 'hr_system',
    status: 'connected',
    icon: 'Users',
    eventsCount: 5400,
    lastSync: '1 hour ago',
    category: 'Identity',
    ingestRate: 0.8
  }
];

export const mockEvents: AuditEvent[] = [
  {
    id: 'evt-101',
    timestamp: '2026-06-26T22:45:12Z',
    source: 'Google Workspace',
    sourceType: 'google_workspace',
    actor: {
      name: 'Jonathan Vance',
      email: 'j.vance@enterprise.com',
      role: 'Principal Software Engineer',
      department: 'Infrastructure'
    },
    eventName: 'OAuth Grant Approved',
    severity: 'critical',
    riskScore: 88,
    ipAddress: '103.242.108.4',
    location: 'Singapore (Changi)',
    device: 'MacBook Pro - Chrome',
    description: 'Granted full read/write permissions for Google Drive files to an unverified third-party app named "SheetsExportAI".',
    metadata: {
      AppName: 'SheetsExportAI',
      Scope: 'drive.readonly, drive.metadata.readonly',
      DeveloperId: 'dev-unknown-4019',
      ClientUID: '942-8851-gws'
    }
  },
  {
    id: 'evt-102',
    timestamp: '2026-06-26T22:42:01Z',
    source: 'Google Workspace',
    sourceType: 'google_workspace',
    actor: {
      name: 'Jonathan Vance',
      email: 'j.vance@enterprise.com',
      role: 'Principal Software Engineer',
      department: 'Infrastructure'
    },
    eventName: 'Sensitive Drive File Downloaded',
    severity: 'warning',
    riskScore: 65,
    ipAddress: '103.242.108.4',
    location: 'Singapore (Changi)',
    device: 'MacBook Pro - Chrome',
    description: 'Bulk downloaded confidential accounting parameters from restricted team drive folder.',
    metadata: {
      FileName: 'customer_pii_ledger_v2.parquet',
      Folder: 'Finances_2026_Restricted',
      FileSize: '412.4 MB',
      Action: 'Download'
    }
  },
  {
    id: 'evt-103',
    timestamp: '2026-06-26T22:15:33Z',
    source: 'Okta IDP',
    sourceType: 'okta',
    actor: {
      name: 'Jonathan Vance',
      email: 'j.vance@enterprise.com',
      role: 'Principal Software Engineer',
      department: 'Infrastructure'
    },
    eventName: 'MFA Bypass Attempt Accepted',
    severity: 'critical',
    riskScore: 82,
    ipAddress: '103.242.108.4',
    location: 'Singapore (Changi)',
    device: 'MacBook Pro - Firefox Private',
    description: 'Okta Session initialized via temporary passcode (bypass token) requested from HelpDesk 2 hours ago.',
    metadata: {
      BypassMethod: 'Temporary OTP Token',
      IssuedBy: 'servicedesk-bot',
      SessionDuration: '24 hours'
    }
  },
  {
    id: 'evt-104',
    timestamp: '2026-06-26T21:30:19Z',
    source: 'GitHub Enterprise',
    sourceType: 'github',
    actor: {
      name: 'Dr. Elena Rostova',
      email: 'e.rostova@enterprise.com',
      role: 'Senior ML Scientist',
      department: 'AI/LLM Core'
    },
    eventName: 'Bulk Repository Clone',
    severity: 'critical',
    riskScore: 78,
    ipAddress: '198.51.100.75',
    location: 'Zurich, Switzerland (Residential)',
    device: 'Ubuntu WSL - git-cli',
    description: 'Rapidly cloned 14 private repositories containing core proprietary neural network routing weights.',
    metadata: {
      RepositoryList: 'deepmind-llm-router, custom-tokenizer-v3, weights-loader-v1, training-pipeline-core',
      CloneCount: 14,
      ByteSize: '8.4 GB'
    }
  },
  {
    id: 'evt-105',
    timestamp: '2026-06-26T20:55:00Z',
    source: 'Slack Enterprise',
    sourceType: 'slack',
    actor: {
      name: 'Marcus Brody',
      email: 'm.brody@enterprise.com',
      role: 'Sales Operations Manager',
      department: 'Sales-West'
    },
    eventName: 'Bulk Export Channel History',
    severity: 'warning',
    riskScore: 55,
    ipAddress: '72.21.81.140',
    location: 'Seattle, WA',
    device: 'Windows 11 - Slack Desktop',
    description: 'Initiated export of public and private channel logs for channel "#sales-confidential".',
    metadata: {
      ChannelName: '#sales-confidential',
      MessageCount: 14202,
      TimeRange: '365 days',
      Format: 'JSON'
    }
  },
  {
    id: 'evt-106',
    timestamp: '2026-06-26T19:40:11Z',
    source: 'Salesforce CRM',
    sourceType: 'salesforce',
    actor: {
      name: 'Sarah Connor',
      email: 's.connor@enterprise.com',
      role: 'Enterprise Account Executive',
      department: 'Sales-West'
    },
    eventName: 'CRM Lead Report Export',
    severity: 'warning',
    riskScore: 70,
    ipAddress: '162.210.192.4',
    location: 'Denver, CO (VPN)',
    device: 'iPad Pro - Safari',
    description: 'Exported report containing full accounts database including billing contact details and renew schedules.',
    metadata: {
      ReportName: 'West_Active_Subscribers_Q2',
      RecordsExported: 4500,
      Classification: 'Highly Confidential'
    }
  },
  {
    id: 'evt-107',
    timestamp: '2026-06-26T19:35:45Z',
    source: 'Google Workspace',
    sourceType: 'google_workspace',
    actor: {
      name: 'Sarah Connor',
      email: 's.connor@enterprise.com',
      role: 'Enterprise Account Executive',
      department: 'Sales-West'
    },
    eventName: 'Personal Storage Transfer Detected',
    severity: 'critical',
    riskScore: 92,
    ipAddress: '162.210.192.4',
    location: 'Denver, CO (VPN)',
    device: 'MacBook Air - BoxUploader Extension',
    description: 'Uploaded multiple Excel sheets to a personal Box.com folder by executing an uninspected browser extension proxy.',
    metadata: {
      ExtName: 'BoxUploaderPro',
      ExtID: 'jklmnoopqrstuvwxyz123456',
      TargetURL: 'upload.box.com/api/v2/files',
      PayloadSize: '4.2 GB'
    }
  },
  {
    id: 'evt-108',
    timestamp: '2026-06-26T18:10:02Z',
    source: 'Okta IDP',
    sourceType: 'okta',
    actor: {
      name: 'DevOps Automated Bot',
      email: 'devops-bot@enterprise-service.com',
      role: 'Service Account',
      department: 'Infrastructure'
    },
    eventName: 'API Key Created',
    severity: 'warning',
    riskScore: 40,
    ipAddress: '54.210.12.98',
    location: 'AWS us-east-1',
    device: 'AWS Lambda NodeSDK',
    description: 'Generated a new API key with root read/write roles assigned to a service profile.',
    metadata: {
      ServiceProfile: 'CloudDeployMaster',
      KeyExpiry: 'Never Expires',
      PermissionsLevel: 'AdminAccess'
    }
  }
];

export const mockCases: InvestigationCase[] = [
  {
    id: 'NX-1042',
    title: 'Anomalous Multi-Region OAuth Consent',
    createdTime: '2026-06-26T22:45:12Z',
    status: 'open',
    severity: 'critical',
    overallRiskScore: 88,
    assignedTo: 'Sarah Jenkins (SecOps Team Lead)',
    subject: {
      name: 'Jonathan Vance',
      email: 'j.vance@enterprise.com',
      role: 'Principal Software Engineer',
      department: 'Infrastructure',
      riskTier: 'High',
      avatarUrl: ''
    },
    summary: 'NexusGuard combined an Okta temporary OTP bypass event, Singapore-based Drive file downloads, and the authorization of a highly permissive, unapproved third-party Google Workspace application ("SheetsExportAI") on Jonathan Vance\'s corporate account. The subject normally logs in exclusively from San Francisco. Critical engineering data and PII were downloaded and connected to this OAuth grant.',
    possibleDataExposure: [
      {
        resourceName: 'customer_pii_ledger_v2.parquet',
        resourceType: 'Google Cloud Storage Bucket',
        sensitivity: 'Restricted PII',
        action: 'Downloaded & OAuth Sync',
        riskScore: 90
      },
      {
        resourceName: 'quarterly_billing_forecast.xlsx',
        resourceType: 'Google Drive Spreadsheet',
        sensitivity: 'Confidential',
        action: 'OAuth Read Access Granted',
        riskScore: 82
      },
      {
        resourceName: 'prod_db_credentials_config.yaml',
        resourceType: 'Google Drive File',
        sensitivity: 'Restricted PII',
        action: 'Accessed',
        riskScore: 95
      }
    ],
    timeline: [
      {
        id: 't-1',
        timestamp: '2026-06-26T20:15:00Z',
        source: 'okta',
        title: 'MFA Temporary Passcode Generated',
        description: 'Helpdesk ticket #HD-9081 approved a 24-hour Okta MFA bypass key for the user, citing "forgot physical key at hotel".',
        severity: 'info'
      },
      {
        id: 't-2',
        timestamp: '2026-06-26T22:15:33Z',
        source: 'okta',
        title: 'Okta MFA Bypassed from Singapore',
        description: 'Successful Okta login from SG IP address using the newly generated bypass token. Browser user agent matches standard laptop but IP is unusual.',
        severity: 'warning'
      },
      {
        id: 't-3',
        timestamp: '2026-06-26T22:42:01Z',
        source: 'google_workspace',
        title: 'Confidential Ledger Downloaded',
        description: 'Downloaded file "customer_pii_ledger_v2.parquet" containing restricted customer ledger metrics.',
        severity: 'warning'
      },
      {
        id: 't-4',
        timestamp: '2026-06-26T22:45:12Z',
        source: 'google_workspace',
        title: 'Google Drive OAuth Grant Authorized',
        description: 'User approved an OAuth consent screen granting unverified client "SheetsExportAI" full read scope to Google Drive folders.',
        severity: 'critical'
      }
    ],
    humanActionPlan: [
      {
        id: 'h-1',
        task: 'Revoke "SheetsExportAI" OAuth application token immediately',
        status: 'pending',
        recommendedBy: 'NexusGuard Signal Engine',
        notes: 'Can be automated via GWS integration block button below.'
      },
      {
        id: 'h-2',
        task: 'Force-terminate active GWS & Okta sessions for j.vance@enterprise.com',
        status: 'pending',
        recommendedBy: 'Okta Audit Rule'
      },
      {
        id: 'h-3',
        task: 'Contact Jonathan Vance via Slack or direct phone to verify Singapore login validity',
        status: 'pending',
        recommendedBy: 'SecOps SOP'
      },
      {
        id: 'h-4',
        task: 'Review HelpDesk agent ticket logs for #HD-9081 to identify caller authenticity',
        status: 'pending',
        recommendedBy: 'Incident Management'
      }
    ]
  },
  {
    id: 'NX-1043',
    title: 'Anomalous ML Repository Clones After Office Hours',
    createdTime: '2026-06-26T21:30:19Z',
    status: 'under_review',
    severity: 'warning',
    overallRiskScore: 74,
    assignedTo: 'Alexander Frost (Senior Incident Analyst)',
    subject: {
      name: 'Dr. Elena Rostova',
      email: 'e.rostova@enterprise.com',
      role: 'Senior ML Scientist',
      department: 'AI/LLM Core',
      riskTier: 'Medium',
      avatarUrl: ''
    },
    summary: 'An unusual quantity (14) of core proprietary model and weights repository layers were cloned off-VPN using SSH keys registered to Elena Rostova. The operation was performed during deep-night hours (2:30 AM local Switzerland time). Routine ML development accesses cached HuggingFace checkpoints, making raw source repository cloning of this scale anomalous.',
    possibleDataExposure: [
      {
        resourceName: 'deepmind-llm-router',
        resourceType: 'GitHub Private Repository',
        sensitivity: 'Confidential',
        action: 'SSH Git Clone',
        riskScore: 78
      },
      {
        resourceName: 'weights-loader-v1',
        resourceType: 'GitHub Private Repository',
        sensitivity: 'Confidential',
        action: 'SSH Git Clone',
        riskScore: 72
      }
    ],
    timeline: [
      {
        id: 't-11',
        timestamp: '2026-06-26T21:10:00Z',
        source: 'github',
        title: 'New SSH Authentication Key Registered',
        description: 'A new SSH key titled "Elena-HomeWS" was registered through Elena\'s GitHub user portal.',
        severity: 'warning'
      },
      {
        id: 't-12',
        timestamp: '2026-06-26T21:30:19Z',
        source: 'github',
        title: 'Git Bulk Clone Initiated',
        description: 'Rapid cloning sequence detected across 14 separate code repos in the AI/LLM division using the newly registered SSH key.',
        severity: 'critical'
      }
    ],
    humanActionPlan: [
      {
        id: 'h-11',
        task: 'Confirm with Dr. Elena Rostova if she registered "Elena-HomeWS" SSH key',
        status: 'completed',
        recommendedBy: 'SecOps SOP',
        notes: 'Spoke briefly, Elena confirmed she added this key from her home machine to fix a late-night training bug.'
      },
      {
        id: 'h-12',
        task: 'Revoke temporary SSH keys if Elena is done with debug work',
        status: 'pending',
        recommendedBy: 'NexusGuard Policy Engine'
      }
    ]
  },
  {
    id: 'NX-1044',
    title: 'CRM Exfiltration via Unapproved Cloud Drive',
    createdTime: '2026-06-26T19:35:45Z',
    status: 'open',
    severity: 'critical',
    overallRiskScore: 92,
    assignedTo: 'Marcus Brody (Sales Operations Manager)',
    subject: {
      name: 'Sarah Connor',
      email: 's.connor@enterprise.com',
      role: 'Enterprise Account Executive',
      department: 'Sales-West',
      riskTier: 'High',
      avatarUrl: ''
    },
    summary: 'A critical event matching NexusGuard\'s Data Exfiltration Rule was triggered when Sarah Connor exported high-value customer lead lists containing contact details and ARR figures from Salesforce, followed immediately by 4.2 GB of data uploads to a personal, unmonitored Box.com account. The transfer was completed by executing a silent proxy extension.',
    possibleDataExposure: [
      {
        resourceName: 'West_Active_Subscribers_Q2.xlsx',
        resourceType: 'Salesforce CSV Export',
        sensitivity: 'Restricted PII',
        action: 'Exported & Uploaded',
        riskScore: 94
      },
      {
        resourceName: 'top_500_enterprise_prospects.pdf',
        resourceType: 'Local Device File',
        sensitivity: 'Confidential',
        action: 'Uploaded to Box.com',
        riskScore: 89
      }
    ],
    timeline: [
      {
        id: 't-21',
        timestamp: '2026-06-26T19:20:00Z',
        source: 'salesforce',
        title: 'Mass CRM Leads Report Exported',
        description: 'Sarah exported "West_Active_Subscribers_Q2" containing names, email logs, phone lines, and billing structures.',
        severity: 'warning'
      },
      {
        id: 't-22',
        timestamp: '2026-06-26T19:35:45Z',
        source: 'google_workspace',
        title: 'Endpoint Extension Traffic Bypassed Secure Gateway',
        description: 'Endpoint security client detected Chrome extension "BoxUploaderPro" established SSL connections directly uploading files to upload.box.com.',
        severity: 'critical'
      }
    ],
    humanActionPlan: [
      {
        id: 'h-21',
        task: 'Contact West Region Sales Director to audit file sharing legitimacy',
        status: 'pending',
        recommendedBy: 'Sales Division Audit'
      },
      {
        id: 'h-22',
        task: 'Push enterprise policy block for "BoxUploaderPro" browser extension in Workspace panel',
        status: 'pending',
        recommendedBy: 'IT Admin Protocol'
      },
      {
        id: 'h-23',
        task: 'Initiate formal corporate security hold on Sarah\'s notebook credentials',
        status: 'pending',
        recommendedBy: 'HR and Legal Advisory'
      }
    ]
  }
];

export const mockPolicies: PolicyRule[] = [
  {
    id: 'POL-01',
    name: 'Data Exfiltration via Unapproved Cloud Storage',
    code: 'RULE_DATA_EXFIL_CLOUD_DRIVES',
    description: 'Detects bulk exports from key SaaS portals (Salesforce, Workspace) followed by immediate web uploads to unauthorized cloud storage endpoints.',
    category: 'Data Exfiltration',
    severity: 'critical',
    isActive: true,
    triggerCount: 14,
    logicDescription: 'If Source(SaaS_Export) AND Source(Personal_Drive_POST) by Actor within 60 mins -> Trigger Alert'
  },
  {
    id: 'POL-02',
    name: 'Multi-Region Concurrent Authentication',
    code: 'RULE_IDENTITY_GEOGRAPHIC_IMPOSSIBILITY',
    description: 'Triggers when Okta credentials login from distinct geographic regions separated by physical travel impossibility within 4 hours.',
    category: 'Identity & Access',
    severity: 'critical',
    isActive: true,
    triggerCount: 8,
    logicDescription: 'If GeoDistance(Auth_1, Auth_2) > 1000km AND TimeDelta < 4 hours -> Trigger Geographic Impossibility Score'
  },
  {
    id: 'POL-03',
    name: 'Anomalous Late Night Repository Activity',
    code: 'RULE_CODE_NIGHT_CLONING',
    description: 'Triggers when a user clones highly sensitive private source code repositories between the hours of 11:00 PM and 5:00 AM local time.',
    category: 'Anomalous Activity',
    severity: 'warning',
    isActive: true,
    triggerCount: 22,
    logicDescription: 'If Action(Git_Clone) AND RepoSensitivity >= 80 AND LocalTime OUTSIDE(07:00, 21:00) -> Trigger Alert'
  },
  {
    id: 'POL-04',
    name: 'Unverified OAuth Application Consent',
    code: 'RULE_UNVERIFIED_OAUTH_CONSENT',
    description: 'Monitors the authorization of third-party OAuth apps requesting wide directory or read-only Drive scopes.',
    category: 'Privileged Operations',
    severity: 'critical',
    isActive: true,
    triggerCount: 5,
    logicDescription: 'If Action(OAuth_Grant) AND ClientVerified == False AND GrantedScope IN(drive.readonly, admin.directory) -> Trigger Alert'
  },
  {
    id: 'POL-05',
    name: 'Mass File Access with Deletion Signature',
    code: 'RULE_MASS_DELETE_SIGNATURE',
    description: 'Alerts when more than 100 enterprise team drive assets are modified, archived, or deleted in rapid succession.',
    category: 'Data Exfiltration',
    severity: 'warning',
    isActive: false,
    triggerCount: 0,
    logicDescription: 'If ActionCount(File_Delete) > 100 within 5 minutes -> Trigger Mass Delete Signature'
  }
];

export const mockReports: SecurityReport[] = [
  {
    id: 'REP-001',
    title: 'SecOps Incident Summary: Case NX-1042 Executive Briefing',
    type: 'Executive Brief',
    generatedAt: '2026-06-26 23:15',
    generatedBy: 'Sarah Jenkins',
    status: 'Ready',
    fileSize: '1.2 MB',
    caseId: 'NX-1042'
  },
  {
    id: 'REP-002',
    title: 'Q2 Compliance and Authorized Third-Party App Audit',
    type: 'Compliance Audit',
    generatedAt: '2026-06-25 14:30',
    generatedBy: 'SecOps Automated Audit',
    status: 'Ready',
    fileSize: '3.4 MB'
  },
  {
    id: 'REP-003',
    title: 'Anomalous Activity Monthly Digest - May 2026',
    type: 'Activity Report',
    generatedAt: '2026-06-01 08:00',
    generatedBy: 'NexusGuard Platform Engine',
    status: 'Ready',
    fileSize: '4.8 MB'
  },
  {
    id: 'REP-004',
    title: 'Post-Incident Exposure Report - Sarah Connor CRM Transfer',
    type: 'Incident Summary',
    generatedAt: '2026-06-26 19:50',
    generatedBy: 'Marcus Brody',
    status: 'Generating',
    fileSize: 'Pending...',
    caseId: 'NX-1044'
  }
];
