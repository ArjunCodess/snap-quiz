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

    const { amount, topic, content, type } = getQuestionsSchema.parse(body);
    let questions;

    if (!strict_output) {
      console.error("strict_output function is not defined");
      return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    try {
      const context = content 
        ? `Generate exactly ${amount} questions based on this content: ${content}`
        : `Generate exactly ${amount} questions about ${topic}`;

      const prompts = Array(amount).fill(
        content 
          ? "Generate a question based on the provided content" 
          : `Generate a question about ${topic}`
      );

      if (type === "open_ended") {
        questions = await strict_output(
          `You are a helpful AI that generates open-ended questions. ${context}. Generate exactly ${amount} questions, no more, no less.`,
          prompts,
          {
            question: "question",
            answer: "answer with max length of 15 words",
          }
        );
      } else if (type === "mcq") {
        questions = await strict_output(
          `You are a helpful AI that generates multiple choice questions. ${context}. Generate exactly ${amount} questions, no more, no less.`,
          prompts,
          {
            question: "question",
            answer: "correct answer",
            option1: "first incorrect option",
            option2: "second incorrect option",
            option3: "third incorrect option",
          }
        );
      }

      questions = questions!.slice(0, amount);
      
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