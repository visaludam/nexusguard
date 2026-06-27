import { AuditEvent, InvestigationCase } from '../types';

export interface SimulatedEvent extends Omit<AuditEvent, 'id' | 'timestamp'> {
  delayMs?: number; // Simulated delay between steps in milliseconds
  triggerIncident?: boolean; // Whether this step spawns or updates an investigation case
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  initialRiskScore: number;
  events: SimulatedEvent[];
  associatedCase?: Omit<InvestigationCase, 'id' | 'createdTime'> & {
    idPrefix?: string;
  };
}

export const simulationScenarios: Record<string, SimulationScenario> = {
  normal_workday: {
    id: 'normal_workday',
    title: 'Normal Workday',
    description: 'A series of compliant everyday actions by staff within regular working boundaries.',
    severity: 'info',
    initialRiskScore: 12,
    events: [
      {
        source: 'Okta IDP',
        sourceType: 'okta',
        actor: {
          name: 'Sarah Jenkins',
          email: 's.jenkins@enterprise.com',
          role: 'SecOps Team Lead',
          department: 'Security Operations'
        },
        eventName: 'User Login Succeeded',
        severity: 'info',
        riskScore: 5,
        ipAddress: '192.168.1.104',
        location: 'San Francisco, CA',
        device: 'MacBook Pro - Chrome',
        description: 'Completed Multi-Factor Authentication push validation.',
        metadata: {
          AuthFactor: 'Okta Verify Push',
          IPProtocol: 'IPv4',
          ISP: 'Comcast Business',
          SessionDurationHours: 8
        }
      },
      {
        source: 'Slack',
        sourceType: 'slack',
        actor: {
          name: 'Sarah Jenkins',
          email: 's.jenkins@enterprise.com',
          role: 'SecOps Team Lead',
          department: 'Security Operations'
        },
        eventName: 'Workspace Channel Joined',
        severity: 'info',
        riskScore: 2,
        ipAddress: '192.168.1.104',
        location: 'San Francisco, CA',
        device: 'MacBook Pro - Slack Desktop Client',
        description: 'Joined standard project announcement channel #proj-nexusguard-v2.',
        metadata: {
          ChannelID: 'C908123A',
          ChannelScope: 'Public',
          ActionSource: 'Invited'
        }
      },
      {
        source: 'GitHub',
        sourceType: 'github',
        actor: {
          name: 'Sarah Jenkins',
          email: 's.jenkins@enterprise.com',
          role: 'SecOps Team Lead',
          department: 'Security Operations'
        },
        eventName: 'Repository Code Reviewed',
        severity: 'info',
        riskScore: 8,
        ipAddress: '192.168.1.104',
        location: 'San Francisco, CA',
        device: 'MacBook Pro - Chrome',
        description: 'Approved pull request #214 in deepmind-llm-router.',
        metadata: {
          PullRequestNumber: 214,
          DiffSizeLines: 42,
          ApprovalState: 'APPROVED',
          Repository: 'deepmind-llm-router'
        }
      }
    ]
  },

  bulk_download: {
    id: 'bulk_download',
    title: 'Bulk Download',
    description: 'An employee downloads an unusually high volume of restricted corporate plans in quick succession.',
    severity: 'warning',
    initialRiskScore: 68,
    events: [
      {
        source: 'Box',
        sourceType: 'box',
        actor: {
          name: 'Michael Brody',
          email: 'm.brody@enterprise.com',
          role: 'Account Representative',
          department: 'Sales-West'
        },
        eventName: 'Sensitive Directory Accessed',
        severity: 'info',
        riskScore: 25,
        ipAddress: '72.140.22.81',
        location: 'Denver, CO',
        device: 'Windows 11 - Chrome',
        description: 'Opened the restricted directory "Sales-West/Planning_2026/Clients".',
        metadata: {
          FolderID: 'fld-881203',
          Path: 'Shared/Sales-West/Planning_2026/Clients',
          PreviousAccessTime: 'Never'
        }
      },
      {
        source: 'Box',
        sourceType: 'box',
        actor: {
          name: 'Michael Brody',
          email: 'm.brody@enterprise.com',
          role: 'Account Representative',
          department: 'Sales-West'
        },
        eventName: 'Bulk Archive Download Initiated',
        severity: 'warning',
        riskScore: 65,
        ipAddress: '72.140.22.81',
        location: 'Denver, CO',
        device: 'Windows 11 - Chrome',
        description: 'Downloaded compressed archive containing client strategic forecasts.',
        metadata: {
          ArchiveName: 'West_Region_Client_PII_Confidential.zip',
          TotalFilesContained: 1420,
          CompressedSize: '1.2 GB',
          UncompressedSize: '4.8 GB',
          SecurityTag: 'Restricted-PII'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Sales-West High-Volume Client Data Harvest',
      status: 'open',
      severity: 'warning',
      overallRiskScore: 68,
      assignedTo: 'Jonathan Vance (Senior Investigator)',
      subject: {
        name: 'Michael Brody',
        email: 'm.brody@enterprise.com',
        role: 'Account Representative',
        department: 'Sales-West',
        riskTier: 'Medium'
      },
      summary: 'Automated telemetry flagged an unapproved bulk archive download by Michael Brody of the Sales-West division. The compressed package contains over 1,400 confidential customer sheets. No related sales contract is currently active in the system to justify this bulk exfiltration action.',
      possibleDataExposure: [
        {
          resourceName: 'West_Region_Client_PII_Confidential.zip',
          resourceType: 'Box Consolidated Archive File',
          sensitivity: 'Restricted PII',
          action: 'Bulk Archive Download',
          riskScore: 72
        }
      ],
      timeline: [
        {
          id: 't-bd-1',
          timestamp: '',
          source: 'box',
          title: 'Unusual Folder Navigation',
          description: 'Michael Brody navigated to client PII folder which has not been touched in 120+ days.',
          severity: 'info'
        },
        {
          id: 't-bd-2',
          timestamp: '',
          source: 'box',
          title: '1.2GB Zip Download Completed',
          description: 'A bulk stream request was authorized from Denver, CO IP range containing active customer addresses and billing hashes.',
          severity: 'warning'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-bd-1',
          task: 'Contact Michael Brody to verify the business rationale for downloading the client PII archive.',
          status: 'pending',
          recommendedBy: 'NexusGuard Threat Rules'
        },
        {
          id: 'h-bd-2',
          task: 'Verify whether a corresponding active CRM sales pipeline or NDA matches this export request.',
          status: 'pending',
          recommendedBy: 'Salesforce Audit Proxy'
        }
      ]
    }
  },

  public_sharing: {
    id: 'public_sharing',
    title: 'Public Sharing',
    description: 'An employee configures a Google Shared Drive file containing salaries to be viewable by "Anyone with Link".',
    severity: 'critical',
    initialRiskScore: 84,
    events: [
      {
        source: 'Google Workspace',
        sourceType: 'google_workspace',
        actor: {
          name: 'Elana Rostova',
          email: 'e.rostova@enterprise.com',
          role: 'HR Administration Specialist',
          department: 'Human Resources'
        },
        eventName: 'Document ACL Modified',
        severity: 'info',
        riskScore: 10,
        ipAddress: '104.22.41.9',
        location: 'Austin, TX',
        device: 'MacBook Air - Safari',
        description: 'Document access list modified for "q3_internal_salaries_v1.xlsx".',
        metadata: {
          DocumentID: 'doc-gws-908123',
          Title: 'q3_internal_salaries_v1.xlsx',
          OldScope: 'Restricted (Internal HR only)'
        }
      },
      {
        source: 'Google Workspace',
        sourceType: 'google_workspace',
        actor: {
          name: 'Elana Rostova',
          email: 'e.rostova@enterprise.com',
          role: 'HR Administration Specialist',
          department: 'Human Resources'
        },
        eventName: 'Anonymous Public Share Link Created',
        severity: 'critical',
        riskScore: 88,
        ipAddress: '104.22.41.9',
        location: 'Austin, TX',
        device: 'MacBook Air - Safari',
        description: 'Enabled public accessibility ("Anyone with link") on corporate salary ledger document.',
        metadata: {
          DocumentID: 'doc-gws-908123',
          Title: 'q3_internal_salaries_v1.xlsx',
          PermissionRole: 'READER',
          Scope: 'PUBLIC_WITH_LINK',
          PasswordProtected: 'No',
          Expiration: 'Never'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Google Drive Anonymous Public Link Creation',
      status: 'open',
      severity: 'critical',
      overallRiskScore: 84,
      assignedTo: 'Sarah Jenkins (SecOps Team Lead)',
      subject: {
        name: 'Elana Rostova',
        email: 'e.rostova@enterprise.com',
        role: 'HR Administration Specialist',
        department: 'Human Resources',
        riskTier: 'High'
      },
      summary: 'Google Workspace audit log recorded that Elana Rostova modified permissions on a highly sensitive corporate ledger spreadsheet "q3_internal_salaries_v1.xlsx". Access was changed from restricted internal HR only to "Anyone with Link", allowing public anonymous viewing of the entire company salary matrix without credentials.',
      possibleDataExposure: [
        {
          resourceName: 'q3_internal_salaries_v1.xlsx',
          resourceType: 'Google Workspace Spreadsheet',
          sensitivity: 'Restricted PII',
          action: 'Public Share Link Enabled',
          riskScore: 92
        }
      ],
      timeline: [
        {
          id: 't-ps-1',
          timestamp: '',
          source: 'google_workspace',
          title: 'Document Permissions Altered',
          description: 'HR Specialist Elana Rostova opened the sharing settings of q3_internal_salaries_v1.xlsx.',
          severity: 'info'
        },
        {
          id: 't-ps-2',
          timestamp: '',
          source: 'google_workspace',
          title: 'Public Domain Authorization Active',
          description: 'Document link changed to PUBLIC_WITH_LINK, making HR salary files accessible to external spiders and direct download.',
          severity: 'critical'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-ps-1',
          task: 'Revoke the public anonymous link on the Google Drive spreadsheet immediately.',
          status: 'pending',
          recommendedBy: 'Google Admin API Broker'
        },
        {
          id: 'h-ps-2',
          task: 'Check proxy/firewall egress logs to see if any external IP addresses have downloaded this document.',
          status: 'pending',
          recommendedBy: 'Cloud Firewall Ops'
        }
      ]
    }
  },

  crm_export: {
    id: 'crm_export',
    title: 'CRM Export',
    description: 'A sales representative initiates a mass lead database export from Salesforce CRM to local storage.',
    severity: 'critical',
    initialRiskScore: 90,
    events: [
      {
        source: 'Salesforce CRM',
        sourceType: 'salesforce',
        actor: {
          name: 'James Connor',
          email: 's.connor@enterprise.com',
          role: 'Lead Business Development Director',
          department: 'Sales-East'
        },
        eventName: 'Standard Report Execution',
        severity: 'info',
        riskScore: 15,
        ipAddress: '194.26.135.21',
        location: 'New York, NY',
        device: 'Windows 11 - Chrome',
        description: 'Opened the Lead conversion report panel.',
        metadata: {
          ReportID: 'rep-sf-90812',
          QueryFilter: 'Status=Qualified, Region=Global',
          RecordsInView: 25000
        }
      },
      {
        source: 'Salesforce CRM',
        sourceType: 'salesforce',
        actor: {
          name: 'James Connor',
          email: 's.connor@enterprise.com',
          role: 'Lead Business Development Director',
          department: 'Sales-East'
        },
        eventName: 'Mass CRM Report Exported',
        severity: 'critical',
        riskScore: 92,
        ipAddress: '194.26.135.21',
        location: 'New York, NY',
        device: 'Windows 11 - Chrome',
        description: 'Completed bulk CSV file download of 25,000 corporate leads containing customer telephone numbers and annual budget parameters.',
        metadata: {
          ExportFormat: 'CSV_EXPORT_REPORTS',
          ExportName: 'Enterprise_Qualified_Leads_Complete.csv',
          TotalRowsExported: 25000,
          RiskRating: 'Exfiltration Threat Verified'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Salesforce Massive Qualified Leads Export',
      status: 'open',
      severity: 'critical',
      overallRiskScore: 90,
      assignedTo: 'Sarah Jenkins (SecOps Team Lead)',
      subject: {
        name: 'James Connor',
        email: 's.connor@enterprise.com',
        role: 'Lead Business Development Director',
        department: 'Sales-East',
        riskTier: 'High'
      },
      summary: 'James Connor initiated a mass exfiltration event by executing a CSV export from Salesforce of the absolute complete global enterprise leads folder. Over 25,000 distinct accounts (names, corporate positions, direct dial numbers, and deal sizes) were downloaded. This constitutes a severe corporate asset risk.',
      possibleDataExposure: [
        {
          resourceName: 'Enterprise_Qualified_Leads_Complete.csv',
          resourceType: 'Salesforce Report File',
          sensitivity: 'Confidential',
          action: 'CSV Mass Export',
          riskScore: 94
        }
      ],
      timeline: [
        {
          id: 't-crm-1',
          timestamp: '',
          source: 'salesforce',
          title: 'CRM Report Compiled',
          description: 'Salesforce engine structured lead contact parameters for James Connor.',
          severity: 'info'
        },
        {
          id: 't-crm-2',
          timestamp: '',
          source: 'salesforce',
          title: 'Bulk Export Action Recorded',
          description: 'An external download stream fetched 25,000 contact records containing PII.',
          severity: 'critical'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-crm-1',
          task: 'Suspend James Connor Salesforce API session credentials immediately.',
          status: 'pending',
          recommendedBy: 'Salesforce Session Broker'
        },
        {
          id: 'h-crm-2',
          task: 'Initiate offboarding screening checks if resignation activity is discovered in HR systems.',
          status: 'pending',
          recommendedBy: 'HR SecOps Automated Hook'
        }
      ]
    }
  },

  github_clone: {
    id: 'github_clone',
    title: 'GitHub Clone',
    description: 'An unrecognized SSH key clone command targets the most proprietary private repositories.',
    severity: 'critical',
    initialRiskScore: 94,
    events: [
      {
        source: 'GitHub',
        sourceType: 'github',
        actor: {
          name: 'Sarah Jenkins',
          email: 's.jenkins@enterprise.com',
          role: 'SecOps Team Lead',
          department: 'Security Operations'
        },
        eventName: 'New Deployment Key Added',
        severity: 'warning',
        riskScore: 50,
        ipAddress: '185.122.45.67',
        location: 'Paris, France',
        device: 'SSH-Agent / Git Console',
        description: 'A new personal SSH key "ssh-key-sj-99" was registered on the GitHub corporate profile.',
        metadata: {
          KeyAlgorithm: 'RSA-4096-SHA256',
          Fingerprint: 'SHA256:q8+1Bv92M10A8f278N0v',
          IsPrimary: 'No',
          AuthType: 'Interactive Session'
        }
      },
      {
        source: 'GitHub',
        sourceType: 'github',
        actor: {
          name: 'Sarah Jenkins',
          email: 's.jenkins@enterprise.com',
          role: 'SecOps Team Lead',
          department: 'Security Operations'
        },
        eventName: 'Proprietary Code Repository Cloned',
        severity: 'critical',
        riskScore: 96,
        ipAddress: '185.122.45.67',
        location: 'Paris, France',
        device: 'Git CLI Command Line',
        description: 'Massive git clone operation downloaded the core "deepmind-llm-router" private repository.',
        metadata: {
          Repository: 'deepmind-llm-router',
          CloneMethod: 'SSH Client',
          BytesTransferred: '184 MB',
          BranchTarget: 'main'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'GitHub Corporate Repository Cloned via New SSH Key',
      status: 'open',
      severity: 'critical',
      overallRiskScore: 94,
      assignedTo: 'Jonathan Vance (Senior Investigator)',
      subject: {
        name: 'Sarah Jenkins',
        email: 's.jenkins@enterprise.com',
        role: 'SecOps Team Lead',
        department: 'Security Operations',
        riskTier: 'High'
      },
      summary: 'Critical threat alert triggered. Sarah Jenkins personal profile registered a brand new deployment RSA SSH key from an unrecognized French IP pool, immediately followed by an automated repository clone of our core IP: deepmind-llm-router. This signature matches credential stuffing/session token hijacking.',
      possibleDataExposure: [
        {
          resourceName: 'deepmind-llm-router.git',
          resourceType: 'GitHub Core Repository Codebase',
          sensitivity: 'Restricted PII',
          action: 'Git Clone Repository',
          riskScore: 98
        }
      ],
      timeline: [
        {
          id: 't-gh-1',
          timestamp: '',
          source: 'github',
          title: 'SSH Key Registration',
          description: 'A new SSH public key with identifier sj-99 was authorized to profile.',
          severity: 'warning'
        },
        {
          id: 't-gh-2',
          timestamp: '',
          source: 'github',
          title: 'Proprietary Codebase Clone',
          description: 'A git clone fetched all source commits and routing algorithms from deepmind-llm-router.',
          severity: 'critical'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-gh-1',
          task: 'Immediately revoke the deployment SSH key "ssh-key-sj-99" from the profile settings.',
          status: 'pending',
          recommendedBy: 'GitHub API Broker'
        },
        {
          id: 'h-gh-2',
          task: 'Force-invalidate Sarah Jenkins current browser cookies and sessions on Okta.',
          status: 'pending',
          recommendedBy: 'Okta Session Controller'
        }
      ]
    }
  },

  oauth_app: {
    id: 'oauth_app',
    title: 'OAuth App Authorized',
    description: 'An employee authorizes an untrusted, malicious third-party SaaS app with full corporate directory scope.',
    severity: 'critical',
    initialRiskScore: 89,
    events: [
      {
        source: 'Google Workspace',
        sourceType: 'google_workspace',
        actor: {
          name: 'Alexander Frost',
          email: 'a.frost@enterprise.com',
          role: 'Senior Incident Analyst',
          department: 'Security Operations'
        },
        eventName: 'OAuth Request Redirect',
        severity: 'info',
        riskScore: 10,
        ipAddress: '103.111.45.2',
        location: 'Seoul, South Korea',
        device: 'MacBook Pro - Chrome',
        description: 'Initiated Google Single-Sign-On authorization workflow on external site.',
        metadata: {
          RedirectURL: 'https://attacker-dev-portal.com/auth/callback',
          AppVendor: 'Unregistered Developer',
          AppName: 'SyncAllStoragePro'
        }
      },
      {
        source: 'Google Workspace',
        sourceType: 'google_workspace',
        actor: {
          name: 'Alexander Frost',
          email: 'a.frost@enterprise.com',
          role: 'Senior Incident Analyst',
          department: 'Security Operations'
        },
        eventName: 'OAuth Scope Grant Authorized',
        severity: 'critical',
        riskScore: 92,
        ipAddress: '103.111.45.2',
        location: 'Seoul, South Korea',
        device: 'MacBook Pro - Chrome',
        description: 'Approved read/write permissions for Google Shared Drives and Gmail to unverified developer "SyncAllStoragePro".',
        metadata: {
          AppName: 'SyncAllStoragePro',
          AuthorizedScopes: 'drive, gmail.readonly, contacts.readonly',
          DeveloperContact: 'attacker-dev@gmail.com',
          ConsentLevel: 'TENANT_DOMAIN_WIDE'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Malicious Domain-Wide OAuth Permission Granted',
      status: 'open',
      severity: 'critical',
      overallRiskScore: 89,
      assignedTo: 'Sarah Jenkins (SecOps Team Lead)',
      subject: {
        name: 'Alexander Frost',
        email: 'a.frost@enterprise.com',
        role: 'Senior Incident Analyst',
        department: 'Security Operations',
        riskTier: 'High'
      },
      summary: 'Alexander Frost approved a highly dangerous OAuth scopes payload for a generic application "SyncAllStoragePro". This third-party app now holds perpetual token access to browse, export, and delete items from company-wide Google Shared Drives, as well as read internal Gmail strings.',
      possibleDataExposure: [
        {
          resourceName: 'Google Workspace Tenant Storage',
          resourceType: 'Domain Drive & Mail Directories',
          sensitivity: 'Restricted PII',
          action: 'OAuth Permanent Grant',
          riskScore: 90
        }
      ],
      timeline: [
        {
          id: 't-oa-1',
          timestamp: '',
          source: 'google_workspace',
          title: 'SSO Login Request Redirection',
          description: 'A third-party login request was initiated, mapping target scopes.',
          severity: 'info'
        },
        {
          id: 't-oa-2',
          timestamp: '',
          source: 'google_workspace',
          title: 'Permanent Access Grant Approved',
          description: 'Domain-wide OAuth scopes given to SyncAllStoragePro by a high-privilege account.',
          severity: 'critical'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-oa-1',
          task: 'Use the Google Workspace Admin console to force-revoke the client ID token assigned to SyncAllStoragePro.',
          status: 'pending',
          recommendedBy: 'Google Workspace Admin API'
        },
        {
          id: 'h-oa-2',
          task: 'Conduct a compliance audit on the email and drive activity of the compromised account.',
          status: 'pending',
          recommendedBy: 'Audit Compliance Broker'
        }
      ]
    }
  },

  login_new_device: {
    id: 'login_new_device',
    title: 'Login From New Device',
    description: 'An Okta session bypasses MFA push spamming using a virtual Python terminal on a suspicious proxy network.',
    severity: 'critical',
    initialRiskScore: 92,
    events: [
      {
        source: 'Okta IDP',
        sourceType: 'okta',
        actor: {
          name: 'Elana Rostova',
          email: 'e.rostova@enterprise.com',
          role: 'HR Administration Specialist',
          department: 'Human Resources'
        },
        eventName: 'Login Succeeded',
        severity: 'critical',
        riskScore: 94,
        ipAddress: '210.123.45.67',
        location: 'Seoul, South Korea',
        device: 'Python-requests/3.10.4 (Docker Host Linux)',
        description: 'Account access granted following a series of 12 rapid push notifications (MFA exhaustion attack).',
        metadata: {
          DeviceTrust: 'UNTRUSTED',
          MFAMethod: 'Push Notification Spamming',
          ProxyDetected: 'Yes (VPN Tunnel)',
          SessionTimeoutMinutes: 120
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Okta MFA Fatigue & Suspicious Login Session',
      status: 'open',
      severity: 'critical',
      overallRiskScore: 92,
      assignedTo: 'Jonathan Vance (Senior Investigator)',
      subject: {
        name: 'Elana Rostova',
        email: 'e.rostova@enterprise.com',
        role: 'HR Administration Specialist',
        department: 'Human Resources',
        riskTier: 'High'
      },
      summary: 'Okta identity logs flagged a successful authentication for Elana Rostova originating from Seoul, South Korea on a raw Python Docker command-line tool. Key indicators confirm the attacker bypassed multi-factor controls using push fatigue (bombarding her device with continuous validation queries until clicked).',
      possibleDataExposure: [
        {
          resourceName: 'Okta SSO Portal Directory',
          resourceType: 'Identity Portal Session',
          sensitivity: 'Confidential',
          action: 'MFA Push Fatigue Bypass',
          riskScore: 95
        }
      ],
      timeline: [
        {
          id: 't-lnd-1',
          timestamp: '',
          source: 'okta',
          title: 'Credential Push Fatigue Active',
          description: 'A sequence of 12 rapid authentication prompts was pushed to the user smartphone within 45 seconds.',
          severity: 'warning'
        },
        {
          id: 't-lnd-2',
          timestamp: '',
          source: 'okta',
          title: 'Session Authenticated via Untrusted UA',
          description: 'Authentication successfully bypassed from an IP address block with high fraud rating.',
          severity: 'critical'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-lnd-1',
          task: 'Force-terminate active Okta sessions for Elana Rostova across all registered workstations.',
          status: 'pending',
          recommendedBy: 'Okta Identity Broker'
        },
        {
          id: 'h-lnd-2',
          task: 'Temporarily switch the user profile to require Hardware security keys (YubiKey) exclusively.',
          status: 'pending',
          recommendedBy: 'Compliance Board'
        }
      ]
    }
  },

  offboarding_context: {
    id: 'offboarding_context',
    title: 'Offboarding Context',
    description: 'An employee scheduled to leave next week clones a high-value software microservice on their personal laptop.',
    severity: 'warning',
    initialRiskScore: 76,
    events: [
      {
        source: 'HR System',
        sourceType: 'hr_system',
        actor: {
          name: 'Alexander Frost',
          email: 'a.frost@enterprise.com',
          role: 'Senior Incident Analyst',
          department: 'Security Operations'
        },
        eventName: 'Employee Status Suspended',
        severity: 'info',
        riskScore: 10,
        ipAddress: '10.142.1.20',
        location: 'Internal System Hook',
        device: 'Workday Webhook Service',
        description: 'Status updated to scheduled departure. Expiration date locked to current business cycle.',
        metadata: {
          TerminationType: 'Voluntary Resignation',
          DepartureDate: '22-07-2026',
          GracePeriodHours: 0
        }
      },
      {
        source: 'GitHub',
        sourceType: 'github',
        actor: {
          name: 'Alexander Frost',
          email: 'a.frost@enterprise.com',
          role: 'Senior Incident Analyst',
          department: 'Security Operations'
        },
        eventName: 'Private Repository Cloned',
        severity: 'warning',
        riskScore: 78,
        ipAddress: '103.242.108.4',
        location: 'Singapore (Changi)',
        device: 'Git Console Client',
        description: 'Executed git clone command on proprietary security module "core-security-microservice".',
        metadata: {
          Repository: 'core-security-microservice',
          TransferMethod: 'Personal SSH Key (Stale)',
          BytesTransferred: '142 MB'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Offboarding Employee Intellectual Property Clone',
      status: 'open',
      severity: 'warning',
      overallRiskScore: 76,
      assignedTo: 'Sarah Jenkins (SecOps Team Lead)',
      subject: {
        name: 'Alexander Frost',
        email: 'a.frost@enterprise.com',
        role: 'Senior Incident Analyst',
        department: 'Security Operations',
        riskTier: 'Medium'
      },
      summary: 'Alexander Frost (Senior Incident Analyst), who has an active voluntary resignation registered in Workday, has cloned the core-security-microservice codebase onto an unmanaged endpoint via an old personal SSH key. This matches classic offboarding intellectual property harvesting profiles.',
      possibleDataExposure: [
        {
          resourceName: 'core-security-microservice.git',
          resourceType: 'Proprietary Code Repository',
          sensitivity: 'Confidential',
          action: 'Git Repository Clone',
          riskScore: 80
        }
      ],
      timeline: [
        {
          id: 't-oc-1',
          timestamp: '',
          source: 'hr_system',
          title: 'Resignation Request Processed',
          description: 'HR system recorded departure date of July 22 for Alexander Frost.',
          severity: 'info'
        },
        {
          id: 't-oc-2',
          timestamp: '',
          source: 'github',
          title: 'Repository Clone Action',
          description: 'Cloned confidential security routing codebase from a home Singapore IP address.',
          severity: 'warning'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-oc-1',
          task: 'Instruct legal team to issue an IP retention warning to Alexander Frost personal email.',
          status: 'pending',
          recommendedBy: 'Corporate Counsel Playbook'
        },
        {
          id: 'h-oc-2',
          task: 'Force invalidate Alexander Frost Active Directory / GitHub organization credentials immediately.',
          status: 'pending',
          recommendedBy: 'Directory Sync Daemon'
        }
      ]
    }
  },

  weekend_access: {
    id: 'weekend_access',
    title: 'Weekend Access',
    description: 'An executive logs in and downloads highly sensitive material at Sunday 3 AM from an unusual bulletproof host network.',
    severity: 'warning',
    initialRiskScore: 72,
    events: [
      {
        source: 'Okta IDP',
        sourceType: 'okta',
        actor: {
          name: 'Michael Brody',
          email: 'm.brody@enterprise.com',
          role: 'Account Representative',
          department: 'Sales-West'
        },
        eventName: 'Anomalous Weekend Login',
        severity: 'warning',
        riskScore: 60,
        ipAddress: '185.220.101.42',
        location: 'Tor Exit Node - Frankfurt',
        device: 'Linux - Firefox',
        description: 'Authenticated successfully at 03:15:22 AM on Sunday morning.',
        metadata: {
          AnomalousHour: 'Sunday 03:15',
          NetworkRiskType: 'TOR_EXIT_NODE',
          LocationMatch: 'Anomalous'
        }
      },
      {
        source: 'Google Workspace',
        sourceType: 'google_workspace',
        actor: {
          name: 'Michael Brody',
          email: 'm.brody@enterprise.com',
          role: 'Account Representative',
          department: 'Sales-West'
        },
        eventName: 'Confidential Drive File Exported',
        severity: 'warning',
        riskScore: 74,
        ipAddress: '185.220.101.42',
        location: 'Tor Exit Node - Frankfurt',
        device: 'Linux - Firefox',
        description: 'Exported payroll projections sheet to local workspace directory.',
        metadata: {
          FileName: 'Q4_Payroll_Projections_Internal.xlsx',
          ExportMethod: 'Web Download',
          Folder: 'Shared/Finance/Board_Previews'
        },
        triggerIncident: true
      }
    ],
    associatedCase: {
      title: 'Anomalous Tor Exit Node Weekend Activity',
      status: 'open',
      severity: 'warning',
      overallRiskScore: 72,
      assignedTo: 'Jonathan Vance (Senior Investigator)',
      subject: {
        name: 'Michael Brody',
        email: 'm.brody@enterprise.com',
        role: 'Account Representative',
        department: 'Sales-West',
        riskTier: 'Medium'
      },
      summary: 'Michael Brody credentials were used to authenticate to corporate portals on a Sunday at 3:15 AM from a Frankfurt-based Tor Exit Node. Immediately following access, a highly restricted payroll projections spreadsheet was exported to local client storage. Recommended action: Force-expire current session tokens.',
      possibleDataExposure: [
        {
          resourceName: 'Q4_Payroll_Projections_Internal.xlsx',
          resourceType: 'Google Workspace Spreadsheet',
          sensitivity: 'Confidential',
          action: 'Web Drive Export',
          riskScore: 78
        }
      ],
      timeline: [
        {
          id: 't-wa-1',
          timestamp: '',
          source: 'okta',
          title: 'Suspicious Location SSO Auth',
          description: 'Login validated during non-standard hours originating from bulletproof Tor relay servers.',
          severity: 'warning'
        },
        {
          id: 't-wa-2',
          timestamp: '',
          source: 'google_workspace',
          title: 'Financial Spreadsheet Exported',
          description: 'Downloaded the highly restricted planning template Q4_Payroll_Projections_Internal.xlsx.',
          severity: 'warning'
        }
      ],
      humanActionPlan: [
        {
          id: 'h-wa-1',
          task: 'Force reset Michael Brody corporate Okta active credentials.',
          status: 'pending',
          recommendedBy: 'System Automation Proxy'
        },
        {
          id: 'h-wa-2',
          task: 'Initiate a secure out-of-band communication check with Michael Brody to verify identity.',
          status: 'pending',
          recommendedBy: 'SecOps SOP'
        }
      ]
    }
  }
};
