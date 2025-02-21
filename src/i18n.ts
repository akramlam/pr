import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      navigation: {
        home: "Home",
        stats: "Stats",
        singlePlayer: "Single Player",
        multiPlayer: "Multi Player"
      },
      game: {
        singlePlayer: "Single Player",
        multiPlayer: "Multi Player",
        practice: "Practice",
        ranked: "Ranked",
        casual: "Casual",
        custom: "Custom",
        tournament: "Tournament",
        gameOver: "Game Over",
        victory: "Victory",
        defeat: "Defeat",
        draw: "Draw",
        score: "Score",
        finalScore: "Final Score",
        highScore: "High Score",
        newHighScore: "New High Score",
        level: "Level",
        difficulty: "Difficulty",
        easy: "Easy",
        medium: "Medium",
        hard: "Hard",
        expert: "Expert",
        time: "Time",
        timeLeft: "Time Left",
        timeUp: "Time Up",
        round: "Round",
        rounds: "Rounds",
        question: "Question",
        questions: "Questions",
        answer: "Answer",
        answers: "Answers",
        correct: "Correct",
        incorrect: "Incorrect",
        correctAnswers: "Correct Answers",
        incorrectAnswers: "Incorrect Answers",
        accuracy: "Accuracy",
        streak: "Streak",
        bestStreak: "Best Streak",
        multiplier: "Multiplier",
        points: "Points",
        bonus: "Bonus",
        penalty: "Penalty",
        total: "Total",
        average: "Average",
        averageTime: "Average Time",
        fastestTime: "Fastest Time",
        slowestTime: "Slowest Time",
        personalBest: "Personal Best",
        worldRecord: "World Record",
        pause: "Pause",
        resume: "Resume",
        quit: "Quit",
        restart: "Restart",
        playAgain: "Play Again"
      },
      stats: {
        title: "Statistics",
        overview: "Overview",
        details: "Details",
        history: "History",
        progress: "Progress",
        comparison: "Comparison",
        analytics: "Analytics",
        trends: "Trends",
        performance: "Performance",
        improvement: "Improvement",
        decline: "Decline",
        gamesPlayed: "Games Played",
        gamesWon: "Games Won",
        gamesLost: "Games Lost",
        winRate: "Win Rate",
        totalScore: "Total Score",
        averageScore: "Average Score",
        bestScore: "Best Score",
        worstScore: "Worst Score",
        totalTime: "Total Time",
        averageTime: "Average Time",
        fastestTime: "Fastest Time",
        slowestTime: "Slowest Time",
        totalQuestions: "Total Questions",
        correctAnswers: "Correct Answers",
        incorrectAnswers: "Incorrect Answers",
        accuracy: "Accuracy",
        averageAccuracy: "Average Accuracy",
        bestAccuracy: "Best Accuracy",
        worstAccuracy: "Worst Accuracy",
        totalStreak: "Total Streak",
        averageStreak: "Average Streak",
        bestStreak: "Best Streak",
        currentStreak: "Current Streak"
      },
      home: {
        welcome: "Welcome to the Quiz Game",
        subtitle: "Choose your game mode and start playing!",
        singlePlayerDesc: "Practice your skills and compete against yourself",
        multiPlayerDesc: "Challenge your friends and compete in real-time",
        comingSoon: "Coming Soon"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n; 