import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import Hero from "../components/Hero";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Services() {
  const [services, setServices] = useState([]);
  const [sacraments, setSacraments] = useState([]);
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, sacramentsRes, pageRes] = await Promise.all([
        axiosClient.get("/services"),
        axiosClient.get("/sacraments"),
        axiosClient.get("/page-content/services").catch(() => ({ data: null })),
      ]);

      setServices(servicesRes.data);
      setSacraments(sacramentsRes.data);
      setPageContent(pageRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching services data:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only show the three allowed services
  const allowedServices = [
    "Holy Baptism",
    "Christian Burial",
    "Holy Matrimony",
  ];
  const filteredServices = services.filter((s) =>
    allowedServices.includes(s.name)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <Hero
        title={pageContent?.heroTitle || "Parish Services"}
        subtitle={
          pageContent?.heroSubtitle ||
          "Discover the various ministries and services our parish offers to support your spiritual journey and community involvement."
        }
        backgroundImage={pageContent?.heroImage || "/images/services-hero.jpg"}
      />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Page Content */}
        {pageContent?.content && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <div className="prose max-w-none">
              {pageContent.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Sacraments Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Sacraments
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The seven sacraments are sacred rituals that mark important
              moments in our spiritual journey.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {sacraments.map((sacrament, index) => (
              <motion.div
                key={sacrament._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                {sacrament.image && (
                  <img
                    src={sacrament.image}
                    alt={sacrament.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">
                    {sacrament.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{sacrament.description}</p>

                  {/* Schedule */}
                  {sacrament.schedule && (
                    <div className="mb-4 flex items-center text-sm text-gray-600">
                      <FaClock className="mr-2 text-blue-600" />
                      <span>{sacrament.schedule}</span>
                    </div>
                  )}

                  {/* Key Requirements */}
                  {sacrament.requirements &&
                    sacrament.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          Key Requirements:
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                          {sacrament.requirements
                            .slice(0, 3)
                            .map((req, idx) => (
                              <li key={idx} className="flex items-start">
                                <span
                                  className={
                                    req.required
                                      ? "text-red-600"
                                      : "text-gray-500"
                                  }
                                >
                                  {req.required ? "• " : "○ "}
                                </span>
                                <span>{req.item}</span>
                              </li>
                            ))}
                          {sacrament.requirements.length > 3 && (
                            <li className="text-blue-600 font-medium">
                              + {sacrament.requirements.length - 3} more
                              requirements
                            </li>
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Fees */}
                  {sacrament.fees && sacrament.fees.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Fees:
                      </h4>
                      {sacrament.fees.slice(0, 2).map((fee, idx) => (
                        <p key={idx} className="text-sm text-gray-600">
                          <span className="font-medium">{fee.item}:</span>{" "}
                          {fee.amount}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Contact */}
                  <div className="border-t pt-4 mt-4">
                    {sacrament.contactPerson && (
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-medium">Contact:</span>{" "}
                        {sacrament.contactPerson}
                      </p>
                    )}
                    {sacrament.contactInfo && (
                      <p className="text-sm text-gray-600">
                        {sacrament.contactInfo}
                      </p>
                    )}
                  </div>

                  {/* CTA Button removed as requested */}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-white rounded-lg shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Need More Information?
            </h2>
            <p className="text-gray-600">
              Contact our parish office for detailed information about any of
              our services or sacraments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <FaPhone className="text-3xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">(02) 123-4567</p>
            </div>
            <div className="flex flex-col items-center">
              <FaEnvelope className="text-3xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">info@church.org</p>
            </div>
            <div className="flex flex-col items-center">
              <FaMapMarkerAlt className="text-3xl text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Visit Us</h3>
              <p className="text-gray-600">
                Parish Office Hours: Mon-Fri 9AM-5PM
              </p>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
