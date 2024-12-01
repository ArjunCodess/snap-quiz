"use client";

import React, { useState } from "react";
import { quizCreationSchema } from "@/schemas";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BookOpen, CopyCheck } from "lucide-react";
import { Separator } from "./ui/separator";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import LoadingQuestions from "./loading-questions";
import { useToast } from "@/hooks/use-toast";
import { useCreateQuiz } from "@/hooks/useCreateQuiz";

type Props = {
  topic: string;
};

type Input = z.infer<typeof quizCreationSchema>;

const QuizCreation = ({ topic: topicParam }: Props) => {
  const [showLoader, setShowLoader] = useState(false);
  const [finishedLoading, setFinishedLoading] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const { createQuiz, isLoading } = useCreateQuiz();

  const form = useForm<Input>({
    resolver: zodResolver(quizCreationSchema),
    defaultValues: {
      topic: topicParam,
      type: "mcq",
      amount: 3,
    },
  });

  const onSubmit = async (data: Input) => {
    if (isLoading) return; // Prevent multiple submissions
    setShowLoader(true);
    try {
      console.log('Submitting quiz creation with data:', data);
      const { gameId } = await createQuiz(data);
      console.log('Quiz created with gameId:', gameId);
      setFinishedLoading(true);

      setTimeout(() => {
        if (form.getValues("type") === "mcq") {
          router.push(`/play/mcq/${gameId}`);
        } else if (form.getValues("type") === "open_ended") {
          router.push(`/play/open-ended/${gameId}`);
        }
      }, 2000);
    } catch (error) {
      console.error('Error creating quiz:', error);
      setShowLoader(false);
      if (error instanceof AxiosError) {
        toast({
          title: "Error",
          description: error.response?.data?.error || "Something went wrong. Please try again later.",
          variant: "destructive",
        });
      }
    }
  };
  form.watch();

  if (showLoader) return <LoadingQuestions finished={finishedLoading} />;

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-65px)] px-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Creation</CardTitle>
          <CardDescription>Choose a topic</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a topic" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please provide any topic you would like to be quizzed on
                      here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Questions</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="How many questions?"
                        type="number"
                        {...field}
                        value={field.value}
                        onChange={(e) => {
                          const value = e.target.value ? parseInt(e.target.value) : '';
                          field.onChange(value);
                        }}
                        min={1}
                        max={10}
                      />
                    </FormControl>
                    <FormDescription>
                      You can choose how many questions you would like to be
                      quizzed on here.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant={
                    form.getValues("type") === "mcq" ? "default" : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-l-lg"
                  onClick={() => {
                    form.setValue("type", "mcq");
                  }}
                  type="button"
                >
                  <CopyCheck className="w-4 h-4 mr-2" /> Multiple Choice
                </Button>
                <Separator orientation="vertical" />
                <Button
                  variant={
                    form.getValues("type") === "open_ended"
                      ? "default"
                      : "secondary"
                  }
                  className="w-1/2 rounded-none rounded-r-lg"
                  onClick={() => form.setValue("type", "open_ended")}
                  type="button"
                >
                  <BookOpen className="w-4 h-4 mr-2" /> Open Ended
                </Button>
              </div>
              <Button disabled={isLoading} type="submit" className="w-full">
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizCreation;