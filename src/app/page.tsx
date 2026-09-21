"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar, type Tab } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { Tasks } from "@/components/Tasks";
import { Notes } from "@/components/Notes";
import { Timetable } from "@/components/Timetable";
import { GPA } from "@/components/GPA";
import { Pomodoro } from "@/components/Pomodoro";
import { useAppData } from "@/hooks/useAppData";

interface AuthUser {
  userId: string;
  email: string;
  name?: string;
}

export default function Home() {
  const router = useRouter();
  const [active, setActive] = useState<Tab>("dashboard");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const {
    data,
    hydrated,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    addNote,
    updateNote,
    deleteNote,
    addClass,
    deleteClass,
    addCourse,
    updateCourse,
    deleteCourse,
    incrementPomodoro,
  } = useAppData(authUser?.userId);

  // Check auth on mount
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        if (json.user) {
          setAuthUser(json.user);
        } else {
          router.replace("/login");
        }
      })
      .catch(() => router.replace("/login"))
      .finally(() => setAuthChecked(true));
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  if (!authChecked || !hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="text-4xl animate-bounce">🍁</div>
          <div className="h-1.5 w-24 rounded-full bg-amber-200/30 overflow-hidden">
            <div className="h-full w-1/2 rounded-full bg-amber-500/60 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar active={active} onChange={setActive} />

      {/* User info + logout button */}
      <div className="fixed top-0 right-0 z-50 flex items-center gap-3 px-4 py-3">
        {authUser?.name && (
          <span className="text-sm text-muted hidden sm:block">
            👋 {authUser.name}
          </span>
        )}
        <button
          onClick={handleLogout}
          className="text-xs px-3 py-1.5 rounded-lg border border-card-border bg-card text-muted hover:text-foreground hover:border-foreground/30 transition-all"
        >
          Logout
        </button>
      </div>

      <main className="ml-[240px] min-h-screen px-6 py-8 md:px-10 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {active === "dashboard" && (
            <Dashboard
              data={data}
              onToggleTask={toggleTask}
              onNavigate={(t) => setActive(t as Tab)}
            />
          )}
          {active === "tasks" && (
            <Tasks
              tasks={data.tasks}
              onAdd={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
              onUpdate={updateTask}
            />
          )}
          {active === "notes" && (
            <Notes
              notes={data.notes}
              onAdd={addNote}
              onUpdate={updateNote}
              onDelete={deleteNote}
            />
          )}
          {active === "timetable" && (
            <Timetable
              slots={data.timetable}
              onAdd={addClass}
              onDelete={deleteClass}
            />
          )}
          {active === "gpa" && (
            <GPA
              courses={data.courses}
              onAdd={addCourse}
              onDelete={deleteCourse}
              onUpdate={updateCourse}
            />
          )}
          {active === "pomodoro" && (
            <Pomodoro
              sessions={data.pomodoroSessions}
              onComplete={incrementPomodoro}
            />
          )}
        </div>
      </main>
    </div>
  );
}
