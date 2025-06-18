
import React, { useState } from 'react';
import { User, DollarSign, Target, Calendar, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface PersonalProfile {
  currentIncome: number;
  investmentAmount: number;
  targetMonthlyIncome: number;
  riskTolerance: 'conservative' | 'moderate' | 'aggressive';
  timeline: number; // years to freedom
  location: string;
  situation: 'single' | 'married' | 'family';
  age: number;
}

interface PersonalProfileFormProps {
  profile: PersonalProfile;
  onProfileChange: (profile: PersonalProfile) => void;
  onClose: () => void;
}

const presets = {
  'high-income': {
    currentIncome: 150000,
    investmentAmount: 100000,
    targetMonthlyIncome: 12500,
    riskTolerance: 'moderate' as const,
    timeline: 3,
    location: 'Major City',
    situation: 'married' as const,
    age: 35
  },
  'early-retiree': {
    currentIncome: 75000,
    investmentAmount: 50000,
    targetMonthlyIncome: 6250,
    riskTolerance: 'aggressive' as const,
    timeline: 2,
    location: 'Suburban',
    situation: 'single' as const,
    age: 28
  },
  'serial-entrepreneur': {
    currentIncome: 200000,
    investmentAmount: 150000,
    targetMonthlyIncome: 16700,
    riskTolerance: 'aggressive' as const,
    timeline: 4,
    location: 'Tech Hub',
    situation: 'family' as const,
    age: 40
  },
  'conservative': {
    currentIncome: 100000,
    investmentAmount: 75000,
    targetMonthlyIncome: 8300,
    riskTolerance: 'conservative' as const,
    timeline: 5,
    location: 'Mid-size City',
    situation: 'married' as const,
    age: 45
  }
};

const PersonalProfileForm: React.FC<PersonalProfileFormProps> = ({
  profile,
  onProfileChange,
  onClose
}) => {
  const [localProfile, setLocalProfile] = useState<PersonalProfile>(profile);

  const updateProfile = (updates: Partial<PersonalProfile>) => {
    const newProfile = { ...localProfile, ...updates };
    setLocalProfile(newProfile);
    onProfileChange(newProfile);
  };

  const applyPreset = (presetKey: keyof typeof presets) => {
    const preset = presets[presetKey];
    setLocalProfile(preset);
    onProfileChange(preset);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="w-6 h-6 mr-3 text-blue-500" />
          Customize Your Financial Freedom Journey
        </CardTitle>
        <p className="text-gray-600 dark:text-gray-400">
          Adjust these parameters to see how the roadmap adapts to your specific situation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preset Profiles */}
        <div>
          <label className="block text-sm font-semibold mb-3">Quick Presets</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(presets).map(([key, preset]) => (
              <Button
                key={key}
                variant="outline"
                size="sm"
                onClick={() => applyPreset(key as keyof typeof presets)}
                className="text-xs"
              >
                {key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>

        {/* Financial Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Current Annual Income</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={localProfile.currentIncome}
                onChange={(e) => updateProfile({ currentIncome: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="75000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Investment Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={localProfile.investmentAmount}
                onChange={(e) => updateProfile({ investmentAmount: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="50000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Target Monthly Income</label>
            <div className="relative">
              <Target className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="number"
                value={localProfile.targetMonthlyIncome}
                onChange={(e) => updateProfile({ targetMonthlyIncome: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="6250"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Risk Tolerance</label>
            <select
              value={localProfile.riskTolerance}
              onChange={(e) => updateProfile({ riskTolerance: e.target.value as PersonalProfile['riskTolerance'] })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="conservative">Conservative</option>
              <option value="moderate">Moderate</option>
              <option value="aggressive">Aggressive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Timeline to Freedom (Years)</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="number"
                min="1"
                max="10"
                value={localProfile.timeline}
                onChange={(e) => updateProfile({ timeline: Number(e.target.value) })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Age</label>
            <input
              type="number"
              min="18"
              max="80"
              value={localProfile.age}
              onChange={(e) => updateProfile({ age: Number(e.target.value) })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="35"
            />
          </div>
        </div>

        {/* Lifestyle Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Location Type</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={localProfile.location}
                onChange={(e) => updateProfile({ location: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Major City"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Family Situation</label>
            <select
              value={localProfile.situation}
              onChange={(e) => updateProfile({ situation: e.target.value as PersonalProfile['situation'] })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="family">Family with Children</option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Your Scenario Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Monthly Target:</span>
              <p className="font-semibold">${(localProfile.targetMonthlyIncome).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Investment:</span>
              <p className="font-semibold">${(localProfile.investmentAmount).toLocaleString()}</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Timeline:</span>
              <p className="font-semibold">{localProfile.timeline} years</p>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
              <Badge variant="outline" className="capitalize">
                {localProfile.riskTolerance}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalProfileForm;
