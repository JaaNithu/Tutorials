// Type Imports
import type { ThemeColor } from '@core/types'
import { UserAnswer } from '../../../../server/src/modules/userAnswer/userAnswer.entity';
import progress from '../../@core/theme/overrides/progress';

export type UsersType = {
  id: number
  name: string
  email: string
}

export type SectionType = {
  id: number
  title: string
  description: string
  users: UsersType[]
  video_url: string
  section_order: number
  isActive: boolean
  questions: string
  question: QuestionType[]
  progress: UserProgressType[]
}

export type QuestionType = {
  id: number
  question: string
  options: AnswerType[]
  section: SectionType
  userAnswer: UserAnswerType[]
}

export type AnswerType = {
  id: number
  text: string
  isCorrect: boolean
  question: QuestionType
}

export type UserAnswerType = {
  correctAnswers: number;
  wrongAnswers: number;
  answerText: string[];
  isCorrect: boolean;
  question: QuestionType;
  section: SectionType;
  user: UsersType;
  id: number;
  name: string;
  email: string;
  correctAnswer?: string;
};

export type UserProgressType = {
  id: number;
  progress: number
  isCompleted: boolean
  completionDate: Date
  user: UsersType
  name: string;
  email: string;
  section: SectionType
}