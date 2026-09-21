"use client";

import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Calendar,
  Calculator,
  Timer,
  BookOpen,
  Zap,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type Tab =
  | "dashboard"
  | "tasks"
  | "notes"
  | "timetable"
  | "gpa"
  | "pomodoro";

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
  userName?: string;
  onLogout?: () => void;
}

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "timetable", label: "Timetable", icon: Calendar },
  { id: "gpa", label: "GPA Calculator", icon: Calculator },
  { id: "pomodoro", label: "Focus Timer", icon: Timer },
];

export function Sidebar({ active, onChange, userName, onLogout }: SidebarProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <aside className="sidebar-panel fixed left-0 top-0 z-40 flex h-full w-[240px] flex-col">
      {/* Logo */}
      <div className="sidebar-logo flex items-center gap-3 px-5 py-6">
        <div className="sidebar-icon-wrap flex h-9 w-9 items-center justify-center rounded-xl">
          <BookOpen className="h-4.5 w-4.5" />
        </div>
        <div>
          <h1 className="sidebar-title text-base font-bold tracking-tight">StudyFlow</h1>
          <p className="sidebar-sub text-[10px] font-medium tracking-widest uppercase opacity-50">
            Student OS
          </p>
        </div>
      </div>

      {/* Live clock */}
      <div className="sidebar-clock mx-4 mb-4 rounded-xl px-3 py-2.5 text-center">
        <div className="clock-time text-2xl font-bold tabular-nums tracking-tight">
          {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
        </div>
        <div className="clock-date text-[10px] font-medium opacity-50 mt-0.5">
          {time.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 px-3 overflow-y-auto">
        <p className="nav-section-label px-3 pb-2 text-[9px] font-bold tracking-widest uppercase opacity-30">
          Navigation
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn("sidebar-nav-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all", isActive ? "active" : "")}
            >
              <div className={cn("sidebar-nav-icon flex h-7 w-7 items-center justify-center rounded-lg", isActive ? "active" : "")}>
                <Icon className="h-[15px] w-[15px]" />
              </div>
              {item.label}
              {isActive && <Zap className="ml-auto h-3 w-3 opacity-60" />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer border-t px-4 py-4 space-y-3">
        {userName && (
          <div className="sidebar-user flex items-center gap-2.5 rounded-xl px-3 py-2">
            <div className="sidebar-avatar flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-medium truncate opacity-80">{userName}</span>
          </div>
        )}
        {onLogout && (
          <button
            onClick={onLogout}
            className="sidebar-logout flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium transition-all"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        )}
      </div>
    </aside>
  );
}
