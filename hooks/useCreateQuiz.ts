import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { z } from 'zod';
import { quizCreationSchema } from '@/schemas';

type Input = z.infer<typeof quizCreationSchema>;

interface UseCreateQuizReturn {
  createQuiz: (data: Input) => Promise<{ gameId: string }>;
  isLoading: boolean;
  error: string | null;
}

export function useCreateQuiz(): UseCreateQuizReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createQuiz = async (data: Input) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log("Creating quiz with data:", data);
      const response = await axios.post(`/api/game`, data);
      console.log("Quiz creation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error creating quiz:", error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.error || 'Failed to create quiz');
      } else {
        setError('An unexpected error occurred');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { createQuiz, isLoading, error };
} 