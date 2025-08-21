import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";
import OurHistory from "./pages/OurHistory";
import PriestBio from "./pages/PriestBio";
import MassSchedule from "./pages/MassSchedule";
import Services from "./pages/Services";
import Announcements from "./pages/Announcements";
import Events from "./pages/Events";
import Donate from "./pages/Donate";
import AdminLayout from "./admin/AdminLayout";
import Dashboard from "./admin/Dashboard";
import EditDeleteHistory from "./admin/EditDeleteHistory";
import EditDeletePriestBio from "./admin/EditDeletePriestBio";
import EditDeleteMassSchedule from "./admin/EditDeleteMassSchedule";
import EditDeleteAnnouncements from "./admin/EditDeleteAnnouncements";
import EditDeleteEvents from "./admin/EditDeleteEvents";
import EditDeleteSlideshow from "./admin/EditDeleteSlideshow";
import EditPageContent from "./admin/EditPageContent";
import EditDeleteServices from "./admin/EditDeleteServices";
import EditDeleteSacraments from "./admin/EditDeleteSacraments";
import EditDeleteReadings from "./admin/EditDeleteReadings";

import EditNewsPage from "./admin/EditNewsPage";
import AdminLogin from "./admin/AdminLogin";
import AdminRegister from "./admin/AdminRegister";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          // Verify token with backend
          const response = await fetch(
            `${import.meta.env.VITE_API_URL || ""}/api/admin/verify-token`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            setIsAdmin(true);
          } else {
            // Token is invalid, remove it
            localStorage.removeItem("adminToken");
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Token validation failed:", error);
          localStorage.removeItem("adminToken");
          setIsAdmin(false);
        }
      }
      setLoading(false);
    };

    validateToken();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      {/* Outer container takes full height and flexbox layout */}
      <div className="min-h-screen flex flex-col">
        {/* Top: Navbar */}
        <Navbar />

        {/* Middle: Main content should grow to push footer */}
        <main className="flex-grow">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/our-history" element={<OurHistory />} />
            <Route path="/priest-bio" element={<PriestBio />} />
            <Route path="/mass-schedule" element={<MassSchedule />} />
            <Route path="/services" element={<Services />} />
            <Route path="/announcements" element={<Announcements />} />
            <Route path="/events" element={<Events />} />
            <Route path="/donate" element={<Donate />} />

            {/* Admin Auth */}
            <Route
              path="/admin/login"
              element={<AdminLogin setIsAdmin={setIsAdmin} />}
            />
            <Route path="/admin/register" element={<AdminRegister />} />

            {/* Admin CMS */}
            {isAdmin ? (
              <Route
                path="/admin/*"
                element={<AdminLayout setIsAdmin={setIsAdmin} />}
              >
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="edit-history" element={<EditDeleteHistory />} />
                <Route path="edit-priest" element={<EditDeletePriestBio />} />
                <Route
                  path="edit-schedule"
                  element={<EditDeleteMassSchedule />}
                />
                <Route
                  path="edit-announcements"
                  element={<EditDeleteAnnouncements />}
                />
                <Route path="edit-events" element={<EditDeleteEvents />} />
                <Route path="edit-news" element={<EditNewsPage />} />
                <Route
                  path="edit-slideshow"
                  element={<EditDeleteSlideshow />}
                />
                <Route path="edit-page-content" element={<EditPageContent />} />
                <Route path="edit-services" element={<EditDeleteServices />} />
                <Route
                  path="edit-sacraments"
                  element={<EditDeleteSacraments />}
                />
                <Route path="edit-readings" element={<EditDeleteReadings />} />
              </Route>
            ) : (
              <Route path="/admin/*" element={<Navigate to="/admin/login" />} />
            )}
          </Routes>
        </main>

        {/* Bottom: Footer (Always at the bottom) */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
