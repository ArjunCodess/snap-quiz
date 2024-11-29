"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

export default function HistoryCard() {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer transition-all hover:shadow-md hover:bg-accent/10"
      onClick={() => router.push("/history")}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-2xl font-bold">History</CardTitle>
        <div className="p-2 rounded-full bg-primary/10">
          <History className="h-7 w-7 text-primary" strokeWidth={2} />
        </div>
      </CardHeader>
      <CardContent>
        <span className="text-sm text-muted-foreground">
          View your quiz history and track your progress over time.
        </span>
      </CardContent>
    </Card>
  );
}