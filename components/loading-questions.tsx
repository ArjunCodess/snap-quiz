'use client'

import React, { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"

type Props = { finished: boolean }

const loadingTexts = [
  "Getting your questions ready...",
  "Thinking up some good ones...",
  "Almost there, just a few more seconds...", 
  "Making sure these questions are interesting...",
  "Putting the finishing touches on your quiz...",
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
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm px-2 md:px-0">
      <Card className="max-w-7xl px-8 overflow-hidden shadow-lg transform hover:scale-[1.02] transition-all duration-300">
        <CardContent className="py-12">
          <div className="flex flex-col items-center space-y-8">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full border-[6px] border-primary/20"></div>
              <div className="absolute inset-0 rounded-full border-[6px] border-primary border-t-transparent animate-spin"></div>
              <div className="absolute inset-2 rounded-full border-[6px] border-primary/10"></div>
              <div className="absolute inset-2 rounded-full border-[6px] border-primary border-t-transparent animate-spin animation-delay-150"></div>
            </div>
            <div className="w-full space-y-6">
              <Progress 
                value={progress} 
                className="h-3 rounded-lg bg-primary/10" 
              />
              <p className="text-2xl font-bold text-center bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-500">
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