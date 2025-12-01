import React, { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import { ArrowRight, HelpCircle, X } from 'lucide-react';

interface WelcomeViewProps {
  onStart: () => void;
}

const WelcomeView: React.FC<WelcomeViewProps> = ({ onStart }) => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <Card className="w-full max-w-sm space-y-8 py-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-100 rounded-full opacity-50" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-orange-100 rounded-full opacity-50" />

        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 text-white rounded-2xl text-3xl font-bold shadow-lg mb-2">
            KB
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Kata Bahasa</h1>
            <p className="text-slate-500 mt-2">
              Game singkat untuk bantu kamu hafal der/die/das.
            </p>
          </div>

          <div className="py-2">
            <p className="text-sm font-medium text-indigo-600 bg-indigo-50 inline-block px-4 py-1 rounded-full">
              Hanya 5 menit per hari
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button onClick={onStart} fullWidth size="lg">
              Mulai Latihan Pertama
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            
            <button 
              onClick={() => setShowHelp(true)}
              className="text-sm text-slate-400 hover:text-indigo-600 underline decoration-slate-300 hover:decoration-indigo-300 transition-colors"
            >
              Lihat cara kerja
            </button>
          </div>
        </div>
      </Card>

      {/* Simple Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                Cara Bermain
              </h3>
              <button onClick={() => setShowHelp(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <p>
                <strong>1. Tebak Artikel:</strong> Kami akan menampilkan kata benda Jerman (misal: <em>Tisch</em>). Kamu harus menebak artikelnya: <strong>der</strong>, <strong>die</strong>, atau <strong>das</strong>.
              </p>
              <p>
                <strong>2. Feedback Langsung:</strong> Kamu akan langsung tahu jawabanmu benar atau salah, lengkap dengan tips singkat.
              </p>
              <p>
                <strong>3. Repetisi Pintar:</strong> Aplikasi ini mengingat kata yang sulit bagimu dan akan memunculkannya lebih sering sampai kamu hafal.
              </p>
            </div>
            <Button onClick={() => setShowHelp(false)} fullWidth className="mt-6" variant="secondary">
              Saya Mengerti
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WelcomeView;