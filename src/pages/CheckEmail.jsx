import { useNavigate, useLocation } from "react-router-dom";

export default function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f7f7fb] font-sans text-gray-900">
      <h1 className="text-[84px]">💌</h1>

      <div className="w-full bg-white max-w-sm space-y-4 p-8 rounded-[20px] shadow mb-16 text-center">
        <h1 className="text-[16px] font-medium leading-relaxed">
          <span className="font-semibold">{email}</span>
          주소로 인증 메일을 보냈어요!
          <br />
          인증 메일의 링크를 클릭하면 회원가입이 완료됩니다.
        </h1>

        <button
          className="px-4 py-1 text-[16px] font-semibold text-gray-700 bg-gray-200 rounded hover:bg-gray-100 transition"
          onClick={handleSubmit}
        >
          확인
        </button>
      </div>
    </div>
  );
}
