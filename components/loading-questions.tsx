import React, { useEffect, useState } from "react";
import { Progress } from "./ui/progress";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Loader2 } from "lucide-react";

type Props = { finished: boolean };

const loadingTexts = [
  "Generating questions...",
  "Unleashing the power of curiosity...", 
  "Diving deep into the ocean of questions...",
  "Harnessing the collective knowledge of the cosmos...",
  "Igniting the flame of wonder and exploration...",
];

const LoadingQuestions = ({ finished }: Props) => {
  const [progress, setProgress] = useState(10);
  const [loadingText, setLoadingText] = useState(loadingTexts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * loadingTexts.length);
      setLoadingText(loadingTexts[randomIndex]);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100;
        if (prev === 100) {
          return 0;
        }
        if (Math.random() < 0.1) {
          return prev + 2;
        }
        return prev + 0.5;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [finished]);

  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[70vw] md:w-[60vw] flex flex-col items-center">
      <Card className="w-full">
        <CardContent className="flex flex-col items-center p-6">
          <div className="relative w-60 h-60">
            <Image 
              src="/loading.gif"
              fill
              className="object-contain"
              alt="loading animation"
            />
          </div>
          <div className="w-full mt-4 space-y-4">
            <Progress 
              value={progress} 
              className="h-2 transition-all"
            />
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <h1 className="text-xl font-semibold text-center">{loadingText}</h1>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingQuestions;