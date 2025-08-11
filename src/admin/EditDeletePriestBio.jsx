import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeletePriestBio() {
  const [bio, setBio] = useState([]);
  const [newBio, setNewBio] = useState("");

  useEffect(() => {
    axiosClient.get("/priests").then((res) => setBio(res.data));
  }, []);

  const handleAdd = () => {
    axiosClient.post("/priests", { bio: newBio }).then((res) => {
      setBio([...bio, res.data]);
      setNewBio("");
    });
  };

  const handleDelete = (id) => {
    axiosClient.delete(`/priests/${id}`).then(() => {
      setBio(bio.filter((b) => b._id !== id));
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Priest Bio</h2>
      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        placeholder="Enter priest bio..."
        className="w-full border p-2 mb-2"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Bio
      </button>
      <ul className="mt-4">
        {bio.map((b) => (
          <li
            key={b._id}
            className="flex justify-between items-center mb-2 border p-2"
          >
            <span>{b.bio}</span>
            <button
              onClick={() => handleDelete(b._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}