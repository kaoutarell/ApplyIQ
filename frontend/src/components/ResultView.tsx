// components/ResultView.tsx
"use client";

import AnswerCard from "./AnswerCard";
import ThinkText from "./ThinkText";
import Badge from "./Badge";

type ResultViewProps = {
  result: {
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
};

export default function ResultView({ result }: ResultViewProps) {
  return (
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
      {/* {result.assistant_text && (
        <div className="mt-8 bg-neutral-800 border border-neutral-700 rounded-lg p-6 text-left">
          <h2 className="text-xl text-white font-semibold mb-4">Summary</h2>
          <p className="text-neutral-300 whitespace-pre-wrap">
            {result.assistant_text}
          </p>
        </div>
      )} */}
    </div>
  );
}
