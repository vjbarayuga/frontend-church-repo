import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

export default function EditDeleteMassSchedule() {
  const [schedule, setSchedule] = useState([]);
  const [day, setDay] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      const res = await axiosClient.get("/massschedule");
      setSchedule(res.data);
    } catch (err) {
      console.error("Error fetching schedule:", err);
    }
  };

  const handleAdd = async () => {
    if (!day || !time) return alert("Please fill in both fields.");
    try {
      const res = await axiosClient.post("/massschedule", { day, time });
      setSchedule([...schedule, res.data]);
      setDay("");
      setTime("");
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/massschedule/${id}`);
      setSchedule(schedule.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Manage Mass Schedule</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="text"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          placeholder="Day (e.g., Sunday)"
          className="border p-2 rounded w-full sm:w-auto"
        />
        <input
          type="text"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          placeholder="Time (e.g., 9:00 AM)"
          className="border p-2 rounded w-full sm:w-auto"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {schedule.map((s) => (
          <li
            key={s._id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded"
          >
            <span className="text-gray-800">
              {s.day} - {s.time}
            </span>
            <button
              onClick={() => handleDelete(s._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
