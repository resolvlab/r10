import React, { useState } from 'react';
import { NOUNS } from '../data/nouns';
import { getVisualForNoun } from '../utils/content';
import Button from '../components/Button';
import { Search, ChevronLeft } from 'lucide-react';

interface NounListViewProps {
  onBack: () => void;
}

const NounListView: React.FC<NounListViewProps> = ({ onBack }) => {
  const [search, setSearch] = useState('');

  const filtered = NOUNS.filter(n => 
    n.word.toLowerCase().includes(search.toLowerCase()) || 
    n.meaning.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full max-w-md mx-auto px-4 h-[85vh] flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-600">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">Koleksi Kata</h2>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Cari kata (Jerman atau Indonesia)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="text-sm text-slate-500 mb-2">
        Menampilkan {filtered.length} dari {NOUNS.length} kata
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pr-1 pb-10">
        {filtered.map(noun => (
          <div key={noun.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-2xl">
                  {getVisualForNoun(noun)}
               </div>
               <div>
                <div className="font-bold text-slate-800">
                  <span className={`mr-1.5 ${
                    noun.gender === 'der' ? 'text-blue-600' :
                    noun.gender === 'die' ? 'text-red-500' : 'text-green-600'
                  }`}>{noun.gender}</span>
                  {noun.word}
                </div>
                <div className="text-sm text-slate-500">{noun.meaning}</div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1">
               <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded">
                 {noun.level}
               </span>
               <span className="text-[10px] text-slate-400">
                 {noun.topic}
               </span>
            </div>
          </div>
        ))}
        
        {filtered.length === 0 && (
          <div className="text-center text-slate-400 py-10">
            Tidak ada kata ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default NounListView;