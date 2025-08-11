import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Parish Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              Minor Basilica and Archdiocesan Shrine of Our Lady of the
              Assumption
            </h3>
            <p className="text-gray-300 mb-4">
              A Catholic parish dedicated to serving our community through
              faith, worship, and love.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaTwitter className="text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/mass-schedule"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Mass Times
                </Link>
              </li>
              <li>
                <Link
                  to="/about-us"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/priest-bio"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Our Priest
                </Link>
              </li>
              <li>
                <Link
                  to="/events"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  to="/announcements"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  News & Announcements
                </Link>
              </li>
              <li>
                <Link
                  to="/donate"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Support Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-3 text-blue-400" />
                <div>
                  <div>123 Faith Avenue</div>
                  <div>Hope City, HC 12345</div>
                </div>
              </div>
              <div className="flex items-center text-gray-300">
                <FaPhone className="mr-3 text-blue-400" />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center text-gray-300">
                <FaEnvelope className="mr-3 text-blue-400" />
                <span>info@ourladyassumption.org</span>
              </div>
            </div>
          </div>

          {/* Office Hours */}
          <div>
            <h3 className="text-xl font-bold mb-4">Office Hours</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center">
                <FaClock className="mr-3 text-blue-400" />
                <div>
                  <div className="font-medium">Tuesday - Friday</div>
                  <div className="text-sm">9:00 AM - 3:00 PM</div>
                </div>
              </div>
              <div className="text-sm text-gray-400 mt-3">
                Saturday - Monday: CLOSED
                <br />
                Holidays: CLOSED
              </div>
              <div className="text-sm text-yellow-400 mt-3">
                For emergencies, please call our emergency line.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-300 text-sm">
            © {new Date().getFullYear()} Minor Basilica and Archdiocesan Shrine
            of Our Lady of the Assumption. All rights reserved.
          </div>
          <div className="text-gray-300 text-sm mt-4 md:mt-0">
            Built with faith and technology
          </div>
        </div>
      </div>
    </footer>
  );
}
