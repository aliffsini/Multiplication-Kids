import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RotateCcw, Plus, Share, Trophy, ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import { Question } from '@/types/quiz';
import { quizGenerator } from '@/lib/quiz-generator';

interface ResultsScreenProps {
  questions: Question[];
  score: number;
  onRestartQuiz: () => void;
  onNewQuiz: () => void;
}

export function ResultsScreen({ questions, score, onRestartQuiz, onNewQuiz }: ResultsScreenProps) {
  const totalQuestions = questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const achievement = quizGenerator.getAchievement(score, totalQuestions);

  const handleShare = async () => {
    const shareText = `I scored ${score}/${totalQuestions} (${percentage}%) on my multiplication quiz! 🎉`;
    const shareData = {
      title: 'My Multiplication Quiz Results',
      text: shareText,
      url: window.location.href
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        alert('Results copied to clipboard!');
      }
    } catch (error) {
      // Final fallback - create a temporary text area
      const textArea = document.createElement('textarea');
      textArea.value = `${shareText} ${window.location.href}`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Results copied to clipboard!');
    }
  };

  const getScoreColor = () => {
    if (percentage >= 90) return 'text-success-green';
    if (percentage >= 70) return 'text-brand-amber';
    return 'text-error-red';
  };

  const getBackgroundGradient = () => {
    if (percentage >= 90) return 'from-green-400 to-blue-500';
    if (percentage >= 70) return 'from-yellow-400 to-orange-500';
    return 'from-purple-400 to-pink-500';
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient()} text-white`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-4xl font-bold mb-4">Quiz Complete!</h2>
          <Card className="max-w-md mx-auto">
            <CardContent className="pt-6 text-slate-800">
              <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`}>
                {score}/{totalQuestions}
              </div>
              <div className="text-xl mb-2">Final Score</div>
              <div className="text-lg text-slate-600 mb-4">{percentage}% Correct</div>
              <div className="p-3 bg-gradient-to-r from-brand-purple to-brand-cyan text-white rounded-lg">
                <Trophy className="inline h-5 w-5 text-brand-amber mr-2" />
                <span className="font-semibold">{achievement}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Review */}
        <Card className="mb-8">
          <CardContent className="p-6 text-slate-800">
            <h3 className="text-2xl font-bold mb-4 text-center">
              <ClipboardList className="inline h-6 w-6 text-brand-purple mr-2" />
              Detailed Review
            </h3>
            <ScrollArea className="max-h-96">
              <div className="space-y-2">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <span className="font-mono text-lg">
                      {question.multiplicand} × {question.multiplier} = {question.answer}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-600">
                        Your answer: {question.userAnswer ?? 'Not answered'}
                      </span>
                      {question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-success-green" />
                      ) : (
                        <XCircle className="h-5 w-5 text-error-red" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={onRestartQuiz}
            className="bg-white text-brand-purple font-bold text-lg py-3 px-8 hover:bg-opacity-90 transition-all duration-200"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={onNewQuiz}
            className="bg-brand-purple hover:bg-purple-700 text-white font-bold text-lg py-3 px-8 transition-colors duration-200"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Quiz
          </Button>
          <Button
            onClick={handleShare}
            className="bg-brand-amber hover:bg-yellow-500 text-white font-bold text-lg py-3 px-8 transition-colors duration-200"
          >
            <Share className="h-5 w-5 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
