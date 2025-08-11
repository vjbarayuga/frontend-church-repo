import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaNewspaper, FaExternalLinkAlt, FaClock } from "react-icons/fa";

export default function NewsFromVatican() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock Vatican news data - in real implementation, you'd fetch from an API
    const mockNews = [
      {
        id: 1,
        title: "Missionaries are a 'message of hope' according to Pope Leo",
        excerpt:
          'In a world darkened by war and injustice, "even when all seems lost," Pope Leo XIV said migrants and refugees "stand as messengers of hope."',
        url: "https://cruxnow.com/vatican/2025/07/missionaries-are-a-message-of-hope-according-to-pope-leo/",
        date: "July 26, 2025",
        timeAgo: "1 day ago",
      },
      {
        id: 2,
        title:
          "Pope Leo says mission of evangelism belongs to all the baptized",
        excerpt:
          'Pope Leo XIV says all Christians are called to enter "the dynamism of mission and to face the challenges of evangelization."',
        url: "https://cruxnow.com/vatican/2025/07/pope-leo-says-mission-of-evangelism-belongs-to-all-the-baptized/",
        date: "July 25, 2025",
        timeAgo: "2 days ago",
      },
      {
        id: 3,
        title: "Pope Leo leaves Castel Gandolfo and returns to Vatican City",
        excerpt:
          "Returning to Rome on Tuesday night after a short stay in nearby town of Castel Gandolfo, Pope Leo XIV called for an end to the arms trade.",
        url: "https://cruxnow.com/vatican/2025/07/pope-leo-leaves-castel-gandolfo-and-returns-to-vatican-city/",
        date: "July 24, 2025",
        timeAgo: "3 days ago",
      },
      {
        id: 4,
        title:
          "Pope Leo XIV marks 56th anniversary of moon landing with observatory visit",
        excerpt:
          "Pope Leo XIV marked the 56th anniversary of man's arrival on the moon Sunday with a visit to the Vatican astronomical observatory.",
        url: "https://cruxnow.com/ap/2025/07/pope-leo-xiv-marks-56th-anniversary-of-moon-landing-with-observatory-visit-call-to-buzz-aldrin/",
        date: "July 23, 2025",
        timeAgo: "4 days ago",
      },
      {
        id: 5,
        title:
          "Pope Leo speaks to President of Palestine, urges protection of civilians in Gaza",
        excerpt:
          "In a telephone conversation with President Mahmoud Abbas of the State of Palestine on Monday, Pope Leo XIV repeated his appeal for international humanitarian law.",
        url: "https://cruxnow.com/vatican/2025/07/pope-leo-speaks-to-president-of-palestine-urges-protection-of-civilians-in-gaza/",
        date: "July 22, 2025",
        timeAgo: "5 days ago",
      },
    ];

    // Simulate loading delay
    setTimeout(() => {
      setNews(mockNews);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex items-center mb-6">
          <FaNewspaper className="text-2xl text-red-600 mr-3" />
          <h3 className="text-2xl font-bold text-gray-800">
            News from the Vatican
          </h3>
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-lg shadow-lg p-6"
    >
      <div className="flex items-center mb-6">
        <FaNewspaper className="text-2xl text-red-600 mr-3" />
        <h3 className="text-2xl font-bold text-gray-800">
          News from the Vatican
        </h3>
      </div>

      <div className="space-y-6">
        {news.map((article, index) => (
          <motion.article
            key={article.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="text-lg font-semibold text-gray-800 leading-tight pr-4">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-red-600 transition-colors"
                >
                  {article.title}
                </a>
              </h4>
              <FaExternalLinkAlt className="text-gray-400 text-sm mt-1 flex-shrink-0" />
            </div>

            <p className="text-gray-600 text-sm mb-3 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex items-center text-xs text-gray-500">
              <FaClock className="mr-1" />
              <span>{article.timeAgo}</span>
              <span className="mx-2">•</span>
              <span>{article.date}</span>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <a
          href="https://cruxnow.com/vatican"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-red-600 hover:text-red-700 font-medium text-sm transition-colors"
        >
          View More Vatican News
          <FaExternalLinkAlt className="ml-2" />
        </a>
      </div>
    </motion.div>
  );
}
