import { MdOutlineUploadFile } from "react-icons/md";

import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearGroupNames } from "../redux/GroupNamesSlice";
import { clearUploadedFrame } from "../redux/uploadedFrameSlice";

export default function Result() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRetry = () => {
    dispatch(clearGroupNames());
    dispatch(clearUploadedFrame());

    navigate("/upload-frame"); // ✅ 페이지 이동
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-[1024px] mx-auto">
          {/* Step Indicator */}
          <div className="w-full mb-10">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-1/3 bg-[#69247C] rounded-full" />
              <div className="h-2 w-1/3 bg-[#69247C] rounded-full" />
              <div className="h-2 w-1/3 bg-[#69247C] rounded-full" />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold mb-1">
              🌟 내용 분석 보고서 생성 완료!
            </h2>
          </div>

          {/* Next Button - 화면 하단 고정 */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4">
            <div className="max-w-[1024px] mx-auto px-4 flex justify-end">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={handleRetry}
              >
                다시하기
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
