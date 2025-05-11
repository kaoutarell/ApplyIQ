// components/ThinkText.tsx
"use client";

export default function ThinkText({ content }: { content: string }) {
  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-4 mb-4 text-left">
      <p className="text-neutral-300 whitespace-pre-wrap leading-relaxed">
        {content}
      </p>
    </div>
  );
}
