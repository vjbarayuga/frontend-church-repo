import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Dashboard() {
  // Set initial state to 1 (first accordion item)
  const [selectedId, setSelectedId] = useState(1);

  // Optional: Use useEffect if you want to animate on mount
  useEffect(() => {
    // This ensures the animation runs after component mounts
    setSelectedId(1);
  }, []);

  const items = [
    {
      id: 1,
      title: "Homepage & Page Content",
      links: [
        { to: "/admin/edit-slideshow", label: "Manage Homepage Slideshow" },
        {
          to: "/admin/edit-page-content",
          label: "Manage Page Hero Images & Content",
        },
      ],
    },
    {
      id: 2,
      title: "Church Information",
      links: [
        // { to: "/admin/edit-history", label: "Edit Church History" },
        { to: "/admin/edit-schedule", label: "Edit Mass Schedule" },
      ],
    },
    {
      id: 3,
      title: "Services & Sacraments",
      links: [
        { to: "/admin/edit-services", label: "Manage Church Services" },
        {
          to: "/admin/edit-sacraments",
          label: "Manage Sacraments (Baptism, Wedding, Burial)",
        },
      ],
    },
    {
      id: 4,
      title: "Announcements & Events",
      links: [
        { to: "/admin/edit-announcements", label: "Edit Announcements" },
        { to: "/admin/edit-events", label: "Edit Events" },
      ],
    },
    {
      id: 5,
      title: "Liturgical Content",
      links: [{ to: "/admin/edit-readings", label: "Manage Daily Readings" }],
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {items.map((item) => (
        <div key={item.id} className="mb-4">
          <button
            className="w-full p-4 text-left bg-blue-100 hover:bg-blue-200 rounded-t flex justify-between items-center"
            onClick={() =>
              setSelectedId(selectedId === item.id ? null : item.id)
            }
          >
            <span className="font-semibold">{item.title}</span>
            <motion.span
              initial={{ rotate: item.id === 1 ? 180 : 0 }} // Set initial rotation for first item
              animate={{ rotate: selectedId === item.id ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              ▼
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {selectedId === item.id && (
              <motion.div
                key={`content-${item.id}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{
                  height: "auto",
                  opacity: 1,
                  transition: { duration: 0.3 },
                }}
                exit={{
                  height: 0,
                  opacity: 0,
                  transition: { duration: 0.2 },
                }}
                className="overflow-hidden border-x border-b rounded-b"
              >
                <div className="p-4 bg-white">
                  {item.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="block py-2 px-4 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
