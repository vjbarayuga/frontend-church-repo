import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeleteEvents() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    axiosClient.get("/events").then((res) => setEvents(res.data));
  }, []);

  const handleAdd = () => {
    axiosClient.post("/events", { title, date, description }).then((res) => {
      setEvents([...events, res.data]);
      setTitle("");
      setDate("");
      setDescription("");
    });
  };

  const handleDelete = (id) => {
    axiosClient.delete(`/events/${id}`).then(() => {
      setEvents(events.filter((e) => e._id !== id));
    });
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
              <p className="font-bold">{e.title}</p>
              <p>{e.date}</p>
              <p>{e.description}</p>
            </div>
            <button
              onClick={() => handleDelete(e._id)}
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
