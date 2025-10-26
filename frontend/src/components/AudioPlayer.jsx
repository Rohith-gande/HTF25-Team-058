// import { useEffect, useRef, useState } from "react";
// import { Play, Pause } from "lucide-react";

// const AudioPlayer = ({ podcast }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     if (audioRef.current) audioRef.current.pause();
//     setIsPlaying(false);
//   }, [podcast]);

//   // const togglePlay = () => {
//   //   if (!audioRef.current) return;
//   //   if (isPlaying) audioRef.current.pause();
//   //   else audioRef.current.play();
//   //   setIsPlaying(!isPlaying);
//   // };

//   if (!podcast)
//     return (
//       <div className="text-center text-gray-500 py-16">
//         Select a podcast to play
//       </div>
//     );

//   return (
//     <div className="bg-gray-50 rounded-lg p-6 shadow-inner">
//       <h3 className="text-lg font-semibold mb-2 text-gray-800">
//         Now Playing
//       </h3>
//       <p className="text-gray-700 mb-4 truncate">{podcast.title}</p>

//       {/* 🧠 BACKEND PLACEHOLDER: audio URL will come from backend */}
//       <audio ref={audioRef} 
//       src={podcast.audioUrl} 
//       // src={podcast ? `http://localhost:8000${podcast.audio_url}` : ""} 
//       className="hidden" />

//       {/* <button
//         onClick={togglePlay}
//         className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-md"
//       >
//         {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
//       </button> */}

//       {/* Optional: default HTML audio controls */}
//       <audio
//         controls
//         src={podcast.audio_url}
//         className="w-full mt-4"
//       />
//     </div>
//   );
// };

// export default AudioPlayer;

// import { useEffect, useRef, useState } from "react";
// import { Play, Pause } from "lucide-react";

// const formatTime = (time) => {
//   if (isNaN(time)) return "0:00";
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.floor(time % 60);
//   return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
// };

// const AudioPlayer = ({ podcast }) => {
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [currentTime, setCurrentTime] = useState(0);
//   const [duration, setDuration] = useState(0);
//   const audioRef = useRef(null);
//   const progressBarRef = useRef(null);

//   useEffect(() => {
//     if (audioRef.current) {
//       audioRef.current.pause();
//       setCurrentTime(0);
//     }
//     setIsPlaying(false);
//   }, [podcast]);

//   const togglePlay = () => {
//     if (!audioRef.current) return;
//     if (isPlaying) audioRef.current.pause();
//     else audioRef.current.play();
//     setIsPlaying(!isPlaying);
//   };

//   const handleProgressClick = (e) => {
//     const rect = progressBarRef.current.getBoundingClientRect();
//     const clickX = e.clientX - rect.left;
//     const newTime = (clickX / rect.width) * duration;
//     if (audioRef.current) audioRef.current.currentTime = newTime;
//   };

//   const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime);
//   const handleLoadedMetadata = () =>
//     setDuration(audioRef.current.duration || 0);

//   const progressPercent = (currentTime / duration) * 100 || 0;

//   if (!podcast)
//     return (
//       <div className="text-center text-gray-500 py-16">
//         Select a podcast to play
//       </div>
//     );

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xl transition-all">
//       <h3 className="text-xl font-bold mb-1 text-gray-900">Now Playing</h3>
//       <p className="text-md text-blue-600 mb-4 truncate font-medium">
//         {podcast.title}
//       </p>

//       {/* Keep audio loaded but invisible */}
//       <audio
//         ref={audioRef}
//         src={podcast.audio_url} // ✅ always use same key
//         onTimeUpdate={handleTimeUpdate}
//         onLoadedMetadata={handleLoadedMetadata}
//         onEnded={() => setIsPlaying(false)}
//         className="absolute opacity-0 w-0 h-0"
//       />

//       <div className="flex items-center space-x-4 mt-6">
//         <button
//           onClick={togglePlay}
//           className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform transform hover:scale-105"
//           aria-label={isPlaying ? "Pause" : "Play"}
//         >
//           {isPlaying ? (
//             <Pause className="w-6 h-6" />
//           ) : (
//             <Play className="w-6 h-6 fill-current" />
//           )}
//         </button>

