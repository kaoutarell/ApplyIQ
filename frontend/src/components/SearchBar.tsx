// components/SearchBar.tsx
"use client";

import { useState } from "react";
import AnswerCard from "./AnswerCard";
import ThinkText from "./ThinkText";
import Badge from "./Badge";

type Result = {
  cards: {
    title: string;
    description: string;
    link: string;
  }[];
  assistant_text: string;
  think_text: string;
  skills: string[];
  certifications: string[];
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<Result | null>(null);
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
      setResult(data.results);
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

      {loading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
        </div>
      )}

      {error && <p className="text-center text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="space-y-6 mt-8">
          {/* ThinkText component */}
          {result.think_text && <ThinkText content={result.think_text} />}

          {/* Job Opportunity Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.cards.map((card, index) => (
              <AnswerCard
                key={index}
                title={card.title}
                description={card.description}
                link={card.link}
              />
            ))}
          </div>

          {/* Skills and Certifications */}
          <div className="mt-8">
            <h2 className="text-xl text-white font-semibold mb-4">
              Skills Required
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.skills.map((skill, i) => (
                <Badge key={`skill-${i}`} text={skill} variant="green" />
              ))}
            </div>

            <h2 className="text-xl text-white font-semibold mt-6 mb-4">
              Certifications & Education
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.certifications.map((cert, i) => (
                <Badge key={`cert-${i}`} text={cert} variant="blue" />
              ))}
            </div>
          </div>

          {/* Assistant Text */}
          {result.assistant_text && (
            <div className="mt-8 bg-neutral-800 border border-neutral-700 rounded-lg p-6">
              <h2 className="text-xl text-white font-semibold mb-4">Summary</h2>
              <p className="text-neutral-300 whitespace-pre-wrap">
                {result.assistant_text}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
