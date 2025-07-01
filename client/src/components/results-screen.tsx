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
          <h2 className="text-4xl font-bold mb-4">Multiplication Quiz Results</h2>
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
              Times Tables Answers Review
            </h3>
            <ScrollArea className="h-80 w-full rounded-lg border">
              <div className="p-4 space-y-3">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <span className="bg-slate-200 text-slate-700 font-bold px-3 py-1 rounded-full text-sm">
                        #{index + 1}
                      </span>
                      <span className="font-mono text-lg font-semibold">
                        {question.multiplicand} × {question.multiplier} = {question.answer}
                      </span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-600 font-medium">
                          Your answer: <span className="font-bold">{question.userAnswer ?? 'Not answered'}</span>
                        </span>
                        {question.isCorrect ? (
                          <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Correct</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">Wrong</span>
                          </div>
                        )}
                      </div>
                      {!question.isCorrect && (
                        <div className="text-green-700 font-semibold text-sm bg-green-50 px-3 py-1 rounded-lg border border-green-200">
                          Correct answer: {question.answer}
                        </div>
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
            size="lg"
            className="bg-white text-purple-900 font-bold text-lg py-4 px-8 hover:bg-gray-50 border-2 border-purple-900 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Try Again
          </Button>
          <Button
            onClick={onNewQuiz}
            size="lg"
            className="bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Quiz
          </Button>
          <Button
            onClick={handleShare}
            size="lg"
            className="bg-gradient-to-r from-brand-amber to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold text-lg py-4 px-8 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            <Share className="h-5 w-5 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
