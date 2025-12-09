"use client";

import { useState, useEffect } from "react";
import { SignUpButton } from "@clerk/nextjs";
import { Canvas } from "@react-three/fiber";
import { ChessModel } from "@/components/3d/ChessModel";

export function LandingContent() {
    const [scrollX, setScrollX] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollX(window.scrollY);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const features = [
        {
            title: "Study Lines",
            description: "Explore curated opening variations with strategies from top players.",
        },
        {
            title: "Practice & Train",
            description: "Get real-time feedback on your moves with adaptive difficulty.",
        },
        {
            title: "Track Progress",
            description: "Monitor your improvement with detailed stats and analytics.",
        },
    ];

    return (
        <section id="features" className="py-16 md:py-24 bg-gray-50 relative overflow-hidden">
            {/* Unified 3D Background */}
            <div className="absolute inset-0 pointer-events-none">
                <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[10, 10, 5]} intensity={1} />
                    <directionalLight position={[-10, -10, -5]} intensity={0.3} />
                    <pointLight position={[0, 5, 0]} intensity={0.5} />

                    {/* Top Right - Pawn (Features) - moves down and rotates on scroll */}
                    <ChessModel
                        modelPath="/models/chess_pawn.obj"
                        position={[9 - scrollX * 0.003, 1 - scrollX * 0.002, -2]}
                        rotation={[0.5, -0.5, 0]}
                        shouldRotate={true}
                        centerPivot={true}
                        scale={0.7}
                        scrollX={scrollX}
                    />

                    {/* Bottom Left - Bishop - moves up and rotates on scroll */}
                    <ChessModel
                        modelPath="/models/chess_bishop.obj"
                        position={[-7 + scrollX * 0.003, -1 + scrollX * 0.002, 0]}
                        rotation={[0, 0.5, 0]}
                        shouldRotate={true}
                        centerPivot={true}
                        scale={0.8}
                        scrollX={scrollX}
                    />
                </Canvas>
            </div>

            <div className="container mx-auto max-w-7xl px-4 relative z-10 space-y-20">
                {/* Features Section */}
                <div className="space-y-10">
                    <div className="text-center space-y-3">
                        <h2 className="text-4xl md:text-5xl font-bold text-balance text-gray-900">Core Features</h2>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            Everything you need to improve your openings.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {features.map((feature) => (
                            <div
                                key={feature.title}
                                className="p-6 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-12 md:p-16 text-center space-y-6 shadow-sm">
                        <h2 className="text-4xl md:text-5xl font-bold leading-tight text-balance text-gray-900">
                            Start Your Chess Journey
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Join players improving their opening repertoire every day.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <SignUpButton mode="modal">
                                <button className="px-6 py-3 text-base font-semibold text-white bg-slate-800 hover:bg-slate-700 transition">
                                    Start Free Trial
                                </button>
                            </SignUpButton>
                            <a
                                href="#features"
                                className="px-6 py-3 text-base font-semibold text-gray-900 bg-transparent border border-gray-300 hover:bg-gray-50 transition"
                            >
                                Learn More
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
