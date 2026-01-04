import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AudioContext } from "../context/AudioContext";

export default function PlaylistDetail() {
  const { id } = useParams(); // playlist id
  const [tracks, setTracks] = useState([]);
  const { playTrack } = useContext(AudioContext);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchTracks = async () => {
    try {
      const res = await fetch(`${API_URL}/playlists/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setTracks(data);
    } catch (err) {
      console.error("Failed to fetch tracks:", err);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, [id]);

  const deleteTrack = async (trackId) => {
    if (!confirm("Are you sure you want to remove this track from the playlist?")) return;

    try {
      await fetch(`${API_URL}/playlists/${id}/tracks/${trackId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Refresh track list after deletion
      fetchTracks();
    } catch (err) {
      console.error("Failed to delete track:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl text-green-400 mb-6">Playlist</h1>

      {tracks.length === 0 && (
        <p className="text-gray-400">No tracks in this playlist yet.</p>
      )}

      {tracks.map((track) => (
        <div
          key={track.id}
          className="flex items-center justify-between bg-gray-800 p-4 rounded mb-3"
        >
          <div>
            <p className="text-white font-semibold">{track.title}</p>
            <p className="text-gray-400">{track.artist}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => playTrack(track)}
              className="bg-green-500 px-4 py-1 rounded"
            >
              Play
            </button>
            <button
              onClick={() => deleteTrack(track.id)}
              className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
