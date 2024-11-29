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

export default async function RecentActivities() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

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
          Track your quiz history and performance
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[580px] overflow-y-auto scrollbar-thin scrollbar-thumb-secondary">
        <div className="flex flex-col gap-2 items-center justify-center min-h-[200px] text-muted-foreground">
          <Clock className="h-8 w-8 mb-2" />
          <p>No recent activities</p>
        </div>
      </CardContent>
    </Card>
  );
}
