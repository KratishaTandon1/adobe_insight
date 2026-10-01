import React from 'react';
import { BookText } from 'lucide-react';

const SummarizeButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-[5.5rem] right-6 sm:right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-transform hover:scale-110 z-50"
      title="Summarize PDFs"
    >
      <BookText />
    </button>
  );
};

export default SummarizeButton;