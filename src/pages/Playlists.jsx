import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Playlists() {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchPlaylists = async () => {
    const res = await fetch(`${API_URL}/playlists`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();
    setPlaylists(data);
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const createPlaylist = async () => {
    if (!name.trim()) return;

    await fetch(`${API_URL}/playlists`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    setName("");
    fetchPlaylists();
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <h1 className="text-3xl text-green-400 mb-6">Your Playlists</h1>

      {/* CREATE PLAYLIST */}
      <div className="flex gap-2 mb-6">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
          className="flex-1 p-2 rounded bg-gray-800 text-white"
        />
        <button
          onClick={createPlaylist}
          className="px-4 py-2 bg-green-500 rounded font-semibold"
        >
          Create
        </button>
      </div>

      {/* PLAYLIST LIST */}
      <div className="grid gap-4">
        {playlists.map((p) => (
          <Link
            key={p.id}
            to={`/user/playlists/${p.id}`}
            className="bg-gray-800 p-4 rounded-xl text-white hover:bg-green-900"
          >
            {p.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
