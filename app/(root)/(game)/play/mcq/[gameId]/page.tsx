import MCQ from "@/components/mcq";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

interface PageProps {
  params: Promise<{
    gameId: string;
  }>;
}

const MCQPage = async ({ params }: PageProps) => {
  const { userId } = await auth();
  const { gameId } = await params;

  if (!userId) {
    return redirect("/");
  }

  const game = await prisma.game.findUnique({
    where: {
      id: gameId,
    },
    include: {
      questions: {
        select: {
          id: true,
          question: true,
          options: true,
        },
      },
    },
  });

  if (!game || game.gameType === "open_ended") {
    return redirect("/quiz");
  }

  return <MCQ game={game} />;
};

export default MCQPage;