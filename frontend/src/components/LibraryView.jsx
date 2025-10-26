import { useState, useEffect } from "react";
import { FileText, Play } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

const LibraryView = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPodcast, setSelectedPodcast] = useState(null); // For modal

  useEffect(() => {
    const id_token = localStorage.getItem("idToken");
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/v1/user/podcasts", {
          headers: { "Authorization": `Bearer ${id_token}` },
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setPodcasts(data.podcasts || []);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPodcasts();
  }, []);

  if (loading)
    return <div className="text-center text-gray-500 py-16">Loading your podcasts...</div>;

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
              key={p.podcast_id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => setSelectedPodcast(p)}
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{p.title}</p>
                <p className="text-xs text-gray-500">{p.duration || "Unknown duration"}</p>
              </div>
              <button
                className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition"
                onClick={(e) => { e.stopPropagation(); setSelectedPodcast(p); }}
              >
                <Play className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedPodcast && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md relative border shadow-lg">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl font-bold"
              onClick={() => setSelectedPodcast(null)}
            >
              &times;
            </button>
            <AudioPlayer podcast={selectedPodcast} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LibraryView;


// import { useState, useEffect } from "react";
// import { FileText, Play } from "lucide-react";

// const LibraryView = ({ onPlay }) => {
//   const [podcasts, setPodcasts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const id_token = localStorage.getItem("idToken"); // Retrieve stored token
//     const fetchPodcasts = async () => {
//       try {
//         const response = await fetch("http://localhost:8000/api/v1/user/podcasts", {
//           method: "GET",
//           // Uncomment this once auth is added
//            headers: { "Authorization": `Bearer ${id_token}` },
//         });

//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         // Backend returns podcasts inside data.podcasts
//         setPodcasts(data.podcasts || []);
//       } catch (error) {
//         console.error("Error fetching podcasts:", error);
//         setPodcasts([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPodcasts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="text-center text-gray-500 py-16">
//         Loading your podcasts...
//       </div>
//     );
//   }

//   return (
//     <div>
//       <h2 className="text-2xl font-bold mb-2 text-gray-800">My Library</h2>
//       <p className="text-gray-500 mb-6">
//         All podcasts you’ve generated will appear here.
//       </p>

//       {podcasts.length === 0 ? (
//         <div className="text-center text-gray-500 py-16">
//           No podcasts yet. Generate your first one!
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {podcasts.map((p) => (
//             <div
//               key={p.id || p.podcast_id}
//               className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
//               onClick={() => onPlay(p)}
//             >
//               <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <FileText className="w-5 h-5 text-blue-500" />
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="truncate font-medium">{p.title}</p>
//                 <p className="text-xs text-gray-500">
//                   {p.duration || "Unknown duration"}
//                 </p>
//               </div>
//               <button className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition">
//                 <Play className="w-4 h-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default LibraryView;
