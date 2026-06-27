import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  RefreshCw,
  Info
} from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onTriggerMockAlert: () => void;
  systemAlertCount: number;
  lastIngestTime: string;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  onTriggerMockAlert,
  systemAlertCount,
  lastIngestTime
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [triggering, setTriggering] = useState(false);

  const handleTrigger = () => {
    setTriggering(true);
    setTimeout(() => {
      onTriggerMockAlert();
      setTriggering(false);
    }, 600);
  };

  return (
    <header className="bg-white border-b border-slate-200 h-16 px-6 flex items-center justify-between shrink-0 select-none z-10" id="nexus-header">
      
      {/* Search Bar / Console Indicator */}
      <div className="flex items-center gap-6 flex-1 max-w-xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="global-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets, employee emails, policy rules, cases or audit events..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all font-sans"
          />
        </div>
      </div>

      {/* Header Actions / Controls */}
      <div className="flex items-center gap-4">
        {/* Dynamic Mock Alert Injection Button */}
        <button
          id="trigger-mock-event-btn"
          onClick={handleTrigger}
          disabled={triggering}
          className="flex items-center gap-2 bg-red-50 border border-red-200 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-md text-xs font-medium cursor-pointer select-none transition-all duration-150 shadow-sm"
          title="Simulate a new critical incident in real-time"
        >
          <Sparkles className={`w-3.5 h-3.5 ${triggering ? 'animate-spin' : ''}`} />
          <span>{triggering ? 'Ingesting...' : 'Simulate Live Event'}</span>
        </button>

        {/* Sync Status Badge */}
        <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-600">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Feed synchronized</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Last: {lastIngestTime}</span>
        </div>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="notifications-toggle"
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-9 h-9 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center relative border border-transparent hover:border-slate-200"
          >
            <Bell className="w-4 h-4" />
            {systemAlertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-xl py-2 z-50 text-xs font-sans text-slate-700">
              <div className="px-4 py-2 border-b border-slate-100 font-medium text-slate-800 flex justify-between items-center">
                <span>System Notifications</span>
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-100 px-1.5 py-0.5 rounded font-mono font-bold">
                  {systemAlertCount} Critical
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {systemAlertCount > 0 ? (
                  <div className="p-3 hover:bg-slate-50 border-b border-slate-100 flex gap-2.5 text-left">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">New Alert: Case NX-1042 Updated</p>
                      <p className="text-slate-500 text-[10px] mt-0.5">Singapore location OAuth application approved</p>
                      <p className="text-slate-400 text-[9px] mt-1">Just now</p>
                    </div>
                  </div>
                ) : null}
                <div className="p-3 hover:bg-slate-50 border-b border-slate-100 flex gap-2.5 text-left">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-slate-800">Ingestion Inbound Pipelines</p>
                    <p className="text-slate-500 text-[10px] mt-0.5">Google Workspace feeds verified nominal</p>
                    <p className="text-slate-400 text-[9px] mt-1">5 mins ago</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-1.5 text-center bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowNotifications(false)}
                  className="text-blue-600 hover:text-blue-700 text-[10px] font-medium"
                >
                  Close panel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Info */}
        <div className="flex items-center gap-2.5 border-l border-slate-200 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-display text-xs text-slate-700 font-semibold border border-slate-200">
            SA
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-medium text-slate-700 leading-none">SecOps Advisor</span>
            <span className="text-[10px] text-slate-500 font-mono mt-0.5">visalu.jp@gmail.com</span>
          </div>
        </div>

      </div>
    </header>
  );
}
