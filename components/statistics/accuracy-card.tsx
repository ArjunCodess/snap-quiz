import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

type Props = { accuracy: number };

const AccuracyCard: React.FC<Props> = ({ accuracy }) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  
  const getAccuracyColor = (value: number): string => {
    if (value >= 80) return "text-green-500";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getMessage = (value: number): string => {
    if (value >= 80) return "Excellent! Keep up the great work! 🎯";
    if (value >= 60) return "Good job! There's room for improvement. 💫";
    return "Keep practicing to improve your accuracy. 📚";
  };

  return (
    <Card className="md:col-span-1 relative overflow-hidden group hover:shadow-lg transition-all duration-300 dark:bg-neutral-900/50 h-full">
      <div className="flex flex-col h-full">
        <CardHeader className="flex flex-row items-center justify-between pb-6 space-y-0">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            Average Accuracy
          </CardTitle>
          <Target className="w-7 h-7 text-primary animate-pulse" />
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-center space-y-6 pt-4 pb-8">
          <div className="flex items-center justify-center">
            <span className={`text-6xl font-bold ${getAccuracyColor(roundedAccuracy)} transition-colors duration-300`}>
              {roundedAccuracy}%
            </span>
          </div>
          <div className="space-y-6">
            <Progress 
              value={roundedAccuracy} 
              className="w-full h-3 rounded-lg transition-all duration-500"
              style={{
                background: 'linear-gradient(to right, rgb(239 68 68 / 0.2), rgb(234 179 8 / 0.2), rgb(34 197 94 / 0.2))'
              }}
            />
            <p className={`text-base text-center transition-colors duration-300 leading-relaxed`}>
              {getMessage(roundedAccuracy)}
            </p>
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default AccuracyCard;