import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from "react-icons/fa";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState({});

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Sample events - replace with actual data
  useEffect(() => {
    setEvents({
      "2025-07-27": [
        { title: "Sunday Mass", time: "7:00 AM, 9:00 AM, 11:00 AM" },
      ],
      "2025-08-15": [
        { title: "Assumption of the Blessed Virgin Mary", time: "7:00 PM" },
      ],
      "2025-08-03": [{ title: "Faith Formation", time: "10:00 AM" }],
      "2025-08-10": [{ title: "Faith Formation", time: "10:00 AM" }],
      "2025-08-17": [{ title: "Faith Formation", time: "10:00 AM" }],
      "2025-08-24": [{ title: "Faith Formation", time: "10:00 AM" }],
      "2025-08-31": [{ title: "Faith Formation", time: "10:00 AM" }],
    });
  }, []);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const formatDateKey = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateKey = formatDateKey(year, month, day);
      const dayEvents = events[dateKey] || [];
      const isToday =
        new Date().toDateString() === new Date(year, month, day).toDateString();

      days.push(
        <div
          key={day}
          className={`p-2 min-h-[60px] border border-gray-200 relative ${
            isToday ? "bg-blue-50 border-blue-300" : "hover:bg-gray-50"
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-blue-700" : "text-gray-700"
            }`}
          >
            {day}
          </div>
          {dayEvents.map((event, index) => (
            <div
              key={index}
              className="text-xs bg-blue-600 text-white rounded px-1 py-0.5 mb-1 truncate"
              title={`${event.title} - ${event.time}`}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return days;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaCalendarAlt className="text-2xl text-blue-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-800">Calendar</h3>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaChevronLeft className="text-gray-600" />
          </button>
          <h4 className="text-lg font-semibold text-gray-800 min-w-[200px] text-center">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h4>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FaChevronRight className="text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
        {/* Day headers */}
        {daysOfWeek.map((day) => (
          <div
            key={day}
            className="bg-gray-100 p-3 text-center font-semibold text-gray-700 border-b border-gray-200"
          >
            {day}
          </div>
        ))}

        {/* Calendar days */}
        {renderCalendarDays()}
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-600 rounded mr-2"></div>
            <span>Church Events</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 border-2 border-blue-300 bg-blue-50 rounded mr-2"></div>
            <span>Today</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
