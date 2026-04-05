import React from 'react';
import { X, Heart, Code, Building } from 'lucide-react';

interface CreditsProps {
  onClose: () => void;
}

export const Credits: React.FC<CreditsProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Heart className="text-red-300" size={24} />
              <h2 className="text-xl font-bold">Credits</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Game Developer */}
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Code className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Game Developer</h3>
            <p className="text-slate-600 font-medium">Vikas Srivastava</p>
            <p className="text-sm text-slate-500">Senior Solutions Architect</p>
          </div>

          {/* Cloudera */}
          <div className="text-center border-t pt-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Building className="text-white" size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Powered by</h3>
            <p className="text-slate-600 font-medium text-xl">Cloudera</p>
            <p className="text-sm text-slate-500">The Enterprise Data Cloud Company</p>
          </div>

          {/* Game Info */}
          <div className="bg-slate-50 rounded-lg p-4 text-center">
            <h4 className="font-semibold text-slate-700 mb-2">About This Game</h4>
            <p className="text-sm text-slate-600 leading-relaxed">
              An interactive memory match-up featuring Cloudera's comprehensive data platform services. 
              Test your knowledge of big data technologies while having fun!
            </p>
          </div>

          {/* Technologies Used */}
          <div className="text-center text-xs text-slate-400">
            <p>Built with React, TypeScript & Tailwind CSS</p>
            <p className="mt-1">© 2025 - Made with ❤️ for the data community</p>
          </div>
        </div>
      </div>
    </div>
  );
};