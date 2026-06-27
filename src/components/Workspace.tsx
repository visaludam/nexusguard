import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle, 
  Clock, 
  Users, 
  UserX, 
  Mail, 
  Briefcase, 
  FileText, 
  TrendingUp, 
  ChevronRight, 
  Plus, 
  Terminal,
  Send,
  Lock,
  GitBranch,
  FolderLock,
  AlertTriangle,
  Compass,
  CheckSquare,
  Sparkles,
  Brain,
  Scale,
  FileQuestion,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  Globe,
  Check,
  Share2
} from 'lucide-react';
import { InvestigationCase, Integration, AuditEvent, PolicyRule } from '../types';
import GeminiChatPanel from './GeminiChatPanel';
import IncidentTimeline from './IncidentTimeline';
import EvidenceGraph from './EvidenceGraph';

interface WorkspaceProps {
  cases: InvestigationCase[];
  events: AuditEvent[];
  policies: PolicyRule[];
  selectedCaseId: string;
  setSelectedCaseId: (id: string) => void;
  onToggleActionStatus: (caseId: string, actionId: string) => void;
  onAddCaseComment: (caseId: string, commentText: string) => void;
  onUpdateCaseStatus: (caseId: string, status: InvestigationCase['status']) => void;
  analyses?: Record<string, any>;
  loadingAnalyses?: Record<string, boolean>;
  analysisErrors?: Record<string, string>;
  onAnalyzeWithGemini?: (caseId: string) => void;
  activeSubTab?: 'copilot' | 'timeline' | 'graph';
  onSubTabChange?: (subtab: 'copilot' | 'timeline' | 'graph') => void;
  demoChatMessage?: string | null;
  onClearDemoChatMessage?: () => void;
}

