"use client";

import { useEffect, useRef, useState } from "react";

interface Bolt {
  id: number;
  x: number;
  segments: { x: number; y: number }[];
  opacity: number;
}

function generateBolt(startX: number): { x: number; y: number }[] {
  const segs: { x: number; y: number }[] = [{ x: startX, y: 0 }];
  let cx = startX;
  let cy = 0;
  const steps = 10 + Math.floor(Math.random() * 8);
  for (let i = 0; i < steps; i++) {
    cx += (Math.random() - 0.5) * 12;
    cy += (100 / steps) + Math.random() * 4;
    segs.push({ x: cx, y: cy });
  }
  return segs;
}

export function ThunderstormEffect() {
  const [bolts, setBolts] = useState<Bolt[]>([]);
  const [flashOpacity, setFlashOpacity] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [rainDrops] = useState(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 0.4 + Math.random() * 0.4,
      height: 12 + Math.random() * 18,
      opacity: 0.2 + Math.random() * 0.5,
    }))
  );
  const [activeRain, setActiveRain] = useState(false);
  const boltIdRef = useRef(0);

  const triggerStorm = () => {
    // Flash
    setFlashOpacity(0.85);
    setTimeout(() => setFlashOpacity(0.3), 60);
    setTimeout(() => setFlashOpacity(0.7), 120);
    setTimeout(() => setFlashOpacity(0), 200);

    // Shake
    setShaking(true);
    setTimeout(() => setShaking(false), 600);

    // Rain burst
    setActiveRain(true);
    setTimeout(() => setActiveRain(false), 4000);

    // Lightning bolts
    const count = 2 + Math.floor(Math.random() * 3);
    const newBolts: Bolt[] = Array.from({ length: count }, () => ({
      id: boltIdRef.current++,
      x: 10 + Math.random() * 80,
      segments: generateBolt(10 + Math.random() * 80),
      opacity: 1,
    }));
    setBolts((prev) => [...prev, ...newBolts]);
    setTimeout(() => {
      setBolts((prev) => prev.filter((b) => !newBolts.find((nb) => nb.id === b.id)));
    }, 400);
  };

  useEffect(() => {
    // Random storm every 15-45 seconds
    const scheduleNext = () => {
      const delay = 15000 + Math.random() * 30000;
      return setTimeout(() => {
        triggerStorm();
        timer.current = scheduleNext();
      }, delay);
    };
    const timer = { current: scheduleNext() };
    return () => clearTimeout(timer.current);
  }, []);

  return (
    <>
      {/* Screen flash */}
      {flashOpacity > 0 && (
        <div
          className="storm-flash"
          style={{ opacity: flashOpacity }}
          aria-hidden="true"
        />
      )}

      {/* Lightning bolts SVG */}
      {bolts.length > 0 && (
        <svg
          className="storm-svg"
          viewBox="0 0 100 110"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {bolts.map((bolt) => (
            <polyline
              key={bolt.id}
              points={bolt.segments.map((s) => `${s.x},${s.y}`).join(" ")}
              fill="none"
              stroke="white"
              strokeWidth="0.3"
              opacity={bolt.opacity}
              style={{ filter: "drop-shadow(0 0 3px #fff) drop-shadow(0 0 6px #aad4ff)" }}
            />
          ))}
        </svg>
      )}

      {/* Rain */}
      {activeRain && (
        <div className="storm-rain" aria-hidden="true">
          {rainDrops.map((drop) => (
            <div
              key={drop.id}
              className="rain-drop"
              style={{
                left: `${drop.x}%`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`,
                height: `${drop.height}px`,
                opacity: drop.opacity,
              }}
            />
          ))}
        </div>
      )}

      {/* Shake class injector */}
      {shaking && (
        <style>{`
          .main-content { animation: thunderShake 0.5s ease !important; }
          .sidebar-panel { animation: thunderShake 0.5s ease !important; }
        `}</style>
      )}
    </>
  );
}
