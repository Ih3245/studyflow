"use client";

import { useState } from "react";
import { Plus, Trash2, Circle, CheckCircle2, X } from "lucide-react";
import type { Task, Priority } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

interface Props {
  tasks: Task[];
  onAdd: (task: Omit<Task, "id" | "createdAt" | "completed">) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
}

export function Tasks({ tasks, onAdd, onToggle, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [subject, setSubject] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

  const filtered = tasks.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      dueDate: dueDate || undefined,
      subject: subject.trim() || undefined,
    });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    setSubject("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Tasks</h2>
          <p className="mt-1 text-sm text-muted">
            {tasks.filter((t) => !t.completed).length} remaining
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Add Task
        </button>
      </header>

      {/* Filters */}
      <div className="flex gap-2">
        {(["all", "pending", "done"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-xs font-medium capitalize",
              filter === f
                ? "bg-foreground text-background"
                : "bg-card border border-card-border text-muted hover:text-foreground"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Task</h3>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-muted hover:bg-background hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Title
                </label>
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What needs to be done?"
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Extra details..."
                  className="w-full resize-none rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Due date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Subject (optional)
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl border border-card-border py-2.5 text-sm font-medium hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task list */}
      <ul className="space-y-2">
        {filtered.length === 0 ? (
          <li className="rounded-2xl border border-dashed border-card-border py-16 text-center text-sm text-muted">
            No tasks here yet.
          </li>
        ) : (
          filtered.map((task) => (
            <li
              key={task.id}
              className={cn(
                "group flex items-start gap-3 rounded-2xl border border-card-border bg-card p-4 shadow-sm transition",
                task.completed && "opacity-60"
              )}
            >
              <button
                onClick={() => onToggle(task.id)}
                className="mt-0.5 shrink-0 text-muted hover:text-accent"
              >
                {task.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-accent" />
                ) : (
                  <Circle className="h-5 w-5" />
                )}
              </button>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm font-medium",
                    task.completed && "line-through text-muted"
                  )}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="mt-0.5 text-xs text-muted line-clamp-1">
                    {task.description}
                  </p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
                  {task.subject && (
                    <span className="rounded-full bg-accent-soft/60 px-2 py-0.5 text-accent">
                      {task.subject}
                    </span>
                  )}
                  {task.dueDate && <span>Due {formatDate(task.dueDate)}</span>}
                  <PriorityDot priority={task.priority} />
                </div>
              </div>
              <button
                onClick={() => onDelete(task.id)}
                className="shrink-0 rounded-lg p-1.5 text-muted opacity-0 transition hover:bg-red-50 hover:text-danger group-hover:opacity-100"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

function PriorityDot({ priority }: { priority: Priority }) {
  const colors = {
    high: "bg-red-500",
    medium: "bg-amber-400",
    low: "bg-slate-300",
  };
  return (
    <span className="inline-flex items-center gap-1">
      <span className={cn("h-1.5 w-1.5 rounded-full", colors[priority])} />
      <span className="capitalize">{priority}</span>
    </span>
  );
}
