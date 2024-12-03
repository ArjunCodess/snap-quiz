import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Award } from "lucide-react";

type Props = { accuracy: number };

const ResultsCard = ({ accuracy }: Props) => {
  const getMessage = (accuracy: number) => {
    if (accuracy >= 80)
      return {
        text: "Outstanding!",
        bgColor: "from-yellow-500/20 to-amber-500/20",
      };
    if (accuracy >= 60)
      return { text: "Nice try!", bgColor: "from-blue-500/20 to-cyan-500/20" };
    return {
      text: "Keep going!",
      bgColor: "from-purple-500/20 to-pink-500/20",
    };
  };

  const message = getMessage(accuracy);

  return (
    <Card className="md:col-span-1 relative overflow-hidden group hover:shadow-lg transition-all duration-300 dark:bg-neutral-900/50 h-full">
      <div className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0">
          <CardTitle className="text-2xl font-bold">Results</CardTitle>
          <Award className="w-7 h-7 text-primary" />
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <div className="space-y-3 text-center">
            <h3 className="text-3xl font-bold">{message.text}</h3>
            <p className="text-base text-muted-foreground leading-relaxed w-[250px] mx-auto">
              {accuracy >= 80
                ? "You've mastered this quiz! Brilliant performance!"
                : accuracy >= 60
                ? "You're making great progress! Keep it up!"
                : "Every attempt brings improvement! You've got this!"}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default ResultsCard;
