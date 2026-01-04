import { useState } from "react";

export default function AdminUpload() {
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("track");
  const [audioFile, setAudioFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: either file or URL must be provided
    if (!title || (!audioFile && !audioUrl)) {
      return setMessage("Title and audio file or URL required");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("category", category);
    formData.append("type", type);

    if (audioFile) {
      formData.append("audio_file", audioFile);
    } else if (audioUrl) {
      formData.append("audio_url", audioUrl);  // send audio_url instead of file
    }

    if (coverFile) {
      formData.append("cover_file", coverFile);
    } else if (audioUrl) {
      formData.append("cover_url", coverUrl);  // send audio_url instead of file
    }

    try {
      const res = await fetch(`${API_URL}/admin`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      setMessage(data.message);
      if (res.ok) {
      setTitle("");
      setArtist("");
      setCategory("");
      setType("track");
      setAudioFile(null);
      setAudioUrl("");
      setCoverFile(null);
      setCoverUrl("");
    }
    } catch (err) {
      console.error(err);
      setMessage("Upload failed");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-900 text-white rounded shadow">
      <h2 className="text-2xl mb-4">Admin Upload</h2>
      {message && <p className="mb-2">{message}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800"
          required
        />
        <input
          type="text"
          placeholder="Artist / Description"
          value={artist}
          onChange={e => setArtist(e.target.value)}
          className="p-2 rounded bg-gray-800"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="p-2 rounded bg-gray-800"
        />
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="p-2 rounded bg-gray-800"
        >
          <option value="track">Track</option>
          <option value="podcast">Podcast</option>
        </select>

        {/* New input for audio URL */}
        <input
          type="url"
          placeholder="Audio URL (if not uploading a file)"
          value={audioUrl}
          onChange={e => setAudioUrl(e.target.value)}
          className="p-2 rounded bg-gray-800"
        />

        <p className="text-gray-400 text-sm mb-2">Or upload audio file:</p>
        <input
          type="file"
          accept="audio/*"
          onChange={e => {
            setAudioFile(e.target.files[0]);
            setAudioUrl(""); // clear URL if file selected
          }}
        />

        <input
  type="url"
  placeholder="Cover Image URL (if not uploading a file)"
  value={coverUrl}
  onChange={e => setCoverUrl(e.target.value)}
  className="p-2 rounded bg-gray-800"
/>

<p className="text-gray-400 text-sm mb-2">Or upload cover image:</p>
<input
  type="file"
  accept="image/*"
  onChange={e => {
    setCoverFile(e.target.files[0]);
    setCoverUrl(""); // clear URL if file selected
  }}
/>

        <button
          type="submit"
          className="bg-green-500 p-2 rounded mt-2 hover:bg-green-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
}
