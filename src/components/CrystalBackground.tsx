"use client";

import { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function CrystalBackground() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generated: Particle[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 8 + 6,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Gradient orbs */}
      <div
        className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,140,0,0.08) 0%, transparent 70%)",
          animation: "refract 20s ease-in-out infinite",
        }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,179,71,0.06) 0%, transparent 70%)",
          animation: "refract 25s ease-in-out infinite reverse",
        }}
      />
      <div
        className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,140,0,0.04) 0%, transparent 70%)",
          animation: "refract 18s ease-in-out infinite",
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: p.id % 3 === 0 ? "50%" : "1px",
            transform: p.id % 3 !== 0 ? "rotate(45deg)" : undefined,
            background:
              p.id % 2 === 0
                ? `rgba(255, 179, 71, ${p.opacity})`
                : `rgba(255, 140, 0, ${p.opacity})`,
            animation: `float-slow ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Crystal refraction lines */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]">
        <line x1="10%" y1="20%" x2="90%" y2="80%" stroke="#FFB347" strokeWidth="0.5" />
        <line x1="80%" y1="10%" x2="20%" y2="90%" stroke="#FF8C00" strokeWidth="0.5" />
        <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="#FFB347" strokeWidth="0.3" />
        <line x1="0%" y1="50%" x2="100%" y2="50%" stroke="#FF8C00" strokeWidth="0.3" />
      </svg>
    </div>
  );
}
