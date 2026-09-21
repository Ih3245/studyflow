export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: Priority;
  dueDate?: string;
  createdAt: string;
  subject?: string;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  color?: string;
}

export interface ClassSlot {
  id: string;
  subject: string;
  day: number; // 0 = Sunday, 1 = Monday ... 6 = Saturday
  startTime: string; // "09:00"
  endTime: string;
  room?: string;
  instructor?: string;
  color: string;
}

export interface Course {
  id: string;
  name: string;
  credit: number;
  grade: string; // A+, A, A-, B+, ... F
}

export interface AppData {
  tasks: Task[];
  notes: Note[];
  timetable: ClassSlot[];
  courses: Course[];
  pomodoroSessions: number;
  lastUpdated: string;
}

export const GRADE_POINTS: Record<string, number> = {
  "A+": 4.0,
  A: 4.0,
  "A-": 3.7,
  "B+": 3.3,
  B: 3.0,
  "B-": 2.7,
  "C+": 2.3,
  C: 2.0,
  "C-": 1.7,
  "D+": 1.3,
  D: 1.0,
  F: 0.0,
};

export const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const FULL_DAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const SUBJECT_COLORS = [
  "#2d6a4f",
  "#1d3557",
  "#9b2226",
  "#bc6c25",
  "#5e548e",
  "#0077b6",
  "#6a994e",
  "#ae2012",
];
