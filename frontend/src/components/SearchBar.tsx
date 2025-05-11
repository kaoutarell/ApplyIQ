"use client";

import { useState } from "react";
import AnswerCard from "./AnswerCard";

type Result = {
  title: string;
  link: string;
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  //   const [results, setResults] = useState<Result[]>([]);
  const [results, setResults] = useState<
    { title: string; description: string; link: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

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
        throw new Error("Failed to fetch results from backend");
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      setError("Failed to fetch job listings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="The more specific, the more results you'll get ... "
            className="w-full rounded-full border border-neutral-700 bg-neutral-900 px-5 py-3 pl-12 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute left-4 top-3.5 text-gray-400">🔍</div>
        </div>
      </form>

      {/* {loading && <p className="text-center text-gray-500 mt-4">Loading...</p>} -- refactored */}
      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
          <p className="text-sm md:text-l text-gray-300">
            Please hang on, we're scanning the web for you. This might take few
            minutes ...
          </p>
        </div>
      )}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {results.map((result, index) => (
          //   <AnswerCard key={index} title={result.title} link={result.link} />
          <AnswerCard
            key={index}
            title={result.title}
            description={result.description}
            link={result.link}
          />
        ))}
      </div>
    </div>
  );
}
