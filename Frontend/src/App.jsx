import React from "react";

import "./App.css";
import "./styles/theme.css";
import "./styles/toast.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
