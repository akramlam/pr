import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome to SMARTER®',
      login: 'Login',
      register: 'Register',
      play: 'Play Now',
      leaderboard: 'Leaderboard',
      settings: 'Settings',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      loginPrompt: 'Sign in to your account',
      registerPrompt: 'Create your account',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      score: 'Score',
      question: 'Question',
      gameOver: 'Game Over!',
      finalScore: 'Final Score',
      backToHome: 'Back to Home',
      loginError: 'Invalid email or password',
      sessionExpired: 'Your session has expired. Please login again.',
      easy: 'Easy',
      medium: 'Medium',
      hard: 'Hard',
      daily: 'Daily',
      weekly: 'Weekly',
      allTime: 'All Time',
      rank: 'Rank',
      totalScore: 'Total Score',
      gamesPlayed: 'Games Played',
      avgTime: 'Avg. Time',
      recentGames: 'Recent Games',
      game: 'Game',
      streak: 'streak',
      ready: 'Ready',
      notReady: 'Not Ready',
      startGame: 'Start Game',
      waitingForPlayers: 'Waiting for players...',
      gameResults: 'Game Results',
      maxStreak: 'Max Streak',
      testCredentials: 'Test Credentials',
      useTestCredentials: 'Email: {{email}}, Password: {{password}}',
      victory: 'Victory!',
      correctAnswers: 'Correct Answers',
      share: 'Share',
      playAgain: 'Play Again',
      shareScore: 'I scored {{score}} points in SMARTER®!',
      selectDifficulty: 'Select Difficulty',
      easyDescription: 'Perfect for beginners',
      mediumDescription: 'For experienced players',
      hardDescription: 'Challenge yourself',
      progress: 'Progress',
      or: 'or',
      continueWithGoogle: 'Continue with Google',
      multiplayerMode: 'Multiplayer Mode',
      multiplayerDescription: 'Play with friends in real-time',
      createGame: 'Create New Game',
      joinGame: 'Join Game',
      enterGameCode: 'Enter game code',
      activeGames: 'Active Games',
      noActiveGames: 'No active games found',
      players: 'players',
      back: 'Back',
      playersNeeded: 'Need {{min}}-{{max}} players',
      inviteLink: 'Invite Link',
      copyInvite: 'Copy invite link',
      host: 'Host',
      waitingForReady: 'Waiting for all players to be ready',
      needMorePlayers: 'Need {{count}} more player(s)',
      tooManyPlayers: 'Too many players',
      typeMessage: 'Type a message...',
      chat: 'Chat',
      winner: 'Winner',
      points: 'Points',
      shareMultiplayerScore: '{{name}} won with {{score}} points in a {{playerCount}}-player game of SMARTER®!',
      multiplayerLobby: 'Multiplayer Lobby',
      hostGame: 'Host Game',
      joining: 'Joining...',
      shareCode: 'Share this code with your friends',
      enterValidCode: 'Please enter a valid code',
      joinError: 'Failed to join game',
      hostError: 'Failed to host game',
      loggingIn: 'Signing in...',
      streak: 'Streak',
      multiplier: 'x{{multiplier}} Multiplier',
      streakBonus: '+{{points}} Streak Bonus!',
      correctAnswer: 'Correct! +{{points}} points',
      correctAnswerWithBonus: 'Correct! +{{points}} points ({{base}} + {{bonus}} bonus)',
      streakMilestone: '{{streak}} streak! x{{multiplier}} multiplier!',
      wrongAnswer: 'Incorrect answer'
    }
  }
};

const i18n = i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['querystring', 'navigator'],
      caches: [],
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
