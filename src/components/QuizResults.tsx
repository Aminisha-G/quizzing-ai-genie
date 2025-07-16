import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, RotateCcw, Home, Share2, Star, Award, Sparkles } from 'lucide-react';
import mascotImage from '@/assets/quiz-mascot.jpg';
import backgroundImage from '@/assets/quiz-background.jpg';

interface QuizResult {
  questionIndex: number;
  question: string;
  selectedAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  timeTaken: number;
}

interface QuizResultsProps {
  results: QuizResult[];
  topic: string;
  totalTime: number;
  onRestart: () => void;
  onNewQuiz: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  results,
  topic,
  totalTime,
  onRestart,
  onNewQuiz
}) => {
  const correctAnswers = results.filter(r => r.isCorrect).length;
  const totalQuestions = results.length;
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const averageTime = Math.round(totalTime / totalQuestions);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Outstanding!", color: "text-quiz-success", icon: "🏆" };
    if (percentage >= 80) return { message: "Excellent!", color: "text-quiz-success", icon: "🎉" };
    if (percentage >= 70) return { message: "Good job!", color: "text-quiz-secondary", icon: "👏" };
    if (percentage >= 60) return { message: "Not bad!", color: "text-quiz-warning", icon: "👍" };
    return { message: "Keep practicing!", color: "text-quiz-error", icon: "💪" };
  };

  const performance = getPerformanceMessage();

  const saveToHistory = () => {
    const historyItem = {
      topic,
      score: percentage,
      correctAnswers,
      totalQuestions,
      date: new Date().toISOString(),
      totalTime
    };

    const history = JSON.parse(localStorage.getItem('quizHistory') || '[]');
    history.unshift(historyItem);
    // Keep only last 10 quiz results
    localStorage.setItem('quizHistory', JSON.stringify(history.slice(0, 10)));
  };

  React.useEffect(() => {
    saveToHistory();
  }, []);

  return (
    <div 
      className="min-h-screen bg-gradient-background flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Floating celebration elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-16 left-16 w-8 h-8 bg-accent/30 rounded-full animate-float"></div>
        <div className="absolute top-32 right-20 w-6 h-6 bg-primary/25 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-24 left-24 w-10 h-10 bg-accent/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-40 right-40 w-4 h-4 bg-primary/30 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
        <Star className="absolute top-24 left-1/4 w-6 h-6 text-accent/40 animate-wiggle" style={{animationDelay: '1.5s'}} />
        <Award className="absolute bottom-32 right-1/4 w-8 h-8 text-primary/30 animate-bounce" style={{animationDelay: '2.5s'}} />
      </div>

      <div className="w-full max-w-4xl animate-fade-in relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6 relative">
            <img 
              src={mascotImage} 
              alt="Quiz Mascot" 
              className="w-32 h-32 object-cover rounded-full shadow-lg animate-scale-pulse border-4 border-primary/30"
            />
            <div className="absolute -top-2 -right-2 p-3 bg-gradient-success rounded-full shadow-quiz animate-bounce-in">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="absolute -bottom-2 -left-2 p-2 bg-gradient-primary rounded-full shadow-quiz animate-wiggle">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            <span className="animate-bounce inline-block">{performance.message}</span> 
            <span className="text-4xl ml-2 animate-wiggle inline-block">{performance.icon}</span>
          </h1>
          <p className="text-xl text-card-foreground/80">
            Quiz completed: <span className="font-semibold text-accent animate-pulse">{topic}</span>
          </p>
        </div>

        {/* Score Overview */}
        <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-card-quiz mb-8 animate-bounce-in">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Your Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-quiz-primary mb-2">
                  {percentage}%
                </div>
                <p className="text-muted-foreground">Overall Score</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-quiz-secondary mb-2">
                  {correctAnswers}/{totalQuestions}
                </div>
                <p className="text-muted-foreground">Correct Answers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-quiz-success mb-2">
                  {Math.floor(totalTime / 60)}:{(totalTime % 60).toString().padStart(2, '0')}
                </div>
                <p className="text-muted-foreground">Total Time</p>
              </div>
            </div>

            <Progress value={percentage} className="h-4 mb-4" />
            <p className="text-center text-sm text-muted-foreground">
              Average time per question: {averageTime} seconds
            </p>
          </CardContent>
        </Card>

        {/* Detailed Results */}
        <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-card-quiz mb-8 animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl">Question Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    result.isCorrect 
                      ? 'border-quiz-success bg-quiz-success/10' 
                      : 'border-quiz-error bg-quiz-error/10'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium mb-2">
                        Question {index + 1}: {result.question}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        {result.isCorrect ? (
                          <span className="text-quiz-success flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Correct
                          </span>
                        ) : (
                          <span className="text-quiz-error">Incorrect</span>
                        )}
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {result.timeTaken}s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="quiz-outline"
            size="lg"
            onClick={onRestart}
            className="w-full"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Retake Quiz
          </Button>
          
          <Button
            variant="quiz"
            size="lg"
            onClick={onNewQuiz}
            className="w-full"
          >
            <Home className="h-5 w-5 mr-2" />
            New Quiz
          </Button>

          <Button
            variant="quiz-secondary"
            size="lg"
            onClick={() => {
              const shareText = `I just scored ${percentage}% on a ${topic} quiz! 🎯 Got ${correctAnswers}/${totalQuestions} questions right.`;
              if (navigator.share) {
                navigator.share({ text: shareText });
              } else {
                navigator.clipboard.writeText(shareText);
                // You could add a toast here
              }
            }}
            className="w-full"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
