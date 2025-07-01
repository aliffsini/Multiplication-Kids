import { useState, useEffect } from 'react';
import { QuizSetup } from '@/components/quiz-setup';
import { QuizInterface } from '@/components/quiz-interface';
import { ResultsScreen } from '@/components/results-screen';
import { Question, QuizSettings, QuizState } from '@/types/quiz';
import { quizGenerator } from '@/lib/quiz-generator';

type Screen = 'setup' | 'quiz' | 'results';

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('setup');
  const [quizState, setQuizState] = useState<QuizState>({
    settings: {
      selectedTables: [],
      questionCount: 10,
      timerEnabled: false,
      timePerQuestion: 10
    },
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    isComplete: false,
    startTime: 0
  });

  const handleStartQuiz = (settings: QuizSettings) => {
    const questions = quizGenerator.generateQuestions(settings);
    
    setQuizState({
      settings,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      isComplete: false,
      startTime: Date.now()
    });
    
    setCurrentScreen('quiz');
  };

  const handleAnswerSubmit = (answer: number) => {
    setQuizState(prev => {
      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      const isCorrect = answer === currentQuestion.answer;
      
      // Update the current question with user's answer
      const updatedQuestions = [...prev.questions];
      updatedQuestions[prev.currentQuestionIndex] = {
        ...currentQuestion,
        userAnswer: answer,
        isCorrect,
        timeSpent: Date.now() - prev.startTime
      };

      return {
        ...prev,
        questions: updatedQuestions,
        score: isCorrect ? prev.score + 1 : prev.score
      };
    });
  };

  const handleNextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: prev.currentQuestionIndex + 1
    }));
  };

  const handleQuizComplete = () => {
    setQuizState(prev => ({
      ...prev,
      isComplete: true,
      endTime: Date.now()
    }));
    setCurrentScreen('results');
  };

  const handleRestartQuiz = () => {
    const newQuestions = quizGenerator.generateQuestions(quizState.settings);
    
    setQuizState(prev => ({
      ...prev,
      questions: newQuestions,
      currentQuestionIndex: 0,
      score: 0,
      isComplete: false,
      startTime: Date.now(),
      endTime: undefined
    }));
    
    setCurrentScreen('quiz');
  };

  const handleNewQuiz = () => {
    setCurrentScreen('setup');
    setQuizState({
      settings: {
        selectedTables: [],
        questionCount: 10,
        timerEnabled: false,
        timePerQuestion: 10
      },
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      isComplete: false,
      startTime: 0
    });
  };

  switch (currentScreen) {
    case 'setup':
      return <QuizSetup onStartQuiz={handleStartQuiz} />;
    
    case 'quiz':
      return (
        <QuizInterface
          questions={quizState.questions}
          settings={quizState.settings}
          currentQuestionIndex={quizState.currentQuestionIndex}
          onAnswerSubmit={handleAnswerSubmit}
          onNextQuestion={handleNextQuestion}
          onQuizComplete={handleQuizComplete}
          onGoHome={handleNewQuiz}
          score={quizState.score}
        />
      );
    
    case 'results':
      return (
        <ResultsScreen
          questions={quizState.questions}
          score={quizState.score}
          onRestartQuiz={handleRestartQuiz}
          onNewQuiz={handleNewQuiz}
        />
      );
    
    default:
      return <QuizSetup onStartQuiz={handleStartQuiz} />;
  }
}
