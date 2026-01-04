import { useEffect, useState, useContext } from "react";
import { AudioContext } from "../context/AudioContext";

export default function MusicList() {
  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [loading, setLoading] = useState(true);

  const { playTrack, currentTrack } = useContext(AudioContext);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const token = localStorage.getItem("token");

  /* ---------------- FETCH TRACKS ---------------- */
  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch(`${API_URL}/tracks`);
        const data = await res.json();
        setTracks(data);
      } catch (err) {
        console.error("Fetch tracks error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  /* ---------------- FETCH USER PLAYLISTS ---------------- */
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setPlaylists)
      .catch((err) => console.error("Fetch playlists error:", err));
  }, [token]);

  /* ---------------- ADD TRACK TO PLAYLIST ---------------- */
  const addToPlaylist = async (playlistId) => {
    try {
      await fetch(`${API_URL}/playlists/${playlistId}/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackId: selectedTrack.id }),
      });

      alert("Track added to playlist");
      setSelectedTrack(null);
    } catch (err) {
      console.error("Add to playlist error:", err);
    }
  };

  if (loading) {
    return (
      <p className="text-white text-center mt-10">
        Loading tracks...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 px-4 py-12">
      <h1 className="text-4xl text-green-400 font-bold text-center mb-8">
        Music Library
      </h1>

      {/* ---------------- TRACK GRID ---------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center hover:bg-green-900 transition"
          >
            <img
              src={track.cover_url || "https://via.placeholder.com/150"}
              alt={track.title}
              className="w-40 h-40 rounded-xl object-cover mb-4"
            />

            <h2 className="text-xl font-semibold text-white">
              {track.title}
            </h2>
            <p className="text-gray-300 mb-4">
              {track.artist}
            </p>

            {/* PLAY BUTTON */}
            <button
              onClick={() => playTrack(track)}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition
                ${
                  currentTrack?.id === track.id
                    ? "bg-green-600"
                    : "bg-green-400 hover:bg-green-500"
                }`}
            >
              {currentTrack?.id === track.id ? "Playing" : "Play"}
            </button>

            {/* ADD TO PLAYLIST */}
            {token && (
              <button
                onClick={() => setSelectedTrack(track)}
                className="mt-2 text-sm text-green-400 hover:underline"
              >
                ➕ Add to Playlist
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ---------------- PLAYLIST MODAL ---------------- */}
      {selectedTrack && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-80">
            <h3 className="text-white text-lg mb-4">
              Add "{selectedTrack.title}" to playlist
            </h3>

            {playlists.length === 0 && (
              <p className="text-gray-400 text-sm">
                You have no playlists yet.
              </p>
            )}

            {playlists.map((playlist) => (
              <button
                key={playlist.id}
                onClick={() => addToPlaylist(playlist.id)}
                className="block w-full text-left px-3 py-2 mb-2 rounded text-white hover:bg-green-700"
              >
                {playlist.name}
              </button>
            ))}

            <button
              onClick={() => setSelectedTrack(null)}
              className="mt-4 text-sm text-gray-400 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
