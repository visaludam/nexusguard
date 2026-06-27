import React, { useState } from 'react';
import { 
  FileText, Copy, Download, Printer, Shield, CheckSquare, Clock, 
  AlertTriangle, CheckCircle, HelpCircle, ChevronRight, BookOpen, Globe, Info, ArrowUpRight
} from 'lucide-react';
import { InvestigationCase, AuditEvent, PolicyRule, SecurityReport } from '../types';

interface InvestigationReportProps {
  currentCase: InvestigationCase;
  analysis?: any; // Gemini analysis data if generated
  onClose?: () => void;
}

// Fallback high-fidelity reports for preloaded cases (when Gemini hasn't run yet)
const fallbackReports: Record<string, any> = {
  'NX-1042': {
    incident_title: "Anomalous Multi-Region OAuth Consent & Customer Data Exposure",
    priority: "Critical",
    confidence: 94,
    executive_summary: "NexusGuard forensic evaluation has identified highly anomalous concurrent logins matching the credentials of Principal Engineer Jonathan Vance. Authenticated via a telephonic MFA bypass token, the active session originated from a residential IP in Singapore while Vance was simultaneously logged in from San Francisco. Immediately following this impossible travel event, the session authorized an unvetted third-party OAuth workspace application named 'SheetsExportAI' and bulk downloaded confidential customer billing and PII ledgers. The unvetted client holds persistent GWS read-only API scopes, representing an active cloud-to-cloud exfiltration backchannel.",
    technical_summary: "1. Authentication sequence initiated at 22:15 UTC utilizing a 24-hour Temporary OTP bypass key issued under HelpDesk ticket #HD-9081 (citing forgotten physical key). Geolocation of bypass session: Singapore (IP: 103.242.108.4), while active session in SF remained online. Speed threshold violated (>10,000 km/h).\n2. At 22:42 UTC, the Singapore-routed session bulk downloaded 'customer_pii_ledger_v2.parquet' (412.4 MB) from the restricted '/Finances_2026_Restricted' GWS Drive path.\n3. At 22:45 UTC, the session approved full Google Workspace OAuth consent authorizing client UID: 942-8851-gws ('SheetsExportAI') with scopes 'drive.readonly, drive.metadata.readonly'.",
    observed_facts: [
      "Temporary MFA bypass passcode was requested and generated via helpdesk-bot.",
      "Okta login succeeded from Singapore residential block IP within 15 minutes of standard San Francisco office authentication.",
      "Confidential customer billing ledger was downloaded in Parquet format from a restricted GWS folder.",
      "An unvetted third-party OAuth app ('SheetsExportAI') was granted persistent access to Google Drive metadata and files."
    ],
    supporting_evidence: [
      "Okta Session Log ID: s-okta-99120 from IP 103.242.108.4 (SG).",
      "Google Workspace Audit: Drive Payload download signature matching parquet asset.",
      "GWS Admin OAuth Registry: Approved ClientID: 942-8851-gws."
    ],
    contradicting_evidence: [
      "The login device user agent strings matched Vance's standard MacBook Pro hardware profile exactly, indicating possible session cookie hijacking/token replication."
    ],
    possible_explanations: [
      {
        title: "Compromised Credentials & Session Token Theft",
        likelihood: 85,
        supporting_points: [
          "MFA bypass key was requested telephonically, a frequent social engineering vector.",
          "Login from Singapore resides in high-frequency VPN blocks.",
          "Authorizing unverified OAuth apps is a signature exfiltration persistence technique."
        ],
        missing_evidence: [
          "No recorded hardware keys stolen; requires verification of the telephone caller voice print."
        ]
      },
      {
        title: "Authorized Travelling Engineer Debug Action",
        likelihood: 15,
        supporting_points: [
          "Vance does occasionally travel for Singapore data center deployments.",
          "Device browser user agent matches standard employee laptop registry."
        ],
        missing_evidence: [
          "No travel requests registered in G&A expense calendars; Vance did not declare overseas travel."
        ]
      }
    ],
    policy_matches: [
      {
        policy_id: "POL-01",
        policy_title: "Data Exfiltration via Unapproved Cloud Storage",
        relevance: "Restricts downloading restricted tables offline without administrative container proxy auditing.",
        possible_violation: true
      },
      {
        policy_id: "POL-02",
        policy_title: "Multi-Region Concurrent Authentication Rule",
        relevance: "Triggers on multiple logins with geographic separation travel delta under 4 hours.",
        possible_violation: true
      },
      {
        policy_id: "POL-04",
        policy_title: "Unverified OAuth Application Consent",
        relevance: "Expressly prohibits granting Drive metadata and file read permissions to non-vetted client developers.",
        possible_violation: true
      }
    ],
    business_impact: "High risk of CCPA / GDPR non-compliance fines due to unencrypted ledger variables downloaded. Potential disclosure of institutional contract schedules to competitive outreaches.",
    recommended_verification_steps: [
      "Establish out-of-band communication with Jonathan Vance via verified voice call or Slack.",
      "Audit Helpdesk Ticket #HD-9081 voice logs to identify if caller spoke with Vance's voice print.",
      "Query SheetsExportAI DNS resolution logs for outbound payloads."
    ],
    recommended_actions: {
      security: [
        "Revoke OAuth application token (942-8851-gws) via Google Workspace admin panel.",
        "Force-terminate all active Okta and GWS session tokens for j.vance@enterprise.com.",
        "Suspend directory credentials and rotate corporate workstation access keys."
      ],
      manager: [
        "Initiate SecOps briefing on data volume downloaded.",
        "Notify Infrastructure VP of potential principal credentials exposure."
      ],
      hr: [
        "Prepare incident log on Jonathan Vance credentials activity.",
        "Await out-of-band verification findings before taking employee action."
      ]
    },
    should_escalate: true,
    escalation_reason: "Direct exposure of Restricted customer data via persistent OAuth backchannel.",
    japanese_summary: "本件は、プリンシパルエンジニアのJonathan Vance氏の認証情報において、サンフランシスコとシンガポールという地理的に不可能な移動速度（時速10,000km超）での同時ログインがOktaで検知されたことから始まります。その後、ヘルプデスクのワンタイムパスコード（OTP）バイパスを悪用してログインした攻撃者が、未検証のサードパーティ製Google Workspace連携アプリ「SheetsExportAI」を承認し、制限付きの顧客個人情報（PII）レジャー「customer_pii_ledger_v2.parquet」（412.4 MB）をバルクダウンロードしました。この外部連携アプリは永続的なDrive読み取り権限を有しており、クラウド経由でのデータ流出経路が確立された可能性が極めて高く、早急なOAuthトークンの剥奪とアカウントセッション強制切断を強く推奨します。",
    human_decision_required: true
  },
  'NX-1043': {
    incident_title: "Late-Night Repository Cloning Sequence",
    priority: "High",
    confidence: 88,
    executive_summary: "NexusGuard behavioral analysis identified an anomalous late-night bulk clone sequence matching Dr. Elena Rostova's SSH credentials. Performing operations during off-VPN hours (2:30 AM Swiss local time), the session cloned 14 private repositories housing proprietary machine learning algorithms, model weight routing routers, and training libraries. This activity is highly unusual, as routine ML modeling depends on cached pipeline files rather than local clones of entire design layers.",
    technical_summary: "1. At 21:10 UTC, Dr. Elena Rostova's GitHub user portal registered a new SSH key titled 'Elena-HomeWS' from a residential Swiss IP.\n2. At 21:30 UTC, the newly configured SSH credential pulling protocol initiated cloned pulls across 14 deep-learning repositories, including 'deepmind-llm-router' and 'weights-loader-v1', extracting 8.4 GB of source directories.",
    observed_facts: [
      "A new SSH authentication key was registered to Dr. Elena Rostova's GitHub corporate profile.",
      "14 codebases containing core machine learning routing systems were cloned within a 20-minute span.",
      "The Git command execution originated from residential networks late at night (02:30 AM Swiss local time)."
    ],
    supporting_evidence: [
      "GitHub audit log: Added SSH Key fingerprint SHA256:7b91... from IP 198.51.100.75.",
      "Command shell pull request history for AI/LLM division code assets."
    ],
    contradicting_evidence: [
      "The SSH key registration was preceded by a legitimate 2FA login from Dr. Rostova's known mobile browser.",
      "Dr. Rostova is a recognized lead ML designer who frequently operates on core weights models."
    ],
    possible_explanations: [
      {
        title: "Malicious Intellectual Property Exfiltration",
        likelihood: 55,
        supporting_points: [
          "Operation occurred late at night from Swiss residential networks off-VPN.",
          "Registration of personal SSH key immediately followed by a heavy clone sequence."
        ],
        missing_evidence: [
          "No verified external transfers or outbound uploads recorded from Swiss IP."
        ]
      },
      {
        title: "Authorized Late-Night Local Debug Environment Config",
        likelihood: 45,
        supporting_points: [
          "Dr. Rostova had upcoming performance evaluations requiring training loops.",
          "SSH fingerprint registered through active 2FA-secured profile."
        ],
        missing_evidence: [
          "Confirm with AI Lead if home training was requested or scheduled."
        ]
      }
    ],
    policy_matches: [
      {
        policy_id: "POL-03",
        policy_title: "Anomalous Late Night Repository Activity",
        relevance: "Limits massive git clones of proprietary source assets outside standard daylight developer hours.",
        possible_violation: true
      }
    ],
    business_impact: "Potential compromise of proprietary core AI weights, custom LLM routers, and unique tokenizer codes. If leaked to rivals, this could expose trade secrets.",
    recommended_verification_steps: [
      "Query Dr. Elena Rostova via verified corporate Slack or telephone channels to confirm SSH key authorization.",
      "Cross-check G&A offboarding registries to verify if Dr. Rostova is in active termination notice periods."
    ],
    recommended_actions: {
      security: [
        "Revoke the newly created SSH key 'Elena-HomeWS' from corporate VCS registries.",
        "Enforce mandatory VPN tunnel access rules for all GitHub repository pulls."
      ],
      manager: [
        "Speak with Dr. Rostova regarding local cloning needs.",
        "Ensure training assets are processed exclusively within secure container playgrounds."
      ],
      hr: [
        "Audit HR database for offboarding indicator flags or competitor recruitment listings.",
        "Maintain normal operational protocol pending manager feedback."
      ]
    },
    should_escalate: false,
    escalation_reason: "Dr. Rostova has high authority over repositories, but off-hours cloning of 8.4 GB of source files represents high IP exfiltration risk.",
    japanese_summary: "Dr. Elena Rostova氏のSSH認証情報を使用し、スイス現地時間の深夜2時30分に、社の重要知的財産である機械学習アルゴリズムやモデルのルーティング設定ファイル等を含む14のプライベートリポジトリ（計8.4 GB）がバルククローンされたことが検知されました。これはリポジトリに新しく登録されたSSHキー「Elena-HomeWS」から行われており、社外VPN経由での深夜のリポジトリ大量クローンは、通常の開発パターン（キャッシュ利用）から逸脱しています。現時点では競合他社への流出や不正な退職前データ収集の懸念があるため、該当SSHキーの取り消しおよび本人への状況確認を推奨します。",
    human_decision_required: true
  },
  'NX-1044': {
    incident_title: "SaaS CRM Sales Leads Bulk Export & External Transfer",
    priority: "Critical",
    confidence: 90,
    executive_summary: "NexusGuard forensic telemetry detected massive customer and lead list exfiltration from Sarah Connor's CRM and file-sharing accounts. Utilizing VPN proxies to simulate local regional office networks, Connor exported active West region subscriber contracts containing sensitive contract and ARR metrics. Connor then utilized an unapproved, encrypted browser extension proxy ('BoxUploaderPro') to upload 4.2 GB of file ledgers directly to personal Box cloud folders.",
    technical_summary: "1. At 19:35 UTC, Sarah Connor exported 'West_Active_Subscribers_Q2' from Salesforce CRM, compromising ARR columns and cellular lines for 4,500 active subscribers.\n2. At 19:40 UTC, endpoint network sensors detected Connor utilizing unapproved Chrome extension ID: jklmnoopqrstuvwxyz123456 ('BoxUploaderPro') to establish direct TLS pipes bypass-uploading 4.2 GB of spreadsheet files to personal Box accounts.",
    observed_facts: [
      "Sarah Connor exported high-value CRM lists containing 4,500 active subscribers.",
      "Direct encrypted uploads were performed to an unapproved personal Box cloud directory.",
      "An uninspected browser extension proxy ('BoxUploaderPro') was deployed to bypass secure web filters."
    ],
    supporting_evidence: [
      "Salesforce transactions log: Subscriber export matching user s.connor@enterprise.com.",
      "Endpoint sensor alert: BoxUploaderPro SSL traffic to upload.box.com payload count 4.2 GB."
    ],
    contradicting_evidence: [
      "No corporate laptops were stolen; all actions occurred on Sarah's active registered Macbook Air."
    ],
    possible_explanations: [
      {
        title: "Intentional Data Harvesting for Competitor Transition",
        likelihood: 90,
        supporting_points: [
          "Exporting client ARR files is highly abnormal for Connor's typical sales accounts.",
          "Using bypass proxies like BoxUploaderPro indicates active efforts to circumvent security logs."
        ],
        missing_evidence: [
          "Requires validation if Connor has submitted resignation or has active interviews with sales rival outbound firms."
        ]
      },
      {
        title: "Benign Off-Network Customer Portfolio Backup",
        likelihood: 10,
        supporting_points: [
          "Connor frequently works on local spreadsheets due to low cellular connectivity in her region."
        ],
        missing_evidence: [
          "Does not explain why standard corporate OneDrive/Google Drive was bypassed in favor of a private Box account."
        ]
      }
    ],
    policy_matches: [
      {
        policy_id: "POL-01",
        policy_title: "Data Exfiltration via Unapproved Cloud Storage",
        relevance: "Prohibits the export of billing ARR databases followed by upload attempts to unauthorized personal storage vaults.",
        possible_violation: true
      }
    ],
    business_impact: "Catastrophic exposure of high-value active ARR sales pipeline. Potential poached accounts risk if data is transfered to competitive sales campaigns.",
    recommended_verification_steps: [
      "Contact Sarah Connor via telephone to request immediate deletion of personal Box assets.",
      "Audit HR records to confirm Connor's employment status and notices."
    ],
    recommended_actions: {
      security: [
        "Force-revoke Sarah Connor's Salesforce access permissions and suspend active directory credentials.",
        "Add browser extension ID jklmnoopqrstuvwxyz123456 to corporate browser block templates."
      ],
      manager: [
        "Initiate sales account audit to identify potential competitor solicitation.",
        "Notify Legal Counsel regarding potential breach of trade secret confidentiality agreements."
      ],
      hr: [
        "Initiate emergency employee review session.",
        "Coordinate with Security Operations for asset collection and laptop recovery."
      ]
    },
    should_escalate: true,
    escalation_reason: "High exfiltration signature of active client ARR list matching competitor recruitment timeline.",
    japanese_summary: "エンタープライズ・アカウント・エグゼクティブのSarah Connor氏のアカウントにおいて、Salesforceから契約ARR（年間経常収益）データ、電話番号、企業リストを含む4,500件のアクティブ契約顧客データがCSVエクスポートされました。その後、社内で禁止されている暗号化アップロード用のブラウザ拡張機能「BoxUploaderPro」を使用し、個人用のBoxアカウント（upload.box.com）に4.2 GBのファイルをアップロードし、セキュリティファイアウォールをバイパスした形跡が検知されました。競合への営業秘密の持ち出し可能性が極めて高く、法務および人事と連携し、早急なアカウント利用停止措置とノートPCの回収を行う必要があります。",
    human_decision_required: true
  }
};

