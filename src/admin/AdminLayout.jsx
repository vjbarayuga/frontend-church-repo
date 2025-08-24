// admin/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";

export default function AdminLayout({ setIsAdmin }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    if (setIsAdmin) {
      setIsAdmin(false);
    }
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
}
