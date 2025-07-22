import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import UploadFrame from "./pages/UploadFrame";
import UploadAudio from "./pages/UploadAudio";
import Result from "./pages/Result";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/upload-frame" element={<UploadFrame />} />
        <Route path="/upload-audio" element={<UploadAudio />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
