// "use client";
// import Image from "next/image";
// import { useEffect, useState } from "react";

// export default function Home() {
//   const [message, setMessage] = useState("Loading...");

//   useEffect(() => {
//     fetch("http://localhost:8000/api/hello")
//       .then((res) => res.json())
//       .then((data) => setMessage(data.message))
//       .catch((err) => setMessage("Error connecting to backend"));
//   }, []);
//   return (
//     <main className="p-10">
//       <h1 className="text-2xl font-bold">{message}</h1>
//     </main>
//   );
// }

// src/app/page.tsx
"use client";

import SearchBar from "@/components/SearchBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">
          🌀 ApplyIQ Portal
        </h1>
        <p className="text-lg md:text-xl text-gray-300">
          Your gateway to answers — powered by AI.
        </p>

        <SearchBar />
      </div>
    </main>
  );
}
