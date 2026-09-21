"use client";

import { useState } from "react";
import { Plus, Trash2, X, Pencil } from "lucide-react";
import type { Note } from "@/lib/types";
import { formatDate, cn } from "@/lib/utils";

const NOTE_COLORS = [
  "#d8f3dc",
  "#fff3b0",
  "#caf0f8",
  "#ffd6a5",
  "#e2e2ff",
  "#f8edeb",
];

interface Props {
  notes: Note[];
  onAdd: (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => void;
  onUpdate: (id: string, updates: Partial<Note>) => void;
  onDelete: (id: string) => void;
}

export function Notes({ notes, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Note | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState(NOTE_COLORS[0]);

  const openNew = () => {
    setIsNew(true);
    setEditing(null);
    setTitle("");
    setContent("");
    setColor(NOTE_COLORS[0]);
  };

  const openEdit = (note: Note) => {
    setIsNew(false);
    setEditing(note);
    setTitle(note.title);
    setContent(note.content);
    setColor(note.color || NOTE_COLORS[0]);
  };

  const close = () => {
    setEditing(null);
    setIsNew(false);
  };

  const save = () => {
    if (!title.trim()) return;
    if (isNew) {
      onAdd({ title: title.trim(), content, color });
    } else if (editing) {
      onUpdate(editing.id, { title: title.trim(), content, color });
    }
    close();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Notes</h2>
          <p className="mt-1 text-sm text-muted">{notes.length} notes</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover"
        >
          <Plus className="h-4 w-4" />
          New Note
        </button>
      </header>

      {/* Editor modal */}
      {(isNew || editing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl bg-card shadow-xl">
            <div className="flex items-center justify-between border-b border-card-border px-5 py-4">
              <h3 className="font-semibold">
                {isNew ? "New Note" : "Edit Note"}
              </h3>
              <button
                onClick={close}
                className="rounded-lg p-1 text-muted hover:bg-background"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title"
                className="w-full rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm font-medium outline-none focus:border-accent"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                placeholder="Write your notes here... (supports basic markdown feel)"
                className="w-full resize-none rounded-xl border border-card-border bg-background px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-accent"
              />
              <div>
                <p className="mb-2 text-xs font-medium text-muted">Color</p>
                <div className="flex gap-2">
                  {NOTE_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={cn(
                        "h-7 w-7 rounded-full border-2 transition",
                        color === c
                          ? "border-foreground scale-110"
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 border-t border-card-border p-5">
              <button
                onClick={close}
                className="flex-1 rounded-xl border border-card-border py-2.5 text-sm font-medium hover:bg-background"
              >
                Cancel
              </button>
              <button
                onClick={save}
                className="flex-1 rounded-xl bg-accent py-2.5 text-sm font-medium text-white hover:bg-accent-hover"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes grid */}
      {notes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-card-border py-20 text-center text-sm text-muted">
          No notes yet. Capture your thoughts.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <article
              key={note.id}
              className="group relative flex flex-col rounded-2xl border border-card-border/60 p-5 shadow-sm transition hover:shadow-md"
              style={{ backgroundColor: note.color || "#f8f7f4" }}
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                  {note.title}
                </h3>
                <div className="flex shrink-0 gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(note)}
                    className="rounded-lg p-1.5 text-muted hover:bg-black/5 hover:text-foreground"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onDelete(note.id)}
                    className="rounded-lg p-1.5 text-muted hover:bg-red-50 hover:text-danger"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <p className="line-clamp-4 flex-1 text-xs leading-relaxed text-muted">
                {note.content}
              </p>
              <p className="mt-4 text-[11px] text-muted/80">
                {formatDate(note.updatedAt)}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
