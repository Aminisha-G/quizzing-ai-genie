import React, { useState, useEffect } from 'react';
import QuizSetup from '@/components/QuizSetup';
import QuizQuestion from '@/components/QuizQuestion';
import QuizResults from '@/components/QuizResults';
import { generateQuiz } from '@/utils/quizApi';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizResult {
  questionIndex: number;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

type QuizState = 'setup' | 'quiz' | 'results';

const Index = () => {
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quizTopic, setQuizTopic] = useState('');
  const [startTime, setStartTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  
  const { toast } = useToast();

  const handleStartQuiz = async (topic: string, questionCount: number, apiKey?: string) => {
    setIsLoading(true);
    setQuizTopic(topic);
    
    try {
      const generatedQuestions = await generateQuiz(topic, questionCount, apiKey);
      setQuestions(generatedQuestions);
      setQuizState('quiz');
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
      setCurrentQuestionIndex(0);
      setResults([]);
      setIsAnswered(false);
      setSelectedAnswer(null);
      
      toast({
        title: "Quiz Generated!",
        description: `${questionCount} questions about ${topic} are ready.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (answerIndex: number, isCorrect: boolean) => {
    if (isAnswered) return;

    const timeTaken = Math.round((Date.now() - questionStartTime) / 1000);
    const currentQuestion = questions[currentQuestionIndex];
    
    const result: QuizResult = {
      questionIndex: currentQuestionIndex,
      question: currentQuestion.question,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correctAnswer,
      isCorrect,
      timeTaken,
    };

    setResults(prev => [...prev, result]);
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    // Show feedback toast
    toast({
      title: isCorrect ? "Correct! 🎉" : "Incorrect 😔",
      description: isCorrect 
        ? "Great job! Moving to next question..." 
        : `The correct answer was: ${currentQuestion.options[currentQuestion.correctAnswer]}`,
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
      setIsAnswered(false);
      setSelectedAnswer(null);
    } else {
      // Quiz completed
      setQuizState('results');
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setResults([]);
    setQuizState('quiz');
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  const handleNewQuiz = () => {
    setQuizState('setup');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResults([]);
    setQuizTopic('');
    setIsAnswered(false);
    setSelectedAnswer(null);
  };

  // Handle next question event
  useEffect(() => {
    const handleNextQuestionEvent = () => {
      setTimeout(handleNextQuestion, 500);
    };

    window.addEventListener('nextQuestion', handleNextQuestionEvent);
    return () => window.removeEventListener('nextQuestion', handleNextQuestionEvent);
  }, [currentQuestionIndex, questions.length]);

  const totalTime = Math.round((Date.now() - startTime) / 1000);

  if (quizState === 'setup') {
    return <QuizSetup onStartQuiz={handleStartQuiz} isLoading={isLoading} />;
  }

  if (quizState === 'quiz' && questions.length > 0) {
    return (
      <QuizQuestion
        question={questions[currentQuestionIndex]}
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
        isAnswered={isAnswered}
        selectedAnswer={selectedAnswer}
        timeLimit={30}
      />
    );
  }

  if (quizState === 'results') {
    return (
      <QuizResults
        results={results}
        topic={quizTopic}
        totalTime={totalTime}
        onRestart={handleRestart}
        onNewQuiz={handleNewQuiz}
      />
    );
  }

  // Loading state
  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center">
      <div className="text-center">
        <div className="h-16 w-16 border-4 border-quiz-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xl text-muted-foreground">Loading your quiz...</p>
      </div>
    </div>
  );
};

export default Index;
