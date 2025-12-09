'use client';

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import Image from 'next/image';

export function LandingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Epoch Logo"
            width={32}
            height={32}
            className="object-contain"
          />
          <span className="font-bold text-lg text-gray-900">Epoch ChessLabs</span>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Features
          </a>
          <a href="#cta" className="text-sm text-gray-600 hover:text-gray-900 transition">
            Get Started
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <SignInButton mode="modal">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition cursor-pointer">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 transition cursor-pointer">
              Get Started
            </button>
          </SignUpButton>
        </div>
      </div>
    </header>
  );
}
