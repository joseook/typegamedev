import React, { useState } from 'react';
import { LanguageOption } from '../types';
import { Code, FileCode, Coffee, Hash, Gem, Database, Cog, Palette, Search } from 'lucide-react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedView, setExpandedView] = useState(false);

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

  const filteredLanguages = languages.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const popularLanguages = ['javascript', 'typescript', 'python', 'java', 'go'];

  // Sort languages to show popular ones first
  const sortedLanguages = [...filteredLanguages].sort((a, b) => {
    const aIsPopular = popularLanguages.includes(a.id);
    const bIsPopular = popularLanguages.includes(b.id);

    if (aIsPopular && !bIsPopular) return -1;
    if (!aIsPopular && bIsPopular) return 1;
    return a.name.localeCompare(b.name);
  });

  // Get the displayed languages based on expanded state
  const displayedLanguages = expandedView
    ? sortedLanguages
    : sortedLanguages.slice(0, 8);

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3">
        <h2 className="text-xl font-medium mb-2 sm:mb-0">Choose a Programming Language</h2>
        <div className="relative w-full sm:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="bg-gray-800 text-white w-full py-2 pl-10 pr-4 rounded-md border border-gray-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            placeholder="Search languages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {displayedLanguages.map((lang) => (
          <button
            key={lang.id}
            onClick={() => onSelectLanguage(lang.id)}
            className={`flex items-center space-x-2 p-3 rounded-md border transition-all transform hover:scale-105 ${selectedLanguage === lang.id
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/20'
                : 'border-gray-700 hover:border-gray-600 hover:bg-gray-800'
              }`}
            title={`Select ${lang.name}`}
          >
            <span className="text-indigo-400">{getIconComponent(lang.icon)}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {filteredLanguages.length > 8 && (
        <button
          onClick={() => setExpandedView(!expandedView)}
          className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium flex items-center"
        >
          {expandedView ? 'Show less' : `Show ${filteredLanguages.length - 8} more languages`}
        </button>
      )}
    </div>
  );
};

export default LanguageSelector;