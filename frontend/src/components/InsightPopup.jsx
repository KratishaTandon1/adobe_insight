import React from 'react';
import TextToSpeechPlayer from './TextToSpeechPlayer'; // Your existing TTS player

const InsightPopup = ({ insight, onClose }) => {
  if (!insight) return null;

  return (
    <div className="absolute top-20 left-4 z-10 bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-700 w-80 animate-fade-in">
      {/* This container ensures the title and mic button are aligned correctly */}
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-blue-400">Insight</h3>
        <TextToSpeechPlayer 
          contextType="insight"
          textToRead={insight}
        />
      </div>
      <p className="text-sm text-slate-300 border-t border-slate-700 pt-2">{insight}</p>
      <button onClick={onClose} className="text-xs text-slate-500 mt-3 hover:text-white w-full text-right">Close</button>
    </div>
  );
};

export default InsightPopup;
