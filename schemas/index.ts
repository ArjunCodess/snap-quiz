import { z } from "zod";

export const quizCreationSchema = z.object({
  topic: z
    .string()
    .min(4, {
      message: "Topic must be at least 4 characters long",
    })
    .max(50, {
      message: "Topic must be at most 50 characters long",
    })
    .optional(),
  content: z.string().optional(),
  type: z.enum(["mcq", "open_ended"]),
  amount: z.number().min(1).max(10),
}).superRefine(
  data => (data.topic && !data.content) || (!data.topic && data.content)
);

export type FormInput = z.infer<typeof quizCreationSchema>;

export const getQuestionsSchema = z.object({
  topic: z.string().optional(),
  content: z.string().optional(),
  amount: z.number().int().positive().min(1).max(10),
  type: z.enum(["mcq", "open_ended"]),
}).superRefine(
  data => (data.topic && !data.content) || (!data.topic && data.content)
);

export const checkAnswerSchema = z.object({
  userInput: z.string(),
  questionId: z.string(),
});

export const endGameSchema = z.object({
  gameId: z.string(),
});