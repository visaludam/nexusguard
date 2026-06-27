import React, { useState } from 'react';
import { 
  FileBarChart2, 
  Plus, 
  Download, 
  Eye, 
  CheckCircle, 
  Loader2, 
  Clock, 
  Info, 
  FileText, 
  FileCheck2,
  ListFilter,
  CheckSquare
} from 'lucide-react';
import { SecurityReport, InvestigationCase } from '../types';
import InvestigationReport from './InvestigationReport';

interface ReportsPageProps {
  reports: SecurityReport[];
  cases: InvestigationCase[];
  analyses?: Record<string, any>;
  onGenerateReport: (title: string, type: SecurityReport['type'], caseId?: string) => void;
  activeReportId?: string;
  onSelectReportId?: (id: string) => void;
}

export default function ReportsPage({
  reports,
  cases,
  analyses,
  onGenerateReport,
  activeReportId,
  onSelectReportId
}: ReportsPageProps) {
  const [showForm, setShowForm] = useState(false);
  const [reportTitle, setReportTitle] = useState('');
  const [reportType, setReportType] = useState<SecurityReport['type']>('Executive Brief');
  const [linkedCaseId, setLinkedCaseId] = useState<string>('none');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [localSelectedReportId, setLocalSelectedReportId] = useState<string | null>(null);
  const selectedReport = reports.find(r => r.id === (activeReportId || localSelectedReportId)) || reports[0];

  const setSelectedReport = (rep: SecurityReport | null) => {
    if (rep) {
      setLocalSelectedReportId(rep.id);
      if (onSelectReportId) onSelectReportId(rep.id);
    } else {
      setLocalSelectedReportId(null);
    }
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportTitle.trim()) return;

    setIsGenerating(true);
    
    setTimeout(() => {
      onGenerateReport(
        reportTitle,
        reportType,
        linkedCaseId === 'none' ? undefined : linkedCaseId
      );
      setIsGenerating(false);
      setReportTitle('');
      setLinkedCaseId('none');
      setShowForm(false);
    }, 1500); // 1.5 seconds high-fidelity generating simulation
  };

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'Executive Brief': return <FileText className="w-5 h-5 text-blue-400" />;
      case 'Compliance Audit': return <FileCheck2 className="w-5 h-5 text-emerald-400" />;
      case 'Incident Summary': return <FileBarChart2 className="w-5 h-5 text-red-400" />;
      default: return <FileText className="w-5 h-5 text-purple-400" />;
    }
  };

  const [downloadNotification, setDownloadNotification] = useState<string | null>(null);

  const triggerDownloadNotification = (title: string) => {
    setDownloadNotification(`Downloaded: ${title}`);
    setTimeout(() => {
      setDownloadNotification(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 font-sans text-slate-600">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-left">
        <div className="text-left">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">Incident Archiving and Compliance</span>
          <h2 className="text-xl font-bold text-slate-800 font-display">SecOps Security Reports</h2>
          <p className="text-xs text-slate-500 mt-1 font-semibold">
            Compile formal investigative summaries, data exposure checklists, and compliance briefing cards.
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-md text-xs transition-colors self-start shadow-md cursor-pointer select-none"
        >
          <Plus className="w-4 h-4" />
          <span>Compile New Brief</span>
        </button>
      </div>

      {/* Download Toast Notification */}
      {downloadNotification && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-700 text-xs flex items-center gap-2 max-w-md mx-auto animate-in fade-in slide-in-from-top-2 text-left shadow-sm">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span className="font-semibold">{downloadNotification} simulation initiated successfully.</span>
        </div>
      )}

      {/* Generate Report Form */}
      {showForm && (
        <form 
          onSubmit={handleGenerate}
          className="bg-white border border-slate-200 rounded-lg p-5 space-y-4 shadow-sm text-left animate-in fade-in"
          id="generate-report-form"
        >
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Loader2 className={`w-4 h-4 text-blue-600 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>Compile Secure Enterprise Brief</span>
            </h3>
            <p className="text-[11px] text-slate-500 mt-0.5 font-semibold">
              Draft official investigation reports to present to Corporate Legal Counsel or HR Executives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Report Name / Subject
              </label>
              <input
                type="text"
                required
                disabled={isGenerating}
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                placeholder="e.g. Legal Summary: Case NX-1042 Audit"
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Brief Type Category
              </label>
              <select
                disabled={isGenerating}
                value={reportType}
                onChange={(e) => setReportType(e.target.value as SecurityReport['type'])}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
              >
                <option value="Executive Brief">Executive Brief</option>
                <option value="Compliance Audit">Compliance Audit</option>
                <option value="Incident Summary">Incident Summary</option>
                <option value="Activity Report">Activity Report</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Link Active Case File
              </label>
              <select
                disabled={isGenerating}
                value={linkedCaseId}
                onChange={(e) => setLinkedCaseId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-1.5 text-xs text-slate-700 focus:outline-none font-semibold cursor-pointer"
              >
                <option value="none">No Case Link (General Report)</option>
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.id}] {c.title}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              disabled={isGenerating}
              onClick={() => setShowForm(false)}
              className="px-3.5 py-1.5 bg-transparent hover:bg-slate-100 text-slate-500 rounded text-xs transition-colors font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors shadow flex items-center gap-1.5 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Compiling PDF Brief...</span>
                </>
              ) : (
                <span>Compile Brief</span>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Reports Catalog on Left, Detailed View on Right */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        
        {/* Left: Brief Registry (5 columns) */}
        <div className="xl:col-span-5 bg-white border border-slate-200 p-5 rounded-lg space-y-4 shadow-sm">
          <div className="border-b border-slate-100 pb-3 text-left flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800">Security Report Registry</h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Live Archives</span>
          </div>

          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 text-left">
            {reports.map((rep) => {
              const isSelected = selectedReport?.id === rep.id;
              const isGeneratingState = rep.status === 'Generating';

              return (
                <div 
                  key={rep.id}
                  onClick={() => !isGeneratingState && setSelectedReport(rep)}
                  className={`p-3 rounded-lg border transition-all duration-150 flex items-center justify-between gap-3 ${
                    isGeneratingState 
                      ? 'bg-slate-50 border-dashed border-slate-200 opacity-60 cursor-not-allowed'
                      : isSelected 
                        ? 'bg-blue-50 border-blue-300 cursor-pointer shadow-sm' 
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-50 hover:border-slate-300 cursor-pointer'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-9 h-9 rounded bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      {isGeneratingState ? (
                        <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                      ) : (
                        getReportIcon(rep.type)
                      )}
                    </div>
                    <div className="truncate">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{rep.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-semibold">
                        {rep.type} • {rep.generatedAt}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[10px] font-mono text-slate-400 block font-bold">{rep.fileSize}</span>
                    <span className={`inline-block text-[9px] font-bold mt-1 uppercase ${
                      isGeneratingState ? 'text-blue-600 animate-pulse' : 'text-emerald-600'
                    }`}>
                      {rep.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Report Details Panel (7 columns) */}
        <div className="xl:col-span-7 bg-white border border-slate-200 p-0 rounded-lg overflow-hidden shadow-sm">
          {selectedReport ? (() => {
            const associatedCase = selectedReport.caseId ? cases.find(c => c.id === selectedReport.caseId) : null;
            if (associatedCase) {
              return (
                <InvestigationReport 
                  currentCase={associatedCase} 
                  analysis={analyses ? analyses[associatedCase.id] : undefined} 
                />
              );
            }

            return (
              <div className="p-5 space-y-5 text-left animate-in fade-in">
                
                {/* Header */}
                <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1 text-left">
                    <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider font-bold">
                      {selectedReport.type} Brief Detail
                    </span>
                    <h3 className="font-bold text-slate-800 text-base leading-snug font-display">{selectedReport.title}</h3>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        triggerDownloadNotification(selectedReport.title);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded text-xs transition-all cursor-pointer font-bold shadow-sm"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Report Metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded border border-slate-200 text-xs font-mono shadow-sm">
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">DRAFT CODE</span>
                    <span className="text-slate-700 font-bold">{selectedReport.id}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">COMPILED BY</span>
                    <span className="text-slate-700 font-bold">{selectedReport.generatedBy.split(' (')[0]}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">COMPILED AT</span>
                    <span className="text-slate-700 font-bold">{selectedReport.generatedAt}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block font-bold">FILE CAPACITY</span>
                    <span className="text-slate-700 font-bold">{selectedReport.fileSize}</span>
                  </div>
                </div>

                {/* Narrative Content */}
                <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed text-left">
                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">1.0 Executive Narrative Summary</span>
                    <p className="bg-slate-50 p-3.5 rounded border border-slate-200 leading-relaxed font-semibold text-slate-600">
                      This brief synthesizes active telemetry indicators matching behavioral security vectors registered across the Google Workspace and corporate IDP channels. Indicators points towards potential credentials bypass tokens and permissive SaaS integrations. It is authored as an explanatory aid for organizational stakeholders.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">2.0 Investigated Corporate Assets</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600 font-semibold">
                      <li>Google Cloud BigQuery ledger bucket (Confidential sensitivity metadata)</li>
                      <li>GWS Drive Folder: <code className="bg-slate-100 text-emerald-700 border border-slate-200 px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">Finances_2026_Restricted</code></li>
                      <li>Okta service profiles access logs</li>
                    </ul>
                  </div>

                  <div className="space-y-1.5">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-widest font-bold">3.0 Remediation Guidelines SOP</span>
                    <p className="font-semibold text-slate-600">
                      Task forces should verify MFA bypass protocols immediately and ensure high-sensitivity OAuth scopes are locked behind double-confirmation approval panels. Complete legal coordination is advised prior to enforcing employee-related device restrictions.
                    </p>
                  </div>
                </div>

                {/* Disclaimer reminder at bottom of page */}
                <div className="bg-blue-50 border border-blue-200 rounded p-3 flex gap-2 text-[10px] leading-relaxed text-left">
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-slate-500 font-semibold">
                    Note: This report is a generated security brief produced by NexusGuard analysis tools. All legal, human resources, or operational disciplinary determinations reside exclusively with authorized company human agents.
                  </p>
                </div>
              </div>
            );
          })() : (
            <p className="text-sm text-slate-400 text-center py-16 font-semibold">Select a report brief from the catalog registry on the left to inspect detailed content logs.</p>
          )}
        </div>
      </div>
    </div>
  );
}
