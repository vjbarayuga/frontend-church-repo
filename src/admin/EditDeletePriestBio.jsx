import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeletePriestBio() {
  const [bio, setBio] = useState([]);
  const [newBio, setNewBio] = useState("");
  const [newName, setNewName] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    axiosClient.get("/priests").then((res) => setBio(res.data));
  }, []);

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("bio", newBio);
    formData.append("name", newName);
    if (photo) {
      formData.append("photo", photo);
    }
    const res = await axiosClient.post("/priests", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setBio([...bio, res.data]);
    setNewBio("");
    setNewName("");
    setPhoto(null);
  };

  const handleDelete = (id) => {
    axiosClient.delete(`/priests/${id}`).then(() => {
      setBio(bio.filter((b) => b._id !== id));
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Priest Bio</h2>
      <input
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
        placeholder="Enter priest name..."
        className="w-full border p-2 mb-2"
      />
      <textarea
        value={newBio}
        onChange={(e) => setNewBio(e.target.value)}
        placeholder="Enter priest bio..."
        className="w-full border p-2 mb-2"
      />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPhoto(e.target.files[0])}
        className="border p-2 mb-2 block"
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
            <div className="flex items-center gap-4">
              {b.photo && (
                <img
                  src={b.photo}
                  alt="Priest"
                  className="h-16 w-16 object-cover rounded-full"
                />
              )}
              <span className="font-semibold mr-2">{b.name}</span>
              <span>{b.bio}</span>
            </div>
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
