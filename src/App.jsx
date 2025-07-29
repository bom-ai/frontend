import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Register from "./pages/Register";
import CheckEmail from "./pages/CheckEmail";
import UploadFrame from "./pages/UploadFrame";
import UploadAudio from "./pages/UploadAudio";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/upload-frame" element={<UploadFrame />} />
        <Route path="/upload-audio" element={<UploadAudio />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
