import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import ResultsCard from "@/components/statistics/results-card";
import AccuracyCard from "@/components/statistics/accuracy-card";
import TimeTakenCard from "@/components/statistics/time-taken-card";
import QuestionsList from "@/components/statistics/questions-list";
import { auth } from "@clerk/nextjs/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type PageProps = {
  params: Promise<{
    gameId: string;
  }>;
};

const Statistics = async ({ params }: PageProps) => {
  const { userId } = await auth();
  if (!userId) {
    return redirect("/");
  }

  const { gameId } = await params;

  const game = await prisma.game.findUnique({
    where: { id: gameId },
    include: { questions: true },
  });
  if (!game) {
    return redirect("/");
  }

  let accuracy: number = 0;

  if (game.gameType === "mcq") {
    const totalCorrect = game.questions.reduce((acc, question) => {
      if (question.isCorrect) {
        return acc + 1;
      }
      return acc;
    }, 0);

    accuracy = (totalCorrect / game.questions.length) * 100;
  } else if (game.gameType === "open_ended") {
    const totalPercentage = game.questions.reduce((acc, question) => {
      return acc + (question.percentageCorrect ?? 0);
    }, 0);

    accuracy = totalPercentage / game.questions.length;
  }

  accuracy = Math.round(accuracy * 100) / 100;

  return (
    <section className="min-h-screen py-10">
      <div className="container px-4 mx-auto max-w-7xl">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold mb-2">
            Statistics for{" "}
            <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}:{" "}
              {game.topic}
            </span>
          </h1>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              className:
                "hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-sm",
            })}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        <Card className="mb-8">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                  Game Summary
                </CardTitle>
                <CardDescription className="text-sm">
                  Review your performance for the{" "}
                  {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}{" "}
                  quiz
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="grid gap-8 mt-4 md:grid-cols-3">
              <ResultsCard accuracy={accuracy} />
              <AccuracyCard accuracy={accuracy} />
              <TimeTakenCard
                timeEnded={new Date(game.timeEnded ?? 0)}
                timeStarted={new Date(game.timeStarted ?? 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-0">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
                Question Review
              </CardTitle>
              <CardDescription className="text-sm">
                Analyze your responses and learn from your mistakes
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <QuestionsList questions={game.questions} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Statistics;