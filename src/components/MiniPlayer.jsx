import React, { useContext } from "react";
import { AudioContext } from "../context/AudioContext";

export default function MiniPlayer() {
  const { track, isPlaying, togglePlayPause, progress, duration, seekAudio } =
    useContext(AudioContext);

  if (!track) return null; // don't show if no track selected

  // Format time helper
  const formatTime = (seconds) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white flex items-center p-4 shadow-lg z-50">
      <img
        src={track.cover_url}
        alt={track.title}
        className="w-14 h-14 rounded-md object-cover mr-4"
      />
      <div className="flex-1">
        <h3 className="font-semibold text-lg truncate">{track.title}</h3>
        <p className="text-sm text-gray-400 truncate">{track.artist}</p>
        <input
          type="range"
          min={0}
          max={duration}
          value={progress}
          onChange={(e) => seekAudio(Number(e.target.value))}
          className="w-full mt-1"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <button
        onClick={togglePlayPause}
        className="ml-4 bg-green-500 hover:bg-green-600 rounded-full w-10 h-10 flex items-center justify-center focus:outline-none"
        aria-label={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M5 3v18l15-9L5 3z" />
          </svg>
        )}
      </button>
    </div>
  );
}