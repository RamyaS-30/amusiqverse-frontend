import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import AdminUpload from "./AdminUpload";
import AdminRequests from "./AdminRequests";
import { AudioContext } from "../context/AudioContext"; // 🔹 Added
import MiniPlayer from "../components/MiniPlayer";

const MENU_ITEMS = [
  { id: "upload", label: "Upload Content" },
  { id: "uploads", label: "Uploaded Tracks / Podcasts" },
  { id: "requests", label: "Admin Access Requests" },
];

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("upload");
  const [uploads, setUploads] = useState({ tracks: [], podcasts: [] });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(true); // 🔹 New

  const { playTrack, currentTrack } = useContext(AudioContext); // 🔹 Added

  const API_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");

  // Fetch uploaded tracks and podcasts
  const fetchUploads = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/uploads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        console.warn("Failed to fetch uploads");
        setUploads({ tracks: [], podcasts: [] });
        return;
      }

      const data = await res.json();
      setUploads({
        tracks: data.tracks || [],
        podcasts: data.podcasts || [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Network error while loading uploaded content");
    }
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-900 text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-800 w-64 p-6 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:translate-x-0 z-50`}
      >
        <h1 className="text-3xl font-bold text-green-400 mb-8 text-center">Admin Panel</h1>

        <nav className="flex flex-col space-y-4">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id);
                setSidebarOpen(false);
              }}
              className={`text-left px-4 py-2 rounded hover:bg-green-600 transition-colors ${
                activeSection === item.id ? "bg-green-600 font-semibold" : ""
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Hamburger Menu */}
      <button
        className="fixed top-4 left-4 z-50 lg:hidden bg-green-500 p-2 rounded-md hover:bg-green-600"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Main Content */}
      <main className="flex-1 p-6 lg:ml-64">
        {/* Upload Section */}
        {activeSection === "upload" && (
          <section>
            <h2 className="text-3xl font-bold text-green-400 mb-6 border-b border-green-400 pb-2">
              Upload Content
            </h2>
            <AdminUpload onUploadSuccess={fetchUploads} />
          </section>
        )}

        {/* Uploaded Content Section */}
        {activeSection === "uploads" && (
          <section>
            <h2 className="text-3xl font-bold text-green-400 mb-6 border-b border-green-400 pb-2">
              Uploaded Tracks / Podcasts
            </h2>

            {/* Tracks */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Tracks</h3>
              {uploads.tracks.length === 0 ? (
                <p className="text-gray-400">No tracks uploaded yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {uploads.tracks.map((track) => (
                    <li key={track.id} className="flex justify-between items-center">
                      <span>
                        <span className="text-green-300">{track.title}</span> - {track.artist}
                      </span>
                      <button
                        className={`px-3 py-1 rounded ${
                          currentTrack?.id === track.id ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
                        }`}
                        onClick={() =>
                          playTrack({
                            id: track.id,
                            audio_url: track.audio_url,
                            title: track.title,
                            cover_url: track.cover_url,
                            artist: track.artist,
                            type: "track",
                          })
                        }
                      >
                        {currentTrack?.id === track.id ? "Pause" : "Play"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Podcasts */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-2">Podcasts</h3>
              {uploads.podcasts.length === 0 ? (
                <p className="text-gray-400">No podcasts uploaded yet.</p>
              ) : (
                <ul className="list-disc pl-5 space-y-1">
                  {uploads.podcasts.map((podcast) => (
                    <li key={podcast.id} className="flex justify-between items-center">
                      <span>
                        <span className="text-green-300">{podcast.title}</span> - {podcast.description}
                      </span>
                      <button
                        className={`px-3 py-1 rounded ${
                          currentTrack?.id === podcast.id ? "bg-green-600" : "bg-green-400 hover:bg-green-500"
                        }`}
                        onClick={() =>
                          playTrack({
                            id: podcast.id,
                            audio_url: podcast.audio_url,
                            title: podcast.title,
                            cover_url: podcast.cover_url,
                            artist: podcast.description,
                            type: "podcast",
                          })
                        }
                      >
                        {currentTrack?.id === podcast.id ? "Pause" : "Play"}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        )}

        {/* Admin Requests Section */}
        {activeSection === "requests" && (
          <section>
            <h2 className="text-3xl font-bold text-green-400 mb-6 border-b border-green-400 pb-2">
              Admin Access Requests
            </h2>
            <AdminRequests />
          </section>
        )}
      </main>

      <MiniPlayer />
    </div>
  );
}
