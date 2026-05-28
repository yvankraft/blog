import Navbar from "./components/Navbar";
import FirstSideMenu from "./home/firstSideMenu";
import { Star, Lock } from "lucide-react";
import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Navbar />
      <FirstSideMenu />
      <main className="flex-1 pt-26 p-4 max-w-3xl ">
        <h1 className="title">Infinite Scroll</h1>
      </main>
      <div className="sticky top-20 h-fit w-64 hidden md:block space-y-4 p-6  items-center ">
        <h1 className="text-2xl font-bold mb-4">Recommended</h1>
        <div>
          <p>you probably no this person.</p>
        </div>
      </div>
    </div>
  );
}
