import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import axiosClient from "../api/axiosClient";

export default function OurHistory() {
  const [bio, setBio] = useState("");

  useEffect(() => {
    axiosClient.get("/history")
      .then((res) => setBio(res.data?.content || ""))
      .catch((err) => {
        console.error("Failed to load church history:", err);
        setBio("History content is currently unavailable.");
      });
  }, []);

  return (
    <>
      <Hero 
        title="Our History"
        subtitle="A Legacy of Faith Since 1950"
        backgroundImage="/images/church-history.jpg"
      />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Our History</h1>
        <p className="text-gray-700 whitespace-pre-line">
          {bio}
        </p>
      </div>
    </>
  );
}