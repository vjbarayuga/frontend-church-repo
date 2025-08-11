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

export default function EditDeleteSacraments() {
  const [sacraments, setSacraments] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingSacrament, setEditingSacrament] = useState(null);
  const [formData, setFormData] = useState({
    name: "baptism",
    title: "",
    description: "",
    image: "",
    requirements: [{ item: "", required: true, notes: "" }],
    processSteps: [{ step: 1, title: "", description: "", timeframe: "" }],
    fees: [{ item: "", amount: "", notes: "" }],
    schedule: "",
    contactPerson: "",
    contactInfo: "",
    isActive: true,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const sacramentTypes = [
    { value: "baptism", label: "Baptism" },
    { value: "wedding", label: "Wedding" },
    { value: "burial", label: "Burial" },
    { value: "confirmation", label: "Confirmation" },
    { value: "communion", label: "First Communion" },
  ];

  useEffect(() => {
    fetchSacraments();
  }, []);

  const fetchSacraments = async () => {
    try {
      const response = await axiosClient.get("/sacraments/admin");
      setSacraments(response.data);
    } catch (error) {
      console.error("Error fetching sacraments:", error);
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
      const formDataUpload = new FormData();
      formDataUpload.append("image", file);

      const response = await axiosClient.post(
        "/slideshow/upload",
        formDataUpload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data.filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.image;

      if (selectedFile) {
        imageUrl = await uploadImage(selectedFile);
      }

      const sacramentData = {
        ...formData,
        image: imageUrl,
        requirements: formData.requirements.filter(
          (req) => req.item.trim() !== ""
        ),
        processSteps: formData.processSteps.filter(
          (step) => step.title.trim() !== ""
        ),
        fees: formData.fees.filter((fee) => fee.item.trim() !== ""),
      };

      if (editingSacrament) {
        await axiosClient.put(
          `/sacraments/${editingSacrament._id}`,
          sacramentData
        );
      } else {
        await axiosClient.post("/sacraments", sacramentData);
      }

      fetchSacraments();
      resetForm();
    } catch (error) {
      console.error("Error saving sacrament:", error);
      alert("Error saving sacrament. Please try again.");
    }
  };

  const handleEdit = (sacrament) => {
    setEditingSacrament(sacrament);
    setFormData({
      name: sacrament.name,
      title: sacrament.title,
      description: sacrament.description,
      image: sacrament.image,
      requirements:
        sacrament.requirements.length > 0
          ? sacrament.requirements
          : [{ item: "", required: true, notes: "" }],
      processSteps:
        sacrament.processSteps.length > 0
          ? sacrament.processSteps
          : [{ step: 1, title: "", description: "", timeframe: "" }],
      fees:
        sacrament.fees.length > 0
          ? sacrament.fees
          : [{ item: "", amount: "", notes: "" }],
      schedule: sacrament.schedule || "",
      contactPerson: sacrament.contactPerson || "",
      contactInfo: sacrament.contactInfo || "",
      isActive: sacrament.isActive,
    });
    setPreviewUrl(sacrament.image);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this sacrament?")) {
      try {
        await axiosClient.delete(`/sacraments/${id}`);
        fetchSacraments();
      } catch (error) {
        console.error("Error deleting sacrament:", error);
        alert("Error deleting sacrament. Please try again.");
      }
    }
  };

  const toggleStatus = async (id) => {
    try {
      await axiosClient.patch(`/sacraments/${id}/toggle`);
      fetchSacraments();
    } catch (error) {
      console.error("Error toggling sacrament status:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "baptism",
      title: "",
      description: "",
      image: "",
      requirements: [{ item: "", required: true, notes: "" }],
      processSteps: [{ step: 1, title: "", description: "", timeframe: "" }],
      fees: [{ item: "", amount: "", notes: "" }],
      schedule: "",
      contactPerson: "",
      contactInfo: "",
      isActive: true,
    });
    setEditingSacrament(null);
    setShowForm(false);
    setSelectedFile(null);
    setPreviewUrl("");
  };

  // Helper functions for dynamic arrays
  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [
        ...formData.requirements,
        { item: "", required: true, notes: "" },
      ],
    });
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const updateRequirement = (index, field, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index][field] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addProcessStep = () => {
    setFormData({
      ...formData,
      processSteps: [
        ...formData.processSteps,
        {
          step: formData.processSteps.length + 1,
          title: "",
          description: "",
          timeframe: "",
        },
      ],
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

  const addFee = () => {
    setFormData({
      ...formData,
      fees: [...formData.fees, { item: "", amount: "", notes: "" }],
    });
  };

  const removeFee = (index) => {
    const newFees = formData.fees.filter((_, i) => i !== index);
    setFormData({ ...formData, fees: newFees });
  };

  const updateFee = (index, field, value) => {
    const newFees = [...formData.fees];
    newFees[index][field] = value;
    setFormData({ ...formData, fees: newFees });
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage Sacraments (Baptism, Wedding, Burial)
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <FaPlus />
          Add New Sacrament
        </button>
      </div>

      {/* Sacrament Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-bold mb-6">
            {editingSacrament ? "Edit Sacrament" : "Add New Sacrament"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column - Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sacrament Type *
                  </label>
                  <select
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {sacramentTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

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
                    placeholder="e.g., Holy Baptism"
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
                    Schedule
                  </label>
                  <input
                    type="text"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData({ ...formData, schedule: e.target.value })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Sundays after 10:00 AM Mass"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contactPerson: e.target.value,
                      })
                    }
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Parish Secretary"
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
                    placeholder="e.g., Phone: (123) 456-7890"
                  />
                </div>
              </div>

              {/* Right Column - Image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sacrament Image
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
                            id="sacrament-image-upload"
                          />
                          <label
                            htmlFor="sacrament-image-upload"
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
                          id="sacrament-image-upload"
                        />
                        <label
                          htmlFor="sacrament-image-upload"
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
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <input
                    type="text"
                    value={requirement.item}
                    onChange={(e) =>
                      updateRequirement(index, "item", e.target.value)
                    }
                    className="col-span-5 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Requirement item"
                  />
                  <div className="col-span-2 flex items-center">
                    <input
                      type="checkbox"
                      checked={requirement.required}
                      onChange={(e) =>
                        updateRequirement(index, "required", e.target.checked)
                      }
                      className="mr-2"
                    />
                    <label className="text-sm">Required</label>
                  </div>
                  <input
                    type="text"
                    value={requirement.notes}
                    onChange={(e) =>
                      updateRequirement(index, "notes", e.target.value)
                    }
                    className="col-span-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notes"
                  />
                  <button
                    type="button"
                    onClick={() => removeRequirement(index)}
                    className="col-span-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
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
              {formData.processSteps.map((step, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <input
                    type="number"
                    value={step.step}
                    onChange={(e) =>
                      updateProcessStep(
                        index,
                        "step",
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="col-span-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="#"
                    min="1"
                  />
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) =>
                      updateProcessStep(index, "title", e.target.value)
                    }
                    className="col-span-3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Step title"
                  />
                  <input
                    type="text"
                    value={step.description}
                    onChange={(e) =>
                      updateProcessStep(index, "description", e.target.value)
                    }
                    className="col-span-5 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    value={step.timeframe}
                    onChange={(e) =>
                      updateProcessStep(index, "timeframe", e.target.value)
                    }
                    className="col-span-2 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Timeframe"
                  />
                  <button
                    type="button"
                    onClick={() => removeProcessStep(index)}
                    className="col-span-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
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

            {/* Fees Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fees
              </label>
              {formData.fees.map((fee, index) => (
                <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                  <input
                    type="text"
                    value={fee.item}
                    onChange={(e) => updateFee(index, "item", e.target.value)}
                    className="col-span-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Fee item"
                  />
                  <input
                    type="text"
                    value={fee.amount}
                    onChange={(e) => updateFee(index, "amount", e.target.value)}
                    className="col-span-3 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Amount"
                  />
                  <input
                    type="text"
                    value={fee.notes}
                    onChange={(e) => updateFee(index, "notes", e.target.value)}
                    className="col-span-4 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notes"
                  />
                  <button
                    type="button"
                    onClick={() => removeFee(index)}
                    className="col-span-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFee}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Add Fee
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
                {editingSacrament ? "Update Sacrament" : "Create Sacrament"}
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

      {/* Sacraments List */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">Current Sacraments</h2>

        {sacraments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No sacraments found. Add your first sacrament!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sacraments.map((sacrament) => (
              <motion.div
                key={sacrament._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {sacrament.image && (
                  <img
                    src={sacrament.image}
                    alt={sacrament.title}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{sacrament.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {
                      sacramentTypes.find((t) => t.value === sacrament.name)
                        ?.label
                    }
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {sacrament.description}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      sacrament.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sacrament.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleStatus(sacrament._id)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {sacrament.isActive ? <FaEyeSlash /> : <FaEye />}
                    </button>
                    <button
                      onClick={() => handleEdit(sacrament)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(sacrament._id)}
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
