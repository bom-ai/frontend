/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/auth";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
      const res = await register(email, password);
      navigate("/check-email", { state: { email: email } }); // ✅ 이메일 전달
    } catch (err) {
      console.error("회원가입 실패:", err);
      const msg =
        err.response?.data?.detail ||
        err.response?.data?.message ||
        err.message;
      alert("회원가입 실패: " + msg);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7fb] font-sans text-gray-900">
      <h1 className="text-[48px] mb-[24px] font-together">
        <span className="text-[#640D5F]">bo:m</span>atic
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
