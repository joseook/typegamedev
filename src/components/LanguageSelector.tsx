import React from 'react';
import { LanguageOption } from '../types';
import { Code, FileCode, Coffee, Hash, Gem, Database, Cog, Palette } from 'lucide-react';

interface LanguageSelectorProps {
  languages: LanguageOption[];
  selectedLanguage: string;
  onSelectLanguage: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
}) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'file-code':
        return <FileCode className="h-5 w-5" />;
      case 'coffee':
        return <Coffee className="h-5 w-5" />;
      case 'hash':
        return <Hash className="h-5 w-5" />;
      case 'gem':
        return <Gem className="h-5 w-5" />;
      case 'database':
        return <Database className="h-5 w-5" />;
      case 'cog':
        return <Cog className="h-5 w-5" />;
      case 'palette':
        return <Palette className="h-5 w-5" />;
      default:
        return <Code className="h-5 w-5" />;
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Select Language</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {languages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelectLanguage(lang.id)}
            className={`flex items-center space-x-2 p-3 rounded-md border transition-all transform hover:scale-105 ${
              selectedLanguage === lang.id
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/20'
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
            }`}
          >
            <span className="text-indigo-400">{getIconComponent(lang.icon)}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;