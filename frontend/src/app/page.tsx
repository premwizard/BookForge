import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-zinc-950">
      <header className="px-8 h-16 flex items-center justify-between border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
        <div className="flex items-center">
          <BookOpen className="h-6 w-6 text-blue-600 mr-2" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">BookForge</span>
        </div>
        <nav className="flex space-x-4">
          <Link href="/login">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-6">
          Automate Document Formatting
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mb-8">
          The enterprise-grade AI-powered SaaS platform for publishers, authors, and universities. Apply templates, validate formatting, and export instantly.
        </p>
        <div className="flex space-x-4">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8">Start for free</Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="h-12 px-8">View Dashboard</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
