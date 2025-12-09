"use client";

import { SignUpButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ChessModel } from "@/components/3d/ChessModel";

function Scene({ scrollX }: { scrollX: number }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.3} />
      <pointLight position={[0, 5, 0]} intensity={0.5} />

      {/* Chess Models - Vertical layout */}
      <ChessModel
        modelPath="/models/chess_knight-gpt.obj"
        position={[6.5, 0, 1]}
        scrollX={scrollX}
        shouldRotate={true}
        centerPivot={true}
      />
      <ChessModel
        modelPath="/models/chess_rook.obj"
        position={[-6.5, 1.5, 1.5]}
        scrollX={scrollX}
        shouldRotate={true}
        centerPivot={true}
      />
    </>
  );
}

export function LandingHero() {
  const [mounted, setMounted] = useState(false);
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrollX(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Chessboard background */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to bottom, black 70%, transparent 100%)",
          maskComposite: "intersect",
          WebkitMaskComposite: "source-in",
        }}
      >
        <svg className="w-full h-full" viewBox="0 0 1200 400" preserveAspectRatio="none">
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 24 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 70}
                y={row * 50}
                width={70}
                height={50}
                fill={(row + col) % 2 === 0 ? "#000" : "none"}
              />
            )),
          )}
        </svg>
      </div>

      {/* 3D Chess Models Canvas */}
      <div className="absolute inset-0 pointer-events-none">
        {mounted && (
          <Canvas
            camera={{ position: [0, 0, 10], fov: 50 }}
            style={{ background: "transparent" }}
          >
            <Scene scrollX={scrollX} />
          </Canvas>
        )}
      </div>

      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-gray-300 to-gray-600 rounded-full blur-3xl opacity-20" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-gray-300 to-gray-500 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto max-w-7xl px-4 relative z-10 py-16">
        <div className="space-y-12">
          <div className="space-y-6 max-w-3xl mx-auto text-center">
            <h1
              className={`text-5xl md:text-7xl font-bold leading-tight text-balance text-gray-900 transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              Master Chess Openings
            </h1>
            <p
              className={`text-xl md:text-2xl text-gray-600 leading-relaxed transition-all duration-1000 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              Study strategic lines, analyze positions, and practice your openings with interactive tools designed for
              serious players.
            </p>
            <div
              className={`flex flex-col sm:flex-row gap-4 pt-8 justify-center transition-all duration-1000 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
            >
              <SignUpButton mode="modal">
                <button className="px-8 py-4 text-lg font-semibold text-white bg-slate-800 hover:bg-slate-700 transition shadow-lg hover:shadow-xl">
                  Start Free
                </button>
              </SignUpButton>
              <a
                href="#features"
                className="px-8 py-4 text-lg font-semibold text-gray-900 bg-transparent border-2 border-gray-300 hover:bg-gray-50 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent z-20 pointer-events-none" />
    </section>
  );
}
