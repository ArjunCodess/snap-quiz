"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { History } from "lucide-react";

export default function HistoryCard() {
  const router = useRouter();
  return (
    <Card
      className="hover:cursor-pointer transition-all hover:shadow-md hover:bg-accent/10 w-full"
      onClick={() => router.push("/history")}
    >
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl sm:text-2xl font-bold">History</CardTitle>
        <div className="p-1.5 sm:p-2 rounded-full bg-primary/10">
          <History className="h-5 w-5 sm:h-7 sm:w-7 text-primary" strokeWidth={2} />
        </div>
      </CardHeader>
      <CardContent>
        <span className="text-xs sm:text-sm text-muted-foreground">
          View your quiz history and track your progress over time.
        </span>
      </CardContent>
    </Card>
  );
}