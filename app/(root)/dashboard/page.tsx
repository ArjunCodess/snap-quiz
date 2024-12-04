import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import HistoryCard from "@/components/dashboard/history-card";
import QuizMeCard from "@/components/dashboard/quiz-me-card";
import RecentActivityCard from "@/components/dashboard/recent-activities";
import HotTopicsCard from "@/components/dashboard/hot-topics-card";

export const metadata: Metadata = {
  title: "Dashboard | SnapQuiz",
  description:
    "View your quiz history, start new quizzes, and track your progress.",
  keywords: ["quiz", "learning", "education", "dashboard", "progress tracking"],
};

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  return (
    <div className="container py-8">
      <div className="flex items-center">
        <h2 className="mr-2 text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <QuizMeCard />
        <HistoryCard />
      </div>
      <div className="grid gap-4 mt-4 md:grid-cols-2 lg:grid-cols-7">
        <HotTopicsCard />
        <RecentActivityCard />
      </div>
    </div>
  );
}