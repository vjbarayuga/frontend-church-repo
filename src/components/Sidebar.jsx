import Calendar from "./Calendar";
import NewsFromVatican from "./NewsFromVatican";
import { motion } from "framer-motion";
import { FaPray, FaBible, FaHandsHelping } from "react-icons/fa";

export default function Sidebar() {
  const prayerResources = [
    { title: "Morning Prayer", description: "Start your day with God" },
    { title: "Evening Prayer", description: "End your day in gratitude" },
    { title: "Rosary Guide", description: "Meditative prayer practice" },
    { title: "Stations of the Cross", description: "Journey with Jesus" },
  ];

  return (
    <aside className="space-y-8">
      {/* Calendar Component */}
      <Calendar />

      {/* Prayer Resources */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <FaPray className="text-2xl text-purple-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-800">Prayer Resources</h3>
        </div>

        <div className="space-y-4">
          {prayerResources.map((resource, index) => (
            <div
              key={index}
              className="border-l-4 border-purple-300 pl-4 py-2 hover:border-purple-500 transition-colors cursor-pointer"
            >
              <h4 className="font-semibold text-gray-800">{resource.title}</h4>
              <p className="text-gray-600 text-sm">{resource.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-6">
          <a
            href="#"
            className="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            View All Prayers
          </a>
        </div>
      </motion.div>

      {/* Bible Reading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg shadow-lg p-6 text-white"
      >
        <div className="flex items-center mb-4">
          <FaBible className="text-2xl mr-3" />
          <h3 className="text-xl font-bold">Daily Scripture</h3>
        </div>

        <blockquote className="text-green-100 italic mb-4">
          "Ask and it will be given to you; seek and you will find; knock and
          the door will be opened to you."
        </blockquote>

        <cite className="text-green-200 text-sm">- Matthew 7:7</cite>

        <div className="mt-4">
          <a
            href="https://bible.usccb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-green-700 px-4 py-2 rounded font-medium hover:bg-green-50 transition-colors"
          >
            Read More Scripture
          </a>
        </div>
      </motion.div>

      {/* News from Vatican */}
      <NewsFromVatican />

      {/* Service Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <FaHandsHelping className="text-2xl text-orange-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-800">Get Involved</h3>
        </div>

        <div className="space-y-3">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1">Food Drive</h4>
            <p className="text-gray-600 text-sm">
              Help feed our community in need
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1">Youth Ministry</h4>
            <p className="text-gray-600 text-sm">
              Guide our young people in faith
            </p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-1">Altar Servers</h4>
            <p className="text-gray-600 text-sm">
              Assist during Mass celebrations
            </p>
          </div>
        </div>

        <div className="mt-6">
          <a
            href="/events"
            className="inline-block bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Learn More
          </a>
        </div>
      </motion.div>
    </aside>
  );
}
