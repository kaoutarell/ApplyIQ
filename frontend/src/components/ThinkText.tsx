"use client";

import React from "react";

export default function ThinkText({ content }: { content: string }) {
  const cleanSentence = (sentence: string) => {
    // Remove citations like [1][2][3]
    sentence = sentence.replace(/\[\d+\]/g, "");

    // Replace **word** with <i>word</i>
    sentence = sentence.replace(/\*\*(.*?)\*\*/g, "<i>$1</i>");

    // Replace *word* with <i>word</i> (if not already done)
    sentence = sentence.replace(/\*(.*?)\*/g, "<i>$1</i>");

    // Remove any remaining markdown symbols
    sentence = sentence.replace(/^#+\s*/, "").trim();

    return sentence;
  };

  const formatParagraph = (paragraph: string) => {
    // Split into sentences (roughly by period followed by space or newline)
    const sentences = paragraph.split(/(?<=\.)\s+/);

    return sentences.map((sentence, i) => {
      const cleaned = cleanSentence(sentence);

      // Skip empty sentences
      if (!cleaned.trim()) return null;

      return (
        <span
          key={`sentence-${i}`}
          dangerouslySetInnerHTML={{ __html: cleaned }}
        />
      );
    });
  };

  const removeThinkSection = (text: string) => {
    // Alternative to /s flag - match across multiple lines
    const thinkTagStart = text.indexOf("<think>");
    if (thinkTagStart === -1) return text;

    const thinkTagEnd = text.indexOf("</think>");
    if (thinkTagEnd === -1) return text;

    return text.substring(0, thinkTagStart) + text.substring(thinkTagEnd + 8);
  };

  const renderContent = () => {
    // First remove <think> section if present
    content = removeThinkSection(content);

    // Split into paragraphs by double newlines
    const paragraphs = content.split(/\n\s*\n/);

    return paragraphs.map((paragraph, pIndex) => {
      paragraph = paragraph.trim();
      if (!paragraph) return null;

      // Handle headings
      if (paragraph.startsWith("## ")) {
        return (
          <h2
            key={`h2-${pIndex}`}
            className="text-xl font-bold text-white mt-6 mb-3"
          >
            {paragraph.replace("## ", "")}
          </h2>
        );
      }

      // Handle lists
      if (paragraph.startsWith("- ")) {
        const listItems = paragraph
          .split("\n")
          .filter((line) => line.startsWith("- "));
        return (
          <ul key={`ul-${pIndex}`} className="list-disc pl-5 mb-4">
            {listItems.map((item, i) => (
              <li key={`li-${pIndex}-${i}`} className="text-neutral-300 mb-1">
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanSentence(item.substring(2)),
                  }}
                />
              </li>
            ))}
          </ul>
        );
      }

      // Regular paragraph
      return (
        <p
          key={`p-${pIndex}`}
          className="text-neutral-300 mb-3 leading-relaxed"
        >
          {formatParagraph(paragraph)}
          {pIndex < paragraphs.length - 1 && <br />}
        </p>
      );
    });
  };

  return (
    <div className="bg-neutral-800 border border-neutral-700 rounded-lg p-6 text-left">
      <div className="space-y-4">{renderContent()}</div>
    </div>
  );
}
