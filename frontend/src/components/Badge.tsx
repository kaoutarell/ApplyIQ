"use client";

const purplePinkShades = [
  "bg-purple-700 text-purple-100",
  "bg-purple-600 text-purple-100",
  "bg-pink-600 text-pink-100",
  "bg-pink-500 text-pink-100",
  "bg-fuchsia-600 text-fuchsia-100",
  "bg-rose-600 text-rose-100",
  "bg-indigo-600 text-indigo-100",
];

function getRandomColorClass() {
  const index = Math.floor(Math.random() * purplePinkShades.length);
  return purplePinkShades[index];
}

export default function Badge({ text }: { text: string }) {
  const colorClass = getRandomColorClass();

  return (
    <span
      className={`text-sm px-3 py-1 rounded-full font-medium ${colorClass} border border-opacity-30 border-white`}
    >
      {text}
    </span>
  );
}
