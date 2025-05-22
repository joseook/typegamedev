import React, { useEffect, useState } from 'react';
import { TestResult } from '../types';
import { supabase } from '../lib/supabase';
import { Trophy, RotateCcw, Copy, Twitter, Check, Star, Zap, BarChart3 } from 'lucide-react';

interface ResultScreenProps {
  result: TestResult;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ result, onRestart }) => {
  // Salvar resultado no leaderboard se o usuário estiver logado
  useEffect(() => {
    const saveResultToLeaderboard = async () => {
      try {
        // Verificar se o usuário está logado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('Usuário não está logado, resultado não será salvo no leaderboard');
          return;
        }
        
        // Buscar entrada existente do usuário no leaderboard
        const { data: existingEntry } = await supabase
          .from('leaderboard')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (existingEntry) {
          // Atualizar entrada existente se o novo WPM for maior que o registrado
          if (result.wpm > existingEntry.highest_wpm) {
            await supabase
              .from('leaderboard')
              .update({
                highest_wpm: result.wpm,
                highest_accuracy: result.accuracy > existingEntry.highest_accuracy 
                  ? result.accuracy 
                  : existingEntry.highest_accuracy,
                games_played: existingEntry.games_played + 1,
                updated_at: new Date()
              })
              .eq('user_id', user.id);
            
            console.log('Leaderboard atualizado com novo recorde!');
          } else {
            // Apenas incrementar o contador de jogos
            await supabase
              .from('leaderboard')
              .update({
                highest_accuracy: result.accuracy > existingEntry.highest_accuracy 
                  ? result.accuracy 
                  : existingEntry.highest_accuracy,
                games_played: existingEntry.games_played + 1,
                updated_at: new Date()
              })
              .eq('user_id', user.id);
            
            console.log('Contador de jogos atualizado no leaderboard');
          }
        } else {
          // Criar nova entrada no leaderboard para este usuário
          await supabase
            .from('leaderboard')
            .insert({
              user_id: user.id,
              username: user.user_metadata.user_name || user.user_metadata.preferred_username || 'Coder',
              avatar_url: user.user_metadata.avatar_url,
              highest_wpm: result.wpm,
              highest_accuracy: result.accuracy,
              games_played: 1
            });
          
          console.log('Nova entrada criada no leaderboard!');
        }
      } catch (error) {
        console.error('Erro ao salvar resultado no leaderboard:', error);
      }
    };
    
    saveResultToLeaderboard();
  }, [result]);
  
  const [showCopied, setShowCopied] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    // Trigger animation completion after delay
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Generate a performance rating
  const getPerformanceRating = () => {
    // WPM rating
    let stars = 0;
    if (result.wpm >= 70) stars = 5;
    else if (result.wpm >= 50) stars = 4;
    else if (result.wpm >= 35) stars = 3;
    else if (result.wpm >= 20) stars = 2;
    else stars = 1;

    // Adjust for accuracy
    if (result.accuracy < 90) stars = Math.max(stars - 1, 1);

    return stars;
  };

  // Get performance text
  const getPerformanceText = () => {
    const rating = getPerformanceRating();

    switch (rating) {
      case 5: return 'Outstanding speed and accuracy!';
      case 4: return 'Excellent typing skills!';
      case 3: return 'Good job, solid performance!';
      case 2: return 'Nice work, keep practicing!';
      default: return 'Keep practicing to improve!';
    }
  };

  // Format time in mm:ss
  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Copy result to clipboard
  const copyResultToClipboard = () => {
    const resultText = `
📊 My TypeGameDev Result 📊
Language: ${result.language}
Speed: ${result.wpm.toFixed(1)} WPM
Accuracy: ${result.accuracy.toFixed(1)}%
Time: ${formatTime(result.time)}
Errors: ${result.errors}
Rating: ${getPerformanceRating()}/5 stars
    `.trim();

    navigator.clipboard.writeText(resultText);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // Share on Twitter
  const shareOnTwitter = () => {
    const text = `I just typed ${result.wpm.toFixed(1)} WPM with ${result.accuracy.toFixed(1)}% accuracy in ${result.language} on TypeGameDev! 💻⌨️`;
    const url = 'https://typegamedev.com'; // Replace with your actual URL

    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg overflow-hidden shadow-2xl border border-gray-700">
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-indigo-600 opacity-10"></div>
          <div className="pt-10 pb-6 px-8 relative z-10">
            <div className="flex justify-center mb-6">
              <div className={`transition-all duration-1000 ${animationComplete ? 'scale-100 opacity-100' : 'scale-150 opacity-0'}`}>
                <div className="bg-yellow-500/10 p-4 rounded-full">
                  <Trophy className="h-16 w-16 text-yellow-400" />
                </div>
              </div>
            </div>

            <h2 className={`text-3xl font-bold text-center mb-2 transition-all duration-1000 delay-200 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              Test Completed!
            </h2>

            <p className={`text-gray-400 text-center mb-8 transition-all duration-1000 delay-300 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              {getPerformanceText()}
            </p>

            <div className="flex justify-center mb-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  className={`h-8 w-8 transition-all duration-300 delay-${300 + index * 100} transform ${index < getPerformanceRating()
                      ? 'text-yellow-400 scale-100 opacity-100'
                      : 'text-gray-600 scale-90 opacity-70'
                    } ${animationComplete ? 'translate-y-0' : 'translate-y-6'}`}
                  fill={index < getPerformanceRating() ? 'currentColor' : 'none'}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className={`bg-gray-800/50 rounded-lg p-5 border border-gray-700 transition-all duration-500 delay-400 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-indigo-400" />
                  <h3 className="text-lg font-medium">Speed</h3>
                </div>
                <span className="text-2xl font-bold">{result.wpm.toFixed(1)}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(result.wpm, 100)}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Words per minute (WPM) - Average is around 40 WPM
              </p>
            </div>

            <div className={`bg-gray-800/50 rounded-lg p-5 border border-gray-700 transition-all duration-500 delay-500 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-400" />
                  <h3 className="text-lg font-medium">Accuracy</h3>
                </div>
                <span className="text-2xl font-bold">{result.accuracy.toFixed(1)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-green-500 h-2.5 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${result.accuracy}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Percentage of characters typed correctly
              </p>
            </div>
          </div>

          <div className={`bg-gray-800/30 rounded-lg p-4 mb-6 border border-gray-700 transition-all duration-500 delay-600 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-indigo-400" />
              <span>Additional Stats</span>
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-400 text-sm">Time</p>
                <p className="font-bold">{formatTime(result.time)}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Errors</p>
                <p className="font-bold">{result.errors}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Language</p>
                <p className="font-bold capitalize">{result.language}</p>
              </div>
            </div>
          </div>

          <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-500 delay-700 ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
            <button
              onClick={onRestart}
              className="flex-1 flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </button>

            <div className="flex gap-3">
              <button
                onClick={copyResultToClipboard}
                className="relative flex justify-center items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-3 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                {showCopied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
                <span>{showCopied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={shareOnTwitter}
                className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
              >
                <Twitter className="h-4 w-4" />
                <span>Tweet</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultScreen;