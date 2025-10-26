import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import DashboardPage from "./components/DashboardPage";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Sign In Page */}
        <Route
          path="/signin"
          element={
            !isLoggedIn ? (
              <SignIn onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Sign Up Page */}
        <Route
          path="/signup"
          element={
            !isLoggedIn ? (
              <SignUp onLogin={handleLogin} />
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        {/* Dashboard (protected) */}
        <Route
          path="/dashboard"
          element={
            isLoggedIn ? (
              <DashboardPage onSignOut={handleSignOut} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;


// import Index from "./components/Index"
//  const App = () => {
//   return <Index />;
// }
// export default App;
