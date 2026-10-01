import React, { useState, useRef } from 'react';
import { Mic } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';
const SimpleTextToSpeech = ({ textToRead }) => {
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  const generateAndPlay = async () => {
    if (isLoading) return;
    if (!textToRead || textToRead.length < 20) {
      toast.error("Not enough text on this page to read.");
      return;
    }

    setIsLoading(true);
    toast.loading("Generating audio...");

    try {
      const response = await fetch(`${API_BASE_URL}/api/podcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context_type: "page_content",
          text_content: textToRead,
        }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      
      if (audioRef.current) {
        audioRef.current.src = data.audio_url;
        audioRef.current.play();
      }
      toast.dismiss();
      toast.success("Reading page content...");
    } catch (err) {
      toast.dismiss();
      toast.error("Could not generate audio.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={generateAndPlay}
        disabled={isLoading}
        className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-500 transition-all"
        title="Read page content aloud"
      >
        {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Mic size={20} />}
      </button>
      <audio ref={audioRef} className="hidden" />
    </>
  );
};

export default SimpleTextToSpeech;
