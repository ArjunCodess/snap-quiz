import { strict_output } from "@/lib/gemini";
import { getQuestionsSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@clerk/nextjs/server";

export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "You must be logged in to create a game." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    console.log("Received request body:", body);

    const { amount, topic, type } = getQuestionsSchema.parse(body);

    let questions;
    const systemPromptMCQ = `
      You are an expert question generator AI. Your task is to create multiple choice questions.
      Rules for questions:
      1. Questions should be clear, concise, and directly related to ${topic}
      2. Questions should test understanding, not just memorization
      3. Each question must have exactly one correct answer
      4. The three alternative options must be plausible but clearly incorrect
      5. All options should be of similar length and style
      6. Avoid using "all of the above" or "none of the above"
      7. Each response should be max 15 words
      8. Questions should be challenging but not tricky
    `;

    const systemPromptOpenEnded = `
      You are an expert question generator AI. Your task is to create open-ended questions.
      Rules for questions:
      1. Questions should be clear, specific, and directly related to ${topic}
      2. Questions should encourage critical thinking
      3. Answers must be concise (maximum 15 words)
      4. Questions should have a definitive answer
      5. Avoid questions that are too broad or subjective
      6. Questions should be challenging but answerable
    `;

    if (type === "open_ended") {
      questions = await strict_output(
        systemPromptOpenEnded,
        new Array(amount).fill(
          `Generate a challenging open-ended question about ${topic}`
        ),
        {
          question: "question",
          answer: "answer with max length of 15 words",
        }
      );
    } else if (type === "mcq") {
      questions = await strict_output(
        systemPromptMCQ,
        new Array(amount).fill(
          `Generate a multiple choice question about ${topic}`
        ),
        {
          question: "question",
          answer: "correct answer (max 15 words)",
          option1: "first incorrect option (max 15 words)",
          option2: "second incorrect option (max 15 words)",
          option3: "third incorrect option (max 15 words)",
        }
      );
    }

    console.log("Generated questions:", questions);

    if (!questions || questions.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate questions" },
        { status: 500 }
      );
    }

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    } else {
      console.error("Error details:", error as Error);
      return NextResponse.json(
        {
          error: "An unexpected error occurred",
          details: (error as Error).message,
        },
        { status: 500 }
      );
    }
  }
}