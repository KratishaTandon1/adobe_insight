import React from 'react';
import { Mic } from 'lucide-react';

const PodcastButton = ({ onClick, disabled }) => {
  if (disabled) {
    return null; // Don't show the button if there's no context
  }

  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white p-4 rounded-full shadow-lg hover:bg-red-700 transition-transform hover:scale-110"
      title="Generate Podcast for Current Context"
    >
      <Mic />
    </button>
  );
};

export default PodcastButton;