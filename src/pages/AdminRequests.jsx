import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/admin-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id, decision) => {
    try {
      const res = await fetch(`${API_URL}/admin-requests/${id}/decision`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ decision }),
      });
      const data = await res.json();
      toast.success(data.message);
      fetchRequests();
    } catch (err) {
      console.error(err);
    }
  };

  if (requests.length === 0) return <p>No admin requests</p>;

  return (
    <div className="flex flex-col gap-3">
      {requests.map(req => (
        <div key={req.id} className="bg-gray-800 p-4 rounded flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">{req.name} ({req.email})</p>
            <p className="text-gray-400">Status: {req.status}</p>
          </div>
          {req.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => handleDecision(req.id, "approved")}
                className="bg-green-500 px-3 py-1 rounded hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecision(req.id, "rejected")}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}