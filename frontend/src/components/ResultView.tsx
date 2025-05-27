"use client";

import { useState } from "react";
import AnswerCard from "./AnswerCard";
import Badge from "./Badge";
import SalaryModal from "./SalaryModal";
import {
  CheckCircleIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  BriefcaseIcon,
  LightBulbIcon,
} from "@heroicons/react/24/solid";

type ResultViewProps = {
  result: {
    skills: string[];
    requirements: string[];
    insights: string[];
    cards: {
      title: string;
      description: string;
      link: string;
    }[];
  };
};

export default function ResultView({ result }: ResultViewProps) {
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const hasCards = result.cards?.length > 0;
  const hasInsights = result.insights?.length > 0;
  const hasSkills = result.skills?.length > 0;
  const hasRequirements = result.requirements?.length > 0;

  const cleanSkills =
    result.skills
      ?.map((skill) => skill.replace(/<[^>]+>/g, "").trim())
      .filter((skill) => skill.length > 0) || [];

  const cleanRequirements =
    result.requirements
      ?.map((req) => req.replace(/<[^>]+>/g, "").trim())
      .filter((req) => req.length > 0) || [];

  const cleanInsights =
    result.insights
      ?.map((insight) => insight.replace(/<[^>]+>/g, "").trim())
      .filter((insight) => insight.length > 0) || [];

  return (
    <div className="space-y-8 mt-8">
      {/* Insights Section */}
      {hasInsights && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <LightBulbIcon className="h-6 w-6 text-yellow-400" />
            Insights
          </h2>
          <div className="bg-gray-800 rounded-lg p-4 text-gray-200">
            <ul className="space-y-3">
              {cleanInsights.map((insight, i) => (
                <li key={`insight-${i}`} className="flex items-start gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>{insight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Skills Section */}
      {hasSkills && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-400" />
            Key Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-2">
            {cleanSkills.map((skill, i) => (
              <Badge
                key={`skill-${i}-${skill.replace(/\s+/g, "-")}`}
                text={skill}
              />
            ))}
          </div>
        </div>
      )}

      {/* Requirements Section */}
      {hasRequirements && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <AcademicCapIcon className="h-6 w-6 text-pink-400" />
            Requirements
          </h2>
          <div className="bg-gray-800 rounded-lg p-4 text-gray-200">
            <ul className="space-y-3">
              {cleanRequirements.map((req, i) => (
                <li key={`req-${i}`} className="flex items-start gap-2">
                  <AcademicCapIcon className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Job Opportunity Cards */}
      {hasCards && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <BriefcaseIcon className="h-6 w-6 text-indigo-400" />
            Job Opportunities
          </h2>
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
