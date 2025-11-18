import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Slider } from './ui/slider';
import { Briefcase, User, TrendingUp, BookOpen, X } from 'lucide-react';
import { 
  Profile, 
  defaultCompetencies, 
  defaultCareers, 
  competencyLearningPaths 
} from '../services/career-data';

interface CareerViewProps {
  profiles: Profile[];
  selectedProfileIndex: number | null;
  onAddProfile: (profile: Profile) => void;
  onSelectProfile: (index: number | null) => void;
}

export function CareerView({ 
  profiles, 
  selectedProfileIndex, 
  onAddProfile, 
  onSelectProfile 
}: CareerViewProps) {
  const [isCreatingProfile, setIsCreatingProfile] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileCompetencies, setNewProfileCompetencies] = useState<Record<string, number>>({});

  const selectedProfile = selectedProfileIndex !== null ? profiles[selectedProfileIndex] : null;

  const startCreatingProfile = () => {
    setIsCreatingProfile(true);
    setNewProfileName('');
    setNewProfileCompetencies({});
    // Initialize all competencies to 1
    const initialCompetencies: Record<string, number> = {};
    defaultCompetencies.forEach(comp => {
      initialCompetencies[comp.name] = 1;
    });
    setNewProfileCompetencies(initialCompetencies);
  };

  const cancelCreatingProfile = () => {
    setIsCreatingProfile(false);
    setNewProfileName('');
    setNewProfileCompetencies({});
  };

  const saveProfile = () => {
    if (!newProfileName.trim()) {
      return;
    }
    const newProfile: Profile = {
      name: newProfileName.trim(),
      competencies: { ...newProfileCompetencies }
    };
    onAddProfile(newProfile);
    onSelectProfile(profiles.length);
    setIsCreatingProfile(false);
    setNewProfileName('');
    setNewProfileCompetencies({});
  };

  const getCareerRecommendations = (profile: Profile, limit: number = 3) => {
    const results = defaultCareers.map(career => ({
      career,
      score: career.calculateCompatibilityScore(profile.competencies)
    }));
    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit);
  };

  const getLearningPathRecommendations = (profile: Profile) => {
    const recommendations: Array<{ competency: string; paths: string[] }> = [];
    for (const [compName, level] of Object.entries(profile.competencies)) {
      if (level < 3) {
        const paths = competencyLearningPaths[compName] || [];
        if (paths.length > 0) {
          recommendations.push({ competency: compName, paths });
        }
      }
    }
    return recommendations;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl mb-2">Career Guidance</h2>
          <p className="text-gray-600">Discover career paths that match your skills</p>
        </div>
        <Briefcase className="w-12 h-12 text-indigo-500" />
      </div>

      {/* Profile Management */}
      <Card>
        <CardHeader>
          <CardTitle>Profiles</CardTitle>
          <CardDescription>
            Create a profile by rating your skills (1-5) to get personalized career recommendations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {profiles.length === 0 && !isCreatingProfile && (
            <div className="text-center py-8 text-gray-500">
              <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No profiles created yet. Create your first profile to get started!</p>
            </div>
          )}

          {!isCreatingProfile && profiles.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Profile:</label>
              <Select
                value={selectedProfileIndex !== null ? selectedProfileIndex.toString() : ''}
                onValueChange={(value) => onSelectProfile(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((profile, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {profile.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {isCreatingProfile ? (
            <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Create New Profile</h3>
                <Button variant="ghost" size="sm" onClick={cancelCreatingProfile}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Name:</label>
                <Input
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium block">Rate your skills (1-5):</label>
                {defaultCompetencies.map((competency) => {
                  const currentValue = newProfileCompetencies[competency.name] ?? 1;
                  return (
                    <div key={competency.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <label className="text-sm font-medium">{competency.name}</label>
                          <p className="text-xs text-gray-500">{competency.description}</p>
                        </div>
                        <span className="text-sm font-medium w-8 text-right ml-4">{currentValue}</span>
                      </div>
                      <div className="px-2 slider-purple">
                        <Slider
                          value={[currentValue]}
                          onValueChange={(values) => {
                            setNewProfileCompetencies({
                              ...newProfileCompetencies,
                              [competency.name]: values[0]
                            });
                          }}
                          min={1}
                          max={5}
                          step={1}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <Button
                onClick={saveProfile}
                disabled={!newProfileName.trim()}
                className="w-full"
              >
                Save Profile
              </Button>
            </div>
          ) : (
            <Button onClick={startCreatingProfile} variant="outline" className="w-full">
              <User className="w-4 h-4 mr-2" />
              Create New Profile
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Career Recommendations */}
      {selectedProfile && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Career Recommendations</CardTitle>
              <CardDescription>
                Top career paths based on your skills for {selectedProfile.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getCareerRecommendations(selectedProfile).map(({ career, score }) => (
                  <Card key={career.name} className="border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{career.name}</CardTitle>
                        <Badge className="bg-indigo-500">
                          {score.toFixed(1)}% Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600">Compatibility</span>
                          <span className="text-sm font-medium">{score.toFixed(1)}%</span>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold mb-2">Learning Path:</h4>
                        <ul className="space-y-1">
                          {career.learningPath.map((path, index) => (
                            <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                              <BookOpen className="w-4 h-4 mt-0.5 text-indigo-500 flex-shrink-0" />
                              <span>{path}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Learning Path Recommendations */}
          {getLearningPathRecommendations(selectedProfile).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skill Improvement Recommendations</CardTitle>
                <CardDescription>
                  Suggested learning paths for skills that need improvement
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {getLearningPathRecommendations(selectedProfile).map(({ competency, paths }) => (
                    <div key={competency} className="border rounded-lg p-4">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-orange-500" />
                        {competency}
                      </h4>
                      <p className="text-sm text-gray-600 mb-2">
                        Current level: {selectedProfile.competencies[competency]}/5
                      </p>
                      <ul className="space-y-1">
                        {paths.map((path, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <BookOpen className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                            <span>{path}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {getLearningPathRecommendations(selectedProfile).length === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Skill Improvement Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  {selectedProfile.name} doesn't have any skills with low ratings. Congratulations!
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {!selectedProfile && profiles.length > 0 && (
        <Card>
          <CardContent className="py-8 text-center text-gray-500">
            <User className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a profile above to see career recommendations</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

