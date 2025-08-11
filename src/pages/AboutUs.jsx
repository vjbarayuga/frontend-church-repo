import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hero from "../components/Hero";
import Sidebar from "../components/Sidebar";
import { FaChurch, FaHeart, FaUsers, FaHandsHelping } from "react-icons/fa";

export default function AboutUs() {
  const [selectedId, setSelectedId] = useState(1);

  const sections = [
    {
      id: 1,
      title: "Our History",
      icon: FaChurch,
      content:
        "Our church was founded in 1950 with a vision to serve the spiritual and social needs of the local community. Over the decades, it has become a beacon of faith and fellowship. From humble beginnings as a small congregation meeting in a community center, we have grown into a vibrant parish family that serves hundreds of families in our area. Our beautiful church building was completed in 1965, and we have continued to expand our ministries and outreach programs to meet the evolving needs of our community.",
    },
    {
      id: 2,
      title: "Our Mission",
      icon: FaHeart,
      content:
        "We are dedicated to spreading God's word and serving our community through faith, love, and compassion. Our mission is to create a welcoming environment where all people can encounter Jesus Christ, grow in their faith, and serve others. We strive to be a place where the Gospel comes alive through our worship, education, and service to those in need.",
    },
    {
      id: 3,
      title: "Our Community",
      icon: FaUsers,
      content:
        "Our parish is home to over 500 families from diverse backgrounds, all united in faith and fellowship. We believe that everyone has a place in our church family, regardless of where they are on their spiritual journey. Our community includes young families, seniors, students, and professionals who come together to worship, learn, and serve.",
    },
    {
      id: 4,
      title: "Our Ministries",
      icon: FaHandsHelping,
      content:
        "We offer numerous ministries and programs designed to meet the spiritual, educational, and social needs of our parish family. These include religious education for all ages, youth ministry, senior fellowship, charitable outreach, liturgical ministries, and various prayer groups. Each ministry provides opportunities for our parishioners to grow in faith and serve others.",
    },
  ];

  const stats = [
    { number: "500+", label: "Parish Families" },
    { number: "75", label: "Years Serving" },
    { number: "20+", label: "Active Ministries" },
    { number: "1000+", label: "Lives Touched Annually" },
  ];

  return (
    <>
      <Hero
        title="About Our Parish"
        subtitle="Learn about our history, mission, and community"
        backgroundImage="/images/church-main.jpg"
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-blue-600 rounded-lg p-8 mb-12 text-white"
            >
              <h2 className="text-3xl font-bold text-center mb-8">
                Our Impact
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <div className="text-3xl font-bold mb-2">{stat.number}</div>
                    <div className="text-blue-200">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Accordion Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl font-bold mb-8 text-center text-gray-800">
                About Minor Basilica and Archdiocesan Shrine of Our Lady of the
                Assumption
              </h2>

              <div className="space-y-4">
                {sections.map((section) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: section.id * 0.1 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden"
                  >
                    <button
                      className="w-full p-6 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center border-b border-gray-200 transition-colors"
                      onClick={() =>
                        setSelectedId(
                          selectedId === section.id ? null : section.id
                        )
                      }
                    >
                      <div className="flex items-center">
                        <section.icon className="text-2xl text-blue-600 mr-4" />
                        <span className="font-semibold text-xl text-gray-800">
                          {section.title}
                        </span>
                      </div>
                      <span
                        className={`text-2xl transition-transform ${
                          selectedId === section.id ? "rotate-45" : ""
                        }`}
                      >
                        +
                      </span>
                    </button>

                    <AnimatePresence>
                      {selectedId === section.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 bg-white">
                            <p className="text-gray-700 leading-relaxed text-lg">
                              {section.content}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="mt-12 bg-gradient-to-r from-green-600 to-green-800 rounded-lg p-8 text-white text-center"
            >
              <h3 className="text-2xl font-bold mb-4">
                Join Our Parish Family
              </h3>
              <p className="text-green-100 mb-6 text-lg">
                We welcome you to become part of our loving church community.
                Whether you're new to the area or looking for a spiritual home,
                we invite you to join us for worship and fellowship.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/mass-schedule"
                  className="bg-white text-green-700 px-8 py-3 rounded-lg hover:bg-green-50 transition-colors font-medium"
                >
                  View Mass Times
                </a>
                <a
                  href="/events"
                  className="bg-green-700 text-white px-8 py-3 rounded-lg hover:bg-green-800 transition-colors font-medium border border-green-400"
                >
                  Upcoming Events
                </a>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>
    </>
  );
}
