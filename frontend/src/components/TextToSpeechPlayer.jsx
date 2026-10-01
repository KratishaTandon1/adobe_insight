import React, { useEffect, useState, useRef } from 'react';
import { Mic, Play, Pause, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../apiConfig';
const TextToSpeechPlayer = ({ textToRead, contextType = "text" }) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const generateAndPlay = async () => {
    if (!textToRead || textToRead.length < 10) {
      toast.error("Not enough text to read aloud.");
      return;
    }
    setIsLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/podcast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          context_type: contextType,
          text_content: textToRead,
        }),
      });
      if (!response.ok) throw new Error("Server error");
      const data = await response.json();
      const fullAudioUrl = `${API_BASE_URL}${data.audio_url}`;
      setAudioUrl(fullAudioUrl);
      setIsPlaying(true);
    } catch (err) {
      toast.error("Could not generate audio.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };
  
  const handleStopAndReset = () => {
    if(audioRef.current) audioRef.current.pause();
    setAudioUrl(null);
    setIsPlaying(false);
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={!audioUrl ? generateAndPlay : handleStopAndReset}
        disabled={isLoading}
        className="group relative flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-slate-500 transition-all"
        title={!audioUrl ? "Read this section aloud" : "Stop & Reset"}
      >
        {isLoading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : !audioUrl ? <Mic size={20} /> : <RotateCcw size={20} />}
      </button>

      {audioUrl && (
        <button
          onClick={togglePlayPause}
          className="flex items-center justify-center w-10 h-10 bg-slate-700 text-white rounded-full hover:bg-slate-600"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </button>
      )}

      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          autoPlay
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
};

export default TextToSpeechPlayer;



