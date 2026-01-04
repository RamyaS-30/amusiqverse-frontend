import { useEffect, useState, useContext } from "react";
import { AudioContext } from "../context/AudioContext";

export default function RecentlyPlayed() {
  const [items, setItems] = useState([]);
  const { playTrack } = useContext(AudioContext);
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/recent`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setItems)
      .catch((err) => console.error("Failed to fetch recently played:", err));
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl text-green-400 mb-6">Recently Played</h1>
      {items.map((item) => {
        const isTrack = !!item.track_id;
        const title = isTrack ? item.track_title : item.podcast_title;
        const subtitle = isTrack ? item.track_artist : item.podcast_description;
        const audioUrl = isTrack ? item.track_audio : item.podcast_audio;
        const id = isTrack ? item.track_id : item.podcast_id;
        const lastPosition = item.last_position || 0;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between bg-gray-800 p-4 rounded mb-3"
          >
            <div>
              <p className="text-white font-semibold">{title}</p>
              <p className="text-gray-400">{subtitle}</p>
              <p className="text-sm text-gray-500 mt-1">
                {isTrack ? "Track" : "Podcast"} - Last played at {Math.floor(lastPosition)}s
              </p>
            </div>
            <button
              onClick={() =>
                playTrack({
                  id,
                  audio_url: audioUrl,
                  title,
                  last_position: lastPosition,
                  type: isTrack ? "track" : "podcast",
                })
              }
              className="bg-green-500 px-4 py-1 rounded"
            >
              Play
            </button>
          </div>
        );
      })}
    </div>
  );
}
