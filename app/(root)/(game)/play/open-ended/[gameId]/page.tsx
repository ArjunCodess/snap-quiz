import React from "react";
import OpenEnded from "@/components/open-ended";
import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    gameId: string;
  }>;
}

const OpenEndedPage = async ({ params }: PageProps) => {
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
          answer: true,
        },
      },
    },
  });

  if (!game || game.gameType === "mcq") {
    return redirect("/quiz");
  }

  return <OpenEnded game={game} />;
};

export default OpenEndedPage;