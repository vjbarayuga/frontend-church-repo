import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeleteAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const res = await axiosClient.get("/announcements");
    setAnnouncements(res.data);
  };

  const handleAdd = async () => {
    if (!title || !content) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    const res = await axiosClient.post("/announcements", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setAnnouncements([...announcements, res.data]);
    setTitle("");
    setContent("");
    setImage(null);
  };

  const handleDelete = async (id) => {
    await axiosClient.delete(`/announcements/${id}`);
    setAnnouncements(announcements.filter((a) => a._id !== id));
  };

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editImage, setEditImage] = useState(null);

  const startEdit = (a) => {
    setEditId(a._id);
    setEditTitle(a.title);
    setEditContent(a.content);
    setEditImage(null);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editContent) return;
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("content", editContent);
    if (editImage) formData.append("image", editImage);
    const res = await axiosClient.put(`/announcements/${editId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setAnnouncements(
      announcements.map((a) => (a._id === editId ? res.data : a))
    );
    setEditId(null);
    setEditTitle("");
    setEditContent("");
    setEditImage(null);
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Announcements</h2>
      <div className="space-y-3">
        {announcements.map((a) => (
          <div key={a._id} className="border p-3 rounded shadow">
            {editId === a._id ? (
              <>
                <input
                  className="w-full border p-2 mb-2"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <textarea
                  className="w-full border p-2 h-24"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setEditImage(e.target.files[0])}
                  className="border p-2 mb-2 block"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleUpdate} className="text-green-600">
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="text-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(a.date).toLocaleDateString()}
                </p>
                <p className="mt-1 text-gray-800">{a.content}</p>
                {a.heroImage && (
                  <img
                    src={a.heroImage}
                    alt="Hero"
                    className="mt-2 max-h-32 rounded"
                  />
                )}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => startEdit(a)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(a._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Add New Announcement</h3>
        <input
          className="w-full border p-2 mb-2"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="w-full border p-2 h-24"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="border p-2 mb-2 block"
        />
        <button
          onClick={handleAdd}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Announcement
        </button>
      </div>
    </div>
  );
}
