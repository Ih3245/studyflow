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
import { ThunderstormEffect } from "@/components/ThunderstormEffect";
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
    data, hydrated, addTask, updateTask, deleteTask, toggleTask,
    addNote, updateNote, deleteNote, addClass, deleteClass,
    addCourse, updateCourse, deleteCourse, incrementPomodoro,
  } = useAppData(authUser?.userId);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((json) => {
        if (json.user) setAuthUser(json.user);
        else router.replace("/login");
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
      <div className="app-loading">
        <div className="loading-bolt" />
        <div className="loading-text">StudyFlow</div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <ThunderstormEffect />
      <Sidebar
        active={active}
        onChange={setActive}
        userName={authUser?.name || authUser?.email}
        onLogout={handleLogout}
      />
      <main className="main-content ml-[240px] min-h-screen px-6 py-8 md:px-10 lg:px-12">
        <div className="mx-auto max-w-5xl">
          {active === "dashboard" && (
            <Dashboard data={data} onToggleTask={toggleTask} onNavigate={(t) => setActive(t as Tab)} />
          )}
          {active === "tasks" && (
            <Tasks tasks={data.tasks} onAdd={addTask} onToggle={toggleTask} onDelete={deleteTask} onUpdate={updateTask} />
          )}
          {active === "notes" && (
            <Notes notes={data.notes} onAdd={addNote} onUpdate={updateNote} onDelete={deleteNote} />
          )}
          {active === "timetable" && (
            <Timetable slots={data.timetable} onAdd={addClass} onDelete={deleteClass} onUpdate={updateClass} />
          )}
          {active === "gpa" && (
            <GPA courses={data.courses} onAdd={addCourse} onDelete={deleteCourse} onUpdate={updateCourse} />
          )}
          {active === "pomodoro" && (
            <Pomodoro sessions={data.pomodoroSessions} onComplete={incrementPomodoro} />
          )}
        </div>
      </main>
    </div>
  );
}
