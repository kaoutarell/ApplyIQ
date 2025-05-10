"use client";
import { FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";

type AnswerCardProps = {
  title: string;
  description: string;
  link: string;
  image?: string; // Optional image
};

export default function AnswerCard({
  title,
  description,
  link,
  image,
}: AnswerCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition duration-300 ease-in-out border border-neutral-700"
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full h-32 object-contain mb-4 rounded"
        />
      )}

      <h3 className="text-lg font-semibold text-white mb-2 flex items-center justify-between">
        {title}
        <FaExternalLinkAlt className="text-sm text-purple-400 ml-2" />
      </h3>

      <p className="text-sm text-gray-300 line-clamp-4 flex gap-2">
        <FaInfoCircle className="mt-0.5" /> {description}
      </p>
    </a>
  );
}
