// components/SearchContainer.tsx
"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import ResultView from "./ResultView";
import { fetchResults } from "@/lib/api";

export default function SearchContainer() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/search`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }

      const data = await response.json();
      setResult(data.results);
    } catch (error) {
      setError("Failed to fetch job listings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <SearchBar onSearch={handleSearch} />

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
        </div>
      )}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {result && <ResultView result={result} />}
    </div>
  );
}
