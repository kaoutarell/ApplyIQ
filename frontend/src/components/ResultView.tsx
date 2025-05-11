import AnswerCard from "@/components/AnswerCard";
import ThinkText from "@/components/ThinkText";
import Badge from "@/components/Badge";

type ResultProps = {
  thinkText: string;
  assistantText: string;
  citationCards: { title: string; description: string; link: string }[];
  skills: string[];
  certifications: string[];
};

export default function ResultView({
  thinkText,
  assistantText,
  citationCards,
  skills,
  certifications,
}: ResultProps) {
  return (
    <div className="space-y-6">
      {/* 1. ThinkText block */}
      {thinkText && <ThinkText content={thinkText} />}

      {/* 2. Job Opportunity Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {citationCards.map((card, index) => (
          <AnswerCard
            key={index}
            title={card.title}
            description={card.description}
            link={card.link}
          />
        ))}
      </div>

      {/* 3. Skills and Certifications */}
      <div>
        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          Skills Required
        </h2>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <Badge key={i} text={skill} variant="green" />
          ))}
        </div>

        <h2 className="text-xl text-white font-semibold mt-6 mb-2">
          Certifications & Education
        </h2>
        <div className="flex flex-wrap gap-2">
          {certifications.map((cert, i) => (
            <Badge key={i} text={cert} variant="blue" />
          ))}
        </div>
      </div>
    </div>
  );
}
