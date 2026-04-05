import React, { useState } from 'react';
import { User, Building, Play, PhoneCallIcon, PhoneIcon } from 'lucide-react';
import { Player } from '../types/game';
import { savePlayer, getPlayerByName } from '../utils/database';

interface PlayerRegistrationProps {
  onPlayerReady: (player: Player) => void;
}

export const PlayerRegistration: React.FC<PlayerRegistrationProps> = ({ onPlayerReady }) => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company is required';
    }

    // Phone number validation (10 digits)
    const phone = formData.phone ? formData.phone.replace(/\D/g, '') : '';
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length !== 10) {
      newErrors.phone = 'Phone number must be exactly 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
  if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Save player to database
      const player = await savePlayer({
        name: formData.name.trim(),
        company: formData.company.trim(),
        phone: formData.phone.trim()
      });

      onPlayerReady(player);
    } catch (error) {
      console.error('Error saving player:', error);
      // Show error message to user
      setErrors({ general: 'Failed to save player data. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
            <img 
            src="evolve25.png" 
            alt="EVOLVE25" 
            className="h-10 object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-slate-800 mb-2">
            Memory Match-up Game
            </h1>
          
          <p className="text-slate-600">
            Enter your details to start the 90-Second game
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <User size={16} className="inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <Building size={16} className="inline mr-2" />
              Company Name
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.company ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter your company name"
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              <PhoneCallIcon size={16} className="inline mr-2" />
              Phone Number (For Prize Notification)
            </label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.phone ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Enter your phone number"
            />
            
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-orange-600 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-orange-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Play size={20} />
                Start Game
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          <p>🎯 Click tiles to reveal Cloudera Offering details</p>
          <p>⏱️ Complete within 90 seconds for bonus points</p>
          <p>🏆 Compete on the leaderboard</p>
        </div>
      </div>
    </div>
  );
};