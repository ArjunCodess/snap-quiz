"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Game, Question } from "@prisma/client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import { differenceInSeconds } from "date-fns";
import Link from "next/link";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import { cn, formatTimeDelta } from "@/lib/utils";
import MCQCounter from "./mcq-counter";
import { useGameMutations } from "@/hooks/use-game-mutations";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "./ui/separator";

type MCQProps = {
  game: Game & { questions: Pick<Question, "id" | "options" | "question">[] };
};

const MCQ = ({ game }: MCQProps) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const [stats, setStats] = useState({
    correct_answers: 0,
    wrong_answers: 0,
  });
  const [selectedChoice, setSelectedChoice] = useState<number>(0);
  const [now, setNow] = useState(new Date());

  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    if (!currentQuestion.options) return [];
    return JSON.parse(currentQuestion.options as string) as string[];
  }, [currentQuestion]);

  const { toast } = useToast();

  const { checkAnswer, endGame, isChecking } = useGameMutations();

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasEnded) {
        setNow(new Date());
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    checkAnswer(
      {
        questionId: currentQuestion.id,
        userInput: options[selectedChoice],
      },
      {
        onSuccess: ({ isCorrect }) => {
          if (isCorrect) {
            setStats((stats) => ({
              ...stats,
              correct_answers: stats.correct_answers + 1,
            }));
            toast({
              title: "Correct",
              description: "You got it right!",
              variant: "success",
            });
          } else {
            setStats((stats) => ({
              ...stats,
              wrong_answers: stats.wrong_answers + 1,
            }));
            toast({
              title: "Incorrect",
              description: "You got it wrong!",
              variant: "destructive",
            });
          }
          if (questionIndex === game.questions.length - 1) {
            endGame({ gameId: game.id });
            setHasEnded(true);
            return;
          }
          setQuestionIndex((questionIndex) => questionIndex + 1);
        },
      }
    );
  }, [
    checkAnswer,
    questionIndex,
    game.questions.length,
    toast,
    endGame,
    currentQuestion.id,
    options,
    selectedChoice,
    game.id,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;

      if (key === "1") {
        setSelectedChoice(0);
      } else if (key === "2") {
        setSelectedChoice(1);
      } else if (key === "3") {
        setSelectedChoice(2);
      } else if (key === "4") {
        setSelectedChoice(3);
      } else if (key === "Enter") {
        handleNext();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  if (hasEnded) {
    return (
      <div className="absolute flex flex-col justify-center -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <div className="px-4 py-2 mt-2 font-semibold text-white bg-neutral-500 rounded-md whitespace-nowrap">
          You Completed in{" "}
          {formatTimeDelta(differenceInSeconds(now, game.timeStarted))}
        </div>
        <Link
          href={`/statistics/${game.id}`}
          className={cn(buttonVariants({ size: "lg" }), "mt-2")}
        >
          View Statistics
          <BarChart className="w-4 h-4 ml-2" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl w-full top-1/2 left-1/2 px-4 py-8">
      <div className="flex flex-row justify-between">
        <div className="flex flex-col">
          <p>
            <span className="text-sm sm:text-base">Topic: </span>
            <span className="text-sm sm:text-base font-semibold">{game.topic}</span>
          </p>
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            <p className="text-sm sm:text-base font-medium">{formatTimeDelta(differenceInSeconds(now, game.timeStarted))}</p>
          </div>
        </div>
        <MCQCounter
          correct_answers={stats.correct_answers}
          wrong_answers={stats.wrong_answers}
        />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center gap-6">
          <CardTitle className="flex flex-col items-center justify-center min-w-[60px] text-center">
            <div className="text-2xl sm:text-3xl font-bold">
              {questionIndex + 1}
              <span className="text-neutral-500 text-base sm:text-lg">
                /{game.questions.length}
              </span>
            </div>
          </CardTitle>
          <CardDescription className="flex-grow text-base sm:text-xl font-medium leading-relaxed">
            {currentQuestion?.question}
          </CardDescription>
        </CardHeader>
      </Card>
      <div className="flex flex-col items-center justify-center w-full mt-4">
        {options.map((option, index) => {
          return (
            <Button
              key={option}
              variant={selectedChoice === index ? "default" : "outline"}
              className="justify-start w-full py-8 mb-4"
              onClick={() => setSelectedChoice(index)}
            >
              <div className="flex items-center justify-start">
                <div className="py-2 px-3.5 mr-5 border rounded-md">
                  {index + 1}
                </div>
                <div className="text-start">{option}</div>
              </div>
            </Button>
          );
        })}
        <Separator className="mb-4 mt-2" />
        <Button
          variant="default"
          className="mt-2 w-full"
          size="lg"
          disabled={isChecking || hasEnded}
          onClick={() => {
            handleNext();
          }}
        >
          {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MCQ;
