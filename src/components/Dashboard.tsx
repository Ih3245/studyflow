"use client";

import { CheckCircle2, Circle, StickyNote, Calendar, Flame } from "lucide-react";
import type { AppData } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";
import { FULL_DAYS } from "@/lib/types";

interface Props {
  data: AppData;
  onToggleTask: (id: string) => void;
  onNavigate: (tab: string) => void;
}

export function Dashboard({ data, onToggleTask, onNavigate }: Props) {
  const today = new Date().getDay();
  const todayClasses = data.timetable
    .filter((c) => c.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pendingTasks = data.tasks.filter((t) => !t.completed);
  const completedToday = data.tasks.filter((t) => t.completed).length;
  const highPriority = pendingTasks.filter((t) => t.priority === "high");

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Good {getGreeting()}, Student
        </h2>
        <p className="mt-1 text-muted">
          {new Date().toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          label="Pending Tasks"
          value={pendingTasks.length}
          sub={`${highPriority.length} high priority`}
        />
        <StatCard
          label="Completed"
          value={completedToday}
          sub="tasks done"
        />
        <StatCard
          label="Today's Classes"
          value={todayClasses.length}
          sub={FULL_DAYS[today]}
        />
        <StatCard
          label="Focus Sessions"
          value={data.pomodoroSessions}
          sub="pomodoros total"
          icon={<Flame className="h-4 w-4 text-warning" />}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's tasks */}
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Priority Tasks</h3>
            <button
              onClick={() => onNavigate("tasks")}
              className="text-xs font-medium text-accent hover:text-accent-hover"
            >
              View all
            </button>
          </div>
          {pendingTasks.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              All caught up. Nice work.
            </p>
          ) : (
            <ul className="space-y-2">
              {pendingTasks.slice(0, 5).map((task) => (
                <li
                  key={task.id}
                  className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-background/80"
                >
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 shrink-0 text-muted hover:text-accent"
                  >
                    <Circle className="h-[18px] w-[18px]" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.title}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                      <PriorityBadge priority={task.priority} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Today's classes */}
        <section className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Today&apos;s Schedule</h3>
            <button
              onClick={() => onNavigate("timetable")}
              className="text-xs font-medium text-accent hover:text-accent-hover"
            >
              Full timetable
            </button>
          </div>
          {todayClasses.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">
              No classes today. Use the time wisely.
            </p>
          ) : (
            <ul className="space-y-3">
              {todayClasses.map((slot) => (
                <li
                  key={slot.id}
                  className="flex items-center gap-3 rounded-xl border border-card-border/60 px-3 py-3"
                >
                  <div
                    className="h-10 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: slot.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{slot.subject}</p>
                    <p className="text-xs text-muted">
                      {slot.startTime} – {slot.endTime}
                      {slot.room ? ` · ${slot.room}` : ""}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* Recent notes preview */}
      <section className="rounded-2xl border border-card-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Recent Notes</h3>
          <button
            onClick={() => onNavigate("notes")}
            className="text-xs font-medium text-accent hover:text-accent-hover"
          >
            All notes
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {data.notes.slice(0, 2).map((note) => (
            <button
              key={note.id}
              onClick={() => onNavigate("notes")}
              className="rounded-xl border border-card-border/70 p-4 text-left transition hover:border-accent/30 hover:shadow-sm"
              style={{ backgroundColor: note.color || "#f8f7f4" }}
            >
              <div className="mb-2 flex items-center gap-2">
                <StickyNote className="h-3.5 w-3.5 text-muted" />
                <span className="text-xs text-muted">
                  {formatDate(note.updatedAt)}
                </span>
              </div>
              <p className="line-clamp-1 text-sm font-medium">{note.title}</p>
              <p className="mt-1 line-clamp-2 text-xs text-muted">
                {note.content.replace(/[#*`]/g, "").slice(0, 80)}
              </p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: number | string;
  sub: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-card-border bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted">{label}</p>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold tracking-tight">{value}</span>
        {icon}
      </div>
      <p className="mt-0.5 text-xs text-muted">{sub}</p>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles = {
    high: "bg-red-50 text-red-700",
    medium: "bg-amber-50 text-amber-700",
    low: "bg-slate-100 text-slate-600",
  };
  return (
    <span
      className={cn(
        "rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
        styles[priority as keyof typeof styles] || styles.low
      )}
    >
      {priority}
    </span>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
