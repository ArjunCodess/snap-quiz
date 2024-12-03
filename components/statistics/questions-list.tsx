"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle } from 'lucide-react';
import { Question } from "@prisma/client";

type Props = {
  questions: Question[];
};

const QuestionsList = ({ questions }: Props) => (
  <Card className="mt-6">
    <CardHeader>
      <CardTitle>Questions Review</CardTitle>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">No.</TableHead>
            <TableHead>Question & Correct Answer</TableHead>
            <TableHead>Your Answer</TableHead>
            {questions[0].questionType === "open_ended" && (
              <TableHead className="w-[100px] text-right">Accuracy</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {questions.map(({ answer, question, userAnswer, percentageCorrect, isCorrect }, index) => (
            <TableRow key={index} className="group hover:bg-muted/50 transition-colors">
              <TableCell className="font-medium">{index + 1}</TableCell>
              <TableCell className="max-w-[300px]">
                <p className="font-medium mb-2">{question}</p>
                <p className="text-sm text-muted-foreground">
                  Correct: <span className="font-semibold text-primary">{answer}</span>
                </p>
              </TableCell>
              <TableCell>
                {questions[0].questionType === "open_ended" ? (
                  <p className="font-medium">{userAnswer}</p>
                ) : (
                  <div className="flex items-center space-x-2">
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                      {userAnswer}
                    </span>
                  </div>
                )}
              </TableCell>
              {questions[0].questionType === "open_ended" && (
                <TableCell className="text-right">
                  {percentageCorrect && (
                    <Badge variant={Number(percentageCorrect) > 50 ? "default" : "destructive"}>
                      {percentageCorrect}%
                    </Badge>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

export default QuestionsList;