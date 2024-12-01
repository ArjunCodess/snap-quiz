import { strict_output } from "@/lib/gemini";
import { getQuestionsSchema } from "@/schemas";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export const runtime = "nodejs";
export const maxDuration = 500;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Questions API - Received body:", body);

    const { amount, topic, type } = getQuestionsSchema.parse(body);
    let questions;

    if (!strict_output) {
      console.error("strict_output function is not defined");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    try {
      if (type === "open_ended") {
        questions = await strict_output(
          `You are a helpful AI that generates open-ended questions about ${topic}.`,
          new Array(amount).fill(`Generate a question about ${topic}`),
          {
            question: "question",
            answer: "answer with max length of 15 words",
          }
        );
      } else if (type === "mcq") {
        questions = await strict_output(
          `You are a helpful AI that generates multiple choice questions about ${topic}.`,
          new Array(amount).fill(`Generate a question about ${topic}`),
          {
            question: "question",
            answer: "correct answer",
            option1: "first incorrect option",
            option2: "second incorrect option",
            option3: "third incorrect option",
          }
        );
      }

      console.log("Generated questions:", questions);
      return NextResponse.json({ questions }, { status: 200 });
      
    } catch (error) {
      console.error("Error generating questions:", error);
      return NextResponse.json({ 
        error: "Failed to generate questions",
        details: error instanceof Error ? error.message : "Unknown error"
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Questions API error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ 
      error: "An unexpected error occurred",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}