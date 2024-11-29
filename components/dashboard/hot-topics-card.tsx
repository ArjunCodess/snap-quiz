import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Flame } from "lucide-react";

export default async function HotTopicsCard() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <CardTitle className="text-2xl font-bold">Hot Topics</CardTitle>
          <Flame className="h-6 w-6 text-orange-500" />
        </div>
        <CardDescription>
          Popular topics from our quiz community. Click any topic to start a quiz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-card/50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
          word cloud
        </div>
      </CardContent>
    </Card>
  );
}