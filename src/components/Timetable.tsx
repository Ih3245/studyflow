"use client";

import { useState } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";
import type { ClassSlot } from "@/lib/types";
import { FULL_DAYS, SUBJECT_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  slots: ClassSlot[];
  onAdd: (slot: Omit<ClassSlot, "id">) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ClassSlot>) => void;
}

const PERIODS = [
  { label: "Period 1", start: "08:00", end: "08:45" },
  { label: "Period 2", start: "08:45", end: "09:30" },
  { label: "Period 3", start: "09:30", end: "10:15" },
  { label: "Break",    start: "10:15", end: "10:30" },
  { label: "Period 4", start: "10:30", end: "11:15" },
  { label: "Period 5", start: "11:15", end: "12:00" },
  { label: "Period 6", start: "12:00", end: "12:45" },
];

const BD_DAYS = [0, 1, 2, 3, 4, 5]; // Sun–Fri (Bangladesh school week)

type FormData = {
  subject: string;
  day: number;
  startTime: string;
  endTime: string;
  room: string;
  instructor: string;
  color: string;
};

const emptyForm = (): FormData => ({
  subject: "",
  day: 0,
  startTime: "08:00",
  endTime: "08:45",
  room: "",
  instructor: "",
  color: SUBJECT_COLORS[0],
});

