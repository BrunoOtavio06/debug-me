import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CheckCircle2, Lightbulb, Code, Trophy } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface ChallengeDialogProps {
  challenge: {
    id: string;
    title: string;
    xpReward: number;
    problem: string;
    starterCode: string;
    solution: string;
    hints: string[];
    testCases: {
      input: string;
      expected: string;
    }[];
  };
  isCompleted: boolean;
  onClose: () => void;
  onComplete: (xp: number) => void;
}

export function ChallengeDialog({ challenge, isCompleted, onClose, onComplete }: ChallengeDialogProps) {
  const [code, setCode] = useState(challenge.starterCode);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);

  const runTests = () => {
    // Simulated test runner
    // In a real app, you would execute the code safely
    const normalizedCode = code.toLowerCase().replace(/\s+/g, '');
    const normalizedSolution = challenge.solution.toLowerCase().replace(/\s+/g, '');
    
    // Simple check if code contains key solution elements
    const hasReturn = code.includes('return');
    const isSimilarToSolution = normalizedCode.length > challenge.starterCode.length;
    
    const results = challenge.testCases.map((testCase, index) => {
      const passed = hasReturn && isSimilarToSolution;
      return {
        passed,
        message: passed 
          ? `Test ${index + 1} passed ✓` 
          : `Test ${index + 1} failed - Expected ${testCase.expected}`
      };
    });

    setTestResults(results);

    const allPassed = results.every(r => r.passed);
    
    if (allPassed) {
      toast.success('All tests passed! Challenge complete!', {
        icon: <Trophy className="w-4 h-4" />
      });
      
      if (!isCompleted) {
        onComplete(challenge.xpReward);
        toast.success(`+${challenge.xpReward} XP earned!`);
      }
    } else {
      toast.error('Some tests failed. Keep trying!');
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            {challenge.title}
          </DialogTitle>
          <DialogDescription>
            Complete this challenge to earn {challenge.xpReward} XP
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="problem" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="problem">Problem</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="hints">Hints</TabsTrigger>
          </TabsList>

          <TabsContent value="problem" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3">Challenge Description</h3>
                <p className="text-gray-700 leading-relaxed">{challenge.problem}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3">Test Cases</h3>
                <div className="space-y-2">
                  {challenge.testCases.map((testCase, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded">
                      <div className="text-sm">
                        <span className="text-gray-600">Input:</span> {testCase.input}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Expected:</span> {testCase.expected}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="code" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3>Your Code</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCode(challenge.starterCode)}
                    >
                      Reset
                    </Button>
                  </div>
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="font-mono text-sm min-h-[300px] bg-gray-900 text-gray-100 border-gray-700"
                    placeholder="Write your code here..."
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={runTests} className="flex-1">
                    Run Tests
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowSolution(!showSolution)}
                  >
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </Button>
                </div>

                {testResults.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h4 className="mb-3">Test Results</h4>
                      <div className="space-y-2">
                        {testResults.map((result, index) => (
                          <div
                            key={index}
                            className={`flex items-center gap-2 p-2 rounded ${
                              result.passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}
                          >
                            <CheckCircle2 className={`w-4 h-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`} />
                            <span className="text-sm">{result.message}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {showSolution && (
                  <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="pt-6">
                      <h4 className="mb-3 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Solution
                      </h4>
                      <Card className="bg-gray-900">
                        <CardContent className="p-4">
                          <pre className="text-sm text-gray-100 overflow-x-auto">
                            <code>{challenge.solution}</code>
                          </pre>
                        </CardContent>
                      </Card>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hints" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-yellow-500" />
                  <h3>Hints</h3>
                </div>
                
                {!showHints ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">
                      Try solving the challenge on your own first!
                    </p>
                    <Button onClick={() => setShowHints(true)} variant="outline">
                      Show Hints
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {challenge.hints.map((hint, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="flex gap-3">
                          <Badge className="bg-blue-500 shrink-0">
                            {index + 1}
                          </Badge>
                          <p className="text-gray-700">{hint}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {testResults.every(r => r.passed) && testResults.length > 0 && (
            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-lg py-2 px-4">
              Challenge Complete! ✓
            </Badge>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
