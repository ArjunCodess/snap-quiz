import React from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2, XCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type Props = {
  correct_answers: number;
  wrong_answers: number;
};

const MCQCounter = ({ correct_answers, wrong_answers }: Props) => {
  return (
    <Card className="flex flex-row items-center justify-center p-2 sm:p-4 gap-2 sm:gap-3">
      <div className="flex items-center">
        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" />
        <span className="ml-2 sm:ml-3 text-lg sm:text-xl font-medium text-emerald-500">
          {correct_answers}
        </span>
      </div>

      <Separator orientation="vertical" className="h-6 sm:h-8 bg-neutral-200" />

      <div className="flex items-center">
        <span className="mr-2 sm:mr-3 text-lg sm:text-xl font-medium text-rose-500">
          {wrong_answers}
        </span>
        <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500" />
      </div>
    </Card>
  );
};

export default MCQCounter;