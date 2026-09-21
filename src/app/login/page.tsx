"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

const LEAF_SHAPES = [
  "M10,0 Q20,5 15,15 Q10,25 5,15 Q0,5 10,0Z",
  "M8,0 Q18,8 12,18 Q6,28 0,18 Q-2,8 8,0Z",
  "M12,0 C20,4 22,14 15,20 C8,26 0,20 2,12 C4,4 12,0 12,0Z",
  "M10,2 Q18,0 20,10 Q22,20 12,22 Q2,24 0,14 Q-2,4 10,2Z",
  "M15,0 Q25,5 22,15 Q19,25 10,25 Q1,25 0,15 Q-1,5 15,0Z",
];

interface Leaf {
  id: number;
  x: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
  shape: string;
  rotation: number;
  swing: number;
}

function generateLeaves(count: number): Leaf[] {
  const colors = [
    "#D2691E", "#CD853F", "#A0522D", "#8B4513",
    "#DAA520", "#B8860B", "#FF8C00", "#FF6347",
    "#DC143C", "#C0392B", "#E67E22", "#F39C12",
    "#795548", "#6D4C41", "#BF360C", "#E64A19",
  ];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    size: 12 + Math.random() * 28,
    delay: Math.random() * 15,
    duration: 8 + Math.random() * 14,
    color: colors[Math.floor(Math.random() * colors.length)],
    shape: LEAF_SHAPES[Math.floor(Math.random() * LEAF_SHAPES.length)],
    rotation: Math.random() * 360,
    swing: 40 + Math.random() * 80,
  }));
}

const leaves = generateLeaves(35);

function FallingLeaf({ leaf }: { leaf: Leaf }) {
  return (
    <div
      className="falling-leaf"
      style={{
        left: `${leaf.x}%`,
        animationDuration: `${leaf.duration}s`,
        animationDelay: `${leaf.delay}s`,
        "--swing": `${leaf.swing}px`,
        "--rot-start": `${leaf.rotation}deg`,
        "--rot-end": `${leaf.rotation + 360}deg`,
      } as React.CSSProperties}
    >
      <svg width={leaf.size} height={leaf.size} viewBox="0 0 25 28" fill={leaf.color}>
        <path d={leaf.shape} />
        <line x1="10" y1="0" x2="10" y2="28" stroke={leaf.color} strokeWidth="0.8" opacity="0.5" />
      </svg>
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
    const body = isRegister
      ? { email: form.email, password: form.password, name: form.name }
      : { email: form.email, password: form.password };
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) setError(json.error || "Something went wrong. Please try again.");
      else { router.push("/"); router.refresh(); }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="autumn-bg">
      <div className="autumn-sky" />
      <div className="leaves-container" aria-hidden="true">
        {leaves.map((leaf) => <FallingLeaf key={leaf.id} leaf={leaf} />)}
      </div>
      <div className="ground-mist" />

      <div className="login-scene" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div
          ref={cardRef}
          className="login-card"
          style={{ transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
        >
          <div className="card-orb card-orb-1" />
          <div className="card-orb card-orb-2" />

          <div className="card-header">
            <div className="logo-mark">SF</div>
            <h1 className="app-title">StudyFlow</h1>
            <p className="app-subtitle">
              {isRegister ? "Create your student account" : "Sign in to your account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="field-group">
                <label className="field-label">Full Name</label>
                <div className="field-wrapper">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your name"
                    value={form.name}
                    onChange={(e) => { setForm(f => ({ ...f, name: e.target.value })); setError(""); }}
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrapper">
                <input
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={(e) => { setForm(f => ({ ...f, email: e.target.value })); setError(""); }}
                  className="auth-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <input
                  type="password"
                  name="password"
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  onChange={(e) => { setForm(f => ({ ...f, password: e.target.value })); setError(""); }}
                  className="auth-input"
                  required
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={6}
                />
              </div>
            </div>

            {error && <div className="error-box">{error}</div>}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  {isRegister ? "Creating account..." : "Signing in..."}
                </span>
              ) : isRegister ? "Create Account" : "Sign In"}
            </button>
          </form>

          <div className="toggle-section">
            <span className="toggle-text">
              {isRegister ? "Already have an account?" : "New student?"}
            </span>
            <button
              type="button"
              className="toggle-btn"
              onClick={() => { setIsRegister(!isRegister); setError(""); setForm({ email: "", password: "", name: "" }); }}
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>

          <div className="card-footer">
            <span className="footer-text">Your data is safe and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
}
