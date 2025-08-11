import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeleteHistory() {
  const [history, setHistory] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    axiosClient
      .get("/history")
      .then((res) => {
        setHistory(res.data?.content || "");
        setLoading(false);
      })
      .catch(() => {
        setHistory("");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSuccess("");
    setError("");
    try {
      await axiosClient.put("/history", { content: history });
      setSuccess("History updated successfully.");
    } catch (err) {
      setError("Failed to update history.");
    }
    setSaving(false);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Church History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <textarea
            className="w-full border p-3 h-40"
            placeholder="Update church history here..."
            value={history}
            onChange={(e) => setHistory(e.target.value)}
          />
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {success && <p className="text-green-600 mt-2">{success}</p>}
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </>
      )}
    </div>
  );
}