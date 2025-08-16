import { BrowserRouter, Routes, Route } from "react-router-dom";
import Onboarding from "./pages/Onboarding";
import Register from "./pages/Register";
import CheckEmail from "./pages/CheckEmail";
import UploadFrame from "./pages/UploadFrame";
import SelectTone from "./pages/SelectTone";
import UploadAudio from "./pages/UploadAudio";
import Result from "./pages/Result";
import VerificationResult from "./pages/VerificationResult";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Onboarding />} />
        <Route path="/register" element={<Register />} />
        <Route path="/check-email" element={<CheckEmail />} />
        <Route path="/verification-result" element={<VerificationResult />} />
        <Route path="/upload-frame" element={<UploadFrame />} />
        <Route path="/select-tone" element={<SelectTone />} />
        <Route path="/upload-audio" element={<UploadAudio />} />
        <Route path="/result/:jobId" element={<Result />} />
      </Routes>
    </BrowserRouter>
  );
}
