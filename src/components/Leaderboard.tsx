import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import LoadingSpinner from './LoadingSpinner';

interface LeaderboardEntry {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  highest_wpm: number;
  highest_accuracy: number;
  games_played: number;
  created_at: string;
}

const Leaderboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setLoading(true);
      try {
        // Create the table if it doesn't exist yet
        const { error: tableError } = await supabase.rpc('ensure_leaderboard_table');
        
        if (tableError) {
          console.error('Error ensuring leaderboard table:', tableError);
        }
        
        // Get leaderboard data
        const { data, error } = await supabase
          .from('leaderboard')
          .select('*')
          .order('highest_wpm', { ascending: false })
          .limit(25);

        if (error) throw error;
        
        setLeaderboardData(data || []);
      } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 text-red-300 px-4 py-3 rounded-md mb-6">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Top Coders Leaderboard</h2>
      
      {leaderboardData.length === 0 ? (
        <div className="text-center py-10 bg-gray-800/20 rounded-lg">
          <p className="text-gray-400">No entries yet. Be the first to make it to the leaderboard!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800/40 text-left">
                <th className="px-4 py-3 rounded-tl-lg">Rank</th>
                <th className="px-4 py-3">Coder</th>
                <th className="px-4 py-3 text-right">WPM</th>
                <th className="px-4 py-3 text-right">Accuracy</th>
                <th className="px-4 py-3 text-right rounded-tr-lg">Games</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((entry, index) => (
                <tr 
                  key={entry.id} 
                  className={`
                    border-b border-gray-800/20 
                    ${index % 2 === 0 ? 'bg-gray-900/20' : 'bg-gray-800/10'}
                    ${index === 0 ? 'bg-yellow-900/30 hover:bg-yellow-900/40' : ''}
                    ${index === 1 ? 'bg-gray-600/20 hover:bg-gray-600/30' : ''}
                    ${index === 2 ? 'bg-amber-900/20 hover:bg-amber-900/30' : ''}
                    hover:bg-gray-800/30 transition-colors
                  `}
                >
                  <td className="px-4 py-3 font-medium">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={entry.avatar_url} 
                        alt={entry.username} 
                        className="w-8 h-8 rounded-full border border-gray-700"
                      />
                      <span>{entry.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    <span className="font-medium text-green-400">{entry.highest_wpm}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {entry.highest_accuracy.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono">
                    {entry.games_played}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