export default function InvestigationReport({ currentCase, analysis, onClose }: InvestigationReportProps) {
  const [checklist, setChecklist] = useState<Record<string, boolean>>({});
  const [isCopied, setIsCopied] = useState(false);

  // Get active analysis data or fall back to high-fidelity mock records
  const reportData = analysis || fallbackReports[currentCase.id] || {
    incident_title: currentCase.title,
    priority: currentCase.severity === 'critical' ? 'Critical' : 'High',
    confidence: currentCase.overallRiskScore || 85,
    executive_summary: currentCase.summary,
    technical_summary: `Forensic audit logs recorded anomalous activity linked to credentials assigned to ${currentCase.subject?.name || 'Subject'}. Events matching policy flags triggered automatic investigation.`,
    observed_facts: currentCase.timeline.map(t => `${t.title}: ${t.description}`),
    supporting_evidence: [`Incident timeline logs mapping case ID ${currentCase.id}`],
    contradicting_evidence: ["Authentication signatures matched standard user profiles, suggesting session replication."],
    possible_explanations: [
      {
        title: "Potential Session Hijack or Credentials Abuse",
        likelihood: 75,
        supporting_points: ["Anomalous events matched strict policy rules.", "Activity deviates from standard peer behavior."],
        missing_evidence: ["Confirmation from employee regarding recent network routing changes."]
      },
      {
        title: "Authorized Business Testing Operations",
        likelihood: 25,
        supporting_points: ["Subject browser user-agent matches normal system parameters."],
        missing_evidence: ["Formal supervisor approvals for off-hours audit query testing."]
      }
    ],
    policy_matches: currentCase.timeline.map(t => ({
      policy_id: "POL-GEN",
      policy_title: `Activity Source Match (${t.source.toUpperCase()})`,
      relevance: t.description,
      possible_violation: t.severity === 'critical'
    })),
    business_impact: "Potential disclosure of restricted assets. Risk of non-compliance with data safety standards.",
    recommended_verification_steps: ["Perform direct human contact validation with the target employee.", "Confirm helpdesk logging validity."],
    recommended_actions: {
      security: ["Suspend active credentials.", "Terminate active session tokens."],
      manager: ["Audit recent data queries.", "Notify operations directors."],
      hr: ["Record incident details in employee log.", "Await security verification findings."]
    },
    should_escalate: currentCase.severity === 'critical',
    escalation_reason: "High risk rating on core data access channels.",
    japanese_summary: `ケース ${currentCase.id} に関するセキュリティ要約：従業員 ${currentCase.subject?.name || '対象者'} のアカウントにおける異常な挙動が検知されました。ポリシー違反が疑われる複数の監査ログが記録されており、詳細な本人確認調査、ならびに関連する認証トークンの一時的な無効化措置を推奨します。法的なコンプライアンス要件（個人情報保護など）に配慮し、人事および部門マネージャーとの連携を直ちに開始してください。`,
    human_decision_required: true
  };

  const handleCopyReport = () => {
    const formattedText = `
=========================================
OFFICIAL SEC-OPS INCIDENT REPORT (DRAFT)
CASE ID: ${currentCase.id}
TITLE: ${reportData.incident_title}
PRIORITY: ${reportData.priority} // CONFIDENCE: ${reportData.confidence}%
=========================================

1.0 EXECUTIVE NARRATIVE SUMMARY
------------------------------
${reportData.executive_summary}

2.0 TECHNICAL TIMELINE FORENSICS
-------------------------------
${reportData.technical_summary}

3.0 OBSERVED FACTS & TELEMETRY
------------------------------
${reportData.observed_facts.map((fact: string, i: number) => `* [Fact ${i+1}] ${fact}`).join('\n')}

4.0 SUPPORTING EVIDENCE LOGS
----------------------------
${reportData.supporting_evidence.map((ev: string) => `* ${ev}`).join('\n')}

5.0 POSSIBLE INCIDENT MODEL EXPLANATIONS
----------------------------------------
${reportData.possible_explanations.map((exp: any, i: number) => `
Explanations Model ${i+1}: ${exp.title}
Likelihood: ${exp.likelihood}%
- Supporting: ${exp.supporting_points.join(', ')}
- Missing Evidence: ${exp.missing_evidence.join(', ')}
`).join('\n')}

6.0 COMPANY POLICY INTEL MATCHES
--------------------------------
${reportData.policy_matches.map((p: any) => `* [${p.policy_id}] ${p.policy_title} (violation: ${p.possible_violation ? 'YES' : 'NO'})\n  Relevance: ${p.relevance}`).join('\n')}

7.0 BUSINESS IMPACT ANALYSIS
---------------------------
${reportData.business_impact}

8.0 RECOMMENDATIONS & REMEDIATION STEPS
---------------------------------------
Security Checklist:
${reportData.recommended_actions.security.map((act: string) => `* [ ] ${act}`).join('\n')}

Manager Checklist:
${reportData.recommended_actions.manager.map((act: string) => `* [ ] ${act}`).join('\n')}

HR Checklist:
${reportData.recommended_actions.hr.map((act: string) => `* [ ] ${act}`).join('\n')}

Japanese Brief:
${reportData.japanese_summary}
`;

    navigator.clipboard.writeText(formattedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `nexusguard_case_${currentCase.id}_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleCheck = (id: string) => {
    setChecklist(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm font-sans text-slate-600 print:bg-white print:text-black print:border-none print:shadow-none print:p-0" id="nexus-investigation-report-page text-left">
      
      {/* Top action header */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 print:hidden">
        <div className="text-left">
          <span className="text-[9px] font-mono text-blue-600 uppercase tracking-widest font-bold flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            <span>CASE {currentCase.id} // SEC-OPS ARCHIVE REGISTER</span>
          </span>
          <h2 className="text-base font-bold text-slate-800 font-display mt-0.5">Formal Investigation Report</h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onClose && (
            <button 
              onClick={onClose}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 hover:text-slate-800 transition-colors cursor-pointer font-bold font-mono shadow-sm"
            >
              CLOSE DOSSIER
            </button>
          )}
          <button 
            onClick={handleCopyReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs transition-colors cursor-pointer font-bold shadow-sm"
          >
            <Copy className="w-3.5 h-3.5 text-blue-600" />
            <span>{isCopied ? 'Copied Markdown!' : 'Copy Report'}</span>
          </button>
          <button 
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs transition-colors cursor-pointer font-bold shadow-sm"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            <span>Download JSON</span>
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs transition-all cursor-pointer font-bold shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Export PDF / Print</span>
          </button>
        </div>
      </div>

      {/* Main printable paper dossier container */}
      <div className="p-8 max-w-4xl mx-auto space-y-8 bg-white text-left print:bg-white print:text-black print:p-0">
        
        {/* Printable header */}
        <div className="border-b-2 border-slate-200 pb-5 flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                N
              </div>
              <span className="font-display font-bold text-xl text-slate-800 tracking-tight print:text-black">
                NEXUS<span className="text-blue-500">GUARD</span> SECURITY INCIDENT DOSSIER
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
              AUTHORIZED SECURITY STAKEHOLDERS DIVISION ONLY // CLASSIFIED: RESTRICTED
            </p>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-500">
            <div>CASE ID: <strong>{currentCase.id}</strong></div>
            <div>STATUS: <strong className="text-amber-600 uppercase">{currentCase.status.replace('_', ' ')}</strong></div>
            <div>GEN TIME: <strong>2026-06-26 23:35</strong></div>
          </div>
        </div>

        {/* Priority, Confidence Gauge and Subject summary card */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          
          <div className="md:col-span-8 bg-slate-50 border border-slate-200 p-5 rounded-lg flex flex-col justify-between space-y-4 shadow-sm print:border-black print:bg-transparent">
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block">Incident Title / Classification</span>
              <h3 className="text-lg font-bold text-slate-800 mt-1 print:text-black">{reportData.incident_title}</h3>
              
              {/* Employee card link */}
              <div className="mt-4 flex items-center gap-3 bg-white p-3 rounded border border-slate-200 print:border-black print:bg-transparent">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 shrink-0 font-bold font-mono">
                  {currentCase.subject?.name.split(' ').map(n=>n[0]).join('')}
                </div>
                <div className="text-left truncate">
                  <h4 className="text-xs font-bold text-slate-800 print:text-black">{currentCase.subject?.name}</h4>
                  <p className="text-[10px] text-slate-500 truncate font-semibold">
                    {currentCase.subject?.role} • {currentCase.subject?.department}
                  </p>
                  <span className={`inline-block text-[9px] font-bold mt-1 px-1.5 py-0.5 rounded ${
                    currentCase.subject?.riskTier === 'High' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    HR STATUS: {currentCase.subject?.riskTier} RISK
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-4 bg-slate-50 border border-slate-200 p-5 rounded-lg flex flex-col items-center justify-center space-y-3.5 text-center shadow-sm print:border-black print:bg-transparent">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Severity Rating</span>
            
            <div className="flex items-center gap-1.5">
              <span className={`w-3.5 h-3.5 rounded-full ${
                reportData.priority.toLowerCase() === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
              }`} />
              <span className="text-base font-bold text-slate-800 uppercase tracking-wider font-mono print:text-black">
                {reportData.priority}
              </span>
            </div>

            <div className="w-full border-t border-slate-200 pt-3 flex flex-col items-center">
              <span className="text-[9px] font-mono text-slate-400 uppercase font-bold mb-1">Dossier Confidence Index</span>
              <div className="flex items-end gap-1.5">
                <span className="text-3xl font-bold text-blue-600 font-mono leading-none">{reportData.confidence}%</span>
                <span className="text-[10px] text-slate-400 font-bold pb-0.5 uppercase">vetted</span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden border border-slate-300/30">
                <div 
                  className="bg-blue-500 h-full rounded-full" 
                  style={{ width: `${reportData.confidence}%` }} 
                />
              </div>
            </div>
          </div>

        </div>

        {/* 1.0 Executive Narrative Summary */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
            <span className="text-blue-600 font-extrabold font-sans">1.0</span>
            <span>Executive Narrative Summary</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-200 font-semibold print:border-none print:p-0 print:bg-transparent print:text-black">
            {reportData.executive_summary}
          </p>
        </div>

        {/* 2.0 Technical Forensics Timeline Summary */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
            <span className="text-blue-600 font-extrabold font-sans">2.0</span>
            <span>Technical Forensics Timeline Summary</span>
          </h3>
          <div className="text-xs text-slate-600 leading-relaxed space-y-3.5">
            {reportData.technical_summary.split('\n').map((line: string, i: number) => (
              <p key={i} className="pl-1 leading-relaxed font-medium">{line}</p>
            ))}
          </div>
        </div>

        {/* 3.0 Observed Facts & Evidence */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
              <span className="text-blue-600 font-extrabold font-sans">3.0</span>
              <span>Observed Facts & Telemetry</span>
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 font-medium">
              {reportData.observed_facts.map((fact: string, idx: number) => (
                <li key={idx} className="flex gap-2.5 items-start pl-1">
                  <span className="text-blue-600 shrink-0 font-bold font-mono">[{idx+1}]</span>
                  <span className="leading-relaxed">{fact}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
              <span className="text-blue-600 font-extrabold font-sans">4.0</span>
              <span>Supporting Evidence Logs</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              {reportData.supporting_evidence.map((ev: string, idx: number) => (
                <li key={idx} className="flex gap-2 items-center bg-slate-50 border border-slate-200 p-2.5 rounded-md print:border-black print:bg-transparent print:text-black">
                  <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-mono text-[11px] truncate leading-none text-slate-700">{ev}</span>
                </li>
              ))}
              {reportData.contradicting_evidence && reportData.contradicting_evidence.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1">Contradicting Context</span>
                  {reportData.contradicting_evidence.map((ce: string, idx: number) => (
                    <p key={idx} className="text-[11px] text-slate-500 leading-relaxed italic pl-1 border-l border-slate-200">{ce}</p>
                  ))}
                </div>
              )}
            </ul>
          </div>

        </div>

        {/* 5.0 Possible Explanations Model */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
            <span className="text-blue-600 font-extrabold font-sans">5.0</span>
            <span>Incident Model Explanations</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.possible_explanations.map((exp: any, idx: number) => (
              <div 
                key={idx} 
                className="bg-slate-50 border border-slate-200 p-4.5 rounded-lg space-y-3 shadow-sm print:border-black print:bg-transparent"
              >
                <div className="flex items-start justify-between gap-2.5">
                  <h4 className="text-xs font-bold text-slate-800 font-display print:text-black">{exp.title}</h4>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold block">Likelihood</span>
                    <span className={`text-xs font-bold font-mono ${exp.likelihood >= 75 ? 'text-red-600' : 'text-slate-500'}`}>{exp.likelihood}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden border border-slate-300/30">
                  <div 
                    className={`h-full rounded-full ${exp.likelihood >= 75 ? 'bg-red-500' : 'bg-slate-400'}`}
                    style={{ width: `${exp.likelihood}%` }} 
                  />
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 font-mono uppercase font-bold text-[9px] block">Supporting Points</span>
                    <ul className="list-disc list-inside pl-1 text-slate-600 space-y-0.5 mt-0.5 font-semibold">
                      {exp.supporting_points.map((pt: string, idx: number) => (
                        <li key={idx} className="truncate">{pt}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-slate-400 font-mono uppercase font-bold text-[9px] block">Missing Verification</span>
                    <ul className="list-disc list-inside pl-1 text-slate-500 space-y-0.5 mt-0.5 font-semibold">
                      {exp.missing_evidence.map((pt: string, idx: number) => (
                        <li key={idx} className="truncate">{pt}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6.0 Policy Intelligence Match */}
        <div className="space-y-2.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
            <span className="text-blue-600 font-extrabold font-sans">6.0</span>
            <span>Corporate Compliance & Policy Matches</span>
          </h3>
          
          <div className="space-y-2.5">
            {reportData.policy_matches.map((pol: any, idx: number) => (
              <div key={idx} className="bg-slate-50/50 border border-slate-200 p-3.5 rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 print:border-black print:bg-transparent">
                <div className="space-y-0.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded font-bold">{pol.policy_id}</span>
                    <h4 className="text-xs font-bold text-slate-800 print:text-black">{pol.policy_title}</h4>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 font-semibold leading-relaxed max-w-2xl">{pol.relevance}</p>
                </div>
                <span className={`shrink-0 text-[10px] font-bold font-mono px-2 py-0.5 rounded uppercase ${
                  pol.possible_violation 
                    ? 'bg-red-50 text-red-700 border border-red-200 font-bold' 
                    : 'bg-slate-100 text-slate-500 border border-slate-200 font-semibold'
                }`}>
                  {pol.possible_violation ? 'FLAGGED VIOLATION' : 'MONITORED'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 7.0 Business Impact & Verification */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          <div className="md:col-span-5 space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
              <span className="text-blue-600 font-extrabold font-sans">7.0</span>
              <span>Business Impact Analysis</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold bg-slate-50 p-4 rounded border border-slate-200 print:border-none print:p-0 print:bg-transparent print:text-black">
              {reportData.business_impact}
            </p>
          </div>

          <div className="md:col-span-7 space-y-2.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
              <span className="text-blue-600 font-extrabold font-sans">8.0</span>
              <span>Recommended Human Verification Steps</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
              {reportData.recommended_verification_steps.map((step: string, idx: number) => (
                <li key={idx} className="flex gap-2.5 items-start pl-1 text-left">
                  <ArrowUpRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 9.0 Remediation Action Plan Checklist - COLLABORATIVE HUMAN OVERWRITE */}
        <div className="space-y-4">
          <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center print:border-black">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 print:text-black">
              <span className="text-blue-600 font-extrabold font-sans">9.0</span>
              <span>Multi-Division Action Plan Checklist (Human Decisioning)</span>
            </h3>
            <span className="text-[9px] font-mono text-blue-600 uppercase font-bold print:hidden">Human Authority Guard</span>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
            To prevent automatic service disruption, NexusGuard mandates double-signature verification across three corporate stakeholders. Complete each checklist row before declaring this incident Containment Ready.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Security Ops Checklist */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3.5 shadow-sm print:border-black print:bg-transparent">
              <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono print:text-black">Security Ops Check</h4>
                <span className="text-[9px] text-blue-600 font-mono font-bold">SecOps</span>
              </div>
              <ul className="space-y-2 text-left">
                {reportData.recommended_actions.security.map((act: string, idx: number) => {
                  const checkId = `sec-${idx}`;
                  const isChecked = !!checklist[checkId];

                  return (
                    <li 
                      key={idx}
                      onClick={() => toggleCheck(checkId)}
                      className="flex gap-2.5 items-start text-xs text-slate-600 font-semibold cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-0.5 rounded border-slate-300 text-blue-600 bg-white focus:ring-0 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-slate-400' : ''}>{act}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Division Manager Checklist */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3.5 shadow-sm print:border-black print:bg-transparent">
              <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono print:text-black">Operations Manager Check</h4>
                <span className="text-[9px] text-emerald-600 font-mono font-bold">Director</span>
              </div>
              <ul className="space-y-2 text-left">
                {reportData.recommended_actions.manager.map((act: string, idx: number) => {
                  const checkId = `mgr-${idx}`;
                  const isChecked = !!checklist[checkId];

                  return (
                    <li 
                      key={idx}
                      onClick={() => toggleCheck(checkId)}
                      className="flex gap-2.5 items-start text-xs text-slate-600 font-semibold cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-0.5 rounded border-slate-300 text-emerald-600 bg-white focus:ring-0 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-slate-400' : ''}>{act}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* HR / Compliance Checklist */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-lg space-y-3.5 shadow-sm print:border-black print:bg-transparent">
              <div className="border-b border-slate-200 pb-1.5 flex justify-between items-center">
                <h4 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider font-mono print:text-black">Human Resources Check</h4>
                <span className="text-[9px] text-purple-600 font-mono font-bold">HR / Legal</span>
              </div>
              <ul className="space-y-2 text-left">
                {reportData.recommended_actions.hr.map((act: string, idx: number) => {
                  const checkId = `hr-${idx}`;
                  const isChecked = !!checklist[checkId];

                  return (
                    <li 
                      key={idx}
                      onClick={() => toggleCheck(checkId)}
                      className="flex gap-2.5 items-start text-xs text-slate-600 font-semibold cursor-pointer select-none"
                    >
                      <input 
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="mt-0.5 rounded border-slate-300 text-purple-600 bg-white focus:ring-0 cursor-pointer"
                      />
                      <span className={isChecked ? 'line-through text-slate-400' : ''}>{act}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

          </div>
        </div>

        {/* 10.0 外国語セキュリティ監査要約 (Japanese Compliance Briefing Summary) */}
        <div className="space-y-2.5 bg-slate-50 p-5 rounded-lg border border-slate-200 print:border-black print:bg-transparent print:p-0">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-200 pb-1.5 print:border-black print:text-black">
            <Globe className="w-4 h-4 text-blue-600 print:hidden" />
            <span>10.0 外国語セキュリティ監査要約 (Japanese Summary briefing)</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-semibold italic">
            {reportData.japanese_summary}
          </p>
        </div>

        {/* Closing Notice disclaimer footer */}
        <div className="border-t border-slate-200 pt-4 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 print:text-black print:border-black font-semibold leading-relaxed">
          <span>NexusGuard Co-Pilot Document Generation // System ID: {currentCase.id}-GEN</span>
          <span className="text-center sm:text-right mt-1 sm:mt-0 max-w-md">
            This document represents a generated investigative brief. Operational containment procedures, legal briefs, and HR assessments require human authorization.
          </span>
        </div>

      </div>

    </div>
  );
}
