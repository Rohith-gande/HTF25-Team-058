// src/Index.jsx
import React, { useState, useEffect } from "react";

/*
  Pure JSX + Tailwind (no shadcn). This component:
  - Provides a landing page with Login / Sign up placeholders
  - For auth, it expects a Firebase idToken (see `idToken` state)
  - Calls backend endpoints:
    - POST /generate_podcast/  (multipart file upload, header: Authorization: Bearer <id_token>)
    - GET  /user/podcasts      (header: Authorization)
    - DELETE /user/podcasts/:id (header: Authorization)
  Replace the placeholder Firebase sign-in function with your own firebase client code.
*/

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState("landing");
  const [idToken, setIdToken] = useState(null); // store Firebase idToken here after sign-in

  // Placeholder: call real Firebase sign-in and set idToken
  async function handleMockLogin() {
    // TODO: Replace with Firebase client sign-in and getIdToken()
    // For development you may set a test token or a local dev flag.
    const fakeToken = "DEV_FAKE_ID_TOKEN"; // replace with real token in production
    setIdToken(fakeToken);
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  }

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleMockLogin} />;
  }

  return <DashboardPage idToken={idToken} onSignOut={() => { setIsLoggedIn(false); setIdToken(null); }} />;
};

const LandingPage = ({ onLogin }) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  if (showLoginForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="text-primary text-2xl font-bold">🔊</div>
              <h1 className="text-3xl font-bold text-gray-900">Podify</h1>
            </div>

            <div className="inline-flex rounded-lg bg-white shadow-sm p-1 mb-6">
              <button
                onClick={() => setIsSignUp(false)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${!isSignUp ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                Sign In
              </button>
              <button
                onClick={() => setIsSignUp(true)}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${isSignUp ? "bg-blue-600 text-white" : "text-gray-500 hover:text-gray-900"}`}
              >
                Sign Up
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-4">
              {isSignUp && <input className="w-full border px-3 py-2 rounded-md" placeholder="Full Name" />}
              <input className="w-full border px-3 py-2 rounded-md" placeholder="Email Address" />
              <input className="w-full border px-3 py-2 rounded-md" placeholder="Password" />
              {isSignUp && <input className="w-full border px-3 py-2 rounded-md" placeholder="Confirm Password" />}
              {!isSignUp && <div className="text-sm text-gray-500 text-left">Forgot Password?</div>}

              <button onClick={onLogin} className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold">
                {isSignUp ? "CREATE ACCOUNT" : "LOGIN"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button onClick={onLogin} className="w-full border border-gray-300 py-2 rounded-md flex items-center justify-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/></svg>
                Sign in with Google
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50">
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="text-2xl">🔊</div>
              <span className="text-xl font-bold text-gray-900">Podify</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-900 hover:text-blue-600">Features</a>
              <a href="#" className="text-gray-900 hover:text-blue-600">Pricing</a>
              <button onClick={() => setShowLoginForm(true)} className="border px-3 py-1 rounded-md">Login</button>
              <button onClick={() => setShowLoginForm(true)} className="bg-blue-600 text-white px-3 py-1 rounded-md">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">Stop Reading,<br/>Start Listening.</h1>
            <p className="text-xl text-gray-600 mb-8">Convert notes to podcasts with AI.</p>
            <button onClick={onLogin} className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg">Get Started for Free</button>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 bg-white rounded-2xl mx-auto flex items-center justify-center">🔊</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full"><span>📄</span><span className="text-sm">Documents</span></div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full"><span>🧠</span><span className="text-sm">AI Processing</span></div>
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full"><span>🎧</span><span className="text-sm">Podcast Ready</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// Dashboard and main app
const DashboardPage = ({ idToken, onSignOut }) => {
  const [currentView, setCurrentView] = useState("generator");
  const [podcasts, setPodcasts] = useState([]);
  const [currentPodcast, setCurrentPodcast] = useState(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!idToken) return;
    fetchHistory();
  }, [idToken]);

  async function fetchHistory() {
    setLoadingHistory(true);
    try {
      const res = await fetch("/user/podcasts", {
        headers: { "Authorization": `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      // Expect an array of podcast records { id, title, summary, audio_url, createdAt }
      setPodcasts(data);
    } catch (err) {
      console.error(err);
      alert("Could not load podcast history.");
    } finally {
      setLoadingHistory(false);
    }
  }

  function addPodcast(p) {
    setPodcasts(prev => [p, ...prev]);
    setCurrentPodcast(p);
  }

  async function deletePodcast(podcastId) {
    if (!confirm("Delete this podcast?")) return;
    try {
      const res = await fetch(`/user/podcasts/${podcastId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${idToken}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setPodcasts(prev => prev.filter(p => p.id !== podcastId));
    } catch (err) {
      console.error(err);
      alert("Could not delete podcast.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6">
        <aside className="bg-white rounded-2xl shadow-lg p-6 h-fit">
          <div className="flex items-center gap-2 mb-6"><div className="text-2xl">🔊</div><span className="text-xl font-bold">Podify</span></div>
          <div className="space-y-2 mb-6">
            <button onClick={() => setCurrentView("generator")} className={`w-full text-left px-3 py-2 rounded-md ${currentView==="generator" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>Generate New</button>
            <button onClick={() => setCurrentView("library")} className={`w-full text-left px-3 py-2 rounded-md ${currentView==="library" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>My Library</button>
            <button onClick={() => setCurrentView("profile")} className={`w-full text-left px-3 py-2 rounded-md ${currentView==="profile" ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}>Account</button>
          </div>

          <button onClick={onSignOut} className="w-full border rounded-md px-3 py-2">Sign Out</button>
        </aside>

        <main className="bg-white rounded-2xl shadow-lg p-8">
          {currentView === "generator" && <GeneratorView idToken={idToken} onPodcastGenerated={addPodcast} />}
          {currentView === "library" && <LibraryView podcasts={podcasts} onPlay={setCurrentPodcast} onDelete={deletePodcast} loading={loadingHistory} />}
          {currentView === "profile" && <ProfileView podcasts={podcasts} onPlay={setCurrentPodcast} />}
        </main>

        <aside className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4">My Library</h2>
          <div className="space-y-3 max-h-[60vh] overflow-auto">
            {podcasts.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setCurrentPodcast(p)}>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">📄</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{p.title}</p>
                  <p className="text-xs text-gray-500">{p.duration || ""}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); setCurrentPodcast(p); }} className="rounded-full w-8 h-8 bg-blue-600 text-white">▶</button>
              </div>
            ))}
            {podcasts.length === 0 && <p className="text-sm text-gray-500">No podcasts yet</p>}
          </div>
        </aside>
      </div>

      {currentPodcast && (
        <div className="max-w-7xl mx-auto mt-8 bg-white rounded-xl p-6 shadow">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">📄</div>
            <div>
              <h3 className="font-semibold">{currentPodcast.title}</h3>
              <p className="text-sm text-gray-500">{currentPodcast.summary || ""}</p>
              {currentPodcast.audio_url && (
                <audio controls className="mt-2 w-full">
                  <source src={currentPodcast.audio_url} />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// GeneratorView - handles file upload
function GeneratorView({ idToken, onPodcastGenerated }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsProcessing(true);
    setProcessingStatus("Uploading file...");

    try {
      const form = new FormData();
      form.append("file", file);

      const res = await fetch("/generate_podcast/", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${idToken}`,
        },
        body: form,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to generate");
      }

      const data = await res.json();
      // backend returns { id, title, summary, audio_url, createdAt, duration? }
      onPodcastGenerated(data);
      setProcessingStatus("Done!");
    } catch (err) {
      console.error(err);
      alert("Error generating podcast: " + err.message);
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Generator View</h2>

      {isProcessing ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-blue-300 rounded-full mb-4"></div>
          <p className="text-lg font-medium text-gray-600">{processingStatus}</p>
        </div>
      ) : (
        <div className="border-2 border-dashed rounded-2xl p-12 text-center hover:border-blue-300 transition-colors">
          <div className="text-6xl mb-4">⬆️</div>
          <h3 className="text-xl font-semibold mb-2">Upload your PDF or .txt to get started</h3>
          <p className="text-gray-500 mb-6">Drag and drop your file here or click to browse</p>

          <label htmlFor="file-upload" className="inline-block">
            <input id="file-upload" type="file" accept=".pdf,.txt" onChange={handleFile} className="hidden" />
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md">Browse Files</button>
          </label>
        </div>
      )}
    </div>
  );
}

// LibraryView
function LibraryView({ podcasts, onPlay, onDelete, loading }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Library</h2>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      <div className="grid gap-4">
        {podcasts.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center">📄</div>
            <div className="flex-1">
              <h3 className="font-semibold">{p.title}</h3>
              <p className="text-sm text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => onPlay(p)} className="rounded-full bg-blue-600 text-white px-3 py-2">▶</button>
              <button onClick={() => onDelete(p.id)} className="rounded-full border px-3 py-2">🗑</button>
            </div>
          </div>
        ))}
        {podcasts.length === 0 && <p className="text-sm text-gray-500">No podcasts yet</p>}
      </div>
    </div>
  );
}

function ProfileView({ podcasts, onPlay }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Account</h2>
      <div className="space-y-6">
        <div className="flex items-start gap-6 p-6 bg-gray-50 rounded-xl">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center">👤</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1">John Doe</h3>
            <p className="text-gray-500 mb-4">john.doe@example.com</p>
            <p className="text-sm text-gray-500">Member since Jan 2025 • {podcasts.length} podcasts generated</p>
          </div>
          <button className="border rounded-md px-3 py-2">Edit Profile</button>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">My Generated Podcasts</h3>
          <div className="grid gap-3">
            {podcasts.map(p => (
              <div key={p.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">📄</div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.title}</p>
                  <p className="text-sm text-gray-500">{p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}</p>
                </div>
                <button onClick={() => onPlay(p)} className="px-3 py-2 bg-blue-600 text-white rounded-md">▶ Play</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Index;
