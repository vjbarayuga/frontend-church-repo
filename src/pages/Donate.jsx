import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import axiosClient from "../api/axiosClient";

export default function Donate() {
  const [heroData, setHeroData] = useState({
    heroImage: "/images/donate-hero.jpg",
    heroTitle: "Support Our Church",
    heroSubtitle: "Help Us Continue Our Mission Through Your Generosity",
  });

  useEffect(() => {
    async function fetchPageContent() {
      try {
        const res = await axiosClient.get("/page-content/donate");
        if (res.data) {
          setHeroData({
            heroImage: res.data.heroImage || "/images/donate-hero.jpg",
            heroTitle: res.data.heroTitle || "Support Our Church",
            heroSubtitle:
              res.data.heroSubtitle ||
              "Help Us Continue Our Mission Through Your Generosity",
          });
        }
      } catch (err) {}
    }
    fetchPageContent();
  }, []);

  return (
    <>
      <Hero
        title={heroData.heroTitle}
        subtitle={heroData.heroSubtitle}
        backgroundImage={heroData.heroImage}
      />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Donate</h1>
        <p className="text-gray-700 mb-4">
          Your contributions help sustain our programs and outreach. Thank you
          for your generosity.
        </p>
        <button className="bg-green-600 text-white px-6 py-2 rounded">
          Donate Now
        </button>
      </div>
    </>
  );
}
