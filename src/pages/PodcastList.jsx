import { useEffect, useState, useContext } from "react";
import { AudioContext } from "../context/AudioContext";

export default function PodcastList() {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack, currentTrack } = useContext(AudioContext);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const res = await fetch(`${API_URL}/podcasts`);
        const data = await res.json();
        setPodcasts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPodcasts();
  }, []);

  if (loading) return <p className="text-white text-center mt-10">Loading podcasts...</p>;

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <h1 className="text-4xl text-green-400 font-bold text-center mb-8">Podcasts</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {podcasts.map((podcast) => (
          <div
            key={podcast.id}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:bg-green-900 transition"
          >
            <img
              src={podcast.cover_url || "https://via.placeholder.com/150"}
              alt={podcast.title}
              className="w-40 h-40 rounded-xl object-cover mb-4"
            />
            <h2 className="text-xl font-semibold text-white">{podcast.title}</h2>
            <p className="text-gray-300 mb-4 truncate">{podcast.description || "No description"}</p>
            <button
              onClick={() => playTrack(podcast)}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition
                ${currentTrack?.id === podcast.id ? "bg-green-600" : "bg-green-400 hover:bg-green-500"}`}
            >
              {currentTrack?.id === podcast.id ? "Playing" : "Play"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}