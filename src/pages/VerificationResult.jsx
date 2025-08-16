import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import background from "../assets/background.jpg";

// 상태별 설정 객체는 이전과 동일하게 사용합니다.
const statusConfig = {
  success: {
    title: "이메일 인증 완료!",
    message: "계정이 성공적으로 활성화되었습니다",
    linkText: "로그인하러 가기",
    linkTo: "/",
  },
};

const VerificationResult = () => {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState(statusConfig.success);

  useEffect(() => {
    const status = searchParams.get("status");
    const newResult = statusConfig[status] || statusConfig.success;
    setResult(newResult);
  }, [searchParams]);

  return (
    // 전체 페이지 컨테이너
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center 
                   bg-cover bg-center bg-no-repeat font-sans text-gray-900"
      style={{ backgroundImage: `url(${background})` }}
    >
      <div className="w-full bg-white max-w-sm space-y-2 p-8 rounded-[20px] shadow mb-16 flex flex-col justify-center items-center">
        {/* 제목 */}
        <h1 className="text-[20px] font-bold text-slate-800">{result.title}</h1>

        {/* 메시지 */}
        <p className="text-[16px] text-slate-600 leading-relaxed">
          {result.message}
        </p>

        {/* 액션 버튼 / 링크 */}
        {result.linkText && result.linkTo && (
          <div className="pt-4">
            <Link
              to={result.linkTo}
              className="inline-block text-[16px] px-6 py-2 rounded-[8px] font-semibold text-white transition-colors duration-300 bg-gray-800 hover:bg-gray-600"
            >
              {result.linkText}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationResult;
