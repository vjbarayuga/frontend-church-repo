import { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import axiosClient from '../api/axiosClient';

export default function Announcements() {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axiosClient.get('/announcements')
      .then((res) => setAnnouncements(res.data))
      .catch((err) => {
        console.error('Failed to fetch announcements:', err);
      });
  }, []);

  return (
    <>
      <Hero 
        title="Parish Announcements"
        subtitle="Stay Updated with Church News and Activities"
        backgroundImage="/images/announcements-hero.jpg"
      />

      <div className="max-w-4xl mx-auto p-6 mt-6">
        <h1 className="text-3xl font-bold mb-4">Announcements</h1>

        {announcements.length === 0 ? (
          <p className="text-gray-600">No announcements yet.</p>
        ) : (
          <ul className="space-y-4">
            {announcements.map((item) => (
              <li key={item._id} className="bg-white p-4 rounded shadow">
                <h3 className="font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(item.date).toLocaleDateString()}
                </p>
                <p className="mt-1">{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
