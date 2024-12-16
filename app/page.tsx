import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Sparkles } from "lucide-react";

export default async function Home() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-65px)] p-4 sm:p-0">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight md:text-6xl">
            Snap<span className="text-primary">Quiz</span>
          </h1>
          <Sparkles className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
        </div>
        <p className="max-w-[42rem] text-sm leading-normal text-muted-foreground sm:text-xl sm:leading-8 px-4">
          Challenge yourself with interactive quizzes. Learn, test your knowledge, and track your progress.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0">
          <Link href="/sign-up">
            <Button size="lg" className="gap-2 text-base">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="text-base">
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
