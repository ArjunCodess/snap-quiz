import { prisma } from "@/lib/db";
import { quizCreationSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { z } from "zod";
import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { mcqQuestion, openQuestion } from "@/types";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "You must be logged in to create a game." }, { status: 401 });
    }

    const body = await req.json();
    const { topic, type, amount } = quizCreationSchema.parse(body);
    
    console.log("Creating game with:", { topic, type, amount });
    console.log("API_URL:", process.env.API_URL);

    const game = await prisma.game.create({
      data: {
        gameType: type,
        timeStarted: new Date(),
        userId: userId,
        topic,
      },
    });
    
    console.log("Game created:", game.id);
    
    await prisma.topicCount.upsert({
      where: { topic },
      create: { topic, count: 1 },
      update: { count: { increment: 1 } },
    });

    try {
      const { data } = await axios.post(
        `${process.env.API_URL as string}/api/questions`,
        { amount, topic, type }
      );
      
      console.log("Questions API response:", data);

      if (type === "mcq") {
        const manyData = data.questions.map((question: mcqQuestion) => {
          const options = [
            question.option1,
            question.option2,
            question.option3,
            question.answer,
          ].sort(() => Math.random() - 0.5);

          return {
            question: question.question,
            answer: question.answer,
            options: JSON.stringify(options),
            gameId: game.id,
            questionType: "mcq",
          };
        });

        await prisma.question.createMany({
          data: manyData,
        });
      } else if (type === "open_ended") {
        await prisma.question.createMany({
          data: data.questions.map((question: openQuestion) => {
            return {
              question: question.question,
              answer: question.answer,
              gameId: game.id,
              questionType: "open_ended",
            };
          }),
        });
      }

      return NextResponse.json({ gameId: game.id }, { status: 200 });
    } catch (error) {
      console.error("Error calling questions API:", error);
      throw error;
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
    }
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "You must be logged in to create a game." }, { status: 401 });
    }

    const url = new URL(req.url);
    const gameId = url.searchParams.get("gameId");

    if (!gameId) {
      return NextResponse.json({ error: "You must provide a game id." }, { status: 400 });
    }

    const game = await prisma.game.findUnique({
      where: { id: gameId },
      include: { questions: true },
    });

    if (!game) {
      return NextResponse.json({ error: "Game not found." }, { status: 404 });
    }

    return NextResponse.json({ game }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}