export function Timetable({ slots, onAdd, onDelete, onUpdate }: Props) {
  const [mode, setMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormData>(emptyForm());
  const [activeDay, setActiveDay] = useState(new Date().getDay());

  // ── Open Add modal ────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm());
    setEditingId(null);
    setMode("add");
  };

  // ── Open Edit modal ───────────────────────────────────────────────
  const openEdit = (slot: ClassSlot) => {
    setForm({
      subject:    slot.subject,
      day:        slot.day,
      startTime:  slot.startTime,
      endTime:    slot.endTime,
      room:       slot.room || "",
      instructor: slot.instructor || "",
      color:      slot.color,
    });
    setEditingId(slot.id);
    setMode("edit");
  };

  const closeModal = () => { setMode(null); setEditingId(null); };

  // ── Submit ────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject.trim()) return;
    const payload = {
      subject:    form.subject.trim(),
      day:        form.day,
      startTime:  form.startTime,
      endTime:    form.endTime,
      room:       form.room.trim() || undefined,
      instructor: form.instructor.trim() || undefined,
      color:      form.color,
    };
    if (mode === "edit" && editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }
    closeModal();
  };

  const field = (key: keyof FormData, value: string | number) =>
    setForm((f) => ({ ...f, [key]: value }));

  // ── Current day's slots sorted by time ────────────────────────────
  const daySlots = slots
    .filter((s) => s.day === activeDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Timetable</h2>
          <p className="mt-1 text-sm text-muted">Bangladesh school schedule — 6 periods daily</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Add Class
        </button>
      </header>

      {/* Day selector tabs */}
      <div className="flex flex-wrap gap-2">
        {BD_DAYS.map((d) => (
          <button
            key={d}
            onClick={() => setActiveDay(d)}
            className={cn(
              "rounded-xl px-3 py-1.5 text-sm font-medium transition-all",
              activeDay === d
                ? "bg-accent text-white shadow-sm"
                : "border border-card-border bg-card text-muted hover:text-foreground"
            )}
          >
            {FULL_DAYS[d]}
            {d === new Date().getDay() && (
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-green-400 align-middle" />
            )}
          </button>
        ))}
      </div>

      {/* Period grid for selected day */}
      <div className="rounded-2xl border border-card-border bg-card overflow-hidden">
        {/* Period header row */}
        <div className="grid grid-cols-[80px_1fr] border-b border-card-border bg-card/50 px-4 py-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Period</span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">Class</span>
        </div>

        {PERIODS.map((period, idx) => {
          const isBreak = period.label === "Break";
          const slot = daySlots.find(
            (s) => s.startTime === period.start
          );

          return (
            <div
              key={idx}
              className={cn(
                "grid grid-cols-[80px_1fr] border-b border-card-border/40 last:border-0",
                isBreak ? "bg-amber-500/5" : "hover:bg-white/[0.02] transition-colors"
              )}
            >
              {/* Left — period label */}
              <div className="flex flex-col justify-center border-r border-card-border/40 px-3 py-3">
                <span className={cn(
                  "text-xs font-semibold",
                  isBreak ? "text-amber-500" : "text-muted"
                )}>
                  {period.label}
                </span>
                <span className="text-[10px] text-muted/60 mt-0.5 tabular-nums">
                  {period.start} – {period.end}
                </span>
              </div>

              {/* Right — class slot */}
              <div className="flex items-center justify-between px-4 py-3 min-h-[60px]">
                {isBreak ? (
                  <span className="text-xs font-medium text-amber-500/70">Break — 15 minutes</span>
                ) : slot ? (
                  <div className="flex flex-1 items-center gap-3">
                    {/* Color bar */}
                    <div
                      className="h-10 w-1 shrink-0 rounded-full"
                      style={{ backgroundColor: slot.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-foreground">{slot.subject}</p>
                      <p className="text-[11px] text-muted mt-0.5">
                        {[slot.room, slot.instructor].filter(Boolean).join(" · ")}
                      </p>
                    </div>
                    {/* Action buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEdit(slot)}
                        className="rounded-lg p-1.5 text-muted hover:bg-accent/10 hover:text-accent transition-all"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(slot.id)}
                        className="rounded-lg p-1.5 text-muted hover:bg-red-500/10 hover:text-danger transition-all"
                        title="Delete"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setForm((f) => ({ ...emptyForm(), day: activeDay, startTime: period.start, endTime: period.end }));
                      setMode("add");
                    }}
                    className="flex items-center gap-1.5 text-xs text-muted/50 hover:text-accent transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                    Add class
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional classes (not in standard periods) */}
      {daySlots.filter(s => !PERIODS.some(p => p.start === s.startTime)).length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted">Other Classes</p>
          {daySlots
            .filter(s => !PERIODS.some(p => p.start === s.startTime))
            .map(slot => (
              <div
                key={slot.id}
                className="flex items-center justify-between rounded-xl border border-card-border bg-card px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full" style={{ backgroundColor: slot.color }} />
                  <div>
                    <p className="text-sm font-medium">{slot.subject}</p>
                    <p className="text-xs text-muted">{slot.startTime} – {slot.endTime}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(slot)} className="rounded-lg p-1.5 text-muted hover:text-accent hover:bg-accent/10">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => onDelete(slot.id)} className="rounded-lg p-1.5 text-muted hover:text-danger hover:bg-red-500/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}

      {/* ── Modal: Add / Edit ───────────────────────────────────────── */}
      {mode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-card-border bg-card p-6 shadow-2xl">
            {/* Modal header */}
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {mode === "edit" ? "Edit Class" : "Add Class"}
              </h3>
              <button onClick={closeModal} className="rounded-lg p-1 text-muted hover:bg-background">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Subject *</label>
                <input
                  autoFocus
                  value={form.subject}
                  onChange={(e) => field("subject", e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  required
                />
              </div>

              {/* Day */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Day</label>
                <select
                  value={form.day}
                  onChange={(e) => field("day", Number(e.target.value))}
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {BD_DAYS.map((d) => (
                    <option key={d} value={d}>{FULL_DAYS[d]}</option>
                  ))}
                </select>
              </div>

              {/* Period shortcut */}
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">Period (quick select)</label>
                <div className="flex flex-wrap gap-1.5">
                  {PERIODS.filter(p => p.label !== "Break").map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => { field("startTime", p.start); field("endTime", p.end); }}
                      className={cn(
                        "rounded-lg px-2.5 py-1 text-xs font-medium border transition-all",
                        form.startTime === p.start && form.endTime === p.end
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-card-border text-muted hover:text-foreground"
                      )}
                    >
                      {p.label}
                      <span className="ml-1 opacity-50">{p.start}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Start Time</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => field("startTime", e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">End Time</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => field("endTime", e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Room & Instructor */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Room</label>
                  <input
                    value={form.room}
                    onChange={(e) => field("room", e.target.value)}
                    placeholder="Room 201"
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">Instructor</label>
                  <input
                    value={form.instructor}
                    onChange={(e) => field("instructor", e.target.value)}
                    placeholder="Dr. Name"
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>

              {/* Color */}
              <div>
                <p className="mb-2 text-xs font-medium text-muted">Color</p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => field("color", c)}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition-transform",
                        form.color === c ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 rounded-xl border border-card-border py-2.5 text-sm font-medium hover:bg-background"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
                >
                  {mode === "edit" ? "Save Changes" : "Add Class"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
