import React from 'react';
import { UserStats, NounProgress } from '../types';
import { getProgressMap } from '../utils/storage';
import { NOUNS } from '../data/nouns';
import Button from '../components/Button';
import Card from '../components/Card';
import { Trophy, Target, Flame, BookOpen, RotateCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface StatsViewProps {
  stats: UserStats;
  onBack: () => void;
}

const StatsView: React.FC<StatsViewProps> = ({ stats, onBack }) => {
  const accuracy = stats.totalAnswered > 0 
    ? Math.round((stats.totalCorrect / stats.totalAnswered) * 100) 
    : 0;

  const progressMap = getProgressMap();
  
  // Calculate level breakdowns
  const calculateLevelAccuracy = (level: string) => {
    const levelNouns = NOUNS.filter(n => n.level === level);
    let correct = 0;
    let total = 0;
    
    levelNouns.forEach(n => {
      const p = progressMap[n.id];
      if (p) {
        // We approximate correctness based on streaks for simplicity in this aggregate view
        // Or we could store totalCorrect per noun in the future.
        // For now, let's use total attempts vs correct (Need to update noun type to track correct total strictly, 
        // but for MVP we can infer "mastery" if streak > 2)
        if (p.correctStreak >= 2) correct++;
        if (p.totalAttempts > 0) total++;
      }
    });
    
    return total > 0 ? Math.round((correct / total) * 100) : 0;
  };

  const a1 = calculateLevelAccuracy('A1');
  const a2 = calculateLevelAccuracy('A2');
  const b1 = calculateLevelAccuracy('B1');

  const chartData = [
    { name: 'Correct', value: stats.totalCorrect },
    { name: 'Incorrect', value: stats.totalAnswered - stats.totalCorrect },
  ];
  
  // Handle empty state for chart
  const safeChartData = stats.totalAnswered === 0 ? [{ name: 'Empty', value: 1 }] : chartData;
  const COLORS = stats.totalAnswered === 0 ? ['#f1f5f9'] : ['#10b981', '#ef4444'];

  return (
    <div className="w-full max-w-md mx-auto px-4 pb-10">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 text-center">Progres Belajar</h2>

      {/* Hero Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-none p-4 flex flex-col items-center justify-center">
           <Flame className="w-8 h-8 mb-2 opacity-80" />
           <span className="text-3xl font-bold">{stats.currentDayStreak}</span>
           <span className="text-xs uppercase tracking-wider opacity-80">Streak Hari</span>
        </Card>
        <Card className="p-4 flex flex-col items-center justify-center">
           <Trophy className="w-8 h-8 mb-2 text-yellow-500" />
           <span className="text-3xl font-bold text-slate-800">{accuracy}%</span>
           <span className="text-xs text-slate-400 uppercase tracking-wider">Akurasi Total</span>
        </Card>
      </div>

      {/* Visualization */}
      <Card className="mb-6 flex flex-row items-center justify-between p-6">
        <div className="w-32 h-32 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {safeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
               <span className="text-xs font-bold text-slate-400">
                 {stats.totalAnswered}<br/>Soal
               </span>
            </div>
        </div>
        <div className="flex-1 pl-6 space-y-4">
           <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Total Dijawab</span>
              <span className="font-bold text-slate-800">{stats.totalAnswered}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Benar</span>
              <span className="font-bold text-emerald-600">{stats.totalCorrect}</span>
           </div>
           <div className="flex justify-between items-center">
              <span className="text-sm text-slate-500">Salah</span>
              <span className="font-bold text-red-500">{stats.totalAnswered - stats.totalCorrect}</span>
           </div>
        </div>
      </Card>

      {/* Breakdown by Level */}
      <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 ml-1">Penguasaan Level</h3>
      <div className="space-y-3 mb-8">
        {[
          { lbl: 'A1 (Pemula)', val: a1, color: 'bg-blue-500' },
          { lbl: 'A2 (Dasar)', val: a2, color: 'bg-purple-500' },
          { lbl: 'B1 (Menengah)', val: b1, color: 'bg-pink-500' }
        ].map((item) => (
           <div key={item.lbl} className="bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
             <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-slate-700">{item.lbl}</span>
                <span className="text-slate-500">{item.val}% "Hafal"</span>
             </div>
             <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
             </div>
           </div>
        ))}
      </div>

      <Button onClick={onBack} fullWidth variant="outline" className="mb-4">
        <RotateCcw className="w-4 h-4 mr-2" />
        Kembali Latihan
      </Button>
    </div>
  );
};

export default StatsView;
