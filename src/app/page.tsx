"use client";

import NavigationsTab from "../app/infrastructure/navigation/NavigationsTab";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <NavigationsTab classname="absolute bottom-0" />
    </div>
  );
}
