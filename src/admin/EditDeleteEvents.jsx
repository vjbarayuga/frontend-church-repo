import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeleteEvents() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    axiosClient.get("/events").then((res) => setEvents(res.data));
  }, []);

  const handleAdd = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("date", date);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    const res = await axiosClient.post("/events", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setEvents([...events, res.data]);
    setTitle("");
    setDate("");
    setDescription("");
    setImage(null);
  };

  const handleDelete = (id) => {
    axiosClient.delete(`/events/${id}`).then(() => {
      setEvents(events.filter((e) => e._id !== id));
    });
  };

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState(null);

  const startEdit = (e) => {
    setEditId(e._id);
    setEditTitle(e.title);
    setEditDate(e.date);
    setEditDescription(e.description);
    setEditImage(null);
  };

  const handleUpdate = async () => {
    if (!editTitle || !editDate || !editDescription) return;
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("date", editDate);
    formData.append("description", editDescription);
    if (editImage) formData.append("image", editImage);
    const res = await axiosClient.put(`/events/${editId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setEvents(events.map((e) => (e._id === editId ? res.data : e)));
    setEditId(null);
    setEditTitle("");
    setEditDate("");
    setEditDescription("");
    setEditImage(null);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Manage Events</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 mr-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mr-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full border p-2 mb-2 mt-2"
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        className="border p-2 mb-2 block"
      />
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add
      </button>

      <ul className="mt-4">
        {events.map((e) => (
          <li
            key={e._id}
            className="flex justify-between items-center border p-2 mb-2"
          >
            <div>
              {editId === e._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(ev) => setEditTitle(ev.target.value)}
                    className="border p-2 mb-2 w-full"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(ev) => setEditDate(ev.target.value)}
                    className="border p-2 mb-2 w-full"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(ev) => setEditDescription(ev.target.value)}
                    className="w-full border p-2 mb-2"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(ev) => setEditImage(ev.target.files[0])}
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
                  <p className="font-bold">{e.title}</p>
                  <p>{e.date}</p>
                  <p>{e.description}</p>
                  {e.heroImage && (
                    <img
                      src={e.heroImage}
                      alt="Hero"
                      className="mt-2 max-h-32 rounded"
                    />
                  )}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => startEdit(e)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(e._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