export default function Workspace({
  cases,
  events,
  policies,
  selectedCaseId,
  setSelectedCaseId,
  onToggleActionStatus,
  onAddCaseComment,
  onUpdateCaseStatus,
  analyses = {},
  loadingAnalyses = {},
  analysisErrors = {},
  onAnalyzeWithGemini,
  activeSubTab,
  onSubTabChange,
  demoChatMessage,
  onClearDemoChatMessage
}: WorkspaceProps) {
  const [commentText, setCommentText] = useState('');
  const [internalSubTab, setInternalSubTab] = useState<'copilot' | 'timeline' | 'graph'>('copilot');
  const subTab = activeSubTab || internalSubTab;
  const setSubTab = onSubTabChange || setInternalSubTab;
  
  // Find current active case
  const currentCase = cases.find(c => c.id === selectedCaseId) || cases[0];

  // Map Integration type to icon for visual timeline
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'google_workspace': return <Compass className="w-4 h-4 text-emerald-400" />;
      case 'okta': return <Lock className="w-4 h-4 text-purple-400" />;
      case 'github': return <GitBranch className="w-4 h-4 text-gray-200" />;
      case 'slack': return <FileText className="w-4 h-4 text-pink-400" />;
      default: return <ShieldAlert className="w-4 h-4 text-blue-400" />;
    }
  };

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddCaseComment(currentCase.id, commentText);
    setCommentText('');
  };

  return (
    <div className="space-y-6 font-sans text-slate-700" id="nexus-workspace">
      
      {/* Top Selector Panel */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-semibold">Security Operations Command</span>
          <h2 className="text-xl font-bold text-slate-800 font-display">Investigation Workspace</h2>
        </div>

        {/* Case selector dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-mono font-semibold uppercase">Active Case File:</span>
          <select
            value={selectedCaseId}
            onChange={(e) => setSelectedCaseId(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
          >
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                [{c.id}] {c.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Segmented Sub-Tab Navigation Bar */}
      <div className="flex border-b border-slate-200 gap-1.5 mt-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 shadow-sm">
        <button
          onClick={() => setSubTab('copilot')}
          className={`px-4 py-2 text-xs font-semibold font-mono rounded-md transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'copilot'
              ? 'bg-blue-600 text-white shadow font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Brain className="w-4 h-4" />
          <span>Forensic Briefing & Co-Pilot Chat</span>
        </button>
        <button
          onClick={() => setSubTab('timeline')}
          className={`px-4 py-2 text-xs font-semibold font-mono rounded-md transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'timeline'
              ? 'bg-blue-600 text-white shadow font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Incident Chronology Timeline</span>
        </button>
        <button
          onClick={() => setSubTab('graph')}
          className={`px-4 py-2 text-xs font-semibold font-mono rounded-md transition-all cursor-pointer flex items-center gap-2 ${
            subTab === 'graph'
              ? 'bg-blue-600 text-white shadow font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Share2 className="w-4 h-4" />
          <span>Threat Evidence Graph</span>
        </button>
      </div>

      {/* Case Details Visual Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Side: Summary, Subject, Exposure (8 columns) */}
        <div className="lg:col-span-8 space-y-5">
          
          {subTab === 'copilot' && (
            <>
          
          {/* Main Case Info Header Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-lg space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="space-y-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-red-50 text-red-700 px-2 py-0.5 rounded font-mono font-bold uppercase border border-red-200">
                    {currentCase.severity} severity
                  </span>
                  <span className="text-xs text-slate-500 font-mono font-semibold">Created {new Date(currentCase.createdTime).toLocaleString()}</span>
                </div>
                <h1 className="text-lg font-bold text-slate-800 font-display mt-1">{currentCase.title}</h1>
              </div>

              {/* Status Update Controls */}
              <div className="flex items-center gap-2 bg-slate-50 p-1 border border-slate-200 rounded">
                <span className="text-[10px] font-mono font-semibold uppercase text-slate-500 px-2">Status:</span>
                <select
                  value={currentCase.status}
                  onChange={(e) => onUpdateCaseStatus(currentCase.id, e.target.value as InvestigationCase['status'])}
                  className="bg-transparent text-xs text-blue-600 font-semibold focus:outline-none cursor-pointer pr-1"
                >
                  <option value="open" className="bg-white text-slate-800">Open</option>
                  <option value="under_review" className="bg-white text-slate-800">Under Review</option>
                  <option value="resolved" className="bg-white text-slate-800">Resolved</option>
                  <option value="archived" className="bg-white text-slate-800">Archived</option>
                </select>
              </div>
            </div>

            {/* Case Narrative Text */}
            <div className="space-y-2 text-left">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Incident Synthesis Brief</h3>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded border border-slate-200 shadow-inner">
                {currentCase.summary}
              </p>
            </div>

            {/* Target Subject Info Section */}
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono text-left">Target Subject Employee</h3>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 text-left justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-800 flex items-center justify-center font-bold text-sm text-white border border-blue-500/30 shadow-md shadow-blue-900/10">
                    {currentCase.subject.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800">{currentCase.subject.name}</h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 font-semibold">{currentCase.subject.email}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-500 font-semibold">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentCase.subject.role}</span>
                      </span>
                      <span>•</span>
                      <span>{currentCase.subject.department}</span>
                    </div>
                  </div>
                </div>

                {/* Risk profile details */}
                <div className="border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-6 shrink-0 text-left">
                  <span className="text-[9px] font-mono uppercase text-slate-400 block">Organizational Risk tier</span>
                  <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-mono font-bold mt-1 ${
                    currentCase.subject.riskTier === 'High' 
                      ? 'bg-red-50 text-red-700 border border-red-200' 
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {currentCase.subject.riskTier} RISK ENTITY
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Gemini AI Powered Co-Pilot Analysis */}
          <div className="bg-gradient-to-br from-blue-50/70 to-indigo-50/30 border border-blue-100 p-6 rounded-lg space-y-5 shadow-sm relative overflow-hidden text-left" id="gemini-co-pilot-analysis">
            {/* Glowing background gradient effect */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-blue-500/5 to-purple-500/5 rounded-full filter blur-3xl pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5 text-left">
                <div className="w-9 h-9 rounded-lg bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-600 shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Gemini 3.5 Flash
                    </span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 border border-blue-200 px-1.5 py-0.2 rounded font-mono uppercase font-bold">
                      Co-Pilot
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-800 font-display mt-0.5">NexusGuard Investigation Analysis</h3>
                </div>
              </div>

              {/* Header Action Button */}
              {onAnalyzeWithGemini && !loadingAnalyses[currentCase.id] && (
                <button
                  onClick={() => onAnalyzeWithGemini(currentCase.id)}
                  className={`px-4 py-2 rounded text-xs font-semibold font-mono flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                    analyses[currentCase.id]
                      ? 'bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-slate-300' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white border border-blue-500/20'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{analyses[currentCase.id] ? 'Re-run AI Analysis' : 'Analyze with Gemini'}</span>
                </button>
              )}
            </div>

            {/* ERROR STATE */}
            {analysisErrors[currentCase.id] && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-start gap-3 text-left">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-700">AI Analysis Pipeline Error</h4>
                  <p className="text-[11px] text-red-600 leading-relaxed font-medium">{analysisErrors[currentCase.id]}</p>
                  <button 
                    onClick={() => onAnalyzeWithGemini && onAnalyzeWithGemini(currentCase.id)}
                    className="mt-2 text-[10px] text-blue-600 hover:underline font-mono font-bold block"
                  >
                    Retry Synthesis
                  </button>
                </div>
              </div>
            )}

            {/* LOADING STATE */}
            {loadingAnalyses[currentCase.id] && (
              <div className="space-y-4 py-3 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-4 bg-slate-200 rounded animate-pulse" />
                  <div className="w-32 h-4 bg-slate-200 rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="w-full h-12 bg-slate-50 border border-slate-200 rounded p-3 flex flex-col justify-between">
                    <div className="w-1/3 h-2 bg-slate-200 rounded animate-pulse" />
                    <div className="w-5/6 h-2 bg-slate-200 rounded animate-pulse" />
                  </div>
                  <div className="w-full h-24 bg-slate-50 border border-slate-200 rounded p-4 space-y-2.5">
                    <div className="w-1/4 h-2 bg-slate-200 rounded animate-pulse" />
                    <div className="w-full h-2 bg-slate-200 rounded animate-pulse" />
                    <div className="w-5/6 h-2 bg-slate-200 rounded animate-pulse" />
                    <div className="w-2/3 h-2 bg-slate-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Terminal className="w-4 h-4 text-blue-600 animate-spin shrink-0" />
                  <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-semibold">
                    Running deep semantic matching, comparing with company policy, evaluating alternate explanations...
                  </span>
                </div>
              </div>
            )}

            {/* INITIAL EMPTY STATE */}
            {!analyses[currentCase.id] && !loadingAnalyses[currentCase.id] && !analysisErrors[currentCase.id] && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center space-y-4 py-8">
                <Brain className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                <div className="space-y-1.5 max-w-md mx-auto">
                  <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider font-mono">No Active AI Analysis</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Generate a detailed AI synthesis of this case. Gemini will cross-reference the audit timeline with company policies, formulate human explanations, and construct recommended human action plans.
                  </p>
                </div>
                {onAnalyzeWithGemini && (
                  <button
                    onClick={() => onAnalyzeWithGemini(currentCase.id)}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold font-mono rounded inline-flex items-center gap-2 transition-all cursor-pointer shadow"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze with Gemini Now</span>
                  </button>
                )}
              </div>
            )}

            {/* FULLY LOADED ASSESSMENT VIEW */}
            {analyses[currentCase.id] && !loadingAnalyses[currentCase.id] && (
              <div className="space-y-6 text-left py-1">
                
                {/* Meta Details: Priority & Confidence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="text-left">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Security Priority</span>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold mt-1 ${
                        analyses[currentCase.id].priority === 'Critical' || analyses[currentCase.id].priority === 'High'
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : analyses[currentCase.id].priority === 'Medium'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
                        {analyses[currentCase.id].priority.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:border-l sm:border-slate-200 sm:pl-4">
                    <div className="text-left w-full">
                      <span className="text-[9px] font-mono text-slate-400 uppercase block font-semibold">Gemini Confidence Metric</span>
                      <div className="flex items-center gap-3 mt-1.5">
                        <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${analyses[currentCase.id].confidence || 85}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-800 shrink-0">{analyses[currentCase.id].confidence || 85}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summaries */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-blue-600 uppercase tracking-wider font-mono">Executive Summary</h4>
                    <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded border border-slate-200 shadow-sm">
                      {analyses[currentCase.id].executive_summary}
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Technical Analysis Brief</h4>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-4 rounded border border-slate-200/60">
                      {analyses[currentCase.id].technical_summary}
                    </p>
                  </div>
                </div>

                {/* Side-by-Side Fact & Evidence comparative grids */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Observed Facts */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <FileQuestion className="w-3.5 h-3.5 text-blue-600" />
                      <span>Observed Facts</span>
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      {analyses[currentCase.id].observed_facts?.map((fact: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-blue-500 shrink-0 font-bold">•</span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supporting Evidence */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Supporting Evidence</span>
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      {analyses[currentCase.id].supporting_evidence?.map((evidence: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-emerald-500 shrink-0 font-bold">•</span>
                          <span>{evidence}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Contradicting / Mitigating Evidence */}
                  <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 shadow-sm">
                    <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                      <ThumbsDown className="w-3.5 h-3.5 text-amber-600" />
                      <span>Contradicting Evidence</span>
                    </h4>
                    <ul className="space-y-2 text-[11px] text-slate-600">
                      {analyses[currentCase.id].contradicting_evidence?.map((evidence: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                          <span className="text-amber-500 shrink-0 font-bold">•</span>
                          <span>{evidence}</span>
                        </li>
                      ))}
                      {(!analyses[currentCase.id].contradicting_evidence || analyses[currentCase.id].contradicting_evidence.length === 0) && (
                        <li className="text-slate-400 italic">No mitigating factors observed.</li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Possible Explanations */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Plausible Security Hypotheses</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analyses[currentCase.id].possible_explanations?.map((exp: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 p-4 rounded-lg space-y-3 shadow-sm">
                        <div className="flex justify-between items-center gap-2">
                          <h5 className="text-xs font-bold text-slate-800 leading-tight">{exp.title}</h5>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                            exp.likelihood >= 70
                              ? 'bg-red-50 text-red-700'
                              : exp.likelihood >= 40
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {exp.likelihood}% LIKELIHOOD
                          </span>
                        </div>

                        <div className="bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              exp.likelihood >= 70 ? 'bg-red-500' : exp.likelihood >= 40 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${exp.likelihood}%` }}
                          />
                        </div>

                        <div className="space-y-2.5 text-[10.5px]">
                          <div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Corroborating points</span>
                            <ul className="space-y-1 mt-1 text-slate-600">
                              {exp.supporting_points?.map((pt: string, pIdx: number) => (
                                <li key={pIdx} className="flex items-start gap-1">
                                  <span>•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="text-[9px] font-mono text-slate-400 uppercase block font-bold">Unobserved/Missing Evidence</span>
                            <ul className="space-y-1 mt-1 text-slate-500 italic">
                              {exp.missing_evidence?.map((pt: string, mIdx: number) => (
                                <li key={mIdx} className="flex items-start gap-1">
                                  <span>•</span>
                                  <span>{pt}</span>
                                </li>
                              ))}
                              {(!exp.missing_evidence || exp.missing_evidence.length === 0) && (
                                <li className="text-slate-400 text-[9px]">None.</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company Policy Matches */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Matched Corporate Security Policies</h4>
                  <div className="space-y-2">
                    {analyses[currentCase.id].policy_matches?.map((pol: any, idx: number) => (
                      <div key={idx} className="bg-white border border-slate-200 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
                        <div className="space-y-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono font-bold uppercase bg-slate-50 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                              {pol.policy_id}
                            </span>
                            <h5 className="font-bold text-slate-800 text-xs">{pol.policy_title}</h5>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-relaxed">{pol.relevance}</p>
                        </div>

                        <div className="shrink-0">
                          {pol.possible_violation ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                              VIOLATION SIGNATURE
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-50 text-slate-500 border border-slate-200">
                              NO BREACH
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Impact Brief */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Estimated Business Impact</h4>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-4 rounded border border-slate-200 shadow-sm">
                    {analyses[currentCase.id].business_impact}
                  </p>
                </div>

                {/* Recommended Verification Steps */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Recommended SOP Human Verification Steps</h4>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-3">
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Rule out benign corporate activity and verify key variables before containment:
                    </p>
                    <div className="space-y-2 text-xs">
                      {analyses[currentCase.id].recommended_verification_steps?.map((step: string, idx: number) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded border border-slate-200 shadow-sm">
                          <CheckSquare className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span className="text-slate-600 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Categorized Corporate Stakeholder Actions */}
                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Stakeholder Action Playbook</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* Security Team Actions */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 flex flex-col shadow-sm">
                      <div className="border-b border-slate-100 pb-2">
                        <span className="text-[9px] font-mono text-blue-600 uppercase tracking-wider font-bold">Security Operations</span>
                        <h5 className="text-xs font-bold text-slate-800 mt-0.5">SecOps Actions</h5>
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-600 flex-1">
                        {analyses[currentCase.id].recommended_actions?.security?.map((act: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-blue-500 shrink-0 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Department Manager Actions */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 flex flex-col shadow-sm">
                      <div className="border-b border-slate-100 pb-2">
                        <span className="text-[9px] font-mono text-purple-600 uppercase tracking-wider font-bold">Line Management</span>
                        <h5 className="text-xs font-bold text-slate-800 mt-0.5">Manager Actions</h5>
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-600 flex-1">
                        {analyses[currentCase.id].recommended_actions?.manager?.map((act: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-purple-500 shrink-0 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* HR & Legal Actions */}
                    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 flex flex-col shadow-sm">
                      <div className="border-b border-slate-100 pb-2">
                        <span className="text-[9px] font-mono text-pink-600 uppercase tracking-wider font-bold">HR / Legal Advisory</span>
                        <h5 className="text-xs font-bold text-slate-800 mt-0.5">HR & Legal Actions</h5>
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-600 flex-1">
                        {analyses[currentCase.id].recommended_actions?.hr?.map((act: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-1.5 leading-relaxed">
                            <span className="text-pink-500 shrink-0 font-bold">•</span>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>
                </div>

                {/* Escalation recommendations */}
                <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs ${
                  analyses[currentCase.id].should_escalate
                    ? 'bg-red-50 border-red-200'
                    : 'bg-emerald-50 border-emerald-200'
                }`}>
                  <div className="flex items-center gap-3 text-left">
                    <ShieldAlert className={`w-5 h-5 shrink-0 ${analyses[currentCase.id].should_escalate ? 'text-red-600' : 'text-emerald-600'}`} />
                    <div>
                      <span className="font-bold font-mono text-[9px] uppercase tracking-wider block text-slate-500">
                        Operational Escalation Guide
                      </span>
                      <p className={`font-semibold mt-0.5 ${analyses[currentCase.id].should_escalate ? 'text-red-800' : 'text-emerald-800'}`}>
                        {analyses[currentCase.id].should_escalate 
                          ? `Escalation Recommended: ${analyses[currentCase.id].escalation_reason}`
                          : 'Immediate escalation is NOT recommended. Resolve under standard SOP.'}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[10px] font-bold">
                    {analyses[currentCase.id].human_decision_required ? (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 rounded">
                        HUMAN SIGN-OFF MANDATORY
                      </span>
                    ) : (
                      <span className="bg-slate-50 text-slate-500 border border-slate-200 px-2.5 py-0.5 rounded">
                        AUTOMATED ACTIONS PERMITTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Multinational Japanese Brief */}
                <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                  <details className="group">
                    <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50 select-none">
                      <div className="flex items-center gap-2.5">
                        <Globe className="w-4 h-4 text-blue-600" />
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          Multinational Compliance Briefing (Japanese)
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 transition-transform group-open:rotate-90 shrink-0" />
                    </summary>
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 text-xs text-slate-650 leading-relaxed whitespace-pre-line text-left font-sans font-medium">
                      {analyses[currentCase.id].japanese_summary}
                    </div>
                  </details>
                </div>

              </div>
            )}
          </div>

          {/* Gemini Chat Panel */}
          <GeminiChatPanel 
            currentCase={currentCase}
            events={events}
            policies={policies}
            analysis={analyses[currentCase.id]}
            demoChatMessage={demoChatMessage}
            onClearDemoChatMessage={onClearDemoChatMessage}
          />

          {/* Data Exposure Risk Analysis */}
          <div className="bg-white border border-slate-200 p-6 rounded-lg space-y-4 shadow-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider font-mono text-left">Suspected Data Exposure Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCase.possibleDataExposure.map((res, idx) => (
                <div 
                  key={idx} 
                  className="bg-slate-50/50 border border-slate-200 rounded-lg p-4 flex flex-col justify-between space-y-3.5 text-left shadow-sm"
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-red-50 text-red-700 px-1.5 py-0.5 rounded font-mono font-bold uppercase border border-red-200">
                        {res.sensitivity}
                      </span>
                      <span className="text-xs text-red-600 font-mono font-bold">Score: {res.riskScore}</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800 font-mono truncate pt-1">{res.resourceName}</h4>
                    <p className="text-[10px] text-slate-500">Resource Type: {res.resourceType}</p>
                  </div>

                  <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>Action: {res.action}</span>
                    <span className="text-blue-600 flex items-center gap-1 cursor-pointer hover:underline font-bold">
                      <span>Audit resource</span>
                      <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </>)}

          {subTab === 'timeline' && (
            <IncidentTimeline currentCase={currentCase} />
          )}

          {subTab === 'graph' && (
            <EvidenceGraph currentCase={currentCase} />
          )}

        </div>

        {/* Right Side: Human Action Plan & Quick Notes (4 columns) */}
        <div className="lg:col-span-4 space-y-5">
          
          {/* Action plan card */}
          <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3 text-left">
              <span className="text-[9px] font-mono text-blue-600 uppercase tracking-wider font-bold">Recommended SOP checklist</span>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2 mt-0.5">
                <CheckSquare className="w-4 h-4 text-blue-600" />
                <span>Human Verification Protocol</span>
              </h3>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed text-left">
              These procedural tasks are suggested based on enterprise policy regulations. Security humans must perform and mark these as verified:
            </p>

            <div className="space-y-3 text-left">
              {currentCase.humanActionPlan.map((action) => {
                const isCompleted = action.status === 'completed';
                return (
                  <div 
                    key={action.id}
                    className={`p-3 rounded border transition-colors ${
                      isCompleted 
                        ? 'bg-slate-50/50 border-slate-100 text-slate-400' 
                        : 'bg-white border-slate-200 hover:border-blue-500/20 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        checked={isCompleted}
                        id={`check-${action.id}`}
                        onChange={() => onToggleActionStatus(currentCase.id, action.id)}
                        className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 cursor-pointer bg-transparent"
                      />
                      <div className="space-y-1">
                        <label 
                          htmlFor={`check-${action.id}`} 
                          className={`text-xs block leading-tight cursor-pointer ${
                            isCompleted ? 'line-through text-slate-400 font-medium' : 'text-slate-700 font-semibold'
                          }`}
                        >
                          {action.task}
                        </label>
                        <span className="text-[9px] text-slate-400 block font-mono">
                          Source: {action.recommendedBy}
                        </span>
                        {action.notes && (
                          <div className="bg-slate-50 text-[10px] text-slate-500 p-1.5 rounded border border-slate-100 mt-1 italic shadow-sm">
                            Note: {action.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Incident Comment / Audit Log Append Card */}
          <div className="bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
            <div className="border-b border-slate-100 pb-3 text-left">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">Internal Audit Trail</span>
              <h3 className="text-sm font-bold text-slate-800 mt-0.5">Analyst Log Journal</h3>
            </div>

            {/* Simulated previous Analyst Logs */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-left">
              <div className="text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100 shadow-sm">
                <div className="flex justify-between font-mono text-[9px] text-slate-400">
                  <span>SecOps Bot</span>
                  <span>June 26, 22:50 UTC</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  NexusGuard compiled raw alerts GWS-921 and OKTA-102 into primary Workspace ticket. Risk index assigned 88.
                </p>
              </div>

              <div className="text-[11px] bg-slate-50 p-2.5 rounded border border-slate-100 shadow-sm">
                <div className="flex justify-between font-mono text-[9px] text-slate-400">
                  <span>Sarah Jenkins (SecOps)</span>
                  <span>June 26, 22:55 UTC</span>
                </div>
                <p className="text-slate-600 mt-1 leading-relaxed">
                  MFA bypass logs checked. Appears ticket HD-9081 was issued after telephone request from a cell number. Will investigate.
                </p>
              </div>
            </div>

            {/* Comment form */}
            <form onSubmit={handleAddCommentSubmit} className="space-y-2">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Append security findings or interview notes..."
                rows={3}
                className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-700 placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none shadow-sm"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-1.5 rounded text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <Send className="w-3 h-3" />
                <span>Append Audit Note</span>
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
}
