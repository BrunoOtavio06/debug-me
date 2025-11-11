import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { ProgressDashboard } from './components/progress-dashboard';
import { LessonsView } from './components/lessons-view';
import { ChallengesView } from './components/challenges-view';
import { ProfileView } from './components/profile-view';
import { Code, Trophy, User, BookOpen } from 'lucide-react';

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  streak: number;
  completedLessons: string[];
  completedChallenges: string[];
  badges: string[];
  characterType: string;
}

export default function App() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    streak: 0,
    completedLessons: [],
    completedChallenges: [],
    badges: [],
    characterType: 'wizard'
  });

  const addXP = (amount: number) => {
    setUserProgress(prev => {
      let newXP = prev.xp + amount;
      let newLevel = prev.level;
      let newXPToNext = prev.xpToNextLevel;

      // Level up logic
      while (newXP >= newXPToNext) {
        newXP -= newXPToNext;
        newLevel += 1;
        newXPToNext = Math.floor(newXPToNext * 1.5);
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        xpToNextLevel: newXPToNext
      };
    });
  };

  const completeLesson = (lessonId: string, xpReward: number) => {
    if (!userProgress.completedLessons.includes(lessonId)) {
      setUserProgress(prev => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId]
      }));
      addXP(xpReward);
    }
  };

  const completeChallenge = (challengeId: string, xpReward: number) => {
    if (!userProgress.completedChallenges.includes(challengeId)) {
      setUserProgress(prev => ({
        ...prev,
        completedChallenges: [...prev.completedChallenges, challengeId]
      }));
      addXP(xpReward);
    }
  };

  const earnBadge = (badgeId: string) => {
    if (!userProgress.badges.includes(badgeId)) {
      setUserProgress(prev => ({
        ...prev,
        badges: [...prev.badges, badgeId]
      }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl mb-2 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
            CodeQuest Academy
          </h1>
          <p className="text-gray-600">Learn coding through adventure and exploration!</p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="lessons" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span className="hidden sm:inline">Lessons</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <ProgressDashboard userProgress={userProgress} />
          </TabsContent>

          <TabsContent value="lessons" className="space-y-6">
            <LessonsView 
              userProgress={userProgress} 
              onCompleteLesson={completeLesson}
              onEarnBadge={earnBadge}
            />
          </TabsContent>

          <TabsContent value="challenges" className="space-y-6">
            <ChallengesView 
              userProgress={userProgress} 
              onCompleteChallenge={completeChallenge}
              onEarnBadge={earnBadge}
            />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileView userProgress={userProgress} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
