import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaBookOpen,
  FaDownload,
  FaGlobeAmericas,
} from "react-icons/fa";

export default function EditDeleteReadings() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showAutoFetchModal, setShowAutoFetchModal] = useState(false);
  const [autoFetching, setAutoFetching] = useState(false);
  const [editingReading, setEditingReading] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    title: "",
    reading1: "",
    psalm: "",
    reading2: "",
    gospel: "",
  });
  const [autoFetchConfig, setAutoFetchConfig] = useState({
    source: "usccb",
    days: 7,
  });

  useEffect(() => {
    fetchReadings();
  }, []);

  const fetchReadings = async () => {
    try {
      const response = await axiosClient.get("/readings");
      setReadings(response.data);
    } catch (error) {
      console.error("Error fetching readings:", error);
      alert("Error fetching readings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingReading) {
        await axiosClient.put(`/readings/${editingReading._id}`, formData);
        alert("Reading updated successfully!");
      } else {
        await axiosClient.post("/readings", formData);
        alert("Reading created successfully!");
      }
      setShowModal(false);
      setEditingReading(null);
      setFormData({
        date: "",
        title: "",
        reading1: "",
        psalm: "",
        reading2: "",
        gospel: "",
      });
      fetchReadings();
    } catch (error) {
      console.error("Error saving reading:", error);
      alert(error.response?.data?.message || "Error saving reading");
    }
  };

  const handleEdit = (reading) => {
    setEditingReading(reading);
    setFormData({
      date: reading.date.split("T")[0], // Format date for input
      title: reading.title,
      reading1: reading.reading1,
      psalm: reading.psalm,
      reading2: reading.reading2 || "",
      gospel: reading.gospel,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this reading?")) {
      try {
        await axiosClient.delete(`/readings/${id}`);
        alert("Reading deleted successfully!");
        fetchReadings();
      } catch (error) {
        console.error("Error deleting reading:", error);
        alert("Error deleting reading");
      }
    }
  };

  const openCreateModal = () => {
    setEditingReading(null);
    setFormData({
      date: "",
      title: "",
      reading1: "",
      psalm: "",
      reading2: "",
      gospel: "",
    });
    setShowModal(true);
  };

  const handleAutoFetch = async (isQuick = false) => {
    setAutoFetching(true);
    try {
      const response = await axiosClient.post(
        "/readings/auto-fetch",
        { ...autoFetchConfig, quick: isQuick }
      );
      
      if (isQuick) {
        alert(
          `Quick fetch started!\n\nStatus: ${response.data.status}\nEstimated time: ${response.data.estimated_time}\n\nRefresh the page in 1-2 minutes to see new readings.`
        );
        setShowAutoFetchModal(false);
      } else {
        alert(
          `Auto-fetch completed!\n\nSaved: ${response.data.summary.saved}\nUpdated: ${response.data.summary.updated}\nTotal: ${response.data.summary.total}`
        );
        setShowAutoFetchModal(false);
        fetchReadings(); // Refresh the list
      }
    } catch (error) {
      console.error("Error auto-fetching readings:", error);
      alert(error.response?.data?.message || "Error auto-fetching readings");
    } finally {
      setAutoFetching(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading readings...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <FaBookOpen className="text-3xl text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-800">
            Manage Daily Readings
          </h1>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowAutoFetchModal(true)}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 flex items-center transition-colors"
          >
            <FaDownload className="mr-2" />
            Auto-Fetch Readings
          </button>
          <button
            onClick={openCreateModal}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 flex items-center transition-colors"
          >
            <FaPlus className="mr-2" />
            Add New Reading
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  First Reading
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gospel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {readings.map((reading) => (
                <tr key={reading._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <div className="text-sm text-gray-900">
                        {formatDate(reading.date)}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {reading.title}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {reading.reading1}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500">
                      {reading.gospel}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(reading)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      <FaEdit className="inline mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reading._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash className="inline mr-1" />
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {readings.length === 0 && (
          <div className="text-center py-12">
            <FaBookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No readings
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new reading.
            </p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingReading ? "Edit Reading" : "Create New Reading"}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Liturgical Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Seventeenth Sunday in Ordinary Time"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Reading *
                  </label>
                  <input
                    type="text"
                    name="reading1"
                    value={formData.reading1}
                    onChange={handleInputChange}
                    placeholder="e.g., Genesis 18:20-32"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Responsorial Psalm *
                  </label>
                  <input
                    type="text"
                    name="psalm"
                    value={formData.psalm}
                    onChange={handleInputChange}
                    placeholder="e.g., Psalm 138:1-2, 2-3, 6-7, 7-8"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Second Reading
                  </label>
                  <input
                    type="text"
                    name="reading2"
                    value={formData.reading2}
                    onChange={handleInputChange}
                    placeholder="e.g., Colossians 2:12-14 (optional for weekdays)"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gospel *
                  </label>
                  <input
                    type="text"
                    name="gospel"
                    value={formData.gospel}
                    onChange={handleInputChange}
                    placeholder="e.g., Luke 11:1-13"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    {editingReading ? "Update Reading" : "Create Reading"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Auto-Fetch Modal */}
      {showAutoFetchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 lg:w-1/3 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Auto-Fetch Readings
                </h3>
                <button
                  onClick={() => setShowAutoFetchModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <FaGlobeAmericas className="inline mr-2" />
                    Automatically fetch readings from online sources
                  </p>
                  <p className="text-xs text-blue-600">
                    This will download the latest liturgical readings and save
                    them to your database.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Source
                  </label>
                  <select
                    value={autoFetchConfig.source}
                    onChange={(e) =>
                      setAutoFetchConfig({
                        ...autoFetchConfig,
                        source: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="usccb">USCCB (United States)</option>
                    <option value="philippines">Philippines Catholic</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose the liturgical calendar source
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Days
                  </label>
                  <select
                    value={autoFetchConfig.days}
                    onChange={(e) =>
                      setAutoFetchConfig({
                        ...autoFetchConfig,
                        days: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value={7}>7 days (1 week)</option>
                    <option value={14}>14 days (2 weeks)</option>
                    <option value={30}>30 days (1 month)</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    How many days ahead to fetch readings
                  </p>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAutoFetchModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 border border-gray-300 rounded-md hover:bg-gray-300"
                    disabled={autoFetching}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAutoFetch(true)}
                    disabled={autoFetching}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {autoFetching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FaDownload className="mr-2" />
                        Quick Fetch
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleAutoFetch(false)}
                    disabled={autoFetching}
                    className="px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {autoFetching ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Fetching...
                      </>
                    ) : (
                      <>
                        <FaDownload className="mr-2" />
                        Fetch & Wait
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
