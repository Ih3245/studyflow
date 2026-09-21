"use client";

import {
  LayoutDashboard,
  CheckSquare,
  StickyNote,
  Calendar,
  Calculator,
  Timer,
  BookOpen,
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
}

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "timetable", label: "Timetable", icon: Calendar },
  { id: "gpa", label: "GPA Calculator", icon: Calculator },
  { id: "pomodoro", label: "Focus Timer", icon: Timer },
];

export function Sidebar({ active, onChange }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-[240px] flex-col bg-sidebar text-sidebar-text">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent">
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-white">
            StudyFlow
          </h1>
          <p className="text-[11px] text-sidebar-text/60">Student Companion</p>
        </div>
      </div>

      <nav className="mt-2 flex flex-1 flex-col gap-0.5 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-sidebar-text/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-[18px] w-[18px]",
                  isActive ? "text-accent-soft" : "text-sidebar-text/50"
                )}
              />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] leading-relaxed text-sidebar-text/50">
          Made for students who actually want to get things done.
        </p>
      </div>
    </aside>
  );
}
