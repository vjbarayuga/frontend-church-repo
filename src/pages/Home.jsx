import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import {
  FaCross,
  FaPray,
  FaHandsHelping,
  FaHeart,
  FaCalendarAlt,
  FaBookOpen,
  FaChurch,
  FaClock,
} from "react-icons/fa";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [todaysReadings, setTodaysReadings] = useState(null);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default slides as fallback
  const defaultSlides = [
    {
      image: "/images/church-main.jpg",
      title:
        "Welcome to Minor Basilica and Archdiocesan Shrine of Our Lady of the Assumption",
      subtitle: "A place of worship, community, and spiritual growth",
    },
    {
      image: "/images/mass-hero.jpg",
      title: "Join Us for Mass",
      subtitle: "Come and experience the joy of worship with our parish family",
    },
    {
      image: "/images/community.jpg",
      title: "Growing in Faith Together",
      subtitle: "Building a strong community through faith, love, and service",
    },
  ];

  const quickActions = [
    {
      icon: FaCross,
      title: "Confession",
      description: "Saturday 4:00-4:30 PM",
      link: "/mass-schedule",
      color: "bg-purple-600",
    },
    {
      icon: FaPray,
      title: "Mass Times",
      description: "Daily & Weekend Services",
      link: "/mass-schedule",
      color: "bg-blue-600",
    },
    {
      icon: FaHandsHelping,
      title: "Service",
      description: "Ways to get involved",
      link: "/events",
      color: "bg-green-600",
    },
    {
      icon: FaHeart,
      title: "Donate",
      description: "Support our mission",
      link: "/donate",
      color: "bg-red-600",
    },
  ];

  // Fetch slides from API
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await axiosClient.get("/slideshow");
        if (response.data && response.data.length > 0) {
          setSlides(response.data);
        } else {
          // Use default slides if no slides found in database
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.error("Error fetching slides:", error);
        // Use default slides as fallback
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-advance slides
  useEffect(() => {
    if (slides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [slides.length]);

  // Get today's reading from API
  useEffect(() => {
    const fetchTodaysReading = async () => {
      try {
        const response = await axiosClient.get("/readings/today");
        if (response.data) {
          const reading = response.data;
          setTodaysReadings({
            title: reading.title,
            reading1: reading.reading1,
            psalm: reading.psalm,
            reading2: reading.reading2,
            gospel: reading.gospel,
            date: new Date(reading.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          });
        }
      } catch (error) {
        console.error("Error fetching today's readings:", error);
        // Fallback to mock data if API fails
        const today = new Date();
        setTodaysReadings({
          title: "Seventeenth Sunday in Ordinary Time",
          reading1: "Genesis 18:20-32",
          psalm: "Psalm 138:1-2, 2-3, 6-7, 7-8",
          reading2: "Colossians 2:12-14",
          gospel: "Luke 11:1-13",
          date: today.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        });
      }
    };

    fetchTodaysReading();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Slideshow */}
      <div className="relative h-[70vh] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <div
              className="h-full bg-cover bg-center"
              style={{ backgroundImage: `url('${slide.image}')` }}
            >
              <div className="absolute inset-0 bg-black/50">
                <div className="h-full flex flex-col justify-center items-center text-white px-4">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-5xl md:text-6xl font-bold mb-6 text-center"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-xl md:text-2xl max-w-3xl text-center"
                  >
                    {slide.subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-white" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              How Can We Serve You?
            </h2>
            <p className="text-xl text-gray-600">
              Quick access to our most important services
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  to={action.link}
                  className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center group"
                >
                  <div
                    className={`${action.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}
                  >
                    <action.icon className="text-2xl text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600">{action.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mass Schedule & Today's Readings */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Mass Schedule */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <FaChurch className="text-3xl text-blue-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Mass Schedule
                </h3>
              </div>

              <div className="space-y-4">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    Weekend Masses
                  </h4>
                  <div className="text-gray-600">
                    <p>Saturday: 5:00 PM</p>
                    <p>Sunday: 7:00 AM, 9:00 AM, 11:00 AM</p>
                  </div>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h4 className="font-semibold text-gray-800">Daily Mass</h4>
                  <div className="text-gray-600">
                    <p>Monday: 7:00 AM (Communion Service)</p>
                    <p>Tuesday - Saturday: 7:00 AM</p>
                  </div>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h4 className="font-semibold text-gray-800">
                    Confession Times
                  </h4>
                  <div className="text-gray-600 flex items-center">
                    <FaClock className="mr-2" />
                    <span>Saturday: 4:00 PM - 4:30 PM</span>
                  </div>
                </div>
              </div>

              <Link
                to="/mass-schedule"
                className="inline-block mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View Full Schedule
              </Link>
            </motion.div>

            {/* Today's Readings */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-8"
            >
              <div className="flex items-center mb-6">
                <FaBookOpen className="text-3xl text-green-600 mr-3" />
                <h3 className="text-2xl font-bold text-gray-800">
                  Today's Readings
                </h3>
              </div>

              {todaysReadings && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      {todaysReadings.date}
                    </p>
                    <h4 className="text-lg font-semibold text-blue-600 mb-3">
                      {todaysReadings.title}
                    </h4>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">
                        Reading 1:
                      </span>
                      <span className="text-gray-600 ml-2">
                        {todaysReadings.reading1}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Psalm:</span>
                      <span className="text-gray-600 ml-2">
                        {todaysReadings.psalm}
                      </span>
                    </div>
                    {todaysReadings.reading2 && (
                      <div>
                        <span className="font-medium text-gray-700">
                          Reading 2:
                        </span>
                        <span className="text-gray-600 ml-2">
                          {todaysReadings.reading2}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-gray-700">Gospel:</span>
                      <span className="text-gray-600 ml-2">
                        {todaysReadings.gospel}
                      </span>
                    </div>
                  </div>

                  <a
                    href="https://bible.usccb.org/bible/readings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Read Full Readings
                  </a>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Upcoming Events
            </h2>
            <p className="text-xl text-gray-600">
              Join us for these special occasions
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sample events - replace with dynamic content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <span className="text-sm text-gray-500">August 15, 2025</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Assumption of the Blessed Virgin Mary
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                Special Mass at 7:00 PM
              </p>
              <Link
                to="/events"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Learn More →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <span className="text-sm text-gray-500">Every Sunday</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Faith Formation Classes
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                10:00 AM - Parish Hall
              </p>
              <Link
                to="/events"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Learn More →
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center mb-4">
                <FaCalendarAlt className="text-blue-600 mr-3" />
                <span className="text-sm text-gray-500">August 20, 2025</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                Community Service Day
              </h4>
              <p className="text-gray-600 text-sm mb-4">
                9:00 AM - Local Food Bank
              </p>
              <Link
                to="/events"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Learn More →
              </Link>
            </motion.div>
          </div>

          <div className="text-center mt-8">
            <Link
              to="/events"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              View All Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
