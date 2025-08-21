import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Hero from "../components/Hero";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [heroData, setHeroData] = useState({
    heroImage: "/images/events-hero.jpg",
    heroTitle: "Church Events",
    heroSubtitle: "Join Our Community Gatherings and Celebrations",
  });

  useEffect(() => {
    async function fetchPageContent() {
      try {
        const res = await axiosClient.get("/page-content/events");
        if (res.data) {
          setHeroData({
            heroImage: res.data.heroImage || "/images/events-hero.jpg",
            heroTitle: res.data.heroTitle || "Church Events",
            heroSubtitle:
              res.data.heroSubtitle ||
              "Join Our Community Gatherings and Celebrations",
          });
        }
      } catch (err) {}
    }
    fetchPageContent();
  }, []);

  useEffect(() => {
    axiosClient.get("/events").then((res) => {
      console.log(res.data);
      setEvents(res.data);
    });
  }, []);

  return (
    <>
      <Hero
        title={heroData.heroTitle}
        subtitle={heroData.heroSubtitle}
        backgroundImage={heroData.heroImage}
      />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Upcoming Events</h1>
        <ul className="space-y-4">
          {events.length > 0 ? (
            events.map((event) => (
              <li key={event._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString()}
                </p>
                <p className="mt-1">{event.description}</p>
              </li>
            ))
          ) : (
            <p>No upcoming events.</p>
          )}
        </ul>
      </div>
    </>
  );
}
