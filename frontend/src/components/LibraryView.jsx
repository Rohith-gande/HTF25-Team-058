import { useState, useEffect } from "react";
import { FileText, Play } from "lucide-react";

const LibraryView = ({ onPlay }) => {
  const [podcasts, setPodcasts] = useState([]);

  useEffect(() => {
    // 🧠 BACKEND PLACEHOLDER
    // Fetch all podcasts belonging to the authenticated user
    // Example:
    // const response = await fetch("http://localhost:8000/podcasts/", {
    //   headers: { "Authorization": `Bearer ${id_token}` }
    // });
    // const data = await response.json();
    // setPodcasts(data);

    setPodcasts([]); // start empty until backend is ready
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">My Library</h2>
      <p className="text-gray-500 mb-6">
        All podcasts you’ve generated will appear here.
      </p>

      {podcasts.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          No podcasts yet. Generate your first one!
        </div>
      ) : (
        <div className="space-y-3">
          {podcasts.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => onPlay(p)}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs text-gray-500">{p.duration}</p>
              </div>
              <button className="p-2 bg-blue-500 text-white rounded-full">
                <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryView;
