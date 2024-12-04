import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Clock } from "lucide-react";
import History from "../history";
import { prisma } from "@/lib/db";

export default async function RecentActivities() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const games_count = await prisma.game.count({
    where: {
      userId: userId,
    },
  });

  return (
    <Card className="col-span-4 lg:col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/history">
              <CardTitle className="text-2xl font-bold hover:text-primary transition-colors">
                Recent Activity
              </CardTitle>
            </Link>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
        <CardDescription>
          Yay! You have completed {games_count} quizzes.
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[480px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <div className="flex flex-col gap-2 items-center justify-center text-muted-foreground">
          <History limit={10} userId={userId} className="col-span-1 md:grid-cols-1 lg:grid-cols-1 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}
