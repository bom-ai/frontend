import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import background from "../assets/background.jpg";

import { login } from "../api/auth";
import { setTokens } from "../utils/tokenStorage";

export default function Onboarding() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // 👇 1. event(e)를 파라미터로 받도록 수정
  const handleSubmit = async (e) => {
    e.preventDefault(); // 👈 2. 폼 제출 시 페이지 새로고침 방지

    // 입력 유효성 검사
    if (!email.trim() || !password.trim()) {
      alert("이메일과 비밀번호를 모두 입력해주세요.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("유효한 이메일 주소를 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await login(email, password);
      setTokens(res); // 토큰 저장
      navigate("/upload-frame"); // 로그인 성공 시 이동
    } catch (err) {
      if (err.response) {
        const detail =
          err.response.data?.detail ||
          err.response.data?.message ||
          "알 수 없는 서버 응답";
        alert("로그인 실패: " + detail);
      } else if (err.request) {
        alert("서버로부터 응답이 없습니다. 네트워크를 확인해주세요.");
      } else {
        alert("요청 실패: " + err.message);
      }
    } finally {
      setIsLoading(false);
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

      <form
        className="w-full bg-white max-w-sm space-y-4 p-8 rounded-[20px] shadow mb-16"
        onSubmit={handleSubmit}
      >
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
          // 👇 4. onClick은 제거하고, type="submit"을 명시해주는 것이 좋음 (기본값이 submit이긴 함)
          type="submit"
          className="w-full bg-gray-800 text-white text-[16px] font-semibold py-2 rounded-[8px] hover:bg-gray-700 transition"
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
      </form>

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-white text-lg font-medium">
              로그인 중
            </span>
          </div>
        </div>
      )}

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
