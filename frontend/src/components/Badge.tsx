// components/Badge.tsx
"use client";

const colorMap = {
  green: "bg-green-700 text-green-100",
  blue: "bg-blue-700 text-blue-100",
  yellow: "bg-yellow-600 text-yellow-100",
  purple: "bg-purple-700 text-purple-100",
};

export default function Badge({
  text,
  variant = "blue",
}: {
  text: string;
  variant?: keyof typeof colorMap;
}) {
  return (
    <span
      className={`text-sm px-3 py-1 rounded-full font-medium ${colorMap[variant]} border border-opacity-30 border-white`}
    >
      {text}
    </span>
  );
}
