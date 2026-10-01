import React from 'react';
import { Scale } from 'lucide-react';

const DebateButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[9.5rem] right-6 sm:right-8 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-transform hover:scale-110 z-50"
      title="Generate a Debate"
    >
      <Scale />
    </button>
  );
};

export default DebateButton;