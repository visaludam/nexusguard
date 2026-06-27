import React, { useState } from 'react';
import { 
  FileSliders, 
  Plus, 
  Terminal, 
  Code, 
  AlertTriangle, 
  CheckCircle, 
  Sliders, 
  Play, 
  Settings,
  XCircle,
  Cpu,
  Bookmark
} from 'lucide-react';
import { PolicyRule } from '../types';

interface PolicyIntelligenceProps {
  policies: PolicyRule[];
  onTogglePolicy: (id: string) => void;
  onAddPolicy: (policy: Partial<PolicyRule>) => void;
}

export default function PolicyIntelligence({
  policies,
  onTogglePolicy,
  onAddPolicy
}: PolicyIntelligenceProps) {
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [policyName, setPolicyName] = useState('');
  const [policyCode, setPolicyCode] = useState('');
  const [policyDesc, setPolicyDesc] = useState('');
  const [policyCat, setPolicyCat] = useState<'Data Exfiltration' | 'Identity & Access' | 'Anomalous Activity' | 'Privileged Operations'>('Data Exfiltration');
  const [policySev, setPolicySev] = useState<'critical' | 'warning' | 'info'>('critical');
  const [policyLogic, setPolicyLogic] = useState('');

  // Simulator State
  const [simulatorInput, setSimulatorInput] = useState(
    JSON.stringify({
      event: "FileUploaded",
      actor: "s.connor@enterprise.com",
      destination: "personal-gdrive.com",
      file_size_gb: 4.8,
      source: "Google Drive"
    }, null, 2)
  );
  
  const [simulationResult, setSimulationResult] = useState<{
    matched: boolean;
    ruleMatched?: PolicyRule;
    score?: number;
    actionsRecommended?: string[];
  } | null>(null);

  const [simulating, setSimulating] = useState(false);

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName || !policyCode) return;

    onAddPolicy({
      name: policyName,
      code: policyCode,
      description: policyDesc,
      category: policyCat,
      severity: policySev,
      isActive: true,
      triggerCount: 0,
      logicDescription: policyLogic || 'If true -> trigger alert'
    });

    // Reset fields
    setPolicyName('');
    setPolicyCode('');
    setPolicyDesc('');
    setPolicyLogic('');
    setShowAddPolicy(false);
  };

  // Run Simulator Engine
  const runSimulation = () => {
    setSimulating(true);
    setSimulationResult(null);

    setTimeout(() => {
      setSimulating(false);
      try {
        const parsed = JSON.parse(simulatorInput);
        let matchedRule: PolicyRule | undefined;
        let score = 30;
        let actions: string[] = [];

        // Simple heuristic matching
        const inputString = JSON.stringify(parsed).toLowerCase();
        
        if (inputString.includes('personal-gdrive.com') || inputString.includes('box.com') || inputString.includes('upload') || parsed.file_size_gb > 2) {
          matchedRule = policies.find(p => p.code === 'RULE_DATA_EXFIL_CLOUD_DRIVES');
          score = 92;
          actions = [
            'Trigger corporate credential hold',
            'Secure browser cookie sessions',
            'Notify human compliance agent Sarah Jenkins'
          ];
        } else if (inputString.includes('singapore') || inputString.includes('mfa') || inputString.includes('geography')) {
          matchedRule = policies.find(p => p.code === 'RULE_IDENTITY_GEOGRAPHIC_IMPOSSIBILITY');
          score = 85;
          actions = [
            'Revoke Okta session validation cookies',
            'SOP-Check cellular identification'
          ];
        } else if (inputString.includes('clone') || inputString.includes('github') || inputString.includes('ssh')) {
          matchedRule = policies.find(p => p.code === 'RULE_CODE_NIGHT_CLONING');
          score = 74;
          actions = [
            'Verify repository authorization',
            'Verify Git SHA check'
          ];
        } else if (inputString.includes('oauth') || inputString.includes('consent') || inputString.includes('scope')) {
          matchedRule = policies.find(p => p.code === 'RULE_UNVERIFIED_OAUTH_CONSENT');
          score = 88;
          actions = [
            'Block SheetsExportAI client token',
            'Re-audit Workspace consent scopes'
          ];
        }

        if (matchedRule) {
          setSimulationResult({
            matched: true,
            ruleMatched: matchedRule,
            score,
            actionsRecommended: actions
          });
        } else {
          setSimulationResult({
            matched: false,
            score: 15
          });
        }

      } catch (err) {
        // Handle malformed JSON
        setSimulationResult({
          matched: false,
          score: 0
        });
      }
    }, 800);
  };

  const loadSampleToSimulator = (sampleType: string) => {
    let payload = {};
    if (sampleType === 'exfil') {
      payload = {
        event: "FileUploaded",
        actor: "s.connor@enterprise.com",
        destination: "personal-gdrive.com",
        file_size_gb: 4.8,
        source: "Google Drive"
      };
    } else if (sampleType === 'geo') {
      payload = {
        event: "OktaLogin",
        actor: "j.vance@enterprise.com",
        location: "Singapore (Changi)",
        last_mfa_location: "San Francisco, USA",
        time_difference_hours: 1.5
      };
    } else if (sampleType === 'oauth') {
      payload = {
        event: "OAuthConsentGranted",
        client_app: "SheetsExportAI",
        requested_scopes: ["drive.readonly", "contacts.readonly"],
        client_verified: false
      };
    }
    setSimulatorInput(JSON.stringify(payload, null, 2));
  };

  return (
    <div className="space-y-6 font-sans text-slate-600">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">DLP and Identity Rulebooks</span>
          <h2 className="text-xl font-bold text-slate-800 font-display">Policy Intelligence Engine</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Build and simulate security logic heuristics to identify anomalous activity trends.
          </p>
        </div>

        <button
          onClick={() => setShowAddPolicy(!showAddPolicy)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-md text-xs transition-colors self-start shadow-md cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Custom Policy</span>
        </button>
      </div>

      {/* Add Custom Policy Card Drawer */}
      {showAddPolicy && (
        <form 
          onSubmit={handleCreatePolicy}
          className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm text-left animate-in fade-in"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Settings className="w-4 h-4 text-blue-600" />
              <span>Define Custom Policy Rule Logic</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Policy Rule Title
              </label>
              <input
                type="text"
                required
                value={policyName}
                onChange={(e) => setPolicyName(e.target.value)}
                placeholder="e.g. Non-Compliant AWS Role Change"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Unique Code Identifier
              </label>
              <input
                type="text"
                required
                value={policyCode}
                onChange={(e) => setPolicyCode(e.target.value)}
                placeholder="RULE_AWS_ROLE_HIERARCHY"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-mono font-bold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Policy Category
              </label>
              <select
                value={policyCat}
                onChange={(e) => setPolicyCat(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
              >
                <option value="Data Exfiltration">Data Exfiltration</option>
                <option value="Identity & Access">Identity & Access</option>
                <option value="Anomalous Activity">Anomalous Activity</option>
                <option value="Privileged Operations">Privileged Operations</option>
              </select>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-3 space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Severity Score
              </label>
              <select
                value={policySev}
                onChange={(e) => setPolicySev(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
              >
                <option value="critical">Critical</option>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
              </select>
            </div>

            <div className="md:col-span-9 space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Brief Rule Description
              </label>
              <input
                type="text"
                value={policyDesc}
                onChange={(e) => setPolicyDesc(e.target.value)}
                placeholder="Alerts when IAM credentials are created with admin roles."
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Evaluation Heuristics Formula logic
            </label>
            <textarea
              value={policyLogic}
              onChange={(e) => setPolicyLogic(e.target.value)}
              placeholder="If IAM_Role_Create() AND AssumedAdmin == True -> Trigger Alert"
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono resize-none font-semibold"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => setShowAddPolicy(false)}
              className="px-3.5 py-1.5 bg-transparent hover:bg-slate-100 text-slate-500 rounded text-xs transition-colors font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors shadow cursor-pointer"
            >
              Compile Policy
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Policy rule List on Left, Interactive Rule Simulator on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Policy Rules Catalog (7 columns) */}
        <div className="xl:col-span-7 bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-blue-600" />
              <span>Active Policy Catalog ({policies.length})</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Status: 100% compiled</span>
          </div>

          <div className="space-y-3.5 text-left">
            {policies.map((pol) => {
              return (
                <div 
                  key={pol.id}
                  className={`p-4 rounded-lg border transition-all duration-150 ${
                    pol.isActive 
                      ? 'bg-slate-50/50 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm' 
                      : 'bg-slate-50/10 border-dashed border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-xs text-slate-800">{pol.name}</span>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                          pol.severity === 'critical' 
                            ? 'bg-red-50 text-red-700 border border-red-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {pol.severity}
                        </span>
                        <span className="text-[9px] font-mono text-slate-400 font-bold">{pol.code}</span>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed pt-1 font-semibold">{pol.description}</p>
                    </div>

                    {/* Enable/Disable Toggle Switch */}
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[10px] font-mono text-slate-400 font-bold">
                        {pol.isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                      <button
                        type="button"
                        onClick={() => onTogglePolicy(pol.id)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 cursor-pointer relative ${
                          pol.isActive ? 'bg-blue-600' : 'bg-slate-200'
                        }`}
                        title={pol.isActive ? 'Deactivate policy' : 'Activate policy'}
                      >
                        <div className={`bg-white w-4 h-4 rounded-full shadow transition-transform duration-200 ${
                          pol.isActive ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>

                  {/* Heuristic Formula Section */}
                  {pol.isActive && (
                    <div className="mt-3 bg-white border border-slate-200 rounded p-2.5 font-mono text-[10px] text-slate-600 flex items-center justify-between shadow-inner">
                      <div className="flex items-center gap-1.5 truncate font-bold">
                        <Code className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{pol.logicDescription}</span>
                      </div>
                      <span className="text-slate-400 shrink-0 ml-3 font-bold">
                        Signals: {pol.triggerCount} matches
                      </span>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Interactive Rule Simulator Engine (5 columns) */}
        <div className="xl:col-span-5 bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 text-left">
            <span className="text-[9px] font-mono text-emerald-600 uppercase tracking-wider font-bold">SecOps Sandbox Tools</span>
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
              <Cpu className="w-4 h-4 text-emerald-600" />
              <span>Pipeline Simulation Sandbox</span>
            </h3>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed text-left font-semibold">
            Paste a suspected JSON audit payload below or load standard enterprise templates to verify matching exfiltration rules.
          </p>

          {/* Quick templates loaders */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 uppercase font-mono font-bold mr-1">Load Template:</span>
            <button
              onClick={() => loadSampleToSimulator('exfil')}
              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold transition-all cursor-pointer"
            >
              Data Exfil
            </button>
            <button
              onClick={() => loadSampleToSimulator('geo')}
              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold transition-all cursor-pointer"
            >
              Geographic Login
            </button>
            <button
              onClick={() => loadSampleToSimulator('oauth')}
              className="px-2 py-0.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded text-[10px] font-bold transition-all cursor-pointer"
            >
              OAuth Consent
            </button>
          </div>

          {/* Payload textarea */}
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">Suspected Payload Payload (JSON)</span>
            <div className="relative">
              <textarea
                value={simulatorInput}
                onChange={(e) => setSimulatorInput(e.target.value)}
                rows={7}
                className="w-full bg-slate-50 border border-slate-200 rounded p-3 font-mono text-xs text-slate-800 focus:outline-none focus:border-blue-500 resize-none leading-relaxed font-semibold shadow-inner"
              />
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={simulating}
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer select-none shadow"
          >
            <Play className={`w-3.5 h-3.5 ${simulating ? 'animate-spin' : ''}`} />
            <span>{simulating ? 'Running Logic Trees...' : 'Evaluate Log Payload'}</span>
          </button>

          {/* Simulation Output Area */}
          {simulationResult && (
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left space-y-3.5">
              <div className="border-b border-slate-100 pb-2 flex justify-between items-center text-[10px] font-mono">
                <span className="text-slate-400 font-bold">Evaluation Report:</span>
                <span className="text-emerald-600 uppercase font-bold">Done</span>
              </div>

              {simulationResult.matched ? (
                <div className="space-y-3">
                  <div className="flex gap-2 text-xs">
                    <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                    <div>
                      <span className="font-bold text-red-600 uppercase tracking-wider text-[10px] font-mono block">CRITICAL PATTERN MATCHED</span>
                      <h4 className="font-bold text-slate-800 mt-1 leading-tight">{simulationResult.ruleMatched?.name}</h4>
                      <p className="text-slate-500 text-[11px] mt-1 leading-relaxed font-semibold">
                        Evaluated parameters triggered alert threshold logic on Rule <code className="text-emerald-700 font-mono text-[10px] bg-white border border-slate-200 px-1 rounded font-bold">{simulationResult.ruleMatched?.code}</code>.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-white p-2.5 rounded border border-slate-200 text-xs font-mono text-left shadow-sm">
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">RISK POTENTIAL</span>
                      <span className="text-red-600 font-bold">{simulationResult.score} / 100</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 block font-bold">SEVERITY LEVEL</span>
                      <span className="text-amber-600 font-bold uppercase">{simulationResult.ruleMatched?.severity}</span>
                    </div>
                  </div>

                  {/* Actions checklist */}
                  <div className="space-y-1 text-xs">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block font-bold">Triggered SOP Actions:</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 font-semibold">
                      {simulationResult.actionsRecommended?.map((act, i) => (
                        <li key={i}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2.5 text-xs text-slate-500 py-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-emerald-600 uppercase tracking-wider text-[10px] font-mono block">NO RULE TRIGGERED</span>
                    <p className="text-slate-500 mt-1 leading-relaxed font-semibold">
                      Payload values compile properly but did not trigger active anomaly thresholds (Score: {simulationResult.score}/100).
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
