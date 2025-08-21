import { useEffect, useState } from "react";
import Hero from "../components/Hero";
import axiosClient from "../api/axiosClient";

export default function OurHistory() {
  const [pageContent, setPageContent] = useState({
    heroImage: "/images/church-history.jpg",
    heroTitle: "Our History",
    heroSubtitle: "A Legacy of Faith Since 1950",
    content: "",
  });

  useEffect(() => {
    axiosClient
      .get("/page-content/our-history")
      .then((res) => {
        if (res.data) {
          setPageContent({
            heroImage: res.data.heroImage || "/images/church-history.jpg",
            heroTitle: res.data.heroTitle || "Our History",
            heroSubtitle:
              res.data.heroSubtitle || "A Legacy of Faith Since 1950",
            content: res.data.content || "",
          });
        } else {
          setPageContent((prev) => ({ ...prev, content: "" }));
        }
      })
      .catch(() => {
        setPageContent((prev) => ({ ...prev, content: "" }));
      });
  }, []);

  return (
    <>
      <Hero
        title={pageContent.heroTitle}
        subtitle={pageContent.heroSubtitle}
        backgroundImage={pageContent.heroImage}
      />
      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Our History</h1>
        <p className="text-gray-700 whitespace-pre-line">
          {pageContent.content}
        </p>
      </div>
    </>
  );
}
