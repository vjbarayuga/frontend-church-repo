import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import { FaUpload, FaImage, FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function EditPageContent() {
  const [pageContents, setPageContents] = useState({});
  const [selectedPage, setSelectedPage] = useState("about");
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    heroImage: "",
    heroTitle: "",
    heroSubtitle: "",
    content: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const pages = [
    { key: "our-history", label: "Our History" },
    { key: "announcements", label: "Announcements" },
    { key: "events", label: "Events" },
    { key: "priest", label: "Priest Biography" },
    { key: "mass-times", label: "Mass Times" },
    { key: "services", label: "Services" },
  ];

  useEffect(() => {
    fetchPageContents();
  }, []);

  useEffect(() => {
    if (pageContents[selectedPage]) {
      setFormData({
        heroImage: pageContents[selectedPage].heroImage || "",
        heroTitle: pageContents[selectedPage].heroTitle || "",
        heroSubtitle: pageContents[selectedPage].heroSubtitle || "",
        content: pageContents[selectedPage].content || "",
      });
      setPreviewUrl(pageContents[selectedPage].heroImage || "");
    } else {
      setFormData({
        heroImage: "",
        heroTitle: "",
        heroSubtitle: "",
        content: "",
      });
      setPreviewUrl("");
    }
  }, [selectedPage, pageContents]);

  const fetchPageContents = async () => {
    try {
      const response = await axiosClient.get("/page-content");
      const contentMap = {};
      response.data.forEach((content) => {
        contentMap[content.pageName] = content;
      });
      setPageContents(contentMap);
    } catch (error) {
      console.error("Error fetching page contents:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const uploadImage = async (file) => {
    try {
      console.log("Uploading file:", file.name);
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const response = await axiosClient.post(
        "/page-content/upload",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Upload response:", response.data);
      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      console.error("Error response:", error.response?.data);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.heroImage;

      // If a new file was selected, upload it
      if (selectedFile) {
        console.log("Uploading new file:", selectedFile.name);
        imageUrl = await uploadImage(selectedFile);
        console.log("Received image URL:", imageUrl);
      }

      const pageData = {
        pageName: selectedPage,
        heroImage: imageUrl,
        heroTitle: formData.heroTitle,
        heroSubtitle: formData.heroSubtitle,
        content: formData.content,
        isActive: true,
      };

      console.log("Submitting page data:", pageData);

      await axiosClient.put(`/page-content/${selectedPage}`, pageData);

      fetchPageContents();
      setIsEditing(false);
      setSelectedFile(null);
      alert("Page content updated successfully!");
    } catch (error) {
      console.error("Error saving page content:", error);
      alert("Error saving page content. Please try again.");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    if (pageContents[selectedPage]) {
      setFormData({
        heroImage: pageContents[selectedPage].heroImage || "",
        heroTitle: pageContents[selectedPage].heroTitle || "",
        heroSubtitle: pageContents[selectedPage].heroSubtitle || "",
        content: pageContents[selectedPage].content || "",
      });
      setPreviewUrl(pageContents[selectedPage].heroImage || "");
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Page Content & Hero Images
        </h1>
      </div>

      {/* Page Selection */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Select Page to Edit</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {pages.map((page) => (
            <button
              key={page.key}
              onClick={() => setSelectedPage(page.key)}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedPage === page.key
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="text-sm font-medium">{page.label}</div>
              {pageContents[page.key] && (
                <div className="text-xs text-green-600 mt-1">
                  ✓ Content exists
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      <motion.div
        key={selectedPage}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {pages.find((p) => p.key === selectedPage)?.label} Content
          </h2>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaEdit />
                Edit Content
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FaSave />
                  Save Changes
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Left Column - Text Content */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Title
              </label>
              <input
                type="text"
                value={formData.heroTitle}
                onChange={(e) =>
                  setFormData({ ...formData, heroTitle: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!isEditing}
                placeholder="Enter hero section title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Subtitle
              </label>
              <textarea
                value={formData.heroSubtitle}
                onChange={(e) =>
                  setFormData({ ...formData, heroSubtitle: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="3"
                disabled={!isEditing}
                placeholder="Enter hero section subtitle"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page Content
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="8"
                disabled={!isEditing}
                placeholder="Enter main page content"
              />
            </div>
          </div>

          {/* Right Column - Image Upload */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mx-auto max-h-48 rounded-lg object-cover"
                    />
                    {isEditing && (
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="hero-image-upload"
                        />
                        <label
                          htmlFor="hero-image-upload"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          <FaUpload />
                          Change Image
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewUrl("");
                            setFormData({ ...formData, heroImage: "" });
                            setSelectedFile(null);
                          }}
                          className="block text-red-600 hover:text-red-800"
                        >
                          Remove Image
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FaImage className="mx-auto text-4xl text-gray-400" />
                    <p className="text-gray-500">No hero image uploaded</p>
                    {isEditing && (
                      <>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="hero-image-upload"
                        />
                        <label
                          htmlFor="hero-image-upload"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          <FaUpload />
                          Upload Hero Image
                        </label>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Current Values Display */}
            {!isEditing && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">
                  Current Content:
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div>
                    <strong>Title:</strong> {formData.heroTitle || "Not set"}
                  </div>
                  <div>
                    <strong>Subtitle:</strong>{" "}
                    {formData.heroSubtitle || "Not set"}
                  </div>
                  <div>
                    <strong>Content:</strong>{" "}
                    {formData.content ? (
                      <span className="block mt-1 max-h-24 overflow-y-auto">
                        {formData.content}
                      </span>
                    ) : (
                      "Not set"
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}
