import React, { useState, useEffect } from 'react';
import { Noun, Gender } from '../types';
import { getNextNoun } from '../utils/gameLogic';
import { saveNounProgress, updateUserStats } from '../utils/storage';
import { getVisualForNoun } from '../utils/content';
import Button from '../components/Button';
import Card from '../components/Card';
import { CheckCircle, XCircle, ArrowRight, RefreshCw, X } from 'lucide-react';

interface GameViewProps {
  dayStreak: number;
  correctToday: number;
  onQuit: () => void;
}

const GameView: React.FC<GameViewProps> = ({ dayStreak, correctToday, onQuit }) => {
  const [currentNoun, setCurrentNoun] = useState<Noun | null>(null);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [animating, setAnimating] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Initial load
  useEffect(() => {
    loadNextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNextQuestion = () => {
    setAnimating(true);
    setTimeout(() => {
      const next = getNextNoun(currentNoun?.id);
      setCurrentNoun(next);
      setSelectedGender(null);
      setIsCorrect(null);
      setAnimating(false);
    }, 200); // Short delay for fade out
  };

  const handleAnswer = (gender: Gender) => {
    if (!currentNoun || selectedGender) return; // Prevent double tap

    const correct = gender === currentNoun.gender;
    setSelectedGender(gender);
    setIsCorrect(correct);
    
    // Save logic
    saveNounProgress(currentNoun.id, correct);
    updateUserStats(correct);
  };

  if (!currentNoun) return <div className="flex justify-center p-10"><RefreshCw className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="w-full max-w-md mx-auto px-4 flex flex-col min-h-screen pb-24 relative">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 mt-4">
        <button 
          onClick={() => setShowQuitConfirm(true)}
          className="p-2 -ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          aria-label="Keluar sesi"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3">
           <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            ✔ {correctToday} Benar
          </span>
          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">
            🔥 {dayStreak} Hari
          </span>
        </div>
      </div>

      {/* Question Card Area */}
      <div className={`flex-1 transition-opacity duration-200 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        
        <Card className="mb-6 text-center min-h-[280px] flex flex-col justify-center items-center relative overflow-hidden">
           <div className="text-xs font-bold tracking-wider text-slate-300 uppercase absolute top-4">
            Latihan Hari Ini
          </div>
          
          {/* Illustration Bubble */}
          <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-5xl mb-6 shadow-inner mt-8 animate-in zoom-in duration-300">
            {getVisualForNoun(currentNoun)}
          </div>

          <h2 className="text-4xl font-bold text-slate-800 mb-2 tracking-tight">
            {currentNoun.word}
          </h2>
          <p className="text-lg text-slate-500 font-medium">
            {currentNoun.meaning}
          </p>
          {/* Level Badge */}
          <span className={`mt-4 text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
            currentNoun.level === 'A1' ? 'bg-blue-50 text-blue-500 border-blue-100' : 
            currentNoun.level === 'A2' ? 'bg-purple-50 text-purple-500 border-purple-100' :
            'bg-pink-50 text-pink-500 border-pink-100'
          }`}>
            Level {currentNoun.level} • {currentNoun.topic}
          </span>
        </Card>

        <p className="text-center text-sm text-slate-400 mb-4 font-medium">
          Pilih artikel yang tepat:
        </p>

        {/* Answer Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {(['der', 'die', 'das'] as Gender[]).map((g) => {
            // Determine styling based on state
            let variant: 'outline' | 'primary' | 'secondary' = 'outline';
            let extraClasses = "text-xl py-6";
            
            if (selectedGender) {
              if (g === currentNoun.gender) {
                 // This is the correct answer
                 extraClasses += " bg-emerald-500 text-white border-emerald-600";
              } else if (g === selectedGender && g !== currentNoun.gender) {
                 // This was the wrong selection
                 extraClasses += " bg-red-100 border-red-200 text-red-400 opacity-50";
              } else {
                 // Unselected options
                 extraClasses += " opacity-30";
              }
            }

            return (
              <Button
                key={g}
                variant={variant}
                className={extraClasses}
                onClick={() => handleAnswer(g)}
                disabled={!!selectedGender}
              >
                {g}
              </Button>
            );
          })}
        </div>

        {/* Feedback Section */}
        {selectedGender && (
          <div className="animate-in slide-in-from-bottom-4 duration-300 fade-in">
            <div className={`rounded-xl p-5 mb-4 border-l-4 shadow-sm ${
              isCorrect 
                ? 'bg-emerald-50 border-emerald-500 text-emerald-900' 
                : 'bg-red-50 border-red-500 text-red-900'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600" />
                )}
                <span className="font-bold text-lg">
                  {isCorrect ? 'Benar!' : 'Kurang tepat 😅'}
                </span>
              </div>
              
              <p className="text-lg mb-2">
                Jawaban: <strong>{currentNoun.gender} {currentNoun.word}</strong>
              </p>
              
              {!isCorrect && (
                 <p className="text-sm opacity-80">
                   Artinya: {currentNoun.meaning}
                 </p>
              )}

              {currentNoun.tip && (
                <div className="mt-3 pt-3 border-t border-black/5 text-sm italic flex gap-2 items-start">
                   <span className="not-italic">💡</span>
                   <span>{currentNoun.tip}</span>
                </div>
              )}
            </div>
            {/* Spacer to prevent content being hidden behind floating button */}
            <div className="h-24"></div>
          </div>
        )}
      </div>

      {/* Floating Next Button */}
      {selectedGender && (
        <div className="fixed bottom-6 left-0 right-0 px-4 z-30 flex justify-center animate-in slide-in-from-bottom-10 duration-300">
          <div className="w-full max-w-md shadow-2xl rounded-xl">
            <Button 
              onClick={loadNextQuestion} 
              fullWidth 
              size="lg" 
              className={`${isCorrect ? "bg-emerald-600 hover:bg-emerald-700 ring-emerald-200" : "bg-indigo-600 hover:bg-indigo-700 ring-indigo-200"}`}
            >
              Pertanyaan Berikutnya
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl transform transition-all">
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              Sudahi sesi latihan?
            </h3>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              Progres kamu sudah tersimpan otomatis. Kamu bisa kembali melanjutkan kapan saja.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => setShowQuitConfirm(false)} variant="secondary" fullWidth>
                Lanjut
              </Button>
              <Button 
                onClick={onQuit} 
                variant="primary" 
                fullWidth 
                className="bg-slate-800 hover:bg-slate-900 text-white border-transparent"
              >
                Keluar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameView;