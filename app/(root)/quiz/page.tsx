import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import QuizCreation from "@/components/quiz-creation";
import { SearchParams } from "@/types";

interface Props {
  searchParams: SearchParams;
}

const Quiz = async ({ searchParams }: Props) => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const { topic = "" } = await searchParams;

  return <QuizCreation topic={topic} />;
};

export default Quiz;