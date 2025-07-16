import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  onAnswer: (selectedAnswer: number, isCorrect: boolean) => void;
  isAnswered: boolean;
  selectedAnswer: number | null;
  timeLimit?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  currentQuestion,
  totalQuestions,
  onAnswer,
  isAnswered,
  selectedAnswer,
  timeLimit = 30
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    if (isAnswered || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          onAnswer(-1, false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, onAnswer]);

  useEffect(() => {
    // Reset timer when question changes
    setTimeLeft(timeLimit);
    setShowExplanation(false);
  }, [question.id, timeLimit]);

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    
    const isCorrect = answerIndex === question.correctAnswer;
    onAnswer(answerIndex, isCorrect);
    
    if (question.explanation) {
      setTimeout(() => setShowExplanation(true), 1000);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!isAnswered) return "hover:bg-quiz-primary/10 hover:border-quiz-primary";
    
    if (index === question.correctAnswer) {
      return "bg-quiz-success/20 border-quiz-success text-quiz-success";
    }
    
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return "bg-quiz-error/20 border-quiz-error text-quiz-error";
    }
    
    return "opacity-50";
  };

  const getOptionIcon = (index: number) => {
    if (!isAnswered) return null;
    
    if (index === question.correctAnswer) {
      return <CheckCircle className="h-5 w-5 text-quiz-success" />;
    }
    
    if (index === selectedAnswer && index !== question.correctAnswer) {
      return <XCircle className="h-5 w-5 text-quiz-error" />;
    }
    
    return null;
  };

  const progressPercentage = ((currentQuestion - 1) / totalQuestions) * 100;
  const timePercentage = (timeLeft / timeLimit) * 100;

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl animate-fade-in">
        {/* Progress and Timer */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {timeLeft}s
            </div>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-2" />
          <Progress 
            value={timePercentage} 
            className={`h-1 ${timeLeft <= 10 ? 'animate-pulse' : ''}`}
          />
        </div>

        {/* Question Card */}
        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-card-quiz animate-bounce-in">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8 text-center leading-relaxed">
              {question.question}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isAnswered}
                  className={`
                    p-6 text-left border-2 rounded-lg transition-all duration-300
                    ${getOptionStyle(index)}
                    ${!isAnswered ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
                    flex items-center justify-between group
                  `}
                >
                  <span className="text-lg font-medium">{option}</span>
                  {getOptionIcon(index)}
                </button>
              ))}
            </div>

            {/* Explanation */}
            {showExplanation && question.explanation && (
              <div className="mt-8 p-6 bg-muted/50 rounded-lg border-l-4 border-quiz-primary animate-slide-in">
                <h4 className="font-semibold mb-2 text-quiz-primary">Explanation:</h4>
                <p className="text-muted-foreground">{question.explanation}</p>
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="mt-8 text-center">
                <Button
                  variant="quiz-secondary"
                  size="lg"
                  className="animate-bounce-in"
                  onClick={() => {
                    // This would be handled by the parent component
                    window.dispatchEvent(new CustomEvent('nextQuestion'));
                  }}
                >
                  <ArrowRight className="h-5 w-5 mr-2" />
                  {currentQuestion === totalQuestions ? 'View Results' : 'Next Question'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default QuizQuestion;