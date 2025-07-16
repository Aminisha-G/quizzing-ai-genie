import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Clock, ArrowRight, Target, Zap } from 'lucide-react';
import backgroundImage from '@/assets/quiz-background.jpg';

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
    <div 
      className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-6 h-6 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute top-20 right-16 w-8 h-8 bg-primary/15 rounded-full animate-float" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-20 left-20 w-4 h-4 bg-accent/25 rounded-full animate-float" style={{animationDelay: '0.8s'}}></div>
        <div className="absolute bottom-32 right-32 w-10 h-10 bg-primary/10 rounded-full animate-float" style={{animationDelay: '2.2s'}}></div>
      </div>

      <div className="w-full max-w-4xl animate-fade-in relative z-10">
        {/* Progress and Timer */}
        <div className="mb-6 backdrop-blur-sm bg-card/30 p-4 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <Target className="w-4 h-4 animate-pulse" />
              Question {currentQuestion} of {totalQuestions}
            </span>
            <div className={`flex items-center gap-2 text-sm font-mono transition-colors duration-300 ${
              timeLeft <= 10 ? 'text-destructive animate-pulse' : 'text-card-foreground'
            }`}>
              <Clock className={`h-4 w-4 ${timeLeft <= 10 ? 'animate-wiggle' : ''}`} />
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
        <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-card-quiz animate-bounce-in">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold mb-8 text-center leading-relaxed animate-slide-in flex items-center justify-center gap-3">
              <Zap className="w-6 h-6 text-accent animate-bounce" />
              {question.question}
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerClick(index)}
                  disabled={isAnswered}
                  className={`
                    p-6 text-left border-2 rounded-lg transition-all duration-300 backdrop-blur-sm
                    ${getOptionStyle(index)}
                    ${!isAnswered ? 'hover:scale-105 cursor-pointer hover:shadow-lg' : 'cursor-default'}
                    flex items-center justify-between group animate-fade-in
                    ${selectedAnswer === index && isAnswered ? 'animate-scale-pulse' : ''}
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
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