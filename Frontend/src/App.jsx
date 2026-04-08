import React from "react";

import "./App.css";
import "./styles/theme.css";
import "./styles/toast.css";
import AppRoutes from "./routes/AppRoutes";
import { ToastProvider } from "./components/Toast";

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;
