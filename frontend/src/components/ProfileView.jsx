import { useState, useEffect } from "react";

const ProfileView = ({ onPlay }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, duration: 0 });

  useEffect(() => {
    // 🧠 BACKEND PLACEHOLDER
    // 1. Fetch user profile details from Firebase or backend
    // 2. Fetch statistics like total podcasts generated, total duration
    //
    // Example:
    // const response = await fetch("http://localhost:8000/profile/", {
    //   headers: { "Authorization": `Bearer ${id_token}` }
    // });
    // const data = await response.json();
    // setUser(data.user);
    // setStats(data.stats);

    setUser(null);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-gray-800">My Account</h2>

      {!user ? (
        <div className="text-gray-500 text-center py-16">
          Loading profile...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <img
              src={user.photo || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full border"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-sm text-gray-500">Podcasts Created</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-xl font-bold text-gray-800">
                {stats.duration} min
              </p>
              <p className="text-sm text-gray-500">Total Duration</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileView;
