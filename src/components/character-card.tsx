import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { UserProgress } from '../App';
import { Sparkles, Zap } from 'lucide-react';

interface CharacterCardProps {
  userProgress: UserProgress;
}

export function CharacterCard({ userProgress }: CharacterCardProps) {
  const getCharacterEmoji = (type: string, level: number) => {
    if (type === 'wizard') {
      if (level < 5) return '🧙‍♂️';
      if (level < 10) return '🧙‍♀️✨';
      return '🧙‍♂️⚡';
    }
    return '👨‍💻';
  };

  const getCharacterTitle = (level: number) => {
    if (level < 5) return 'Code Apprentice';
    if (level < 10) return 'Code Wizard';
    if (level < 15) return 'Code Master';
    return 'Code Grandmaster';
  };

  return (
    <Card className="overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-500" />
          Your Character
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div className="relative">
          <Avatar className="w-32 h-32 border-4 border-purple-300 shadow-lg">
            <AvatarFallback className="text-6xl bg-gradient-to-br from-purple-100 to-indigo-100">
              {getCharacterEmoji(userProgress.characterType, userProgress.level)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full w-12 h-12 flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-sm">{userProgress.level}</span>
          </div>
        </div>
        
        <div className="text-center space-y-1">
          <h3 className="text-xl">{getCharacterTitle(userProgress.level)}</h3>
          <p className="text-sm text-gray-600 flex items-center justify-center gap-1">
            <Zap className="w-4 h-4 text-yellow-500" />
            Level {userProgress.level}
          </p>
        </div>

        <div className="w-full space-y-2 pt-4 border-t border-purple-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Power</span>
            <span>{userProgress.level * 10}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Wisdom</span>
            <span>{userProgress.completedLessons.length * 5}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Focus</span>
            <span>{userProgress.streak * 3}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
