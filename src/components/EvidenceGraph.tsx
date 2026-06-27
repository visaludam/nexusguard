import React, { useState } from 'react';
import { 
  Share2, Users, HardDrive, FileText, Lock, Globe, AlertTriangle, 
  Layers, Database, Zap, BookOpen, Info, ShieldAlert, ChevronRight, Activity, Cpu
} from 'lucide-react';
import { InvestigationCase } from '../types';

interface EvidenceGraphProps {
  currentCase: InvestigationCase;
}

interface GraphNode {
  id: string;
  label: string;
  subLabel: string;
  type: 'actor' | 'system' | 'file' | 'customer_data' | 'oauth_app' | 'public_share' | 'hr_status' | 'policy';
  x: number;
  y: number;
  details: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  details: string;
  isDash?: boolean;
}

export default function EvidenceGraph({ currentCase }: EvidenceGraphProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('');
  const [hoveredNodeId, setHoveredNodeId] = useState<string>('');

  // 1. Predefined layout nodes and edges mapping per case
  const getGraphData = (caseId: string): { nodes: GraphNode[]; links: GraphLink[] } => {
    switch (caseId) {
      case 'NX-1042': // Jonathan Vance Case
        return {
          nodes: [
            { 
              id: 'jvance', 
              label: 'Jonathan Vance', 
              subLabel: 'Principal Software Engineer', 
              type: 'actor', 
              x: 400, 
              y: 130, 
              details: "The employee subject of this investigation. Holds privileged command-line access to core SaaS backends and accounting structures." 
            },
            { 
              id: 'hr_vance', 
              label: 'Infrastructure Division (High Risk)', 
              subLabel: 'HR Entity Status', 
              type: 'hr_status', 
              x: 600, 
              y: 60, 
              details: "Employee profile marked as high risk tier due to privileged core engineering roles and credentials." 
            },
            { 
              id: 'okta', 
              label: 'Okta IDP System', 
              subLabel: 'Identity Provider', 
              type: 'system', 
              x: 180, 
              y: 200, 
              details: "Authentication log registry. Recorded simultaneous sessions from standard local networks and travel-impossible Singapore routers." 
            },
            { 
              id: 'gws', 
              label: 'Google Workspace', 
              subLabel: 'Enterprise Cloud', 
              type: 'system', 
              x: 320, 
              y: 250, 
              details: "Company Google Workspace suite. Houses sensitive finances directories and manages authorized OAuth applications." 
            },
            { 
              id: 'parquet_file', 
              label: 'customer_pii_ledger_v2.parquet', 
              subLabel: 'Confidential Drive Asset', 
              type: 'file', 
              x: 460, 
              y: 350, 
              details: "Sensitive accounting ledger containing encrypted consumer PII variables and credit history listings." 
            },
            { 
              id: 'ledger_data', 
              label: 'Customer Financial PII', 
              subLabel: 'Restricted Customer Data', 
              type: 'customer_data', 
              x: 650, 
              y: 350, 
              details: "Underlying customer credentials and banking record variables protected by compliance guidelines." 
            },
            { 
              id: 'sheets_ai', 
              label: 'SheetsExportAI app', 
              subLabel: 'Unverified OAuth Client', 
              type: 'oauth_app', 
              x: 160, 
              y: 380, 
              details: "An unverified third-party app authorized to bypass corporate network proxies and directly read file repositories." 
            },
            { 
              id: 'pol_oauth', 
              label: 'POL-04: Unverified OAuth rule', 
              subLabel: 'Active Security Policy', 
              type: 'policy', 
              x: 650, 
              y: 200, 
              details: "Enterprise directive restricting users from providing broad write or read permissions to unvetted external APIs." 
            }
          ],
          links: [
            { source: 'jvance', target: 'hr_vance', label: 'belongs to', details: "Jonathan Vance holds Principal role in infrastructure team, carrying High Risk rating." },
            { source: 'okta', target: 'jvance', label: 'authenticates', details: "Okta registered concurrent session authorizations from home and Singapore proxy." },
            { source: 'jvance', target: 'parquet_file', label: 'downloaded', details: "Jonathan's credentials executed bulk download of sensitive customer ledger parquet files." },
            { source: 'jvance', target: 'sheets_ai', label: 'authorized', details: "Approved third-party OAuth app permissions via GWS approval prompts." },
            { source: 'sheets_ai', target: 'gws', label: 'accesses', details: "SheetsExportAI holds persistent GWS read-only API access tokens." },
            { source: 'gws', target: 'parquet_file', label: 'hosts', details: "Google Workspace restricted finances drive hosted the confidential parquet file." },
            { source: 'parquet_file', target: 'ledger_data', label: 'exposes', details: "Ledger file contains the bulk restricted consumer attributes and financial listings." },
            { source: 'sheets_ai', target: 'pol_oauth', label: 'violates', details: "Approval of the unverified SheetsExportAI app triggers the POL-04 Unverified OAuth block." }
          ]
        };

      case 'NX-1043': // Dr. Elena Rostova Case
        return {
          nodes: [
            { 
              id: 'erostova', 
              label: 'Dr. Elena Rostova', 
              subLabel: 'Senior ML Scientist', 
              type: 'actor', 
              x: 400, 
              y: 130, 
              details: "Subject of late-night codebase cloning investigation. Core designer of DeepMind LLM routers and weights pipelines." 
            },
            { 
              id: 'hr_elena', 
              label: 'AI/LLM Core Team (Medium Risk)', 
              subLabel: 'HR Entity Status', 
              type: 'hr_status', 
              x: 600, 
              y: 60, 
              details: "Assigned Medium Risk index. Core ML researcher with standard administrative credentials to private repository assets." 
            },
            { 
              id: 'github', 
              label: 'GitHub Enterprise', 
              subLabel: 'Private VCS System', 
              type: 'system', 
              x: 240, 
              y: 250, 
              details: "Company codebase repository hosting proprietary models, neural routing logic, and training parameters." 
            },
            { 
              id: 'repo_router', 
              label: 'deepmind-llm-router', 
              subLabel: 'Proprietary Private Repo', 
              type: 'file', 
              x: 420, 
              y: 360, 
              details: "Private codebase containing proprietary intellectual property on server-side model weights selection routing." 
            },
            { 
              id: 'repo_weights', 
              label: 'weights-loader-v1', 
              subLabel: 'Proprietary Private Repo', 
              type: 'file', 
              x: 580, 
              y: 360, 
              details: "Private codebase housing custom PyTorch model-shredding loaders and layer weight weights configurations." 
            },
            { 
              id: 'pol_night', 
              label: 'POL-03: Night Repo Activity', 
              subLabel: 'Active Security Policy', 
              type: 'policy', 
              x: 660, 
              y: 220, 
              details: "Policy auditing and flagging heavy command-line code downloads completed outside typical localized timezone working hours." 
            }
          ],
          links: [
            { source: 'erostova', target: 'hr_elena', label: 'belongs to', details: "Dr. Elena belongs to the AI/LLM division with Medium Risk classification." },
            { source: 'erostova', target: 'github', label: 'registered key', details: "Elena Rostova registered a home workstation SSH key ('Elena-HomeWS') in her profile." },
            { source: 'erostova', target: 'repo_router', label: 'cloned repo', details: "Elena's newly registered SSH credentials initiated clone sequence for the private model routing logic." },
            { source: 'erostova', target: 'repo_weights', label: 'cloned repo', details: "Elena's credentials cloned the custom layer loaders repository off-VPN late at night." },
            { source: 'github', target: 'repo_router', label: 'hosts', details: "GitHub repositories host the private model weights router source directories." },
            { source: 'github', target: 'repo_weights', label: 'hosts', details: "GitHub hosts the private loaders and configurations code directories." },
            { source: 'erostova', target: 'pol_night', label: 'violates', details: "Cloning 14 repositories off-VPN during 2:30 AM local Swiss time triggers the POL-03 Night Repo Activity alert." }
          ]
        };

      case 'NX-1044': // Sarah Connor Case
        return {
          nodes: [
            { 
              id: 'sconnor', 
              label: 'Sarah Connor', 
              subLabel: 'Enterprise Account Executive', 
              type: 'actor', 
              x: 400, 
              y: 130, 
              details: "Subject AE Sales Representative under investigation. Standard credentials permit Salesforce exports of billing subscribers." 
            },
            { 
              id: 'hr_sarah', 
              label: 'Sales-West Team (High Risk)', 
              subLabel: 'HR Entity Status', 
              type: 'hr_status', 
              x: 600, 
              y: 60, 
              details: "AE mapped to Sales-West. Assigned High Risk profile due to outbound competitor recruitment listings." 
            },
            { 
              id: 'salesforce', 
              label: 'Salesforce CRM Portal', 
              subLabel: 'Customer Relations System', 
              type: 'system', 
              x: 200, 
              y: 230, 
              details: "Enterprise subscriber relational system. Logs active billing plans, pipeline valuations, and subscriber listings." 
            },
            { 
              id: 'box_storage', 
              label: 'Personal Box.com Storage', 
              subLabel: 'Unauthorized External Cloud', 
              type: 'system', 
              x: 350, 
              y: 260, 
              details: "Private, personal cloud drive used to host files away from standard endpoint file inspection gateways." 
            },
            { 
              id: 'xlsx_file', 
              label: 'West_Active_Subscribers_Q2.xlsx', 
              subLabel: 'Salesforce CRM Export', 
              type: 'file', 
              x: 480, 
              y: 370, 
              details: "CRM contact spreadsheet containing detailed subscriber emails, telephone numbers, and ARR contract limits." 
            },
            { 
              id: 'lead_data', 
              label: 'Client Contact and ARR Logs', 
              subLabel: 'Restricted Customer Data', 
              type: 'customer_data', 
              x: 660, 
              y: 370, 
              details: "Underlying commercial consumer assets. Highly protected from external leakage to rival outbound services." 
            },
            { 
              id: 'box_link', 
              label: 'BoxUploaderPro SSL Tunnel', 
              subLabel: 'Public Sharing Gateway', 
              type: 'public_share', 
              x: 210, 
              y: 380, 
              details: "An active extension tunnel established by Chrome plugins uploading encrypted blocks to Box servers." 
            },
            { 
              id: 'pol_exfil', 
              label: 'POL-01: Exfiltration via Cloud', 
              subLabel: 'Active Security Policy', 
              type: 'policy', 
              x: 650, 
              y: 210, 
              details: "Primary security rule auditing SaaS lead exports immediately followed by web uploads to unauthorized cloud storage." 
            }
          ],
          links: [
            { source: 'sconnor', target: 'hr_sarah', label: 'belongs to', details: "Sarah is classified in Sales-West division with active High Risk marker." },
            { source: 'sconnor', target: 'xlsx_file', label: 'exported file', details: "Sarah's credentials triggered mass CRM subscriber ledger exports from Salesforce." },
            { source: 'salesforce', target: 'xlsx_file', label: 'hosts', details: "Salesforce hosts the central subscribers billing tables." },
            { source: 'sconnor', target: 'box_link', label: 'created upload', details: "Sarah Connor utilized BoxUploaderPro browser extension to push local elements." },
            { source: 'xlsx_file', target: 'lead_data', label: 'exposes', details: "Excel export details customer phone listings and commercial subscription values." },
            { source: 'box_link', target: 'box_storage', label: 'uploaded to', details: "Bypassed security gateways to transfer 4.2 GB of company files directly to a personal Box account." },
            { source: 'sconnor', target: 'pol_exfil', label: 'violates', details: "Exporting subscribers list and immediately pushing elements to an unapproved drive violates POL-01." }
          ]
        };

      case 'NX-1045': // Alexander Frost Case
      default:
        return {
          nodes: [
            { 
              id: 'afrost', 
              label: 'Alexander Frost', 
              subLabel: 'Senior Incident Analyst', 
              type: 'actor', 
              x: 400, 
              y: 130, 
              details: "The investigating analyst who triggered the pg_dump alert. Session tokens appear hijacked from offshore VPN nodes." 
            },
            { 
              id: 'hr_frost', 
              label: 'SecOps Team Lead (High Risk)', 
              subLabel: 'HR Entity Status', 
              type: 'hr_status', 
              x: 600, 
              y: 60, 
              details: "Subject employee marked as high risk tier. Mapped to administrative and security orchestration divisions." 
            },
            { 
              id: 'okta_frost', 
              label: 'Okta IDP System', 
              subLabel: 'Identity Provider', 
              type: 'system', 
              x: 320, 
              y: 250, 
              details: "Identity server which registered token reuse coming from known East European VPN endpoints." 
            },
            { 
              id: 'cloud_sql', 
              label: 'Cloud SQL Production', 
              subLabel: 'Relational Database Instance', 
              type: 'system', 
              x: 180, 
              y: 200, 
              details: "Company relational PostgreSQL instance containing transactional ledgers and salted hash parameters." 
            },
            { 
              id: 'sql_file', 
              label: 'billing_ledger_v2.sql', 
              subLabel: 'Database Dump File', 
              type: 'file', 
              x: 460, 
              y: 350, 
              details: "A raw postgres database schema dump file containing active database tables and salts." 
            },
            { 
              id: 'credit_data', 
              label: 'Hashed Credit Secrets', 
              subLabel: 'Restricted Customer Data', 
              type: 'customer_data', 
              x: 650, 
              y: 350, 
              details: "Salts and passwords corresponding to secure enterprise ledger entities." 
            },
            { 
              id: 'pol_dump', 
              label: 'POL-05: Mass Database Dump', 
              subLabel: 'Active Security Policy', 
              type: 'policy', 
              x: 650, 
              y: 200, 
              details: "Policy rule protecting databases from bulk dumps and schema exports outside authorized maintenance windows." 
            }
          ],
          links: [
            { source: 'afrost', target: 'hr_frost', label: 'belongs to', details: "Alexander is a Senior Analyst under high-privilege credentials with active High Risk tier rating." },
            { source: 'okta_frost', target: 'afrost', label: 'authenticates', details: "Okta IDP logged suspicious session tokens originating from Moscow unapproved VPN tunnel." },
            { source: 'afrost', target: 'sql_file', label: 'exported schema', details: "Alexander's administrative credentials executed pg_dump command line task." },
            { source: 'cloud_sql', target: 'sql_file', label: 'hosts', details: "PostgreSQL database servers hosting billing and transaction schemas." },
            { source: 'sql_file', target: 'credit_data', label: 'exposes', details: "Database dump file exposes table rows of secure hashed passwords." },
            { source: 'afrost', target: 'pol_dump', label: 'violates', details: "Triggering a pg_dump schema extraction command off-VPN violates database backup rule POL-05." }
          ]
        };
    }
  };

  const { nodes, links } = getGraphData(currentCase.id);

  // Helper to resolve node properties
  const getNodeById = (id: string) => nodes.find(n => n.id === id);

  // Node Type styling configuration
  const getNodeStyles = (type: GraphNode['type'], isSelected: boolean, isDimmed: boolean) => {
    let colors = '';
    let iconLetter = 'N';

    switch (type) {
      case 'actor':
        colors = 'from-blue-600 to-indigo-700 stroke-blue-400';
        iconLetter = 'A';
        break;
      case 'system':
        colors = 'from-purple-600 to-fuchsia-700 stroke-purple-400';
        iconLetter = 'S';
        break;
      case 'file':
        colors = 'from-teal-500 to-emerald-600 stroke-teal-300';
        iconLetter = 'F';
        break;
      case 'customer_data':
        colors = 'from-amber-500 to-orange-600 stroke-amber-400';
        iconLetter = 'D';
        break;
      case 'oauth_app':
        colors = 'from-red-600 to-rose-700 stroke-red-400';
        iconLetter = 'O';
        break;
      case 'public_share':
        colors = 'from-sky-500 to-blue-600 stroke-sky-400';
        iconLetter = 'P';
        break;
      case 'hr_status':
        colors = 'from-slate-600 to-slate-800 stroke-slate-500';
        iconLetter = 'H';
        break;
      case 'policy':
        colors = 'from-orange-600 to-red-700 stroke-orange-400';
        iconLetter = 'R';
        break;
    }

    return {
      gradient: colors,
      letter: iconLetter,
      opacity: isDimmed ? 'opacity-25' : 'opacity-100',
      scale: isSelected ? 'scale-110' : 'scale-100',
      strokeWidth: isSelected ? 'stroke-2' : 'stroke-[1.5]'
    };
  };

  // Check if a node is dimmed based on active hovers
  const isNodeDimmed = (id: string) => {
    if (!hoveredNodeId) return false;
    if (hoveredNodeId === id) return false;
    // Highlight connected nodes as well
    const isConnected = links.some(
      l => (l.source === hoveredNodeId && l.target === id) || (l.target === hoveredNodeId && l.source === id)
    );
    return !isConnected;
  };

  // Get active selected node
  const selectedNode = nodes.find(n => n.id === selectedNodeId) || nodes[0];

  // Selected node relationships for inspector
  const nodeRelationships = links.filter(
    l => l.source === selectedNode?.id || l.target === selectedNode?.id
  );

  return (
    <div className="space-y-4" id="nexus-evidence-graph">
      
      {/* Visual Header */}
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg flex items-center justify-between">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Security Asset Relationship Visualizer</span>
          <h4 className="text-xs font-bold text-slate-700 font-mono">
            {currentCase.id} Evidence Graph: Mapping Actor, SaaS Systems, and Public Exposure Points
          </h4>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] text-slate-500 font-mono font-bold">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Actor</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> System</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span> File</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Data</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left column (8 cols): The interactive SVG graph */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col items-stretch justify-center relative overflow-hidden min-h-[480px]">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:24px_24px] opacity-80 pointer-events-none" />
          
          <span className="absolute top-3 left-3 text-[9px] font-mono font-bold uppercase text-slate-400 tracking-widest flex items-center gap-1 select-none">
            <Activity className="w-3.5 h-3.5 text-blue-600" />
            Interactive Threat Topology
          </span>

          <svg 
            viewBox="0 0 800 460" 
            className="w-full h-auto max-h-[440px] z-10 select-none"
          >
            {/* GRADIENTS DEF */}
            <defs>
              <linearGradient id="glow-edge" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.1" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* LINKS/EDGES RENDERING */}
            {links.map((link, idx) => {
              const nSource = getNodeById(link.source);
              const nTarget = getNodeById(link.target);
              if (!nSource || !nTarget) return null;

              const isHovered = hoveredNodeId === link.source || hoveredNodeId === link.target;
              const isDimmed = hoveredNodeId && !isHovered;
              
              // Midpoints for labels
              const midX = (nSource.x + nTarget.x) / 2;
              const midY = (nSource.y + nTarget.y) / 2;
              
              const labelWidth = link.label.length * 5 + 12;

              return (
                <g key={`link-${idx}`} className="transition-opacity duration-300">
                  {/* Glowing wide edge on hover */}
                  {isHovered && (
                    <line
                      x1={nSource.x}
                      y1={nSource.y}
                      x2={nTarget.x}
                      y2={nTarget.y}
                      stroke="#2563eb"
                      strokeWidth={5}
                      opacity={0.15}
                      strokeLinecap="round"
                    />
                  )}

                  {/* Standard relationship line */}
                  <line
                    x1={nSource.x}
                    y1={nSource.y}
                    x2={nTarget.x}
                    y2={nTarget.y}
                    stroke={isHovered ? '#2563eb' : '#cbd5e1'}
                    strokeWidth={isHovered ? 2 : 1.2}
                    opacity={isDimmed ? 0.15 : 0.7}
                    strokeDasharray={link.source === 'sheets_ai' || link.source === 'box_link' ? '4,4' : undefined}
                    className="transition-all duration-300"
                  />

                  {/* Edge label */}
                  <g className="cursor-help">
                    <title>{link.details}</title>
                    <rect
                      x={midX - labelWidth / 2}
                      y={midY - 7}
                      width={labelWidth}
                      height={14}
                      rx={3}
                      fill="white"
                      stroke={isHovered ? '#2563eb' : '#cbd5e1'}
                      strokeWidth={isHovered ? 1 : 0.6}
                      opacity={isDimmed ? 0.15 : 0.95}
                      className="transition-all duration-300"
                    />
                    <text
                      x={midX}
                      y={midY + 2.5}
                      textAnchor="middle"
                      fill={isHovered ? '#1d4ed8' : '#64748b'}
                      className="text-[8.5px] font-mono font-bold leading-none select-none"
                      opacity={isDimmed ? 0.15 : 1}
                    >
                      {link.label}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* NODES RENDERING */}
            {nodes.map((node) => {
              const isSelected = node.id === selectedNodeId;
              const isDimmed = isNodeDimmed(node.id);
              const styles = getNodeStyles(node.type, isSelected, isDimmed);
              
              return (
                <g 
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`cursor-pointer transition-all duration-300 select-none ${styles.scale} ${styles.opacity}`}
                  onClick={() => setSelectedNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId('')}
                >
                  {/* Outer glowing border ring on hover or select */}
                  {(isSelected || hoveredNodeId === node.id) && (
                    <circle
                      r={21}
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth={1.5}
                      opacity={0.8}
                      className="animate-pulse"
                      filter="url(#glow)"
                    />
                  )}

                  {/* Node solid body */}
                  <circle
                    r={16}
                    fill="url(#node-grad)"
                    className={`bg-gradient-to-tr ${styles.gradient} ${styles.strokeWidth} stroke-[#cbd5e1]`}
                    style={{ fill: `currentColor` }} // Fallback to CSS colors
                  />
                  
                  {/* Decorative color-fill via CSS to ensure full-gradient visibility */}
                  <circle
                    r={14.5}
                    className={`fill-slate-900`}
                  />

                  {/* Letter representation in the center */}
                  <text
                    textAnchor="middle"
                    y={3.5}
                    className="text-[9.5px] font-mono font-black text-slate-100 tracking-normal select-none"
                    style={{ fill: '#ffffff' }}
                  >
                    {styles.letter}
                  </text>

                  {/* Main text label block */}
                  <g transform="translate(0, 26)">
                    {/* Tiny background capsule for labels to ensure readability on grid */}
                    <rect
                      x={-60}
                      y={-8}
                      width={120}
                      height={18}
                      rx={3}
                      fill="white"
                      stroke={isSelected ? '#2563eb' : '#cbd5e1'}
                      strokeWidth={isSelected ? 1.5 : 0.8}
                      opacity={isSelected ? 1 : 0.9}
                    />
                    <text
                      textAnchor="middle"
                      className="text-[9px] font-bold text-slate-800 select-none"
                    >
                      {node.label}
                    </text>
                    <text
                      textAnchor="middle"
                      y={8}
                      className="text-[7.5px] font-mono font-bold text-slate-400 select-none"
                    >
                      {node.subLabel}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500 select-none bg-white px-2.5 py-1 rounded border border-slate-200 shadow-sm">
            Hover elements to trace paths. Click to inspect attributes.
          </div>
        </div>

        {/* Right column (4 cols): Node Attributes Inspector */}
        <div className="lg:col-span-4 space-y-4">
          {selectedNode ? (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-left space-y-4 animate-fade-in relative">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-[9px] font-mono text-slate-400 block uppercase font-bold">Evidence Node Attributes</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-sm font-bold text-slate-800 font-display">{selectedNode.label}</h3>
                </div>
                <span className="text-[9px] bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold text-blue-700 uppercase tracking-wider inline-block mt-1.5">
                  Type: {selectedNode.type.replace('_', ' ')}
                </span>
              </div>

              {/* DETAILS EXPLANATION */}
              <div className="space-y-1.5">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-600" />
                  <span>Forensic Purpose</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-100 shadow-sm">
                  {selectedNode.details}
                </p>
              </div>

              {/* NODE RELATIONSHIPS LIST */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Asset Connections ({nodeRelationships.length})</span>
                </h4>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {nodeRelationships.map((rel, idx) => {
                    const isOutgoing = rel.source === selectedNode.id;
                    const counterpart = isOutgoing ? getNodeById(rel.target) : getNodeById(rel.source);
                    
                    if (!counterpart) return null;

                    return (
                      <div 
                        key={idx} 
                        onClick={() => setSelectedNodeId(counterpart.id)}
                        className="bg-white border border-slate-200 hover:border-blue-300 p-2.5 rounded text-xs text-left cursor-pointer transition-colors shadow-sm flex items-center justify-between gap-2 group"
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-bold text-slate-800 text-[11px] group-hover:text-blue-600 transition-colors">
                              {counterpart.label}
                            </span>
                            <span className="text-[8px] uppercase bg-slate-100 text-slate-500 px-1 rounded font-bold font-mono">
                              {counterpart.subLabel}
                            </span>
                          </div>
                          <p className="text-[10.5px] text-slate-500 leading-tight">
                            {isOutgoing ? 'Outgoing connection' : 'Incoming connection'}: <strong className="text-slate-700 font-mono font-semibold">{rel.label}</strong>
                          </p>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-400 italic text-xs shadow-sm">
              Click any element on the threat topology to examine forensic relationships.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
