import { default as HistoryComponent } from "@/components/history";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { auth } from "@clerk/nextjs/server";

const History = async () => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-65px)] w-full mx-2 lg:mx-0">
      <Card className="w-full max-w-6xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold">History</CardTitle>
            <Link className={buttonVariants()} href="/dashboard">
              <ArrowLeft className="mr-2" />
              Back to Dashboard
            </Link>
          </div>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-scroll">
          <HistoryComponent limit={100} userId={userId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default History;