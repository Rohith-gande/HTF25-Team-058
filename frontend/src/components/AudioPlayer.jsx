import { useEffect, useRef, useState } from "react";
import { Play, Pause } from "lucide-react";

const AudioPlayer = ({ podcast }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) audioRef.current.pause();
    setIsPlaying(false);
  }, [podcast]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  if (!podcast)
    return (
      <div className="text-center text-gray-500 py-16">
        Select a podcast to play
      </div>
    );

  return (
    <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-gray-800">
        Now Playing
      </h3>
      <p className="text-gray-700 mb-4 truncate">{podcast.title}</p>

      {/* 🧠 BACKEND PLACEHOLDER: audio URL will come from backend */}
      <audio ref={audioRef} 
      src={podcast.audioUrl} 
      // src={podcast ? `http://localhost:8000${podcast.audio_url}` : ""} 
      className="hidden" />

      {/* <button
        onClick={togglePlay}
        className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md"
      >
        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
      </button> */}

      {/* Optional: default HTML audio controls */}
      <audio
        controls
        src={`http://localhost:8000${podcast.audio_url}`}
        className="w-full mt-4"
      />
    </div>
  );
};

export default AudioPlayer;
