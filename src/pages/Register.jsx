/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";
import background from "../assets/background.jpg";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      setLoading(true); // ✅ 시작
      const res = await register(email, password);
      navigate("/check-email", { state: { email } });
    } catch (err) {
      console.error("회원가입 실패:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message;
      alert("회원가입 실패: " + msg);
    } finally {
      setLoading(false); // ✅ 끝
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center 
                 bg-cover bg-center bg-no-repeat font-sans text-gray-900"
      style={{ backgroundImage: `url(${background})` }}
    >
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            <span className="mt-4 text-white text-lg font-medium">
              회원가입 중
            </span>
          </div>
        </div>
      )}

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

        <div>
          <label className="block text-[16px] font-semibold mb-1">
            비밀번호 확인
          </label>
          <input
            type="password"
            placeholder="비밀번호 한 번 더 입력"
            className="w-full py-2 border-b border-gray-400 bg-transparent focus:outline-none placeholder-gray-400"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {confirmPassword && (
          <div
            className={`text-sm font-medium mt-1 ${
              confirmPassword === password ? "text-green-600" : "text-red-500"
            }`}
          >
            {confirmPassword === password
              ? "✅ 비밀번호가 일치합니다!"
              : "❗ 비밀번호가 일치하지 않습니다!"}
          </div>
        )}

        <button
          className="w-full bg-gray-800 text-white text-[16px] font-semibold py-2 rounded-[8px] hover:bg-gray-700 transition"
          onClick={handleSubmit}
        >
          회원가입
        </button>
      </div>
    </div>
  );
}
