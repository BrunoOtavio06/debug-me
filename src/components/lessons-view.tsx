import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { UserProgress } from '../App';
import { Lock, CheckCircle2, BookOpen, Code, Brain, Repeat, List } from 'lucide-react';
import { LessonDialog } from './lesson-dialog';

interface Lesson {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  xpReward: number;
  requiredLevel: number;
  icon: React.ReactNode;
  content: {
    explanation: string;
    example: string;
    quiz: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
  };
}

const lessons: Lesson[] = [
  {
    id: 'variables-1',
    title: 'Introduction to Variables',
    description: 'Learn how to store and use data in your programs',
    topic: 'Variables',
    difficulty: 'beginner',
    xpReward: 50,
    requiredLevel: 1,
    icon: <BookOpen className="w-5 h-5" />,
    content: {
      explanation: 'Variables are containers for storing data values. Think of them like boxes that hold information you want to use later.',
      example: `let name = "Alice";
let age = 25;
let isStudent = true;

console.log(name); // Output: Alice`,
      quiz: [
        {
          question: 'What keyword is used to declare a variable in JavaScript?',
          options: ['var', 'let', 'const', 'All of the above'],
          correctAnswer: 3
        }
      ]
    }
  },
  {
    id: 'functions-1',
    title: 'Creating Functions',
    description: 'Master the art of writing reusable code blocks',
    topic: 'Functions',
    difficulty: 'beginner',
    xpReward: 60,
    requiredLevel: 1,
    icon: <Code className="w-5 h-5" />,
    content: {
      explanation: 'Functions are reusable blocks of code that perform a specific task. They help you organize your code and avoid repetition.',
      example: `function greet(name) {
  return "Hello, " + name + "!";
}

console.log(greet("Bob")); // Output: Hello, Bob!`,
      quiz: [
        {
          question: 'What keyword is used to define a function?',
          options: ['func', 'function', 'def', 'method'],
          correctAnswer: 1
        }
      ]
    }
  },
  {
    id: 'conditionals-1',
    title: 'If Statements',
    description: 'Make decisions in your code with conditionals',
    topic: 'Conditionals',
    difficulty: 'beginner',
    xpReward: 55,
    requiredLevel: 2,
    icon: <Brain className="w-5 h-5" />,
    content: {
      explanation: 'Conditional statements allow your code to make decisions. The if statement executes code only when a condition is true.',
      example: `let score = 85;

if (score >= 80) {
  console.log("Great job!");
} else {
  console.log("Keep practicing!");
}`,
      quiz: [
        {
          question: 'Which operator checks if two values are equal?',
          options: ['=', '==', '===', 'equals'],
          correctAnswer: 2
        }
      ]
    }
  },
  {
    id: 'loops-1',
    title: 'Understanding Loops',
    description: 'Repeat actions efficiently with for and while loops',
    topic: 'Loops',
    difficulty: 'intermediate',
    xpReward: 70,
    requiredLevel: 3,
    icon: <Repeat className="w-5 h-5" />,
    content: {
      explanation: 'Loops allow you to repeat a block of code multiple times. This is useful when you need to perform the same action many times.',
      example: `for (let i = 0; i < 5; i++) {
  console.log("Count: " + i);
}

// Output: Count: 0, 1, 2, 3, 4`,
      quiz: [
        {
          question: 'What does i++ do in a for loop?',
          options: ['Decreases i by 1', 'Increases i by 1', 'Multiplies i by 1', 'Nothing'],
          correctAnswer: 1
        }
      ]
    }
  },
  {
    id: 'arrays-1',
    title: 'Working with Arrays',
    description: 'Store and manipulate lists of data',
    topic: 'Arrays',
    difficulty: 'intermediate',
    xpReward: 65,
    requiredLevel: 4,
    icon: <List className="w-5 h-5" />,
    content: {
      explanation: 'Arrays are used to store multiple values in a single variable. Each value has an index starting from 0.',
      example: `let fruits = ["apple", "banana", "orange"];

console.log(fruits[0]); // Output: apple
fruits.push("grape"); // Add to end
console.log(fruits.length); // Output: 4`,
      quiz: [
        {
          question: 'What is the index of the first element in an array?',
          options: ['1', '0', '-1', 'It depends'],
          correctAnswer: 1
        }
      ]
    }
  }
];

interface LessonsViewProps {
  userProgress: UserProgress;
  onCompleteLesson: (lessonId: string, xpReward: number) => void;
  onEarnBadge: (badgeId: string) => void;
}

export function LessonsView({ userProgress, onCompleteLesson, onEarnBadge }: LessonsViewProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const isLessonUnlocked = (lesson: Lesson) => {
    return userProgress.level >= lesson.requiredLevel;
  };

  const isLessonCompleted = (lessonId: string) => {
    return userProgress.completedLessons.includes(lessonId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Learning Path</h2>
        <p className="text-gray-600">Complete lessons to gain XP and unlock new content</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lessons.map((lesson) => {
          const unlocked = isLessonUnlocked(lesson);
          const completed = isLessonCompleted(lesson.id);

          return (
            <Card 
              key={lesson.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                !unlocked ? 'opacity-60' : ''
              } ${completed ? 'border-2 border-green-500' : ''}`}
            >
              {completed && (
                <div className="absolute top-2 right-2">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${unlocked ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'}`}>
                    {unlocked ? lesson.icon : <Lock className="w-5 h-5" />}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-base">{lesson.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {lesson.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {lesson.topic}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(lesson.difficulty)}`}>
                    {lesson.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm text-gray-600">+{lesson.xpReward} XP</span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedLesson(lesson)}
                    disabled={!unlocked}
                  >
                    {completed ? 'Review' : unlocked ? 'Start' : `Level ${lesson.requiredLevel}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedLesson && (
        <LessonDialog
          lesson={selectedLesson}
          isCompleted={isLessonCompleted(selectedLesson.id)}
          onClose={() => setSelectedLesson(null)}
          onComplete={(xp) => {
            onCompleteLesson(selectedLesson.id, xp);
            if (userProgress.completedLessons.length + 1 === 5) {
              onEarnBadge('first-five');
            }
          }}
        />
      )}
    </div>
  );
}
