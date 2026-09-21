"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { ClassSlot } from "@/lib/types";
import { DAYS, FULL_DAYS, SUBJECT_COLORS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface Props {
  slots: ClassSlot[];
  onAdd: (slot: Omit<ClassSlot, "id">) => void;
  onDelete: (id: string) => void;
}

export function Timetable({ slots, onAdd, onDelete }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [day, setDay] = useState(1);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:30");
  const [room, setRoom] = useState("");
  const [instructor, setInstructor] = useState("");
  const [color, setColor] = useState(SUBJECT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) return;
    onAdd({
      subject: subject.trim(),
      day,
      startTime,
      endTime,
      room: room.trim() || undefined,
      instructor: instructor.trim() || undefined,
      color,
    });
    setSubject("");
    setRoom("");
    setInstructor("");
    setShowForm(false);
  };

  // Group by day
  const byDay = Array.from({ length: 7 }, (_, i) =>
    slots
      .filter((s) => s.day === i)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Timetable</h2>
          <p className="mt-1 text-sm text-muted">Your weekly class schedule</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Add Class
        </button>
      </header>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Class</h3>
              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1 text-muted hover:bg-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Subject
                </label>
                <input
                  autoFocus
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted">
                  Day
                </label>
                <select
                  value={day}
                  onChange={(e) => setDay(Number(e.target.value))}
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                >
                  {FULL_DAYS.map((d, i) => (
                    <option key={d} value={i}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Start
                  </label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    End
                  </label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Room
                  </label>
                  <input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Room 201"
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Instructor
                  </label>
                  <input
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    placeholder="Dr. Name"
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-muted">Color</p>
                <div className="flex flex-wrap gap-2">
                  {SUBJECT_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "h-7 w-7 rounded-full border-2",
                        color === c ? "border-foreground scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
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
                  Add Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Week view */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {byDay.map((daySlots, dayIndex) => (
          <div
            key={dayIndex}
            className="rounded-2xl border border-card-border bg-card p-4 shadow-sm"
          >
            <h3
              className={cn(
                "mb-3 text-sm font-semibold",
                dayIndex === new Date().getDay()
                  ? "text-accent"
                  : "text-foreground"
              )}
            >
              {FULL_DAYS[dayIndex]}
              {dayIndex === new Date().getDay() && (
                <span className="ml-2 text-[10px] font-normal text-accent">
                  Today
                </span>
              )}
            </h3>
            {daySlots.length === 0 ? (
              <p className="py-4 text-center text-xs text-muted">No classes</p>
            ) : (
              <ul className="space-y-2">
                {daySlots.map((slot) => (
                  <li
                    key={slot.id}
                    className="group relative rounded-xl border border-card-border/50 p-3"
                    style={{
                      borderLeftWidth: 3,
                      borderLeftColor: slot.color,
                    }}
                  >
                    <p className="text-sm font-medium">{slot.subject}</p>
                    <p className="mt-0.5 text-xs text-muted">
                      {slot.startTime} – {slot.endTime}
                    </p>
                    {(slot.room || slot.instructor) && (
                      <p className="mt-1 text-[11px] text-muted">
                        {[slot.room, slot.instructor].filter(Boolean).join(" · ")}
                      </p>
                    )}
                    <button
                      onClick={() => onDelete(slot.id)}
                      className="absolute right-2 top-2 rounded p-1 text-muted opacity-0 hover:bg-red-50 hover:text-danger group-hover:opacity-100"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
