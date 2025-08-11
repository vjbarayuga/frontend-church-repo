import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axiosClient from "../api/axiosClient";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaUpload,
  FaImage,
} from "react-icons/fa";

export default function EditDeleteSlideshow() {
  const [slides, setSlides] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: "",
    order: 0,
    buttonText: "",
    buttonLink: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await axiosClient.get("/slideshow/admin");
      setSlides(response.data);
    } catch (error) {
      console.error("Error fetching slides:", error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      // Don't set formData.image here - it will be set after upload
    }
  };

  const uploadImage = async (file) => {
    try {
      console.log("Uploading file:", file.name);
      const formData = new FormData();
      formData.append("image", file);

      const response = await axiosClient.post("/slideshow/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

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
      let imageUrl = formData.image;

      // If a new file was selected, upload it
      if (selectedFile) {
        console.log("Uploading new file:", selectedFile.name);
        imageUrl = await uploadImage(selectedFile);
        console.log("Received image URL:", imageUrl);
      }

      const slideData = {
        ...formData,
        image: imageUrl,
      };

      console.log("Submitting slide data:", slideData);

      if (editingSlide) {
        await axiosClient.put(`/slideshow/${editingSlide._id}`, slideData);
      } else {
        await axiosClient.post("/slideshow", slideData);
      }

      fetchSlides();
      resetForm();
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Error saving slide. Please try again.");
    }
  };

  const handleEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle,
      image: slide.image,
      order: slide.order,
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      isActive: slide.isActive,
    });
    setPreviewUrl(slide.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this slide?")) {
      try {
        await axiosClient.delete(`/slideshow/${id}`);
        fetchSlides();
      } catch (error) {
        console.error("Error deleting slide:", error);
        alert("Error deleting slide. Please try again.");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axiosClient.patch(`/slideshow/${id}/toggle`);
      fetchSlides();
    } catch (error) {
      console.error("Error toggling slide status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image: "",
      order: 0,
      buttonText: "",
      buttonLink: "",
      isActive: true,
    });
    setEditingSlide(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Homepage Slideshow
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Add New Slide
        </button>
      </div>

      {/* Slide Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingSlide ? "Edit Slide" : "Add New Slide"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle *
                </label>
                <textarea
                  value={formData.subtitle}
                  onChange={(e) =>
                    setFormData({ ...formData, subtitle: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="3"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      order: parseInt(e.target.value),
                    })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Text (optional)
                </label>
                <input
                  type="text"
                  value={formData.buttonText}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonText: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Learn More"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Button Link (optional)
                </label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) =>
                    setFormData({ ...formData, buttonLink: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., /about-us"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Slide Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setPreviewUrl("");
                          setSelectedFile(null);
                          setFormData({ ...formData, image: "" });
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <FaImage className="mx-auto text-4xl text-gray-400" />
                      <div>
                        <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                          <FaUpload />
                          Choose Image
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                          />
                        </label>
                      </div>
                      <p className="text-sm text-gray-500">
                        Recommended: 1920x1080px, JPG or PNG
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                  className="mr-2"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm font-medium text-gray-700"
                >
                  Active (show on website)
                </label>
              </div>
            </div>

            <div className="lg:col-span-2 flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                {editingSlide ? "Update Slide" : "Create Slide"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Slides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {slides.map((slide, index) => (
          <motion.div
            key={slide._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white rounded-lg shadow-lg overflow-hidden ${
              !slide.isActive ? "opacity-75" : ""
            }`}
          >
            <div className="relative">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <button
                  onClick={() => toggleStatus(slide._id)}
                  className={`p-2 rounded-full ${
                    slide.isActive
                      ? "bg-green-600 text-white"
                      : "bg-gray-600 text-white"
                  }`}
                  title={slide.isActive ? "Hide slide" : "Show slide"}
                >
                  {slide.isActive ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-sm">
                Order: {slide.order}
              </div>
            </div>

            <div className="p-4">
              <h3 className="font-bold text-lg mb-2 line-clamp-2">
                {slide.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {slide.subtitle}
              </p>

              {slide.buttonText && (
                <div className="mb-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    Button: {slide.buttonText}
                  </span>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(slide)}
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <FaEdit />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(slide._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors flex items-center gap-1"
                >
                  <FaTrash />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12">
          <FaImage className="mx-auto text-6xl text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">
            No slides found. Create your first slide!
          </p>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-blue-800 mb-4">
          Image Management Instructions
        </h3>
        <div className="space-y-2 text-blue-700">
          <p>
            <strong>1. Image Storage:</strong> Images are stored in{" "}
            <code>/frontend/public/images/</code>
          </p>
          <p>
            <strong>2. Recommended Size:</strong> 1920x1080px for best quality
          </p>
          <p>
            <strong>3. Supported Formats:</strong> JPG, PNG, WebP
          </p>
          <p>
            <strong>4. Manual Upload:</strong> You can also manually upload
            images to the <code>/frontend/public/images/</code> folder
          </p>
          <p>
            <strong>5. Image Paths:</strong> Use relative paths like{" "}
            <code>/images/your-image.jpg</code>
          </p>
        </div>
      </div>
    </div>
  );
}
