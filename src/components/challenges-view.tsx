import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { UserProgress } from '../App';
import { Trophy, Lock, CheckCircle2, Code2, Zap, Star } from 'lucide-react';
import { ChallengeDialog } from './challenge-dialog';

interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  requiredLevel: number;
  topic: string;
  problem: string;
  starterCode: string;
  solution: string;
  testCases: {
    input: string;
    expected: string;
  }[];
  hints: string[];
}

const challenges: Challenge[] = [
  {
    id: 'challenge-1',
    title: 'Double the Number',
    description: 'Write a function that doubles a number',
    difficulty: 'easy',
    xpReward: 80,
    requiredLevel: 2,
    topic: 'Functions',
    problem: 'Create a function called `doubleNumber` that takes a number as input and returns that number multiplied by 2.',
    starterCode: `function doubleNumber(num) {
  // Your code here
  
}

// Test your function
console.log(doubleNumber(5)); // Should output: 10`,
    solution: `function doubleNumber(num) {
  return num * 2;
}`,
    testCases: [
      { input: '5', expected: '10' },
      { input: '0', expected: '0' },
      { input: '-3', expected: '-6' }
    ],
    hints: [
      'Use the * operator to multiply',
      'Remember to use the return keyword'
    ]
  },
  {
    id: 'challenge-2',
    title: 'Even or Odd',
    description: 'Determine if a number is even or odd',
    difficulty: 'easy',
    xpReward: 85,
    requiredLevel: 3,
    topic: 'Conditionals',
    problem: 'Create a function called `isEven` that returns true if a number is even, and false if it is odd.',
    starterCode: `function isEven(num) {
  // Your code here
  
}

// Test your function
console.log(isEven(4)); // Should output: true
console.log(isEven(7)); // Should output: false`,
    solution: `function isEven(num) {
  return num % 2 === 0;
}`,
    testCases: [
      { input: '4', expected: 'true' },
      { input: '7', expected: 'false' },
      { input: '0', expected: 'true' }
    ],
    hints: [
      'Use the modulo operator (%) to find the remainder',
      'If num % 2 equals 0, the number is even'
    ]
  },
  {
    id: 'challenge-3',
    title: 'Sum Array',
    description: 'Calculate the sum of all numbers in an array',
    difficulty: 'medium',
    xpReward: 100,
    requiredLevel: 5,
    topic: 'Arrays & Loops',
    problem: 'Create a function called `sumArray` that takes an array of numbers and returns their sum.',
    starterCode: `function sumArray(numbers) {
  // Your code here
  
}

// Test your function
console.log(sumArray([1, 2, 3, 4])); // Should output: 10`,
    solution: `function sumArray(numbers) {
  let sum = 0;
  for (let i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}`,
    testCases: [
      { input: '[1, 2, 3, 4]', expected: '10' },
      { input: '[0, 0, 0]', expected: '0' },
      { input: '[5, -3, 2]', expected: '4' }
    ],
    hints: [
      'Initialize a variable to store the sum',
      'Use a for loop to iterate through the array',
      'Add each element to your sum variable'
    ]
  },
  {
    id: 'challenge-4',
    title: 'Reverse String',
    description: 'Reverse the characters in a string',
    difficulty: 'medium',
    xpReward: 95,
    requiredLevel: 4,
    topic: 'Strings',
    problem: 'Create a function called `reverseString` that takes a string and returns it reversed.',
    starterCode: `function reverseString(str) {
  // Your code here
  
}

// Test your function
console.log(reverseString("hello")); // Should output: "olleh"`,
    solution: `function reverseString(str) {
  return str.split('').reverse().join('');
}`,
    testCases: [
      { input: '"hello"', expected: '"olleh"' },
      { input: '"code"', expected: '"edoc"' },
      { input: '"a"', expected: '"a"' }
    ],
    hints: [
      'You can convert a string to an array using split()',
      'Arrays have a reverse() method',
      'Use join() to convert the array back to a string'
    ]
  },
  {
    id: 'challenge-5',
    title: 'FizzBuzz',
    description: 'The classic FizzBuzz challenge',
    difficulty: 'hard',
    xpReward: 120,
    requiredLevel: 6,
    topic: 'Logic',
    problem: 'Create a function that prints numbers from 1 to n. For multiples of 3, print "Fizz" instead of the number. For multiples of 5, print "Buzz". For multiples of both 3 and 5, print "FizzBuzz".',
    starterCode: `function fizzBuzz(n) {
  // Your code here
  
}

// Test your function
fizzBuzz(15);`,
    solution: `function fizzBuzz(n) {
  for (let i = 1; i <= n; i++) {
    if (i % 3 === 0 && i % 5 === 0) {
      console.log("FizzBuzz");
    } else if (i % 3 === 0) {
      console.log("Fizz");
    } else if (i % 5 === 0) {
      console.log("Buzz");
    } else {
      console.log(i);
    }
  }
}`,
    testCases: [
      { input: '3', expected: 'Fizz' },
      { input: '5', expected: 'Buzz' },
      { input: '15', expected: 'FizzBuzz' }
    ],
    hints: [
      'Check for divisibility by both 3 and 5 first',
      'Use the modulo operator (%)',
      'Use if-else statements for the conditions'
    ]
  }
];

interface ChallengesViewProps {
  userProgress: UserProgress;
  onCompleteChallenge: (challengeId: string, xpReward: number) => void;
  onEarnBadge: (badgeId: string) => void;
}

export function ChallengesView({ userProgress, onCompleteChallenge, onEarnBadge }: ChallengesViewProps) {
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const isChallengeUnlocked = (challenge: Challenge) => {
    return userProgress.level >= challenge.requiredLevel;
  };

  const isChallengeCompleted = (challengeId: string) => {
    return userProgress.completedChallenges.includes(challengeId);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Code Challenges</h2>
          <p className="text-gray-600">Test your skills with hands-on coding challenges</p>
        </div>
        <Trophy className="w-12 h-12 text-yellow-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {challenges.map((challenge) => {
          const unlocked = isChallengeUnlocked(challenge);
          const completed = isChallengeCompleted(challenge.id);

          return (
            <Card 
              key={challenge.id}
              className={`relative overflow-hidden transition-all hover:shadow-lg ${
                !unlocked ? 'opacity-60' : ''
              } ${completed ? 'border-2 border-yellow-500' : ''}`}
            >
              {completed && (
                <div className="absolute top-3 right-3">
                  <div className="relative">
                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                    <CheckCircle2 className="w-4 h-4 text-green-500 absolute -bottom-1 -right-1" />
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className={`p-3 rounded-lg ${unlocked ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-400'}`}>
                    {unlocked ? <Code2 className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <CardTitle>{challenge.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {challenge.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs">
                    {challenge.topic}
                  </Badge>
                  <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                    {challenge.difficulty}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm">+{challenge.xpReward} XP</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => setSelectedChallenge(challenge)}
                    disabled={!unlocked}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
                  >
                    {completed ? 'Retry' : unlocked ? 'Start' : `Level ${challenge.requiredLevel}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedChallenge && (
        <ChallengeDialog
          challenge={selectedChallenge}
          isCompleted={isChallengeCompleted(selectedChallenge.id)}
          onClose={() => setSelectedChallenge(null)}
          onComplete={(xp) => {
            onCompleteChallenge(selectedChallenge.id, xp);
            if (userProgress.completedChallenges.length + 1 === 3) {
              onEarnBadge('challenge-master');
            }
          }}
        />
      )}
    </div>
  );
}
