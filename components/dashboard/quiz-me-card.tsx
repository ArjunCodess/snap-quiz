"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { BrainCircuit } from "lucide-react";

export default function QuizMeCard() {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer transition-all hover:shadow-md hover:bg-accent/10"
      onClick={() => router.push("/quiz")}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">Quiz me!</CardTitle>
        <div className="p-2 rounded-full bg-primary/10">
          <BrainCircuit className="h-7 w-7 text-primary" strokeWidth={2} />
        </div>
      </CardHeader>
      <CardContent>
        <span className="text-sm text-muted-foreground">
          Start a new quiz on any topic. Test your knowledge and learn something new.
        </span>
      </CardContent>
    </Card>
  );
}