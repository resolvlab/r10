import React, { useState, useEffect } from 'react';
import { Level } from '../types';
import { getAppSettings, saveAppSettings } from '../utils/storage';
import Button from '../components/Button';
import Card from '../components/Card';
import { Check, ChevronLeft, Settings } from 'lucide-react';

interface SettingsViewProps {
  onBack: () => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ onBack }) => {
  const [levels, setLevels] = useState<Level[]>([]);
  
  useEffect(() => {
    const settings = getAppSettings();
    setLevels(settings.selectedLevels);
  }, []);

  const toggleLevel = (level: Level) => {
    setLevels(prev => {
      if (prev.includes(level)) {
        // Prevent removing the last level
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  const handleSave = () => {
    saveAppSettings({ selectedLevels: levels });
    onBack();
  };

  const renderLevelOption = (level: Level, label: string, description: string, colorClass: string) => {
    const isSelected = levels.includes(level);
    
    return (
      <div 
        onClick={() => toggleLevel(level)}
        className={`cursor-pointer border rounded-xl p-4 mb-3 transition-all duration-200 relative overflow-hidden ${
          isSelected 
            ? `bg-white border-${colorClass}-500 shadow-sm ring-1 ring-${colorClass}-500` 
            : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
               isSelected ? `bg-${colorClass}-100 text-${colorClass}-700` : 'bg-slate-200 text-slate-500'
             }`}>
               {level}
             </div>
             <div>
               <h4 className={`font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{label}</h4>
               <p className="text-xs text-slate-400">{description}</p>
             </div>
          </div>
          
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            isSelected 
              ? `border-${colorClass}-500 bg-${colorClass}-500 text-white` 
              : 'border-slate-300 bg-transparent'
          }`}>
            {isSelected && <Check className="w-3.5 h-3.5" />}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 h-[85vh] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Pengaturan</h2>
      </div>

      <div className="flex-1">
        <Card className="p-5 mb-6">
           <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold">
             <Settings className="w-5 h-5 text-indigo-600" />
             <h3>Pilih Tingkat Kesulitan</h3>
           </div>
           <p className="text-sm text-slate-500 mb-6">
             Pilih level kata yang ingin kamu pelajari. Kata-kata akan muncul secara acak dari level yang dipilih.
           </p>

           {renderLevelOption('A1', 'Pemula', 'Kata benda dasar sehari-hari.', 'blue')}
           {renderLevelOption('A2', 'Dasar Lanjut', 'Topik pekerjaan, kesehatan, dll.', 'purple')}
           {renderLevelOption('B1', 'Menengah', 'Konsep abstrak, masyarakat, alam.', 'pink')}
           
        </Card>
      </div>

      <Button onClick={handleSave} fullWidth size="lg" className="mb-4">
        Simpan Perubahan
      </Button>
    </div>
  );
};

export default SettingsView;