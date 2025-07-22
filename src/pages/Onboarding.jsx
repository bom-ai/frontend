import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Onboarding() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    // if (!code.trim()) {
    //   alert("접근 코드를 입력해주세요.");
    //   return;
    // }

    // ✅ 페이지 이동
    navigate("/upload-frame");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7fb] font-sans text-gray-900">
      <img src={logo} alt="logo" className="w-48 mb-12" />

      <div className="w-full max-w-sm space-y-4 px-4">
        <div>
          <label className="block text-[16px] font-semibold mb-1">
            접근 코드
          </label>
          <input
            type="text"
            placeholder="예) ABC-1234"
            className="w-full py-2 border-b border-gray-400 bg-transparent focus:outline-none placeholder-gray-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-gray-800 text-white text-[16px] font-semibold py-2 rounded-[8px] hover:bg-gray-700 transition"
          onClick={handleSubmit}
        >
          👉 입장하기
        </button>
      </div>
    </div>
  );
}
