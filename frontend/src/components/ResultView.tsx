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
    <div className="space-y-8 mt-8">
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

      {/* ThinkText component */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Insights ✨</h2>
        {result.think_text && <ThinkText content={result.think_text} />}
      </div>

      {/* Skills and Certifications */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Skills Required</h2>
        <div className="flex flex-wrap gap-2 justify-center">
          {result.skills.length > 0 ? (
            result.skills.map((skill, i) => (
              <Badge key={`skill-${i}`} text={skill} variant="green" />
            ))
          ) : (
            <Badge text="No skills specified" variant="yellow" />
          )}
        </div>
      </div>

      {/* Assistant Text */}
      {result.assistant_text && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            Requirements and responsabilities
          </h2>
          <ThinkText content={result.assistant_text} />
        </div>
      )}
    </div>
  );
}
