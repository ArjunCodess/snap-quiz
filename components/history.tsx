import { prisma } from "@/lib/db";
import { ArrowRight, Clock, CopyCheck, Edit2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  limit: number;
  userId: string;
  className?: string;
};

const History = async ({ limit, userId, className }: Props) => {
  const games = await prisma.game.findMany({
    take: limit,
    where: {
      userId,
    },
    orderBy: {
      timeStarted: "desc",
    },
  });
  return (
    <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
      {games.map((game) => (
        <Card
          key={game.id}
          className="overflow-hidden transition-shadow hover:shadow-lg"
        >
          <CardContent className="p-0">
            <Link href={`/statistics/${game.id}`} className="block">
              <div className="flex items-center p-4 sm:p-6 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
                {game.gameType === "mcq" ? (
                  <CopyCheck className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-4 text-primary" />
                ) : (
                  <Edit2 className="w-6 h-6 sm:w-8 sm:h-8 mr-2 sm:mr-4 text-primary" />
                )}
                <div>
                  <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
                    {game.topic}
                  </h3>
                  <div className="flex items-center mt-2 text-xs sm:text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    {game.timeEnded
                      ? new Date(game.timeEnded).toLocaleDateString()
                      : "In Progress"}
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 flex justify-between items-center">
                <Badge
                  variant={game.gameType === "mcq" ? "default" : "secondary"}
                >
                  {game.gameType === "mcq" ? "Multiple Choice" : "Open-Ended"}
                </Badge>
                <div className="flex items-center justify-end text-sm font-medium text-primary">
                  View Results
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default History;