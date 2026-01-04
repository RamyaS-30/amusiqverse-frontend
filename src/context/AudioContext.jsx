import React, { createContext, useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

export const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const audioRef = useRef(new Audio());
  const [track, setTrack] = useState(null); // {id, title, artist, audio_url, cover_url, podcastId?}
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // Save last played position
  const saveLastPosition = async (currentTrack, currentTime) => {
    if (!currentTrack || !token) return;
    try {
      await fetch(`${API_URL}/recent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          trackId: currentTrack.id || null,
          podcastId: currentTrack.podcastId || null,
          lastPosition: currentTime,
        }),
      });
    } catch (err) {
      console.error("Failed to save last played position:", err);
    }
  };

  // Play a track (resume from last position)
  const playTrack = async (newTrack) => {
    if (!newTrack) return;

    // Save current track position before switching
    if (track && track.id !== newTrack.id) {
      await saveLastPosition(track, audioRef.current.currentTime);
    }

    // If new track
    if (track?.id !== newTrack.id) {
      setTrack(newTrack);
      audioRef.current.src = newTrack.audio_url;

      // Fetch last played position
      if (token) {
        try {
          const url = `${API_URL}/recent?trackId=${newTrack.id}`;
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (data?.last_position) {
            audioRef.current.currentTime = data.last_position;
          }
        } catch (err) {
          console.error("Failed to fetch last played position:", err);
        }
      }

      audioRef.current.play();
      setIsPlaying(true);
    } else {
      togglePlayPause();
    }
  };

  // Toggle play/pause
  const togglePlayPause = () => {
    if (!track) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      saveLastPosition(track, audioRef.current.currentTime);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Stop track completely
  const stopTrack = () => {
    if (!track) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    saveLastPosition(track, 0);
    setTrack(null);
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  };

  // Seek audio
  const seekAudio = (time) => {
    if (!track) return;
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;

    const updateProgress = () => {
      setProgress(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      saveLastPosition(track, 0);
    };

    const handlePause = () => {
      if (audio.currentTime > 0) saveLastPosition(track, audio.currentTime);
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("pause", handlePause);
    };
  }, [track]);

  // Stop audio on logout
  useEffect(() => {
    if (!user) {
      stopTrack();
    }
  }, [user]);

  return (
    <AudioContext.Provider
      value={{
        track,
        isPlaying,
        progress,
        duration,
        playTrack,
        togglePlayPause,
        seekAudio,
        stopTrack,
        audioRef,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};
