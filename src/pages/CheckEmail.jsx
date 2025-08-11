import { useNavigate, useLocation } from "react-router-dom";
import background from "../assets/background.jpg";

export default function CheckEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleSubmit = () => {
    navigate("/");
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-gray-900">
      {/* 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: `url(${background})` }}
      />

      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-30 z-0" />

      {/* 내용 */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <h1 className="text-[84px] text-white drop-shadow-md">💌</h1>

        <div className="w-full bg-white max-w-[450px] space-y-4 p-8 rounded-[20px] shadow mb-16 text-center">
          <h1 className="text-[16px] font-medium leading-relaxed">
            <span className="font-extrabold">{email} </span>
            주소로 인증 메일을 보냈어요!
            <br />
            인증 메일의 링크를 클릭하면 회원가입이 완료됩니다.
          </h1>

          <button
            className="px-4 py-1 text-[16px] font-semibold text-gray-700 bg-gray-200 rounded-[10px] hover:bg-gray-100 transition"
            onClick={handleSubmit}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
