import { useState, useEffect, useContext, useRef } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function RequestAdminAccess() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const redirectedRef = useRef(false);

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  // ✅ Redirect ONCE if admin
  useEffect(() => {
    if (user?.is_admin && !redirectedRef.current) {
      redirectedRef.current = true;
      navigate("/admin", { replace: true });
    }
  }, [user, navigate]);

  // Fetch admin request status
  useEffect(() => {
    const fetchStatus = async () => {
      setFetching(true);
      try {
        const res = await fetch(`${API_URL}/admin-requests/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          setStatus("");
          return;
        }

        const data = await res.json();
        setStatus(data.status || "");
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch request status");
      } finally {
        setFetching(false);
      }
    };

    fetchStatus();
  }, [API_URL, token]);

  const handleRequest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/admin-requests/request`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Request sent! ✅");
        setStatus("pending");
      } else {
        toast.error(data.message || "Request failed ❌");
      }
    } catch (err) {
      toast.error("Request failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-xs mx-auto bg-gray-900 text-white rounded shadow mt-6 text-sm">
      <h2 className="text-xl mb-2 font-semibold text-center">Request Admin Access</h2>

      {fetching ? (
        <p className="text-gray-400 text-sm text-center">Checking request status...</p>
      ) : (
        <>
          {status === "pending" && (
            <p className="text-yellow-400 text-sm text-center">Your request is pending approval</p>
          )}

          {status === "rejected" && (
            <>
              <p className="text-red-400 text-sm text-center">Your request was rejected.</p>
              {!loading && (
                <div className="flex justify-center mt-2">
                  <button
                    onClick={handleRequest}
                    className="bg-green-500 px-4 py-1 rounded text-sm"
                  >
                    Request Again
                  </button>
                </div>
              )}
            </>
          )}

          {!status && !loading && (
            <div className="flex justify-center mt-2">
              <button
                onClick={handleRequest}
                className="bg-green-500 px-4 py-1 rounded text-sm"
              >
                Request
              </button>
            </div>
          )}

          {loading && (
            <p className="text-gray-400 text-sm text-center mt-1">Sending request...</p>
          )}
        </>
      )}
    </div>
  );
}