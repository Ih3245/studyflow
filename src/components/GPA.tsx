"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, X } from "lucide-react";
import type { Course } from "@/lib/types";
import { GRADE_POINTS } from "@/lib/types";

interface Props {
  courses: Course[];
  onAdd: (course: Omit<Course, "id">) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Course>) => void;
}

export function GPA({ courses, onAdd, onDelete, onUpdate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [credit, setCredit] = useState(3);
  const [grade, setGrade] = useState("A");

  const { gpa, totalCredits } = useMemo(() => {
    let points = 0;
    let credits = 0;
    for (const c of courses) {
      const gp = GRADE_POINTS[c.grade] ?? 0;
      points += gp * c.credit;
      credits += c.credit;
    }
    return {
      gpa: credits === 0 ? 0 : points / credits,
      totalCredits: credits,
    };
  }, [courses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), credit, grade });
    setName("");
    setCredit(3);
    setGrade("A");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">GPA Calculator</h2>
          <p className="mt-1 text-sm text-muted">Track your academic performance</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          Add Course
        </button>
      </header>

      {/* GPA Card */}
      <div className="rounded-2xl border border-card-border bg-card p-6 shadow-sm">
        <div className="flex flex-wrap items-end gap-8">
          <div>
            <p className="text-xs font-medium text-muted">Current GPA</p>
            <p className="mt-1 text-5xl font-semibold tracking-tight text-accent">
              {gpa.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Total Credits</p>
            <p className="mt-1 text-2xl font-semibold">{totalCredits}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted">Courses</p>
            <p className="mt-1 text-2xl font-semibold">{courses.length}</p>
          </div>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-background">
          <div
            className="h-full rounded-full bg-accent transition-all duration-500"
            style={{ width: `${Math.min((gpa / 4) * 100, 100)}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Scale: 0.00 – 4.00 (A+ / A = 4.0)
        </p>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add Course</h3>
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
                  Course Name
                </label>
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Calculus I"
                  className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Credits
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={credit}
                    onChange={(e) => setCredit(Number(e.target.value))}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-muted">
                    Grade
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-accent"
                  >
                    {Object.keys(GRADE_POINTS).map((g) => (
                      <option key={g} value={g}>
                        {g} ({GRADE_POINTS[g]})
                      </option>
                    ))}
                  </select>
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
                  Add Course
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course list */}
      <div className="rounded-2xl border border-card-border bg-card shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-card-border bg-background/50 text-left text-xs font-medium text-muted">
              <th className="px-5 py-3">Course</th>
              <th className="px-5 py-3">Credits</th>
              <th className="px-5 py-3">Grade</th>
              <th className="px-5 py-3">Points</th>
              <th className="px-5 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-muted">
                  No courses added yet.
                </td>
              </tr>
            ) : (
              courses.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-card-border/60 last:border-0 hover:bg-background/40"
                >
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-muted">{c.credit}</td>
                  <td className="px-5 py-3.5">
                    <select
                      value={c.grade}
                      onChange={(e) =>
                        onUpdate(c.id, { grade: e.target.value })
                      }
                      className="rounded-lg border border-card-border bg-background px-2 py-1 text-sm outline-none focus:border-accent"
                    >
                      {Object.keys(GRADE_POINTS).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-5 py-3.5 text-muted">
                    {((GRADE_POINTS[c.grade] ?? 0) * c.credit).toFixed(1)}
                  </td>
                  <td className="px-5 py-3.5">
                    <button
                      onClick={() => onDelete(c.id)}
                      className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-danger"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
