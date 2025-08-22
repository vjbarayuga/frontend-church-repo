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
  FaSave,
  FaTimes,
} from "react-icons/fa";

export default function EditDeleteServices() {
  const [services, setServices] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    requirements: [""],
    processSteps: [{ step: "", description: "" }],
    fees: "",
    contactInfo: "",
    order: 0,
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axiosClient.get("/services/admin");
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
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

  // No longer needed: uploadImage

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("fees", formData.fees);
      data.append("contactInfo", formData.contactInfo);
      data.append("order", formData.order);
      data.append("isActive", formData.isActive);
      // requirements and processSteps as JSON strings
      data.append(
        "requirements",
        JSON.stringify(formData.requirements.filter((req) => req.trim() !== ""))
      );
      data.append(
        "processSteps",
        JSON.stringify(
          formData.processSteps.filter(
            (step) => step.step.trim() !== "" || step.description.trim() !== ""
          )
        )
      );
      if (selectedFile) {
        data.append("image", selectedFile);
      } else if (formData.image) {
        data.append("image", formData.image);
      }

      if (editingService) {
        await axiosClient.put(`/services/${editingService._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axiosClient.post("/services", data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      fetchServices();
      resetForm();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Error saving service. Please try again.");
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      image: service.image,
      requirements:
        service.requirements.length > 0 ? service.requirements : [""],
      processSteps:
        service.processSteps.length > 0
          ? service.processSteps
          : [{ step: "", description: "" }],
      fees: service.fees || "",
      contactInfo: service.contactInfo || "",
      order: service.order,
      isActive: service.isActive,
    });
    setPreviewUrl(service.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axiosClient.delete(`/services/${id}`);
        fetchServices();
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Error deleting service. Please try again.");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axiosClient.patch(`/services/${id}/toggle`);
      fetchServices();
    } catch (error) {
      console.error("Error toggling service status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      image: "",
      requirements: [""],
      processSteps: [{ step: "", description: "" }],
      fees: "",
      contactInfo: "",
      order: 0,
      isActive: true,
    });
    setEditingService(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ""],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addProcessStep = () => {
    setFormData({
      ...formData,
      processSteps: [...formData.processSteps, { step: "", description: "" }],
    });
  };

  const removeProcessStep = (index) => {
    const newProcessSteps = formData.processSteps.filter((_, i) => i !== index);
    setFormData({ ...formData, processSteps: newProcessSteps });
  };

  const updateProcessStep = (index, field, value) => {
    const newProcessSteps = [...formData.processSteps];
    newProcessSteps[index][field] = value;
    setFormData({ ...formData, processSteps: newProcessSteps });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Church Services
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Add New Service
        </button>
      </div>

      {/* Service Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingService ? "Edit Service" : "Add New Service"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Fees (optional)
                  </label>
                  <input
                    type="text"
                    value={formData.fees}
                    onChange={(e) =>
                      setFormData({ ...formData, fees: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Free, ₱500, Contact for pricing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information
                  </label>
                  <input
                    type="text"
                    value={formData.contactInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, contactInfo: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Call parish office, Email: info@church.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        order: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Service Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {previewUrl ? (
                      <div className="space-y-4">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="mx-auto max-h-48 rounded-lg object-cover"
                        />
                        <div className="space-y-2">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="service-image-upload"
                          />
                          <label
                            htmlFor="service-image-upload"
                            className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                          >
                            <FaUpload />
                            Change Image
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewUrl("");
                              setFormData({ ...formData, image: "" });
                              setSelectedFile(null);
                            }}
                            className="block text-red-600 hover:text-red-800"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <FaImage className="mx-auto text-4xl text-gray-400" />
                        <p className="text-gray-500">No image uploaded</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="hidden"
                          id="service-image-upload"
                        />
                        <label
                          htmlFor="service-image-upload"
                          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
                        >
                          <FaUpload />
                          Upload Image
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Requirements Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              {formData.requirements.map((requirement, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement}
                    onChange={(e) => updateRequirement(index, e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Requirement ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addRequirement}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Add Requirement
              </button>
            </div>

            {/* Process Steps Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Process Steps
              </label>
              {formData.processSteps.map((processStep, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={processStep.step}
                    onChange={(e) =>
                      updateProcessStep(index, "step", e.target.value)
                    }
                    className="w-1/3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`Step ${index + 1}`}
                  />
                  <input
                    type="text"
                    value={processStep.description}
                    onChange={(e) =>
                      updateProcessStep(index, "description", e.target.value)
                    }
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description"
                  />
                  <button
                    type="button"
                    onClick={() => removeProcessStep(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addProcessStep}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Add Process Step
              </button>
            </div>

            <div className="flex items-center">
              <input
                id="isActive"
                type="checkbox"
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

            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <FaSave />
                {editingService ? "Update Service" : "Create Service"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Current Services</h2>

        {services.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No services found. Add your first service!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {service.image && (
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="font-bold text-lg mb-2">{service.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      service.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(service._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {service.isActive ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(service._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
