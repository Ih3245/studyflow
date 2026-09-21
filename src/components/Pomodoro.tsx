"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  sessions: number;
  onComplete: () => void;
}

type Mode = "focus" | "short" | "long";

const DURATIONS: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

export function Pomodoro({ sessions, onComplete }: Props) {
  const [mode, setMode] = useState<Mode>("focus");
  const [secondsLeft, setSecondsLeft] = useState(DURATIONS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const reset = useCallback((m: Mode = mode) => {
    setIsRunning(false);
    setSecondsLeft(DURATIONS[m]);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, [mode]);

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsRunning(false);
          if (mode === "focus") onComplete();
          // subtle notification
          if (typeof window !== "undefined" && "Notification" in window) {
            if (Notification.permission === "granted") {
              new Notification(
                mode === "focus" ? "Focus session complete!" : "Break over!",
                { body: mode === "focus" ? "Time for a short break." : "Ready to focus again?" }
              );
            }
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode, onComplete]);

  const switchMode = (m: Mode) => {
    setMode(m);
    reset(m);
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress =
    ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;

  const requestNotif = () => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  return (
    <div className="mx-auto max-w-md space-y-8">
      <header className="text-center">
        <h2 className="text-2xl font-semibold tracking-tight">Focus Timer</h2>
        <p className="mt-1 text-sm text-muted">
          Classic Pomodoro — 25 min focus, then rest
        </p>
      </header>

      {/* Mode tabs */}
      <div className="flex justify-center gap-2">
        {(
          [
            { id: "focus", label: "Focus" },
            { id: "short", label: "Short Break" },
            { id: "long", label: "Long Break" },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            onClick={() => switchMode(m.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition",
              mode === m.id
                ? "bg-accent text-white"
                : "bg-card border border-card-border text-muted hover:text-foreground"
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Timer circle */}
      <div className="relative mx-auto flex h-64 w-64 items-center justify-center">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--card-border)"
            strokeWidth="3"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="text-center">
          <p className="font-mono text-5xl font-semibold tracking-tighter tabular-nums">
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-muted">
            {mode === "focus" ? "Focus" : "Break"}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-card text-muted hover:text-foreground"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </button>
        <button
          onClick={() => {
            requestNotif();
            setIsRunning((r) => !r);
          }}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white shadow-lg hover:bg-accent-hover"
        >
          {isRunning ? (
            <Pause className="h-7 w-7" />
          ) : (
            <Play className="h-7 w-7 ml-0.5" />
          )}
        </button>
        <button
          onClick={() => switchMode(mode === "focus" ? "short" : "focus")}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-card-border bg-card text-muted hover:text-foreground"
          title="Switch"
        >
          <Coffee className="h-5 w-5" />
        </button>
      </div>

      {/* Stats */}
      <div className="rounded-2xl border border-card-border bg-card p-5 text-center shadow-sm">
        <p className="text-xs font-medium text-muted">Total focus sessions</p>
        <p className="mt-1 text-3xl font-semibold text-accent">{sessions}</p>
        <p className="mt-1 text-xs text-muted">
          ≈ {Math.round((sessions * 25) / 60)} hours of deep work
        </p>
      </div>
    </div>
  );
}
