import Greetings from "./Greetings";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full items-start justify-start pt-14">
      <Greetings />
      <h1>Home Page</h1>
    </div>
  );
}
