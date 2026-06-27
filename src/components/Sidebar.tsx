import React from 'react';
import { 
  LayoutDashboard, 
  Workflow, 
  Activity, 
  ShieldAlert, 
  FileSliders, 
  FileBarChart2, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Lock
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ 
  activeTab, 
  setActiveTab, 
  collapsed, 
  setCollapsed 
}: SidebarProps) {
  
  const menuItems = [
    { id: 'overview', label: 'Executive Overview', icon: LayoutDashboard },
    { id: 'integrations', label: 'Integration Hub', icon: Workflow },
    { id: 'events', label: 'Live Event Stream', icon: Activity },
    { id: 'workspace', label: 'Investigation Workspace', icon: ShieldAlert },
    { id: 'policy', label: 'Policy Intelligence', icon: FileSliders },
    { id: 'reports', label: 'Reports', icon: FileBarChart2 },
  ];

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col transition-all duration-300 relative select-none ${
        collapsed ? 'w-[68px]' : 'w-[260px]'
      }`}
      id="nexus-sidebar"
    >
      {/* Brand Header */}
      <div className="h-16 flex items-center px-4 border-b border-slate-200 overflow-hidden whitespace-nowrap bg-white">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-slate-800 leading-tight tracking-tight">
                Nexus<span className="text-blue-600">Guard</span>
              </span>
              <span className="text-[10px] text-slate-400 tracking-wider font-mono font-bold uppercase">
                Enterprise SEC
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 h-4 overflow-hidden">
          {!collapsed ? 'INVESTIGATION SUITE' : '•••'}
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-btn-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-md text-sm transition-all duration-150 group relative text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
              }`}
            >
              {/* Left active line indicator */}
              {isActive && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-1.5 bg-blue-600 rounded-r-md" />
              )}
              
              <Icon 
                className={`w-4.5 h-4.5 shrink-0 ${
                  isActive ? 'text-blue-600' : 'text-slate-500 group-hover:text-slate-700'
                }`} 
              />
              
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}

              {/* Tooltip on collapse */}
              {collapsed && (
                <div className="absolute left-16 scale-0 bg-slate-900 text-white text-xs rounded-md px-2.5 py-1.5 shadow-xl font-sans group-hover:scale-100 transition-all duration-100 origin-left z-50 border border-slate-700 whitespace-nowrap pointer-events-none">
                  {item.label}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Policy Security Status in Sidebar */}
      {!collapsed && (
        <div className="m-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 mb-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-xs font-semibold text-emerald-700">Security Engine Active</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            NexusGuard is currently analyzing Workspace and IDP event buses.
          </p>
          <div className="mt-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">System Integrity Nominal</span>
          </div>
        </div>
      )}

      {/* Collapse Toggle Button */}
      <div className="p-3 border-t border-slate-200 flex justify-end">
        <button
          id="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center border border-transparent hover:border-slate-200 transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
