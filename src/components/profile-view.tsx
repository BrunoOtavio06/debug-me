import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { UserProgress } from '../App';
import { Award, Trophy, BookOpen, Code, Star, Zap, Target, Flame } from 'lucide-react';

interface ProfileViewProps {
  userProgress: UserProgress;
}

const allBadges = [
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: <BookOpen className="w-6 h-6" />,
    color: 'from-blue-400 to-blue-600'
  },
  {
    id: 'first-five',
    name: 'Learning Streak',
    description: 'Complete 5 lessons',
    icon: <Star className="w-6 h-6" />,
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'challenge-master',
    name: 'Challenge Master',
    description: 'Complete 3 challenges',
    icon: <Trophy className="w-6 h-6" />,
    color: 'from-purple-400 to-pink-600'
  },
  {
    id: 'level-five',
    name: 'Rising Star',
    description: 'Reach Level 5',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'perfect-score',
    name: 'Perfectionist',
    description: 'Get 100% on any quiz',
    icon: <Target className="w-6 h-6" />,
    color: 'from-red-400 to-pink-600'
  },
  {
    id: 'week-streak',
    name: 'Dedicated Learner',
    description: 'Maintain a 7-day streak',
    icon: <Flame className="w-6 h-6" />,
    color: 'from-orange-400 to-red-600'
  }
];

export function ProfileView({ userProgress }: ProfileViewProps) {
  const totalLessons = 5;
  const totalChallenges = 5;
  const progressPercentage = ((userProgress.completedLessons.length + userProgress.completedChallenges.length) / (totalLessons + totalChallenges)) * 100;

  const earnedBadges = allBadges.filter(badge => userProgress.badges.includes(badge.id));
  const lockedBadges = allBadges.filter(badge => !userProgress.badges.includes(badge.id));

  const stats = [
    {
      label: 'Total XP',
      value: userProgress.xp + (userProgress.level - 1) * 100,
      icon: <Star className="w-5 h-5 text-yellow-500" />
    },
    {
      label: 'Current Level',
      value: userProgress.level,
      icon: <Zap className="w-5 h-5 text-purple-500" />
    },
    {
      label: 'Lessons Completed',
      value: `${userProgress.completedLessons.length}/${totalLessons}`,
      icon: <BookOpen className="w-5 h-5 text-blue-500" />
    },
    {
      label: 'Challenges Completed',
      value: `${userProgress.completedChallenges.length}/${totalChallenges}`,
      icon: <Code className="w-5 h-5 text-green-500" />
    },
    {
      label: 'Current Streak',
      value: `${userProgress.streak} days`,
      icon: <Flame className="w-5 h-5 text-orange-500" />
    },
    {
      label: 'Badges Earned',
      value: `${userProgress.badges.length}/${allBadges.length}`,
      icon: <Award className="w-5 h-5 text-pink-500" />
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl mb-2">Your Profile</h2>
        <p className="text-gray-600">Track your learning journey and achievements</p>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {userProgress.completedLessons.length + userProgress.completedChallenges.length} of {totalLessons + totalChallenges} activities completed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="h-4" />
          <p className="mt-2 text-sm text-gray-600">
            {Math.round(progressPercentage)}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl">{stat.value}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Badges Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl mb-2">Achievements</h3>
          <p className="text-sm text-gray-600">
            Collect badges by completing milestones
          </p>
        </div>

        {/* Earned Badges */}
        {earnedBadges.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm">Earned Badges</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {earnedBadges.map((badge) => (
                <Card key={badge.id} className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className={`p-4 rounded-full bg-gradient-to-br ${badge.color} text-white`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1">{badge.name}</h4>
                        <p className="text-xs text-gray-600">{badge.description}</p>
                        <Badge className="mt-2 bg-green-500">Unlocked</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locked Badges */}
        {lockedBadges.length > 0 && (
          <div>
            <h4 className="mb-3 text-sm text-gray-500">Locked Badges</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {lockedBadges.map((badge) => (
                <Card key={badge.id} className="opacity-60">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="p-4 rounded-full bg-gray-200 text-gray-400">
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="mb-1 text-gray-600">{badge.name}</h4>
                        <p className="text-xs text-gray-500">{badge.description}</p>
                        <Badge variant="outline" className="mt-2">Locked</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
