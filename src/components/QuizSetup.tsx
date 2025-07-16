import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Brain, Sparkles, Play } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 bg-gradient-primary rounded-full shadow-quiz animate-pulse-glow">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-quiz-primary to-quiz-secondary bg-clip-text text-transparent mb-4">
            QuizMaster AI
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate custom quizzes on any topic using AI
          </p>
        </div>

        <Card className="bg-card/80 backdrop-blur-sm border-0 shadow-card-quiz animate-bounce-in">
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