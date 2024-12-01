export type SearchParams = Promise<{ topic?: string }>;

export interface mcqQuestion {
  question: string;
  answer: string;
  option1: string;
  option2: string;
  option3: string;
}

export interface openQuestion {
  question: string;
  answer: string;
}

export interface DBQuestion {
  id: string;
  question: string;
  answer: string;
  options?: string;
  gameId: string;
  questionType: 'mcq' | 'open_ended';
}

export interface GameQuestions {
  gameId: string;
  questions: DBQuestion[];
}