import { Radio, FileText, Brain, Ear } from "lucide-react";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
      {/* ===== NAVBAR ===== */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white">
        <div className="flex items-center gap-2">
          <Radio className="w-6 h-6 text-blue-500" />
          <span className="text-lg font-semibold">Podify</span>
        </div>

        <div className="hidden md:flex gap-4 text-gray-600 font-medium">
          <button className="hover:text-blue-500 transition">Features</button>
          <button className="hover:text-blue-500 transition">Pricing</button>
          <button className="hover:text-blue-500 transition">About</button>

          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg border"
              onClick={() => navigate("/signin")}
            >
              Login
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-blue-500 text-white"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-12">
        {/* LEFT TEXT CONTENT */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 leading-tight">
            Stop Reading,
            <br /> Start Listening.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Convert your notes into AI-powered podcasts instantly.
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold"
            onClick={() => navigate("/signup")}
          >
            Get Started for Free
          </button>
        </div>

        {/* RIGHT SIDE IMAGE / CARD */}
        <div className="flex-1 flex justify-center">
          <div className="bg-blue-100 p-10 rounded-2xl w-80 h-80 flex flex-col items-center justify-center text-center shadow-lg">
            <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center mb-6">
              <Radio className="w-10 h-10 text-blue-600" />
            </div>

            <FeatureBadge icon={<FileText />} text="Documents" />
            <FeatureBadge icon={<Brain />} text="AI Processing" />
            <FeatureBadge icon={<Ear />} text="Podcast Ready" />
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-16 bg-white text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
          <FeatureCard
            icon={<FileText className="w-10 h-10 text-blue-500" />}
            title="Upload Documents"
            desc="Drag & drop your notes or PDFs easily."
          />
          <FeatureCard
            icon={<Brain className="w-10 h-10 text-blue-500" />}
            title="AI Audio Generation"
            desc="We turn your content into engaging podcasts."
          />
          <FeatureCard
            icon={<Ear className="w-10 h-10 text-blue-500" />}
            title="Listen Anywhere"
            desc="Stream or download and learn on the go."
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ===== Sub Components =====
const FeatureBadge = ({ icon, text }) => (
  <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow mb-3 w-fit">
    <div className="text-blue-500">{icon}</div>
    <span className="text-gray-700 font-medium">{text}</span>
  </div>
);

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-white shadow-md rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all">
    <div className="w-20 h-20 mx-auto flex items-center justify-center bg-blue-100 rounded-xl mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-500">{desc}</p>
  </div>
);

export default LandingPage;

// import { useState } from "react";
// import { Radio, FileText, Brain, Ear } from "lucide-react";
// import Footer from "./Footer";
// import SignIn from "./SignIn";
// import SignUp from "./SignUp";
// import { useNavigate } from "react-router-dom";
// const LandingPage = ({ onLogin }) => {
//     const navigate = useNavigate();
//   const [showLoginForm, setShowLoginForm] = useState(false);
//   const [isSignUp, setIsSignUp] = useState(false);

//   if (showLoginForm) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
//         <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
//           <div className="text-center mb-6">
//             <div className="flex justify-center items-center gap-2 mb-4">
//               <Radio className="w-8 h-8 text-blue-500" />
//               <h1 className="text-3xl font-bold text-gray-800">Podify</h1>
//             </div>
//             <div className="flex bg-gray-100 rounded-lg p-1">
//               <button
//                 className={`flex-1 py-2 rounded-md ${
//                   !isSignUp ? "bg-blue-500 text-white" : "text-gray-600"
//                 }`}
//                 onClick={() => {
//                     // setIsSignUp(false);
//                     navigate('/signin');}
                    
//                 }
//               >
//                 Sign In
//               </button>
//               <button
//                 className={`flex-1 py-2 rounded-md ${
//                   isSignUp ? "bg-blue-500 text-white" : "text-gray-600"
//                 }`}
//                 onClick={() => {setIsSignUp(true); navigate('/signup');} }
//               >
//                 Sign Up
//               </button>
//             </div>
//           </div>

//           {/* <div className="space-y-4">
//             {isSignUp && (
//               <input
//                 type="text"
//                 placeholder="Full Name"
//                 className="w-full border rounded-lg px-4 py-3"
//               />
//             )}
//             <input
//               type="email"
//               placeholder="Email"
//               className="w-full border rounded-lg px-4 py-3"
//             />
//             <input
//               type="password"
//               placeholder="Password"
//               className="w-full border rounded-lg px-4 py-3"
//             />
//             {isSignUp && (
//               <input
//                 type="password"
//                 placeholder="Confirm Password"
//                 className="w-full border rounded-lg px-4 py-3"
//               />
//             )} */}

//             {/* 🧠 BACKEND PLACEHOLDER: Replace with Firebase or API auth */}
//             {/* <button
//               onClick={() => {
//                 navigate('/signin');
//               }}
//               className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold"
//             >
//               {isSignUp ? "Create Account" : "Login"}
//             </button> */}
//           {/* </div> */}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-50 to-blue-50">
//       {/* ===== NAVBAR ===== */}
//       <nav className="flex justify-between items-center px-8 py-4 bg-white ">
//         <div className="flex items-center gap-2">
//           <Radio className="w-6 h-6 text-blue-500" />
//           <span className="text-lg font-semibold">Podify</span>
//         </div>

//         <div className="hidden md:flex gap-4 text-gray-600 font-medium">
//           {/* 🧭 PLACEHOLDERS for navigation links */}
//           <button className="hover:text-blue-500 transition">Features</button>
//           <button className="hover:text-blue-500 transition">Pricing</button>
//           <button className="hover:text-blue-500 transition">About</button>
        

//         <div className="flex gap-4">
//           <button
//             className="px-4 py-2 rounded-lg border"
//             onClick={() => {
//               setShowLoginForm(true);
//               setIsSignUp(false);
//             }}
//           >
//             Login
//           </button>
//           <button
//             className="px-4 py-2 rounded-lg bg-blue-500 text-white"
//             onClick={() => {
//               setShowLoginForm(true);
//               setIsSignUp(true);
//             }}
//           >
//             Sign Up
//           </button>
//         </div>
//         </div>
//       </nav>

//       {/* ===== HERO SECTION ===== */}
//       <section className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto px-6 py-20 gap-12">
//         {/* LEFT TEXT CONTENT */}
//         <div className="flex-1 text-center md:text-left">
//           <h1 className="text-5xl font-bold mb-4 text-gray-800 leading-tight">
//             Stop Reading,
//             <br /> Start Listening.
//           </h1>
//           <p className="text-lg text-gray-600 mb-8">
//             Convert your notes into AI-powered podcasts instantly.
//           </p>
//           <button
//             className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg text-lg font-semibold"
//             onClick={onLogin}
//           >
//             Get Started for Free
//           </button>
//         </div>

//         {/* RIGHT SIDE IMAGE / CARD PLACEHOLDER */}
//         <div className="flex-1 flex justify-center">
//           <div className="bg-blue-100 p-10 rounded-2xl w-80 h-80 flex flex-col items-center justify-center text-center shadow-lg">
//             {/* 🧠 Replace below with real image/animation */}
//             <div className="w-16 h-16 bg-blue-200 rounded-2xl flex items-center justify-center mb-6">
//               <Radio className="w-10 h-10 text-blue-600" />
//             </div>

//             <FeatureBadge icon={<FileText />} text="Documents" />
//             <FeatureBadge icon={<Brain />} text="AI Processing" />
//             <FeatureBadge icon={<Ear />} text="Podcast Ready" />
//           </div>
//         </div>
//       </section>

//       {/* ===== HOW IT WORKS SECTION ===== */}
//       <section className="py-16 bg-white text-center">
//         <h2 className="text-3xl font-bold mb-12 text-gray-800">How It Works</h2>

//         <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
//           <FeatureCard
//             icon={<FileText className="w-10 h-10 text-blue-500" />}
//             title="Upload Documents"
//             desc="Drag & drop your notes or PDFs easily."
//           />
//           <FeatureCard
//             icon={<Brain className="w-10 h-10 text-blue-500" />}
//             title="AI Audio Generation"
//             desc="We turn your content into engaging podcasts."
//           />
//           <FeatureCard
//             icon={<Ear className="w-10 h-10 text-blue-500" />}
//             title="Listen Anywhere"
//             desc="Stream or download and learn on the go."
//           />
//         </div>
//       </section>
//       <Footer/>
//     </div>
//   );
// };

// // ===== Sub Components =====
// const FeatureBadge = ({ icon, text }) => (
//   <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow mb-3 w-fit">
//     <div className="text-blue-500">{icon}</div>
//     <span className="text-gray-700 font-medium">{text}</span>
//   </div>
// );

// const FeatureCard = ({ icon, title, desc }) => (
//   <div className="bg-white shadow-md rounded-2xl p-8 text-center border border-gray-100 hover:shadow-lg transition-all">
//     <div className="w-20 h-20 mx-auto flex items-center justify-center bg-blue-100 rounded-xl mb-6">
//       {icon}
//     </div>
//     <h3 className="text-xl font-semibold mb-2">{title}</h3>
//     <p className="text-gray-500">{desc}</p>
//   </div>
// );

// export default LandingPage;
