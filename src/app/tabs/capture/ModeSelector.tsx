"use client";

import { useRouter } from "next/navigation";

export default function ModeSelector() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2">
      <button className="bg-blue-600 w-40 py-2 rounded-md">Camera</button>
      <button className="bg-blue-600 w-40 py-2 rounded-md">Drone</button>
      <button
        className="bg-blue-600 w-40 py-2 rounded-md"
        onClick={() => router.push("pages/import")}
      >
        Import
      </button>
    </div>
  );
}
