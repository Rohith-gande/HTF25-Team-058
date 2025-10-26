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
      <audio ref={audioRef} src={podcast.audioUrl} className="hidden" />

      <button
        onClick={togglePlay}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg mx-auto"
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default AudioPlayer;
