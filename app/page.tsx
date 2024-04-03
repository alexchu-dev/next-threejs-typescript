import Image from "next/image";
import ThreeScene from "./components/ThreeScene";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      
      <ThreeScene />
      <h1 className="title text-5xl font-bold">Hello World!</h1>
    </main>
  );
}