//         <div className="flex-grow">
//           <div
//             ref={progressBarRef}
//             onClick={handleProgressClick}
//             className="w-full h-2 bg-gray-200 rounded-full cursor-pointer overflow-hidden group relative"
//           >
//             <div
//               className="h-full bg-blue-500 rounded-full transition-all duration-100"
//               style={{ width: `${progressPercent}%` }}
//             />
//             <div
//               className="absolute top-1/2 -translate-y-1/2 h-4 w-4 bg-white border-2 border-blue-500 rounded-full shadow-md transition-all duration-100"
//               style={{
//                 left: `${progressPercent}%`,
//                 transform: "translateX(-50%) translateY(-50%)",
//               }}
//             />
//           </div>

//           <div className="flex justify-between text-sm text-gray-500 mt-2 font-mono">
//             <span>{formatTime(currentTime)}</span>
//             <span>{formatTime(duration)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AudioPlayer;




import { useEffect, useRef, useState } from "react";
import { Play, Pause, Rewind, FastForward, Volume2, Download } from "lucide-react";

const formatTime = (time) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

const AudioPlayer = ({ podcast }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentTime(0);
    }
    setIsPlaying(false);
  }, [podcast]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => setCurrentTime(audioRef.current.currentTime || 0);
  const handleLoadedMetadata = () => setDuration(audioRef.current.duration || 0);
  const handleSeek = (e) => {
    const newTime = e.target.value;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const skip = (seconds) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime += seconds;
  };

  if (!podcast)
    return (
      <div className="text-center text-gray-500 py-16">
        Select a podcast to play
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg p-6 space-y-6 md:space-y-0 md:space-x-8 max-w-5xl mx-auto items-start">
      {/* 🎧 AUDIO PLAYER SECTION */}
      <div className="flex-1 flex flex-col items-center space-y-5">
        {/* Podcast Title */}
        <h3 className="text-lg font-semibold text-gray-800 text-center truncate w-full">
          {podcast.title || "Untitled Podcast"}
        </h3>

        {/* Hidden audio element */}
        <audio
          ref={audioRef}
          src={podcast.audio_url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          className="hidden"
        />

        {/* Controls */}
        <div className="flex items-center justify-center space-x-6 mt-2">
          <button
            onClick={() => skip(-10)}
            className="p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition"
          >
            <Rewind className="w-6 h-6 text-blue-600" />
          </button>

          <button
            onClick={togglePlay}
            className="p-5 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md transition-transform transform hover:scale-105"
          >
            {isPlaying ? (
              <Pause className="w-8 h-8" />
            ) : (
              <Play className="w-8 h-8" />
            )}
          </button>

          <button
            onClick={() => skip(10)}
            className="p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition"
          >
            <FastForward className="w-6 h-6 text-blue-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center space-x-2">
          <span className="text-xs text-gray-500 font-mono w-8 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 rounded-lg appearance-none bg-gray-200 accent-blue-600 cursor-pointer"
          />
          <span className="text-xs text-gray-500 font-mono w-8">
            {formatTime(duration)}
          </span>
        </div>

        {/* Volume + Download */}
        <div className="w-full flex justify-between items-center pt-1">
          <Volume2 className="w-5 h-5 text-blue-600 opacity-70" />
          <a
            href={podcast.audio_url}
            download={podcast.title || "podcast_audio.mp3"}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 font-medium"
          >
            <Download className="w-4 h-4" />
            <span className="text-sm">Download</span>
          </a>
        </div>
      </div>

      {/* 🧠 SUMMARY SECTION */}
      {podcast.summary && (
        <div className="flex-1 bg-blue-50 p-5 rounded-xl shadow-inner max-h-96 overflow-y-auto">
          <h4 className="text-md font-semibold text-gray-800 mb-2">
            🧠 Summary
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
            {podcast.summary}
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioPlayer;
