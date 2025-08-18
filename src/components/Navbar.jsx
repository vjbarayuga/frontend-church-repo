import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/our-history", label: "About" },
    { to: "/priest-bio", label: "Priest" },
    { to: "/mass-schedule", label: "Mass Times" },
    { to: "/services", label: "Services" },
    { to: "/announcements", label: "News" },
    { to: "/events", label: "Events" },
    { to: "/donate", label: "Donate", donate: true },
    { to: "/admin/dashboard", label: "Admin", admin: true },
  ];

  return (
    <>
      {/* Top contact bar */}
      <div className="bg-blue-900 text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm gap-2 md:gap-0">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6">
            <div className="flex items-center gap-2">
              <FaPhone />
              <span>(555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2">
              <FaEnvelope />
              <span>info@ourladyassumption.org</span>
            </div>
            <div className="hidden md:block">
              Office Hours: Tue-Fri 9:00am-3:00pm
            </div>
          </div>
          <div className="flex items-center gap-3 mt-2 md:mt-0">
            <a href="#" className="hover:text-blue-200">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-200">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-white shadow-md px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-sm font-bold text-blue-800">
              Minor Basilica and Archdiocesan Shrine of Our Lady of the
              Assumption
            </h1>
            <p className="text-sm text-gray-600">Parish Community</p>
          </div>
          {/* Hamburger for mobile */}
          <div className="md:hidden">
            <button
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="text-blue-800 text-2xl focus:outline-none"
            >
              <FaBars />
            </button>
          </div>
          {/* Desktop nav links */}
          <ul className="hidden md:flex gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={
                    link.donate
                      ? "hover:text-blue-600 transition-colors bg-yellow-500 text-white px-3 py-1 rounded"
                      : link.admin
                      ? "text-gray-500 hover:text-gray-700 transition-colors"
                      : "hover:text-blue-600 transition-colors"
                  }
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Mobile menu overlay */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-end md:hidden">
            <div className="w-3/4 max-w-xs bg-white h-full shadow-lg p-6 flex flex-col">
              <button
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="self-end text-2xl text-blue-800 mb-6"
              >
                <FaTimes />
              </button>
              <ul className="flex flex-col gap-4 text-lg font-medium">
                {navLinks.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className={
                        link.donate
                          ? "hover:text-blue-600 transition-colors bg-yellow-500 text-white px-3 py-1 rounded"
                          : link.admin
                          ? "text-gray-500 hover:text-gray-700 transition-colors"
                          : "hover:text-blue-600 transition-colors"
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
