import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Loader2, Brain, ScrollText } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { generateFlashcards } from '@/lib/openrouter';

interface Flashcard {
  question: string;
  answer: string;
}

export function FlashcardGenerator() {
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  const characterCount = text.length;
  const isValidLength = characterCount >= 1000 && characterCount <= 10000;
  const progress = Math.min((characterCount / 10000) * 100, 100);

  const handleGenerate = async () => {
    if (!isValidLength) {
      setError('Text must be between 1,000 and 10,000 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generatedFlashcards = await generateFlashcards(text);
      setFlashcards(generatedFlashcards);
    } catch (err) {
      setError('Failed to generate flashcards. Please try again.');
      console.error('Error generating flashcards:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ScrollText className="h-5 w-5" />
            Input Text
          </CardTitle>
          <CardDescription>
            Paste your text below. The AI will analyze it and generate relevant flashcards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Enter your text here (minimum 1000 characters)"
            className="min-h-[300px] resize-none"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Characters</span>
              <span className={isValidLength ? 'text-muted-foreground' : 'text-destructive'}>
                {characterCount}/10000
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            className="w-full"
            size="lg"
            onClick={handleGenerate}
            disabled={!isValidLength || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Generating Flashcards...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-5 w-5" />
                Generate Flashcards
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {flashcards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Flashcards</CardTitle>
            <CardDescription>
              Review and study the AI-generated flashcards below.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {flashcards.map((flashcard, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Question</h4>
                        <p className="text-lg">{flashcard.question}</p>
                      </div>
                      <Separator />
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-2">Answer</h4>
                        <p className="text-lg">{flashcard.answer}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}