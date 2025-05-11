"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ResultView from "@/components/ResultView";
import { fetchResults } from "@/lib/api";

export default function SearchResultContainer() {
  const [result, setResult] = useState<{
    think_text: string;
    assistant_text: string;
    citation_cards: { title: string; description: string; link: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchResults(query); // Fetching results from the API
      setResult(response);
    } catch (error) {
      setError("Failed to fetch results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <ResultView
          thinkText={result.think_text}
          assistantText={result.assistant_text}
          citationCards={result.citation_cards}
        />
      )}
    </div>
  );
}
