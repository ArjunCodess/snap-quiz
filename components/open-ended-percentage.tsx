import React from "react";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

const OpenEndedPercentage = ({ percentage }: { percentage: number }) => {
  return (
    <Card className="flex flex-row items-center p-2 sm:p-4">
      <Target className="w-5 h-5 sm:w-7 sm:h-7 text-primary" />
      <span className="ml-2 sm:ml-3 text-lg sm:text-2xl font-medium text-primary/90">
        {percentage}%
      </span>
    </Card>
  );
};

export default OpenEndedPercentage;