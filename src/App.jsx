import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MusicList from "./pages/MusicList";
import PodcastList from "./pages/PodcastList";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import RecentlyPlayed from "./pages/RecentlyPlayed";

import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Topbar from "./components/Topbar";
import MiniPlayer from "./components/MiniPlayer";

export default function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  return (
    <>
      <Routes>
        {/* 🌐 Public */}
        <Route
          path="/"
          element={
            user
              ? <Navigate to={user.is_admin ? "/admin" : "/user"} replace />
              : <Home />
          }
        />
        <Route path="/login" element={!user ? <Login /> : <Navigate to={user.is_admin ? "/admin" : "/user"} replace />} />
        <Route path="/register" element={<Register />} />

        {/* 👤 USER ROUTES */}
        <Route
          path="/user/*"
          element={
            <ProtectedRoute>
              <Topbar />
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/music"
          element={
            <ProtectedRoute>
              <Topbar />
              <MusicList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/podcasts"
          element={
            <ProtectedRoute>
              <Topbar />
              <PodcastList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/playlists"
          element={
            <ProtectedRoute>
              <Topbar />
              <Playlists />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/playlists/:id"
          element={
            <ProtectedRoute>
              <Topbar />
              <PlaylistDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/recent"
          element={
            <ProtectedRoute>
              <Topbar />
              <RecentlyPlayed />
            </ProtectedRoute>
          }
        />

        {/* 🛠️ ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <Topbar />
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* ❌ fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {user && <MiniPlayer />}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
