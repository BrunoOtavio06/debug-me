import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { CharacterCard } from './character-card';
import { UserProgress } from '../App';
import { Flame, Star, Award, Target } from 'lucide-react';

interface ProgressDashboardProps {
  userProgress: UserProgress;
}

export function ProgressDashboard({ userProgress }: ProgressDashboardProps) {
  const completionPercentage = (userProgress.xp / userProgress.xpToNextLevel) * 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Character Card */}
      <div className="lg:col-span-1">
        <CharacterCard userProgress={userProgress} />
      </div>

      {/* Stats and Progress */}
      <div className="lg:col-span-2 space-y-6">
        {/* XP Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Level Progress
            </CardTitle>
            <CardDescription>
              Level {userProgress.level} - {userProgress.xp} / {userProgress.xpToNextLevel} XP
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={completionPercentage} className="h-4" />
            <p className="mt-2 text-sm text-gray-600">
              {userProgress.xpToNextLevel - userProgress.xp} XP until Level {userProgress.level + 1}
            </p>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Flame className="w-4 h-4 text-orange-500" />
                Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{userProgress.streak}</p>
              <p className="text-xs text-gray-600 mt-1">days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-500" />
                Lessons
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{userProgress.completedLessons.length}</p>
              <p className="text-xs text-gray-600 mt-1">completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Award className="w-4 h-4 text-purple-500" />
                Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl">{userProgress.badges.length}</p>
              <p className="text-xs text-gray-600 mt-1">earned</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Achievements */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Challenges Completed</span>
              <Badge variant="secondary">{userProgress.completedChallenges.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Current Rank</span>
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-500">
                {userProgress.level < 5 ? 'Novice' : userProgress.level < 10 ? 'Apprentice' : 'Expert'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total XP Earned</span>
              <Badge variant="outline">
                {userProgress.xp + (userProgress.level - 1) * 100}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
