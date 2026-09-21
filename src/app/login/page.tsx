"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

// Autumn leaf SVG shapes
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
      <svg
        width={leaf.size}
        height={leaf.size}
        viewBox="0 0 25 28"
        fill={leaf.color}
        style={{ filter: `drop-shadow(0 2px 4px ${leaf.color}66)` }}
      >
        <path d={leaf.shape} />
        <line
          x1="10" y1="0" x2="10" y2="28"
          stroke={leaf.color}
          strokeWidth="0.8"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

interface FormState {
  email: string;
  password: string;
  name: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState<FormState>({ email: "", password: "", name: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaves] = useState(() => generateLeaves(35));
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 3D tilt effect on mouse move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError("");
  };

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
      if (!res.ok) {
        setError(json.error || "কিছু একটা হয়েছে। আবার চেষ্টা করুন।");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Network error. Connection check করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="autumn-bg">
      {/* Animated sky gradient overlay */}
      <div className="autumn-sky" />

      {/* Falling leaves */}
      <div className="leaves-container" aria-hidden="true">
        {leaves.map((leaf) => (
          <FallingLeaf key={leaf.id} leaf={leaf} />
        ))}
      </div>

      {/* Ground mist */}
      <div className="ground-mist" />

      {/* Main card */}
      <div className="login-scene" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <div
          ref={cardRef}
          className="login-card"
          style={{
            transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          }}
        >
          {/* Glowing orbs inside card */}
          <div className="card-orb card-orb-1" />
          <div className="card-orb card-orb-2" />

          {/* Header */}
          <div className="card-header">
            <div className="logo-icon">🍁</div>
            <h1 className="app-title">StudyFlow</h1>
            <p className="app-subtitle">
              {isRegister ? "নতুন account তৈরি করুন" : "আপনার account-এ প্রবেশ করুন"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {isRegister && (
              <div className="field-group">
                <label className="field-label">আপনার নাম</label>
                <div className="field-wrapper">
                  <span className="field-icon">👤</span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="auth-input"
                    autoComplete="name"
                  />
                </div>
              </div>
            )}

            <div className="field-group">
              <label className="field-label">Email Address</label>
              <div className="field-wrapper">
                <span className="field-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className="auth-input"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <span className="field-icon">🔐</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  className="auth-input"
                  required
                  autoComplete={isRegister ? "new-password" : "current-password"}
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="error-box">
                <span>⚠️</span> {error}
              </div>
            )}

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner" />
                  {isRegister ? "তৈরি হচ্ছে..." : "প্রবেশ হচ্ছে..."}
                </span>
              ) : (
                <>
                  {isRegister ? "🍂 Account তৈরি করুন" : "🍁 প্রবেশ করুন"}
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="toggle-section">
            <span className="toggle-text">
              {isRegister ? "আগেই account আছে?" : "নতুন student?"}
            </span>
            <button
              type="button"
              className="toggle-btn"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setForm({ email: "", password: "", name: "" });
              }}
            >
              {isRegister ? "Login করুন →" : "Register করুন →"}
            </button>
          </div>

          {/* Decorative footer */}
          <div className="card-footer">
            <span>🍂</span>
            <span className="footer-text">Your data is safe & secure</span>
            <span>🍂</span>
          </div>
        </div>
      </div>
    </div>
  );
}
