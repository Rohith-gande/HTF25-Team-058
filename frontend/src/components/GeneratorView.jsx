import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";

const GeneratorView = ({ onPodcastGenerated, currentPodcast }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleGeneratePodcast = async () => {
    if (!selectedFile) return;
    setIsGenerating(true);

    try {
      // === 🧠 BACKEND PLACEHOLDER ===
      // 1. Create FormData and append file
      // const formData = new FormData();
      // formData.append("file", selectedFile);
      //
      // 2. Make API call to FastAPI endpoint
      // const response = await fetch("http://localhost:8000/generate_podcast/", {
      //   method: "POST",
      //   headers: { "Authorization": `Bearer ${id_token}` }, // Firebase token if used
      //   body: formData,
      // });
      //
      // 3. Parse response and extract audio URL
      // const data = await response.json();
      // setAudioUrl(data.audio_url);
      // onPodcastGenerated(data.podcast);

      // TODO: Remove this mock once backend is ready
      setTimeout(() => {
        setAudioUrl(null);
        setIsGenerating(false);
      }, 1500);
    } catch (error) {
      console.error("Error generating podcast:", error);
      setIsGenerating(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2 text-gray-800">
        Generate Podcast
      </h2>
      <p className="text-gray-500 mb-6">
        Upload a PDF or TXT file and let AI turn it into a podcast.
      </p>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-gray-50 hover:bg-gray-100 transition-all mb-6">
        <Upload className="w-12 h-12 text-blue-500 mb-3" />
        <p className="text-gray-700 mb-3">
          {selectedFile ? selectedFile.name : "Drag & drop or click to upload"}
        </p>
        <input
          type="file"
          accept=".pdf,.txt"
          className="hidden"
          id="fileUpload"
          onChange={handleFileChange}
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
        >
          Choose File
        </label>
      </div>

      <button
        onClick={handleGeneratePodcast}
        disabled={!selectedFile || isGenerating}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold text-white ${
          !selectedFile || isGenerating
            ? "bg-blue-300 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          "Generate Podcast"
        )}
      </button>

      {/* === BACKEND PLACEHOLDER: AUDIO PREVIEW === */}
      {/* Uncomment this once backend provides audio URL */}
      {audioUrl && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6 shadow-inner">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Preview Podcast
          </h3>
          <audio controls src={audioUrl} className="w-full" />
        </div>
      )}

      {/* === BACKEND PLACEHOLDER: LAST GENERATED === */}
      {currentPodcast && (
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">
            Last Generated
          </h3>
          <p className="text-gray-700">{currentPodcast.title}</p>
          <p className="text-gray-500 text-sm">{currentPodcast.duration}</p>
        </div>
      )}
    </div>
  );
};

export default GeneratorView;
