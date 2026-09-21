"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { AppData, Task, Note, ClassSlot, Course } from "@/lib/types";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "studyflow-data-v1";

const defaultData: AppData = {
  tasks: [
    {
      id: generateId(),
      title: "Finish Math Assignment Chapter 5",
      description: "Problems 1-15 from the textbook",
      completed: false,
      priority: "high",
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      subject: "Mathematics",
    },
    {
      id: generateId(),
      title: "Read History notes for quiz",
      completed: false,
      priority: "medium",
      dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      subject: "History",
    },
    {
      id: generateId(),
      title: "Submit lab report",
      completed: true,
      priority: "high",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      subject: "Physics",
    },
  ],
  notes: [
    {
      id: generateId(),
      title: "Organic Chemistry - Functional Groups",
      content:
        "## Key Groups\n\n- Alcohols: R-OH\n- Aldehydes: R-CHO\n- Ketones: R-CO-R\n- Carboxylic acids: R-COOH\n\nRemember the naming conventions and reactions.",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      color: "#d8f3dc",
    },
    {
      id: generateId(),
      title: "Study Plan for Finals",
      content:
        "1. Focus on weak subjects first\n2. 2 hours revision daily\n3. Practice past papers on weekends\n4. Sleep well before exams",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      color: "#fff3b0",
    },
  ],
  timetable: [
    {
      id: generateId(),
      subject: "Mathematics",
      day: 1,
      startTime: "09:00",
      endTime: "10:30",
      room: "Room 201",
      instructor: "Dr. Rahman",
      color: "#2d6a4f",
    },
    {
      id: generateId(),
      subject: "Physics",
      day: 1,
      startTime: "11:00",
      endTime: "12:30",
      room: "Lab 3",
      instructor: "Prof. Khan",
      color: "#1d3557",
    },
    {
      id: generateId(),
      subject: "English",
      day: 2,
      startTime: "10:00",
      endTime: "11:30",
      room: "Room 105",
      color: "#5e548e",
    },
    {
      id: generateId(),
      subject: "Chemistry",
      day: 3,
      startTime: "09:00",
      endTime: "10:30",
      room: "Lab 1",
      color: "#9b2226",
    },
    {
      id: generateId(),
      subject: "History",
      day: 4,
      startTime: "13:00",
      endTime: "14:30",
      room: "Room 302",
      color: "#bc6c25",
    },
  ],
  courses: [
    { id: generateId(), name: "Calculus I", credit: 3, grade: "A" },
    { id: generateId(), name: "Physics I", credit: 4, grade: "B+" },
    { id: generateId(), name: "English Composition", credit: 3, grade: "A-" },
    { id: generateId(), name: "Introduction to Programming", credit: 3, grade: "A+" },
  ],
  pomodoroSessions: 12,
  lastUpdated: new Date().toISOString(),
};

function loadLocal(): AppData {
  if (typeof window === "undefined") return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

function saveLocal(data: AppData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ ...data, lastUpdated: new Date().toISOString() })
  );
}

// Sync to Neon DB (debounced)
async function syncToServer(data: AppData) {
  try {
    await fetch("/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data }),
    });
  } catch {
    // silent fail — data is still in localStorage
  }
}

export function useAppData(userId?: string) {
  const [data, setData] = useState<AppData>(defaultData);
  const [hydrated, setHydrated] = useState(false);
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  // Hydrate: first try Neon DB (if logged in), fallback to localStorage
  useEffect(() => {
    async function hydrate() {
      if (userId) {
        // Try to load from server
        try {
          const res = await fetch("/api/data");
          if (res.ok) {
            const json = await res.json();
            if (json.data && Object.keys(json.data).length > 0) {
              const serverData = { ...defaultData, ...json.data };
              setData(serverData);
              saveLocal(serverData);
              setHydrated(true);
              return;
            }
          }
        } catch {
          // fall through to localStorage
        }
      }
      // Fallback: localStorage
      setData(loadLocal());
      setHydrated(true);
    }
    hydrate();
  }, [userId]);

  // Save to localStorage + debounced sync to Neon
  useEffect(() => {
    if (!hydrated) return;
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    saveLocal(data);
    // Debounce server sync by 2 seconds
    if (syncTimerRef.current) clearTimeout(syncTimerRef.current);
    if (userId) {
      syncTimerRef.current = setTimeout(() => syncToServer(data), 2000);
    }
  }, [data, hydrated, userId]);

  const update = useCallback((partial: Partial<AppData>) => {
    setData((prev) => ({ ...prev, ...partial }));
  }, []);

  // Tasks
  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "completed">) => {
      const newTask: Task = {
        ...task,
        id: generateId(),
        completed: false,
        createdAt: new Date().toISOString(),
      };
      setData((prev) => ({ ...prev, tasks: [newTask, ...prev.tasks] }));
    },
    []
  );

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
    }));
  }, []);

  const toggleTask = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      ),
    }));
  }, []);

  // Notes
  const addNote = useCallback(
    (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newNote: Note = {
        ...note,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      setData((prev) => ({ ...prev, notes: [newNote, ...prev.notes] }));
    },
    []
  );

  const updateNote = useCallback((id: string, updates: Partial<Note>) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.map((n) =>
        n.id === id
          ? { ...n, ...updates, updatedAt: new Date().toISOString() }
          : n
      ),
    }));
  }, []);

  const deleteNote = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id),
    }));
  }, []);

  // Timetable
  const addClass = useCallback((slot: Omit<ClassSlot, "id">) => {
    const newSlot: ClassSlot = { ...slot, id: generateId() };
    setData((prev) => ({
      ...prev,
      timetable: [...prev.timetable, newSlot],
    }));
  }, []);

  const updateClass = useCallback((id: string, updates: Partial<ClassSlot>) => {
    setData((prev) => ({
      ...prev,
      timetable: prev.timetable.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const deleteClass = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      timetable: prev.timetable.filter((c) => c.id !== id),
    }));
  }, []);

  // Courses / GPA
  const addCourse = useCallback((course: Omit<Course, "id">) => {
    const newCourse: Course = { ...course, id: generateId() };
    setData((prev) => ({
      ...prev,
      courses: [...prev.courses, newCourse],
    }));
  }, []);

  const updateCourse = useCallback((id: string, updates: Partial<Course>) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.map((c) =>
        c.id === id ? { ...c, ...updates } : c
      ),
    }));
  }, []);

  const deleteCourse = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      courses: prev.courses.filter((c) => c.id !== id),
    }));
  }, []);

  const incrementPomodoro = useCallback(() => {
    setData((prev) => ({
      ...prev,
      pomodoroSessions: prev.pomodoroSessions + 1,
    }));
  }, []);

  return {
    data,
    hydrated,
    update,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addNote,
    updateNote,
    deleteNote,
    addClass,
    updateClass,
    deleteClass,
    addCourse,
    updateCourse,
    deleteCourse,
    incrementPomodoro,
  };
}
