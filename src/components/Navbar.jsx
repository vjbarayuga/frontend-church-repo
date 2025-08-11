import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaEnvelope, FaPhone } from "react-icons/fa";

export default function Navbar() {
  return (
    <>
      {/* Top contact bar */}
      <div className="bg-blue-900 text-white py-2 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
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
          <div className="flex items-center gap-3">
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
          <ul className="flex gap-6 text-sm font-medium">
            <li>
              <Link to="/" className="hover:text-blue-600 transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/our-history"
                className="hover:text-blue-600 transition-colors"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/priest-bio"
                className="hover:text-blue-600 transition-colors"
              >
                Priest
              </Link>
            </li>
            <li>
              <Link
                to="/mass-schedule"
                className="hover:text-blue-600 transition-colors"
              >
                Mass Times
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="hover:text-blue-600 transition-colors"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/announcements"
                className="hover:text-blue-600 transition-colors"
              >
                News
              </Link>
            </li>
            <li>
              <Link
                to="/events"
                className="hover:text-blue-600 transition-colors"
              >
                Events
              </Link>
            </li>
            <li>
              <Link
                to="/donate"
                className="hover:text-blue-600 transition-colors bg-gold-500 text-white px-3 py-1 rounded"
              >
                Donate
              </Link>
            </li>
            <li>
              <Link
                to="/admin/dashboard"
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
