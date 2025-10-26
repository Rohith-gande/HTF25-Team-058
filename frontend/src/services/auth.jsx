// // src/services/auth.js
// import axios from "axios";

// export const AuthService = {
//   devMode: true, // toggle true for static login, false for API

//   async signIn({ email, password }) {
//     if (this.devMode) {
//       // Static login for UI testing
//       return {
//         idToken: "DEV_FAKE_ID_TOKEN",
//         user: { name: "John Doe", email, memberSince: "Jan 2025" }
//       };
//     }

//     // Production: call FastAPI backend
//     try {
//       const res = await axios.post("/auth/signin", { email, password });
//       return res.data; // expects { idToken, user }
//     } catch (err) {
//       throw new Error(err.response?.data?.detail || "Login failed");
//     }
//   },

//   async signUp({ name, email, password }) {
//     if (this.devMode) {
//       // Static sign up for UI testing
//       return {
//         idToken: "DEV_FAKE_ID_TOKEN",
//         user: { name, email, memberSince: "Oct 2025" }
//       };
//     }

//     // Production: call FastAPI backend
//     try {
//       const res = await axios.post("/auth/signup", { name, email, password });
//       return res.data; // expects { idToken, user }
//     } catch (err) {
//       throw new Error(err.response?.data?.detail || "Sign up failed");
//     }
//   }
// };

// src/services/auth.js
export const AuthService = {
  async signUp({ name, email, password }) {
    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("password", password);

    const res = await fetch("http://localhost:8000/api/v1/signup", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error((await res.json()).detail || "Signup failed");
    return await res.json();
  },

  async signIn({ email, password }) {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    const res = await fetch("http://localhost:8000/api/v1/signin", {
      method: "POST",
      body: form,
    });

    if (!res.ok) throw new Error((await res.json()).detail || "Signin failed");
    return await res.json();
  },
};
