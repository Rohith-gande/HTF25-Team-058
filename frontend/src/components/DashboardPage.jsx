import { useState } from "react";
import { Radio } from "lucide-react";
import GeneratorView from "./GeneratorView";
import LibraryView from "./LibraryView";
import ProfileView from "./ProfileView";
import AudioPlayer from "./AudioPlayer";

const DashboardPage = ({ onSignOut }) => {
  const [currentView, setCurrentView] = useState("generator");
  const [currentPodcast, setCurrentPodcast] = useState(null);

  const handlePodcastGenerated = (podcast) => {
    // 🧠 BACKEND PLACEHOLDER
    // When backend returns new podcast metadata, add it to the list
    // Optionally update library from backend again
    setCurrentPodcast(podcast);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
      <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6 max-w-[1600px] mx-auto">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-8">
            <Radio className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg">Podify</span>
          </div>
          <div className="space-y-2 mb-8">
            <SidebarButton
              label="Generate New"
              active={currentView === "generator"}
              onClick={() => setCurrentView("generator")}
            />
            <SidebarButton
              label="My Library"
              active={currentView === "library"}
              onClick={() => setCurrentView("library")}
            />
            <SidebarButton
              label="Account"
              active={currentView === "profile"}
              onClick={() => setCurrentView("profile")}
            />
          </div>
          <button
            onClick={onSignOut}
            className="w-full border rounded-lg py-2 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>

        {/* Main Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {currentView === "generator" && (
            <GeneratorView
              onPodcastGenerated={handlePodcastGenerated}
              currentPodcast={currentPodcast}
            />
          )}
          {currentView === "library" && <LibraryView onPlay={setCurrentPodcast} />}
          {currentView === "profile" && <ProfileView />}
        </div>

        {/* Right Sidebar: Audio Player */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <AudioPlayer podcast={currentPodcast} />
        </div>
      </div>
    </div>
  );
};

const SidebarButton = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left py-2 px-3 rounded-lg ${
      active ? "bg-blue-500 text-white" : "hover:bg-gray-100"
    }`}
  >
    {label}
  </button>
);

export default DashboardPage;
