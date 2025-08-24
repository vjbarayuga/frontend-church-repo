import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Hero from "../components/Hero";
import { FaChurch, FaCross, FaClock, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const iconMap = {
  FaCross,
  FaCalendarAlt,
};

export default function MassSchedule() {
  const [schedule, setSchedule] = useState({});
  const [heroData, setHeroData] = useState({
    heroImage: "/images/mass-hero.jpg",
    heroTitle: "Mass Schedule",
    heroSubtitle: "Join Us in Prayer and Worship",
  });
  const [specialSchedules, setSpecialSchedules] = useState([]);
  const [officeHours, setOfficeHours] = useState([]);
  const [officeEmergencyNote, setOfficeEmergencyNote] = useState("");
  const [contactSection, setContactSection] = useState({
    heading: "",
    description: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    async function fetchPageContent() {
      try {
        const res = await axiosClient.get("/page-content/mass-times");
        if (res.data) {
          setHeroData({
            heroImage: res.data.heroImage || "/images/mass-hero.jpg",
            heroTitle: res.data.heroTitle || "Mass Schedule",
            heroSubtitle:
              res.data.heroSubtitle || "Join Us in Prayer and Worship",
          });
          setSpecialSchedules(res.data.specialSchedules || []);
          setOfficeHours(res.data.officeHours || []);
          setOfficeEmergencyNote(res.data.officeEmergencyNote || "");
          setContactSection(
            res.data.contactSection || {
              heading: "",
              description: "",
              phone: "",
              email: "",
            }
          );
        }
      } catch (err) {}
    }
    fetchPageContent();
  }, []);

  useEffect(() => {
    axiosClient.get("/massschedule").then((res) => {
      const grouped = res.data.reduce((acc, curr) => {
        if (!acc[curr.day]) acc[curr.day] = [];
        acc[curr.day].push(curr.time);
        return acc;
      }, {});
      setSchedule(grouped);
    });
  }, []);

  // specialSchedules now comes from backend

  return (
    <>
      <Hero
        title={heroData.heroTitle}
        subtitle={heroData.heroSubtitle}
        backgroundImage={heroData.heroImage}
      />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Main Mass Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Mass Times
            </h1>
            <p className="text-xl text-gray-600">
              Come and worship with our parish community
            </p>
          </div>

          {Object.keys(schedule).length === 0 ? (
            <div className="text-center py-12">
              <FaChurch className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Loading schedule...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {Object.entries(schedule).map(([day, times], index) => (
                <motion.div
                  key={day}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white border-2 border-blue-100 shadow-lg rounded-lg p-6 hover:shadow-xl hover:border-blue-300 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <FaChurch className="text-blue-600 text-2xl mr-3" />
                    <h2 className="text-xl font-bold text-blue-800">{day}</h2>
                  </div>
                  <ul className="space-y-2">
                    {times.map((time, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <FaClock className="text-blue-500 mr-2 text-sm" />
                        <span className="font-medium">{time}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Special Schedules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {specialSchedules.map((schedule, index) => {
            const Icon =
              iconMap[
                schedule.icon?.replace("Fa", "") ? schedule.icon : "FaCross"
              ] || FaCross;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-lg p-8 border-l-4 border-purple-500"
              >
                <div className="flex items-center mb-6">
                  <div
                    className={`${schedule.color} w-12 h-12 rounded-full flex items-center justify-center mr-4`}
                  >
                    {Icon && <Icon className="text-white text-xl" />}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {schedule.title}
                  </h3>
                </div>
                <div className="space-y-4">
                  {schedule.items &&
                    schedule.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 border-gray-200 pl-4"
                      >
                        <div className="font-semibold text-gray-800">
                          {item.day}
                        </div>
                        <div className="text-blue-600 font-medium">
                          {item.time}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {item.location}
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {contactSection.heading || "Questions About Mass Times?"}
          </h3>
          <p className="text-gray-600 mb-6">
            {contactSection.description ||
              "Please contact our parish office for any questions about our schedule or special services."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {contactSection.phone && (
              <a
                href={`tel:${contactSection.phone.replace(/[^\d]/g, "")}`}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Call {contactSection.phone}
              </a>
            )}
            {contactSection.email && (
              <a
                href={`mailto:${contactSection.email}`}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Email Us
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
}
