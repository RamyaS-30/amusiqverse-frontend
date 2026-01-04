import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AudioProvider } from "./context/AudioContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </AuthProvider>
  </BrowserRouter>
);
