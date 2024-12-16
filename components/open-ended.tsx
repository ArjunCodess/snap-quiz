"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  cn,
  formatTimeDelta,
  OPEN_ENDED_ANSWER_PLACEHOLDER,
} from "@/lib/utils";
import { Game, Question } from "@prisma/client";
import { differenceInSeconds } from "date-fns";
import { BarChart, ChevronRight, Loader2, Timer } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "./ui/button";
import OpenEndedPercentage from "./open-ended-percentage";
import BlankAnswerInput from "./blank-answer-input";
import { useGameMutations } from "@/hooks/use-game-mutations";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

type Props = {
  game: Game & { questions: Pick<Question, "id" | "question" | "answer">[] };
};

const OpenEnded = ({ game }: Props) => {
  const [hasEnded, setHasEnded] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [blankAnswer, setBlankAnswer] = useState("");
  const [averagePercentage, setAveragePercentage] = useState(0);
  const currentQuestion = useMemo(() => {
    return game.questions[questionIndex];
  }, [questionIndex, game.questions]);
  const { endGame, checkAnswer, isChecking } = useGameMutations();
  const { toast } = useToast();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    if (!hasEnded) {
      const interval = setInterval(() => {
        setNow(new Date());
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [hasEnded]);

  const handleNext = useCallback(() => {
    let filledAnswer = blankAnswer;
    document
      .querySelectorAll<HTMLInputElement>("#user-blank-input")
      .forEach((input) => {
        filledAnswer = filledAnswer.replace(
          OPEN_ENDED_ANSWER_PLACEHOLDER,
          input.value
        );
        input.value = "";
      });

    checkAnswer(
      {
        questionId: currentQuestion.id,
        userInput: filledAnswer,
      },
      {
        onSuccess: ({ percentageSimilar }) => {
          toast({
            title: `Your answer is ${percentageSimilar}% similar to the correct answer`,
          });
          setAveragePercentage((prev) => {
            return (prev + percentageSimilar!) / (questionIndex + 1);
          });
          if (questionIndex === game.questions.length - 1) {
            endGame({ gameId: game.id });
            setHasEnded(true);
            return;
          }
          setQuestionIndex((prev) => prev + 1);
        },
        onError: (error) => {
          console.error(error);
          toast({
            title: "Something went wrong",
            variant: "destructive",
          });
        },
      }
    );
  }, [
    checkAnswer,
    questionIndex,
    toast,
    endGame,
    game.questions.length,
    blankAnswer,
    currentQuestion.id,
    game.id,
  ]);
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (key === "Enter") {
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
        <OpenEndedPercentage percentage={averagePercentage} />
      </div>
      <Card className="w-full mt-4">
        <CardHeader className="flex flex-row items-center gap-6">
          <CardTitle className="flex flex-col items-center justify-center min-w-[60px] text-center">
            <div className="text-xl sm:text-2xl font-bold">
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

      <div className="flex flex-col items-center justify-center w-full my-12">
        <BlankAnswerInput
          setBlankAnswer={setBlankAnswer}
          answer={currentQuestion.answer}
        />
      </div>

      <Button
        variant="default"
        className="mt-4 w-full"
        disabled={isChecking || hasEnded}
        onClick={() => {
          handleNext();
        }}
      >
        {isChecking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        Next <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

export default OpenEnded;
