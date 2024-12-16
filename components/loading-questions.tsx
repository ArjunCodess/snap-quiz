'use client'

import React, { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

type Props = { finished: boolean }

const loadingTexts = [
  "Getting questions ready...",
  "Thinking up good ones...",
  "Almost there...", 
  "Making them interesting...",
  "Finishing touches...",
]

const LoadingQuestions = ({ finished }: Props) => {
  const [progress, setProgress] = useState(10)
  const [loadingText, setLoadingText] = useState(loadingTexts[0])
  const [textIndex, setTextIndex] = useState(0)

  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % loadingTexts.length)
    }, 3000)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (finished) return 100
        if (prev >= 95) return prev
        return prev + Math.random() * 2
      })
    }, 200)

    return () => {
      clearInterval(textInterval)
      clearInterval(progressInterval)
    }
  }, [finished])

  useEffect(() => {
    setLoadingText(loadingTexts[textIndex])
  }, [textIndex])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-background to-background/90 backdrop-blur-sm px-4 md:px-0">
      <Card className="w-full max-w-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-300">
        <CardContent className="p-6 sm:p-8 md:p-12">
          <div className="flex flex-col items-center space-y-6 sm:space-y-8">
            <div className="relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32">
              <div className="absolute inset-0 rounded-full border-[6px] sm:border-[7px] md:border-[8px] border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-[6px] sm:border-[7px] md:border-[8px] border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-3 sm:inset-4 rounded-full border-[6px] sm:border-[7px] md:border-[8px] border-primary/10"></div>
              <div className="absolute inset-3 sm:inset-4 rounded-full border-[6px] sm:border-[7px] md:border-[8px] border-primary border-t-transparent animate-spin-reverse animation-delay-500"></div>
            </div>
            <div className="w-full space-y-4 sm:space-y-6">
              <Progress 
                value={progress} 
                className="h-2 sm:h-3 rounded-full bg-primary/10" 
              />
              <p 
                className="text-lg sm:text-xl md:text-2xl font-bold text-center bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent transition-opacity duration-500"
                key={loadingText}
              >
                {loadingText}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoadingQuestions