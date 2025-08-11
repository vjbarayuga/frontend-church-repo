import { useEffect, useState } from "react";
import Hero from '../components/Hero';
import axiosClient from "../api/axiosClient";

export default function PriestBio() {
  const [bio, setBio] = useState("");

  useEffect(() => {
    axiosClient.get("/priests")
      .then(res => {
        if (res.data && res.data.length > 0) {
          setBio(res.data[0].bio);
        }
      })
      .catch(err => {
        setBio("Priest bio not available.");
      });
  }, []);

  return (
    <>
      <Hero 
        title="Our Parish Priest"
        subtitle="Serving Our Community with Faith and Dedication"
        backgroundImage="/images/priest-hero.jpg"
      />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Priest Biography</h1>
        <p className="text-gray-700">
          {bio}
        </p>
      </div>
    </>
  );
}