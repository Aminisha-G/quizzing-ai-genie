import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Brain, Sparkles, Play, BookOpen, Zap } from 'lucide-react';
import heroImage from '@/assets/quiz-hero.jpg';
import backgroundImage from '@/assets/quiz-background.jpg';

interface QuizSetupProps {
  onStartQuiz: (topic: string, questionCount: number, apiKey?: string) => void;
  isLoading: boolean;
}

const QuizSetup: React.FC<QuizSetupProps> = ({ onStartQuiz, isLoading }) => {
  const [topic, setTopic] = useState('');
  const [questionCount, setQuestionCount] = useState([5]);
  const [apiKey, setApiKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim()) {
      onStartQuiz(topic.trim(), questionCount[0], apiKey || undefined);
    }
  };

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
      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-8 h-8 bg-accent/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-32 w-6 h-6 bg-primary/20 rounded-full animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-32 left-32 w-10 h-10 bg-accent/15 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 right-20 w-4 h-4 bg-primary/25 rounded-full animate-float" style={{animationDelay: '0.5s'}}></div>
      </div>

      <div className="w-full max-w-2xl animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6 relative">
            <img 
              src={heroImage} 
              alt="Quiz Hero" 
              className="w-40 h-24 object-cover rounded-xl shadow-lg animate-scale-pulse"
            />
            <div className="absolute -top-3 -right-3 p-3 bg-gradient-primary rounded-full shadow-quiz animate-wiggle">
              <Zap className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-shimmer bg-[length:200%_100%]">
            QuizMaster AI
          </h1>
          <p className="text-xl text-card-foreground/80 flex items-center justify-center gap-2">
            <BookOpen className="w-5 h-5 animate-bounce" />
            Generate custom quizzes on any topic using AI
          </p>
        </div>

        <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-card-quiz animate-bounce-in">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-quiz-primary" />
              Create Your Quiz
            </CardTitle>
            <CardDescription>
              Enter a topic and we'll generate engaging questions for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="topic" className="text-base font-medium">
                  Quiz Topic
                </Label>
                <Input
                  id="topic"
                  type="text"
                  placeholder="e.g., JavaScript, World History, Science..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="text-lg py-3 border-2 focus:border-quiz-primary transition-colors"
                  required
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Number of Questions: {questionCount[0]}
                </Label>
                <Slider
                  value={questionCount}
                  onValueChange={setQuestionCount}
                  max={15}
                  min={3}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>3 questions</span>
                  <span>15 questions</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="apiKey" className="text-base font-medium">
                  OpenAI API Key
                  <span className="text-sm text-muted-foreground ml-2">(Optional - for testing)</span>
                </Label>
                <Input
                  id="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="text-sm border-2 focus:border-quiz-secondary transition-colors"
                />
                <p className="text-xs text-muted-foreground">
                  For production use, connect to Supabase for secure API key storage
                </p>
              </div>

              <Button
                type="submit"
                variant="quiz"
                size="lg"
                className="w-full text-lg py-6"
                disabled={isLoading || !topic.trim()}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Generating Quiz...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Play className="h-5 w-5" />
                    Generate Quiz
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground text-sm">
            Powered by OpenAI • Questions generated in real-time
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuizSetup;