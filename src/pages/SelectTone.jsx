import { MdOutlineUploadFile } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setAnalysisStyle } from "../redux/analysisStyleSlice";

export default function SelectTone() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedStyle = useSelector((state) => state.analysisStyle.style);

  const handleStyleSelect = (style) => {
    // 만약 현재 선택된 스타일과 클릭한 스타일이 같다면, 선택을 해제합니다 (null로 설정).
    if (selectedStyle === style) {
      dispatch(setAnalysisStyle(null));
    } else {
      // 다른 스타일을 클릭했다면, 그 스타일을 새로운 선택 값으로 설정합니다.
      dispatch(setAnalysisStyle(style));
    }
  };

  const handleBefore = () => {
    navigate("/upload-frame");
  };

  const handleNext = () => {
    if (selectedStyle) {
      navigate("/upload-audio");
    } else {
      alert("내용 분석 스타일을 선택해주세요!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-[1024px] mx-auto">
          {/* Step Indicator */}
          <div className="w-full mb-10">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
              <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
              <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold mb-1">
              ✔️ 내용 분석 스타일 선택
            </h2>
            <p className="text-gray-500 text-[16px] font-regular">
              어떤 스타일의 분석 결과를 원하시나요? 결과물의 상세 수준이
              달라집니다.
            </p>
          </div>

          {/* === 스타일 선택 UI === */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Raw 버전 선택 버튼 */}
            <button
              onClick={() => handleStyleSelect("raw")}
              className={`p-6 border border-gray-200 rounded-xl ${
                selectedStyle === "raw"
                  ? "bg-gray-100"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <h3 className="text-[18px] font-bold">Raw 버전</h3>
            </button>

            {/* 2. 정제된 버전 선택 버튼 */}
            <button
              onClick={() => handleStyleSelect("refined")}
              className={`p-6 border border-gray-200 rounded-xl ${
                selectedStyle === "refined"
                  ? "bg-gray-100"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              <h3 className="text-[18px] font-bold">정제된 버전</h3>
            </button>
          </div>
          {/* ======================= */}

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4">
            <div className="max-w-[1024px] mx-auto px-4 flex justify-between">
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={handleBefore}
              >
                이전으로
              </button>
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={handleNext}
              >
                다음으로
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
