import { Question, QuizSettings } from '@/types/quiz';

export class QuizGenerator {
  private recentPairs: Array<{ a: number; b: number }> = [];
  private readonly DUPLICATE_PREVENTION_WINDOW = 5;

  generateQuestions(settings: QuizSettings): Question[] {
    const { selectedTables, questionCount } = settings;
    const questions: Question[] = [];
    this.recentPairs = [];

    // Generate all possible combinations
    const possiblePairs: Array<{ a: number; b: number }> = [];
    
    for (const table of selectedTables) {
      for (let multiplier = 1; multiplier <= 12; multiplier++) {
        possiblePairs.push({ a: table, b: multiplier });
      }
    }

    // Generate questions avoiding commutative duplicates
    for (let i = 0; i < questionCount; i++) {
      const pair = this.selectNextPair(possiblePairs);
      
      questions.push({
        id: `q${i + 1}`,
        multiplicand: pair.a,
        multiplier: pair.b,
        answer: pair.a * pair.b
      });

      this.addToRecentPairs(pair);
    }

    return this.shuffleArray(questions);
  }

  private selectNextPair(possiblePairs: Array<{ a: number; b: number }>): { a: number; b: number } {
    // Filter out pairs that would create commutative duplicates within the window
    const availablePairs = possiblePairs.filter(pair => {
      return !this.isCommutativeDuplicate(pair);
    });

    // If no pairs available (unlikely), use any pair
    const pairsToChooseFrom = availablePairs.length > 0 ? availablePairs : possiblePairs;
    
    // Select random pair
    const randomIndex = Math.floor(Math.random() * pairsToChooseFrom.length);
    return pairsToChooseFrom[randomIndex];
  }

  private isCommutativeDuplicate(pair: { a: number; b: number }): boolean {
    return this.recentPairs.some(recent => 
      (recent.a === pair.a && recent.b === pair.b) ||
      (recent.a === pair.b && recent.b === pair.a)
    );
  }

  private addToRecentPairs(pair: { a: number; b: number }): void {
    this.recentPairs.push(pair);
    
    // Keep only the last N pairs to prevent duplicates
    if (this.recentPairs.length > this.DUPLICATE_PREVENTION_WINDOW) {
      this.recentPairs.shift();
    }
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getAchievement(score: number, total: number): string {
    const percentage = (score / total) * 100;
    
    if (percentage === 100) return "Perfect Score! 🏆";
    if (percentage >= 90) return "Math Champion! 🎉";
    if (percentage >= 80) return "Excellent Work! ⭐";
    if (percentage >= 70) return "Great Job! 👍";
    if (percentage >= 60) return "Good Effort! 💪";
    if (percentage >= 50) return "Keep Practicing! 📚";
    return "Don't Give Up! 🌟";
  }
}

export const quizGenerator = new QuizGenerator();
