// src/app/page.tsx
"use client";

import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">
          🌀 ApplyIQ Portal
        </h1>
        <p className="text-md md:text-xl text-gray-300">
          Unlock top career opportunities – your fastest way to find your job
          match is here!
        </p>

        <SearchBar />
      </div>
    </main>
  );
}
