import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Hourglass } from 'lucide-react';
import { formatTimeDelta } from "@/lib/utils";
import { differenceInSeconds } from "date-fns";

type Props = {
  timeEnded: Date;
  timeStarted: Date;
};

const TimeTakenCard = ({ timeEnded, timeStarted }: Props) => {
  const timeDelta = differenceInSeconds(timeEnded, timeStarted);
  const formattedTime = formatTimeDelta(timeDelta);

  return (
    <Card className="md:col-span-1 relative overflow-hidden group hover:shadow-lg transition-all duration-300 dark:bg-neutral-900/50">
      <CardHeader className="flex flex-row items-center justify-between pb-2 sm:pb-4 space-y-0">
        <CardTitle className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
          Time Taken
        </CardTitle>
        <Hourglass className="w-6 h-6 sm:w-7 sm:h-7 text-primary animate-spin-slow" />
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 pt-2 sm:pt-4 pb-6 sm:pb-8">
        <div className="flex items-center justify-center">
          <span className="text-3xl sm:text-4xl font-bold text-primary">{formattedTime}</span>
        </div>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center hover:bg-muted/70 transition-colors duration-200">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Started</p>
              <p className="text-sm sm:text-base font-medium">{timeStarted.toLocaleTimeString()}</p>
            </div>
            <div className="bg-muted/50 p-3 sm:p-4 rounded-lg text-center hover:bg-muted/70 transition-colors duration-200">
              <p className="text-xs sm:text-sm text-muted-foreground mb-1">Ended</p>
              <p className="text-sm sm:text-base font-medium">{timeEnded.toLocaleTimeString()}</p>
            </div>
          </div>
          <p className="text-sm sm:text-base text-center font-medium text-primary/90 leading-relaxed">
            {timeDelta < 60 && "Wow, that was lightning fast! ⚡"}
            {timeDelta >= 60 && timeDelta < 300 && "Perfect timing! You're on fire! 🔥"}
            {timeDelta >= 300 && "Slow and steady wins the race! 🐢"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeTakenCard;