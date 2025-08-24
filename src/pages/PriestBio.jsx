import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import axiosClient from "../api/axiosClient";

export default function PriestBio() {
  const [bio, setBio] = useState("");
  const [heroData, setHeroData] = useState({
    heroImage: "/images/priest-hero.jpg",
    heroTitle: "Our Parish Priest",
    heroSubtitle: "Serving Our Community with Faith and Dedication",
  });

  useEffect(() => {
    // Fetch priest bio and hero data from page-content/priest
    axiosClient
      .get("/page-content/priest")
      .then((res) => {
        if (res.data) {
          setBio(res.data.content || "Priest bio not available.");
          setHeroData({
            heroImage: res.data.heroImage || "/images/priest-hero.jpg",
            heroTitle: res.data.heroTitle || "Our Parish Priest",
            heroSubtitle:
              res.data.heroSubtitle ||
              "Serving Our Community with Faith and Dedication",
          });
        } else {
          setBio("Priest bio not available.");
        }
      })
      .catch(() => {
        setBio("Priest bio not available.");
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
        <h1 className="text-3xl font-bold mb-4">Priest Biography</h1>
        <p className="text-gray-700">{bio}</p>
      </div>
    </>
  );
}
