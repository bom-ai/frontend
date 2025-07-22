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
      <h1 className="text-[48px] mb-[24px] font-together">
        <span className="text-[#640D5F]">bo:m</span>atic
      </h1>
      <div className="w-full bg-white max-w-sm space-y-4 p-8 rounded-[20px] shadow mb-16">
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

      {/* 하단 로고 & 문구 */}
      <footer className="absolute flex flex-col bottom-8 flex items-center space-x-2 text-sm text-gray-600">
        <img src={logo} alt="bom logo" className="w-20 mb-2" />
        <span className="font-light">
          Exclusively designed for Research House bo:m
        </span>
      </footer>
    </div>
  );
}
