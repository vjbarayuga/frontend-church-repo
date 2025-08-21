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
    axiosClient
      .get("/priests")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setBio(res.data[0].bio);
        }
      })
      .catch((err) => {
        setBio("Priest bio not available.");
      });
    // Fetch hero data
    axiosClient.get("/page-content/priest").then((res) => {
      if (res.data) {
        setHeroData({
          heroImage: res.data.heroImage || "/images/priest-hero.jpg",
          heroTitle: res.data.heroTitle || "Our Parish Priest",
          heroSubtitle:
            res.data.heroSubtitle ||
            "Serving Our Community with Faith and Dedication",
        });
      }
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
