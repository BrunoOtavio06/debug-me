import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { CheckCircle2, XCircle, Award } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LessonDialogProps {
  lesson: {
    id: string;
    title: string;
    xpReward: number;
    content: {
      explanation: string;
      example: string;
      quiz: {
        question: string;
        options: string[];
        correctAnswer: number;
      }[];
    };
  };
  isCompleted: boolean;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export function LessonDialog({ lesson, isCompleted, onClose, onComplete }: LessonDialogProps) {
  const [currentStep, setCurrentStep] = useState<'learn' | 'quiz' | 'complete'>('learn');
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleQuizAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === lesson.content.quiz[currentQuizIndex].correctAnswer;
    setShowResult(true);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      toast.success('Correct! Well done!');
    } else {
      toast.error('Not quite right. Keep learning!');
    }

    setTimeout(() => {
      if (currentQuizIndex < lesson.content.quiz.length - 1) {
        setCurrentQuizIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        // Quiz complete
        if (!isCompleted && correctAnswers + (isCorrect ? 1 : 0) >= lesson.content.quiz.length) {
          onComplete(lesson.xpReward);
          toast.success(`+${lesson.xpReward} XP earned!`, {
            icon: <Award className="w-4 h-4" />
          });
        }
        setCurrentStep('complete');
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setCurrentStep('quiz');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{lesson.title}</DialogTitle>
          <DialogDescription>
            {currentStep === 'learn' && 'Learn the concept'}
            {currentStep === 'quiz' && `Quiz - Question ${currentQuizIndex + 1} of ${lesson.content.quiz.length}`}
            {currentStep === 'complete' && 'Lesson Complete!'}
          </DialogDescription>
        </DialogHeader>

        {currentStep === 'learn' && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3">Explanation</h3>
              <p className="text-gray-700 leading-relaxed">{lesson.content.explanation}</p>
            </div>

            <div>
              <h3 className="mb-3">Example</h3>
              <Card className="bg-gray-900">
                <CardContent className="p-4">
                  <pre className="text-sm text-gray-100 overflow-x-auto">
                    <code>{lesson.content.example}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setCurrentStep('quiz')}>
                Start Quiz →
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'quiz' && (
          <div className="space-y-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="mb-4">
                {lesson.content.quiz[currentQuizIndex].question}
              </h3>

              <div className="space-y-2">
                {lesson.content.quiz[currentQuizIndex].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && setSelectedAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                      selectedAnswer === index
                        ? showResult
                          ? index === lesson.content.quiz[currentQuizIndex].correctAnswer
                            ? 'border-green-500 bg-green-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-indigo-500 bg-indigo-50'
                        : showResult && index === lesson.content.quiz[currentQuizIndex].correctAnswer
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === lesson.content.quiz[currentQuizIndex].correctAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && selectedAnswer === index && index !== lesson.content.quiz[currentQuizIndex].correctAnswer && (
                        <XCircle className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleQuizAnswer}
                disabled={selectedAnswer === null || showResult}
              >
                Submit Answer
              </Button>
            </div>
          </div>
        )}

        {currentStep === 'complete' && (
          <div className="space-y-6 text-center py-8">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <CheckCircle2 className="w-12 h-12 text-white" />
              </div>
            </div>

            <div>
              <h3 className="text-2xl mb-2">Great Job!</h3>
              <p className="text-gray-600">
                You answered {correctAnswers} out of {lesson.content.quiz.length} questions correctly
              </p>
            </div>

            {!isCompleted && correctAnswers === lesson.content.quiz.length && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-lg py-2 px-4">
                +{lesson.xpReward} XP Earned
              </Badge>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={resetQuiz}>
                Retake Quiz
              </Button>
              <Button onClick={onClose}>
                Continue
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
