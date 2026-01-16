import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./auth/AuthProvider";
import "./index.css";

// Debug help message
console.log('🎯 DEBUG MODE ENABLED - Check console for detailed database operation logs');
console.log('📋 Look for emoji messages: 🔍 (loading) 📡 (saving) ✅ (success) ❌ (error)');

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);