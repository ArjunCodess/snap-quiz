import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame } from "lucide-react";
import WordCloud from "../word-cloud";
import { prisma } from "@/lib/db";

export default async function HotTopicsCard() {
  const topics = await prisma.topicCount.findMany({});

  const formattedTopics = topics.map((topic) => {
    return {
      text: topic.topic,
      value: topic.count,
    };
  });

  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <CardDescription>
          Popular topics from our quiz community. Click any topic to start a
          quiz.
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <WordCloud formattedTopics={formattedTopics} />
      </CardContent>
    </Card>
  );
}