import { QUESTIONS_BY_DIFFICULTY } from '../data/questions';
import type { Question, Difficulty } from '../types';

interface QuestionFilters {
  difficulty?: Difficulty;
  category?: string;
  count?: number;
}

class QuestionService {
  private getAllQuestions(): Question[] {
    return Object.values(QUESTIONS_BY_DIFFICULTY).flat();
  }

  async fetchQuestions(filters: QuestionFilters = {}): Promise<Question[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let questions: Question[];

    if (filters.difficulty) {
      questions = QUESTIONS_BY_DIFFICULTY[filters.difficulty];
    } else {
      questions = this.getAllQuestions();
    }

    // Apply category filter if specified
    if (filters.category) {
      questions = questions.filter(q => q.category === filters.category);
    }

    // Shuffle questions
    questions = this.shuffle(questions);

    // Limit count
    if (filters.count && filters.count > 0) {
      questions = questions.slice(0, filters.count);
    }

    return questions;
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  async getCategories(): Promise<string[]> {
    const questions = this.getAllQuestions();
    return Array.from(new Set(questions.map(q => q.category)));
  }

  async getDifficulties(): Promise<Difficulty[]> {
    return ['easy', 'medium', 'hard'];
  }
}

export const questionService = new QuestionService();
export type { Question }; 