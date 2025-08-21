import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeleteNews() {
  const [news, setNews] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    const res = await axiosClient.get("/news");
    setNews(res.data);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const res = await axiosClient.post("/news", { title, content });
    setNews([...news, res.data]);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id) => {
    await axiosClient.delete(`/news/${id}`);
    setNews(news.filter((n) => n._id !== id));
  };

  const handleEdit = (n) => {
    setEditingId(n._id);
    setEditTitle(n.title);
    setEditContent(n.content);
  };

  const handleUpdate = async (id) => {
    const res = await axiosClient.put(`/news/${id}`, {
      title: editTitle,
      content: editContent,
    });
    setNews(news.map((n) => (n._id === id ? res.data : n)));
    setEditingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Manage News</h2>
      <form onSubmit={handleAdd} className="mb-6 space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="News Title"
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="News Content"
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add News
        </button>
      </form>
      <ul className="space-y-4">
        {news.map((n) => (
          <li key={n._id} className="border rounded p-4">
            {editingId === n._id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-2 border rounded mb-2"
                />
                <button
                  onClick={() => handleUpdate(n._id)}
                  className="bg-green-600 text-white px-3 py-1 rounded mr-2"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="font-semibold text-lg">{n.title}</h3>
                <p className="mb-2">{n.content}</p>
                <button
                  onClick={() => handleEdit(n)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
