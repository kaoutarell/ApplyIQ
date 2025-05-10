// src/components/SearchBar.tsx
"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch?: (query: string) => void;
}) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
    console.log("Searching for:", query);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          type="text"
          placeholder="Search AI answers..."
          className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <div className="absolute left-4 top-3.5 text-gray-400">🔍</div>
      </div>
    </form>
  );
}
