import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Check, ArrowRight, Timer } from 'lucide-react';
import { Question, QuizSettings } from '@/types/quiz';

interface QuizInterfaceProps {
  questions: Question[];
  settings: QuizSettings;
  currentQuestionIndex: number;
  onAnswerSubmit: (answer: number) => void;
  onNextQuestion: () => void;
  onQuizComplete: () => void;
  score: number;
}

export function QuizInterface({
  questions,
  settings,
  currentQuestionIndex,
  onAnswerSubmit,
  onNextQuestion,
  onQuizComplete,
  score
}: QuizInterfaceProps) {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(settings.timePerQuestion);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    // Reset for new question
    setUserAnswer('');
    setShowFeedback(false);
    setHasSubmitted(false);
    setTimeLeft(settings.timePerQuestion);
    
    // Focus input
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Start timer if enabled
    if (settings.timerEnabled) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [currentQuestionIndex, settings.timerEnabled, settings.timePerQuestion]);

  const handleSubmit = () => {
    if (hasSubmitted) return;

    const answer = parseInt(userAnswer) || 0;
    setHasSubmitted(true);
    setShowFeedback(true);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    onAnswerSubmit(answer);

    // Auto-advance after showing feedback
    setTimeout(() => {
      if (isLastQuestion) {
        onQuizComplete();
      } else {
        handleNext();
      }
    }, 2000);
  };

  const handleNext = () => {
    onNextQuestion();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasSubmitted) {
      handleSubmit();
    }
  };

  const isCorrect = currentQuestion.userAnswer === currentQuestion.answer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quiz Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Multiplication Challenge</h2>
          <Progress value={progress} className="max-w-md mx-auto mb-4 h-4 bg-white bg-opacity-20" />
          <div className="flex justify-between max-w-md mx-auto text-sm opacity-90">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            {settings.timerEnabled && !hasSubmitted && (
              <span className="flex items-center gap-1">
                <Timer className="h-4 w-4" />
                {timeLeft}s
              </span>
            )}
            <span>Score: {score}/{currentQuestionIndex + (hasSubmitted ? 1 : 0)}</span>
          </div>
        </div>

        {/* Question Display */}
        <Card className="bg-white text-slate-800 shadow-2xl mb-8 max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="text-6xl font-bold mb-6 text-brand-purple">
              {currentQuestion.multiplicand} × {currentQuestion.multiplier} = ?
            </div>
            
            {/* Answer Input */}
            <div className="mb-6">
              <Input
                ref={inputRef}
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={hasSubmitted}
                className="text-4xl font-bold text-center w-32 h-16 border-4 border-slate-300 focus:border-brand-purple mx-auto"
                placeholder="?"
              />
            </div>

            {/* Submit Button */}
            {!hasSubmitted && (
              <Button
                onClick={handleSubmit}
                className="bg-gradient-to-r from-brand-purple to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-lg py-4 px-10 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 border-0"
                disabled={!userAnswer.trim()}
                size="lg"
              >
                <Check className="h-6 w-6 mr-3" />
                Submit Answer
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Feedback Display */}
        {showFeedback && (
          <div className="text-center mb-6 animate-slide-up">
            {isCorrect ? (
              <div>
                <div className="text-4xl animate-bounce-in mb-2">🎉</div>
                <p className="text-2xl font-bold text-success-green mb-2">Excellent!</p>
                <p className="text-lg opacity-90">You got it right!</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">❌</div>
                <p className="text-2xl font-bold text-error-red mb-2">Oops!</p>
                <p className="text-lg opacity-90">
                  The correct answer is {currentQuestion.answer}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Next Question Button */}
        {showFeedback && !isLastQuestion && (
          <div className="text-center">
            <Button
              onClick={handleNext}
              className="bg-white text-purple-900 font-bold text-lg py-4 px-10 hover:bg-gray-50 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 rounded-xl"
              size="lg"
            >
              Next Question <ArrowRight className="h-6 w-6 ml-3" />
            </Button>
          </div>
        )}

        {/* Quiz Complete Message */}
        {showFeedback && isLastQuestion && (
          <div className="text-center">
            <p className="text-xl mb-4">🏁 Quiz Complete!</p>
            <p className="text-lg opacity-90">Preparing your results...</p>
          </div>
        )}
      </div>
    </div>
  );
}
