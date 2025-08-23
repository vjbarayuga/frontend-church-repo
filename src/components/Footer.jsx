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
                href="https://www.facebook.com/profile.php?id=100086198833400"
                className="text-gray-300 hover:text-white transition-colors"
              >
                <FaFacebook className="text-xl" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <FaMapMarkerAlt className="mr-3 text-blue-400" />
                <div>
                  <div>Poblacion Norte</div>
                  <div>Santa Maria, Ilocos Sur, 2705</div>
                </div>
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
