import { useState } from "react";

export default function CreatePlaylistModal({ onCreate }) {
  const [name, setName] = useState("");

  return (
    <div className="bg-gray-800 p-4 rounded-xl">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Playlist name"
        className="w-full p-2 rounded bg-gray-700 text-white"
      />
      <button
        onClick={() => onCreate(name)}
        className="mt-3 w-full bg-green-500 py-2 rounded font-semibold"
      >
        Create Playlist
      </button>
    </div>
  );
}