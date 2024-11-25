import type { Question, Difficulty } from '../types';

export const QUESTIONS_BY_DIFFICULTY: Record<Difficulty, Question[]> = {
  easy: [
    // Math
    {
      id: 'e1',
      text: 'What is 2 + 2?',
      category: 'Math',
      difficulty: 'easy',
      options: ['3', '4', '5', '6'],
      correctAnswer: 1,
      timeLimit: 30,
      points: 100
    },
    {
      id: 'e2',
      text: 'What is 10 × 5?',
      category: 'Math',
      difficulty: 'easy',
      options: ['40', '45', '50', '55'],
      correctAnswer: 2,
      timeLimit: 30,
      points: 100
    },
    // Science
    {
      id: 'e3',
      text: 'Which planet is known as the Red Planet?',
      category: 'Science',
      difficulty: 'easy',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      correctAnswer: 1,
      timeLimit: 30,
      points: 100
    },
    {
      id: 'e4',
      text: 'What is the largest organ in the human body?',
      category: 'Science',
      difficulty: 'easy',
      options: ['Heart', 'Brain', 'Liver', 'Skin'],
      correctAnswer: 3,
      timeLimit: 30,
      points: 100
    },
    // Geography
    {
      id: 'e5',
      text: 'What is the capital of France?',
      category: 'Geography',
      difficulty: 'easy',
      options: ['London', 'Berlin', 'Madrid', 'Paris'],
      correctAnswer: 3,
      timeLimit: 30,
      points: 100
    },
    {
      id: 'e6',
      text: 'Which is the largest continent?',
      category: 'Geography',
      difficulty: 'easy',
      options: ['Africa', 'Asia', 'Europe', 'North America'],
      correctAnswer: 1,
      timeLimit: 30,
      points: 100
    }
  ],
  medium: [
    // Math
    {
      id: 'm1',
      text: 'What is the square root of 144?',
      category: 'Math',
      difficulty: 'medium',
      options: ['10', '12', '14', '16'],
      correctAnswer: 1,
      timeLimit: 25,
      points: 200
    },
    {
      id: 'm2',
      text: 'What is 15% of 200?',
      category: 'Math',
      difficulty: 'medium',
      options: ['25', '30', '35', '40'],
      correctAnswer: 1,
      timeLimit: 25,
      points: 200
    },
    // Science
    {
      id: 'm3',
      text: 'Which element has the chemical symbol "Fe"?',
      category: 'Science',
      difficulty: 'medium',
      options: ['Gold', 'Silver', 'Iron', 'Copper'],
      correctAnswer: 2,
      timeLimit: 25,
      points: 200
    },
    {
      id: 'm4',
      text: 'What is the speed of light (in km/s)?',
      category: 'Science',
      difficulty: 'medium',
      options: ['299,792', '199,792', '399,792', '499,792'],
      correctAnswer: 0,
      timeLimit: 25,
      points: 200
    },
    // History
    {
      id: 'm5',
      text: 'In which year did World War II end?',
      category: 'History',
      difficulty: 'medium',
      options: ['1943', '1944', '1945', '1946'],
      correctAnswer: 2,
      timeLimit: 25,
      points: 200
    },
    {
      id: 'm6',
      text: 'Who painted the Mona Lisa?',
      category: 'History',
      difficulty: 'medium',
      options: ['Van Gogh', 'Da Vinci', 'Picasso', 'Rembrandt'],
      correctAnswer: 1,
      timeLimit: 25,
      points: 200
    }
  ],
  hard: [
    // Math
    {
      id: 'h1',
      text: 'What is the value of π (pi) to 4 decimal places?',
      category: 'Math',
      difficulty: 'hard',
      options: ['3.1415', '3.1416', '3.1414', '3.1417'],
      correctAnswer: 0,
      timeLimit: 20,
      points: 300
    },
    {
      id: 'h2',
      text: 'What is the sum of the angles in a pentagon?',
      category: 'Math',
      difficulty: 'hard',
      options: ['360°', '480°', '540°', '720°'],
      correctAnswer: 2,
      timeLimit: 20,
      points: 300
    },
    // Science
    {
      id: 'h3',
      text: 'Which particle has a negative charge?',
      category: 'Science',
      difficulty: 'hard',
      options: ['Proton', 'Neutron', 'Electron', 'Positron'],
      correctAnswer: 2,
      timeLimit: 20,
      points: 300
    },
    {
      id: 'h4',
      text: 'What is the atomic number of Gold (Au)?',
      category: 'Science',
      difficulty: 'hard',
      options: ['47', '79', '85', '92'],
      correctAnswer: 1,
      timeLimit: 20,
      points: 300
    },
    // History & Literature
    {
      id: 'h5',
      text: 'Who wrote "The Art of War"?',
      category: 'History',
      difficulty: 'hard',
      options: ['Confucius', 'Sun Tzu', 'Lao Tzu', 'Buddha'],
      correctAnswer: 1,
      timeLimit: 20,
      points: 300
    },
    {
      id: 'h6',
      text: 'In which year was the first iPhone released?',
      category: 'History',
      difficulty: 'hard',
      options: ['2005', '2006', '2007', '2008'],
      correctAnswer: 2,
      timeLimit: 20,
      points: 300
    }
  ]
}; 