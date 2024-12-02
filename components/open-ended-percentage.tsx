import React from "react";
import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

const OpenEndedPercentage = ({ percentage }: { percentage: number }) => {
  return (
    <Card className="flex flex-row items-center p-2">
      <Target size={30} />
      <span className="ml-3 text-2xl opacity-75">{percentage}%</span>
    </Card>
  );
};

export default OpenEndedPercentage;