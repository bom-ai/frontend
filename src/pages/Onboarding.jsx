import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import background from "../assets/background.jpg";

import { login } from "../api/auth";
import { setTokens } from "../utils/tokenStorage";

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    // 입력 유효성 검사
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const res = await login(email, password);
      setTokens(res); // 토큰 저장
      navigate("/upload-frame"); // 로그인 성공 시 이동
    } catch (err) {
      if (err.response) {
        // 서버에서 에러 응답이 왔을 때
        const detail =
          err.response.data?.detail ||
          err.response.data?.message ||
          "알 수 없는 서버 응답";
        alert("로그인 실패: " + detail);
      } else if (err.request) {
        // 요청은 보냈지만 응답이 없을 때
        alert("서버로부터 응답이 없습니다. 네트워크를 확인해주세요.");
      } else {
        // 요청도 못 보낸 에러 (axios 설정 문제 등)
        alert("요청 실패: " + err.message);
      }
    }
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center 
             bg-cover bg-center bg-no-repeat font-sans text-gray-900"
      style={{ backgroundImage: `url(${background})` }}
    >
      <h1
        className="text-[72px] mb-[12px] font-tenorite text-white"
        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}
      >
        bo:matic
      </h1>

      <div className="w-full bg-white max-w-sm space-y-4 p-8 rounded-[20px] shadow mb-16">
        <div>
          <label className="block text-[16px] font-semibold mb-1">이메일</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="name@rh-bom.com"
              className="w-full py-2 border-b border-gray-400 bg-transparent focus:outline-none placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-[16px] font-semibold mb-1">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호 입력"
            className="w-full py-2 border-b border-gray-400 bg-transparent focus:outline-none placeholder-gray-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          className="w-full bg-gray-800 text-white text-[16px] font-semibold py-2 rounded-[8px] hover:bg-gray-700 transition"
          onClick={handleSubmit}
        >
          로그인
        </button>

        <div className="text-center mt-2">
          <span
            className="text-[16px] font-semibold text-[#393E46] underline cursor-pointer hover:text-gray-500"
            onClick={handleRegister}
          >
            회원가입
          </span>
        </div>
      </div>

      {/* 하단 로고 & 문구 */}
      <footer className="absolute bottom-8 flex items-center justify-center text-sm text-gray-500">
        <img src={logo} alt="bom logo" className="w-20 mr-2" />
        <span className="mx-2 text-gray-400">|</span>
        <span className="font-medium">
          Exclusively designed for Research House bo:m
        </span>
      </footer>
    </div>
  );
}
