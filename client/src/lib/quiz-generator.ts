import { Question, QuizSettings } from '@/types/quiz';

export class QuizGenerator {
  private recentPairs: Array<{ a: number; b: number }> = [];
  private readonly DUPLICATE_PREVENTION_WINDOW = 5;

  generateQuestions(settings: QuizSettings): Question[] {
    const { selectedTables, questionCount } = settings;
    const questions: Question[] = [];
    this.recentPairs = [];

    // Check if this is special mode (specific tables: 3,4,5,6,7,8,9,12)
    const isSpecialMode = this.isSpecialMode(selectedTables);

    if (isSpecialMode) {
      return this.generateSpecialModeQuestions(selectedTables, questionCount);
    }

    // Regular mode generation
    const possiblePairs: Array<{ a: number; b: number }> = [];
    
    for (const table of selectedTables) {
      for (let multiplier = 2; multiplier <= 12; multiplier++) {
        possiblePairs.push({ a: table, b: multiplier });
      }
    }

    // Shuffle the possible pairs first to ensure variety
    const shuffledPairs = this.shuffleArray([...possiblePairs]);

    // Generate questions avoiding consecutive duplicates and commutative pairs
    for (let i = 0; i < questionCount; i++) {
      const pair = this.selectNextPair(shuffledPairs);
      
      questions.push({
        id: `q${i + 1}`,
        multiplicand: pair.a,
        multiplier: pair.b,
        answer: pair.a * pair.b
      });

      this.addToRecentPairs(pair);
    }

    return questions;
  }

  private isSpecialMode(selectedTables: number[]): boolean {
    const specialTables = [3, 4, 5, 6, 7, 8, 9, 12];
    return selectedTables.length === specialTables.length && 
           selectedTables.every(table => specialTables.includes(table)) &&
           specialTables.every(table => selectedTables.includes(table));
  }

  private generateSpecialModeQuestions(selectedTables: number[], questionCount: number): Question[] {
    const questions: Question[] = [];
    const easyNumbers = [2, 10, 11]; // Numbers to avoid on any side
    let lastUsedTable: number | null = null;
    const usedPairs = new Set<string>(); // Track used multiplication pairs

    // Filter available tables and multipliers to exclude easy numbers
    const availableTables = selectedTables.filter(table => !easyNumbers.includes(table));
    const availableMultipliers = [3, 4, 5, 6, 7, 8, 9, 12]; // Exclude 2, 10, 11

    // Generate all possible unique pairs first
    const allPossiblePairs: Array<{ a: number; b: number }> = [];
    for (const table of availableTables) {
      for (const multiplier of availableMultipliers) {
        const pairKey = `${Math.min(table, multiplier)}x${Math.max(table, multiplier)}`;
        if (!allPossiblePairs.find(p => `${Math.min(p.a, p.b)}x${Math.max(p.a, p.b)}` === pairKey)) {
          allPossiblePairs.push({ a: table, b: multiplier });
        }
      }
    }

    // Shuffle the pairs to ensure variety
    const shuffledPairs = this.shuffleArray([...allPossiblePairs]);

    for (let i = 0; i < questionCount && i < shuffledPairs.length; i++) {
      let selectedPair: { a: number; b: number } | null = null;

      // Find a pair that doesn't use the same table as the last question
      for (const pair of shuffledPairs) {
        const pairKey = `${Math.min(pair.a, pair.b)}x${Math.max(pair.a, pair.b)}`;
        const tableInPair = pair.a;
        
        if (!usedPairs.has(pairKey) && 
            (lastUsedTable === null || tableInPair !== lastUsedTable)) {
          selectedPair = pair;
          usedPairs.add(pairKey);
          break;
        }
      }

      // If no valid pair found (rare case), try any unused pair
      if (!selectedPair) {
        for (const pair of shuffledPairs) {
          const pairKey = `${Math.min(pair.a, pair.b)}x${Math.max(pair.a, pair.b)}`;
          if (!usedPairs.has(pairKey)) {
            selectedPair = pair;
            usedPairs.add(pairKey);
            break;
          }
        }
      }

      // If still no pair found, we've exhausted unique combinations
      if (!selectedPair) {
        break;
      }

      questions.push({
        id: `q${i + 1}`,
        multiplicand: selectedPair.a,
        multiplier: selectedPair.b,
        answer: selectedPair.a * selectedPair.b
      });

      lastUsedTable = selectedPair.a;
    }

    return questions;
  }

  private selectNextPair(possiblePairs: Array<{ a: number; b: number }>): { a: number; b: number } {
    // Filter out pairs that would create duplicates within the window
    const availablePairs = possiblePairs.filter(pair => {
      return !this.isRecentDuplicate(pair);
    });

    // If no pairs available, use any pair (rare scenario with limited options)
    const pairsToChooseFrom = availablePairs.length > 0 ? availablePairs : possiblePairs;
    
    // Select random pair from available options
    const randomIndex = Math.floor(Math.random() * pairsToChooseFrom.length);
    return pairsToChooseFrom[randomIndex];
  }

  private isRecentDuplicate(pair: { a: number; b: number }): boolean {
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
