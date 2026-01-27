export const REFLECTION_QUESTIONS = [
  "What blessing from Allah are you most grateful for today?",
  "How have you seen Allah's mercy in your life recently?",
  "What quality of the Prophet ﷺ inspires you most right now?",
  "How can you show more compassion to others today?",
  "What fear or worry can you surrender to Allah today?",
  "How has Allah guided you through a difficult time?",
  "What act of worship brings you closest to Allah?",
  "How can you improve your relationship with the Quran?",
  "What lesson from Islamic history resonates with you today?",
  "How do you plan to seek Allah's forgiveness today?",
  "What aspect of your faith do you want to strengthen?",
  "How can you be a better Muslim in your daily interactions?",
  "What dua do you need Allah's help with most right now?",
  "How has patience helped you in your spiritual journey?",
  "What good deed can you do anonymously today?",
  "How do you feel about your connection with Allah right now?",
  "What Islamic value do you struggle with most?",
  "How can you make your prayers more meaningful?",
  "What reminds you of Allah's presence in your life?",
  "How can you spread more peace and kindness today?",
  "What sacrifice are you willing to make for your faith?",
  "How has Allah answered your prayers recently?",
  "What role does gratitude play in your spiritual life?",
  "How can you better care for your spiritual well-being?",
  "What Islamic knowledge do you want to acquire?",
  "How do you handle trials with faith and patience?",
  "What motivates you to be a better Muslim?",
  "How can you strengthen your family ties Islamically?",
  "What charity or good deed calls to your heart today?",
  "How do you seek Allah's guidance in decisions?",
  "What aspect of Paradise do you look forward to most?",
];

export const getDailyQuestion = (): string => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return REFLECTION_QUESTIONS[dayOfYear % REFLECTION_QUESTIONS.length];
};