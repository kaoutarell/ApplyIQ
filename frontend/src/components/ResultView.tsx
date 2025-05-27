"use client";

import { useState } from "react";
import AnswerCard from "./AnswerCard";
import Badge from "./Badge";
import SalaryModal from "./SalaryModal";

type ResultViewProps = {
  result: {
    cards: {
      title: string;
      description: string;
      link: string;
    }[];
    insights: string;
    skills: string[];
    certifications: string[];
  };
};

export default function ResultView({ result }: ResultViewProps) {
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const hasCards = result.cards?.length > 0;
  const hasInsights = result.insights?.trim().length > 0;
  const hasSkills = result.skills?.length > 0;
  const hasCertifications = result.certifications?.length > 0;

  const cleanSkills =
    result.skills
      ?.map((skill) => skill.replace(/<[^>]+>/g, "").trim())
      .filter((skill) => skill.length > 0) || [];

  const cleanCertifications =
    result.certifications
      ?.map((cert) => cert.replace(/<[^>]+>/g, "").trim())
      .filter((cert) => cert.length > 0) || [];

  return (
    <div className="space-y-8 mt-8">
      {/* Insights Section */}
      {hasInsights && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Insights ✨</h2>
          <div className="bg-gray-800 rounded-lg p-4 text-gray-200">
            {result.insights}
          </div>
        </div>
      )}

      {/* Skills Section */}
      {hasSkills && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Key Skills</h2>
          <div className="flex flex-wrap gap-2">
            {cleanSkills.map((skill, i) => (
              <Badge
                key={`skill-${i}-${skill.replace(/\s+/g, "-")}`}
                text={skill}
                variant="green"
              />
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {hasCertifications && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Certifications</h2>
          <div className="flex flex-wrap gap-2">
            {cleanCertifications.map((cert, i) => (
              <Badge
                key={`cert-${i}-${cert.replace(/\s+/g, "-")}`}
                text={cert}
                variant="blue"
              />
            ))}
          </div>
        </div>
      )}

      {/* Job Opportunity Cards */}
      {hasCards && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Job Opportunities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.cards.map((card, index) => (
              <AnswerCard
                key={`card-${index}-${card.title.replace(/\s+/g, "-")}`}
                title={card.title}
                description={card.description}
                link={card.link}
              />
            ))}
          </div>
        </div>
      )}

      {/* Salary Estimation Button - Centered and full width on mobile */}
      <div className="flex justify-center mb-10">
        <button
          onClick={() => setShowSalaryModal(true)}
          className="w-full md:w-auto border-2 border-purple-600 bg-transparent hover:bg-purple-700 text-purple-600 hover:text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Estimate Salary for These Skills
        </button>
      </div>

      {/* Salary Modal */}
      {showSalaryModal && (
        <SalaryModal
          skills={cleanSkills}
          onClose={() => setShowSalaryModal(false)}
        />
      )}
    </div>
  );
}
