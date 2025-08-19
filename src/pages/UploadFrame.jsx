import { MdOutlineUploadFile } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";

import Header from "../components/Header";
import { setGroupNames, clearGroupNames } from "../redux/groupNamesSlice";
import {
  setUploadedFrame,
  clearUploadedFrame,
} from "../redux/uploadedFrameSlice";

import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import mammoth from "mammoth";

export default function UploadFrame() {
  const uploadedFrame = useSelector((state) => state.uploadedFrame);
  const fileName = uploadedFrame.frameName;
  const fileSize = uploadedFrame.frameBase64
    ? Math.round((uploadedFrame.frameBase64.length * 3) / 4 / 1024)
    : null;
  const groupNames = useSelector((state) => state.groupNames.values);

  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const extractGroupNamesFromHtml = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tables = doc.querySelectorAll("table");
    const groupNameSet = new Set();

    tables.forEach((table) => {
      const rows = table.querySelectorAll("tr");

      rows.forEach((row, idx) => {
        if (idx === 0) return; // 첫 번째 행은 스킵

        const firstCell = row.querySelector("td, th");
        if (firstCell) {
          const groupName = firstCell.textContent.trim();
          if (groupName) {
            groupNameSet.add(groupName);
          }
        }
      });
    });

    console.log(groupNameSet);

    return Array.from(groupNameSet);
  };

  // 👇 .docx 파일 처리 함수
  const handleFrameUpload = async (file, dispatch) => {
    const arrayBuffer = await file.arrayBuffer();
    const { value: html } = await mammoth.convertToHtml({ arrayBuffer });

    const groupNames = extractGroupNamesFromHtml(html);

    if (groupNames.length === 0) {
      console.warn("⚠️ docx 파일에 표(table)가 없습니다.");
    } else {
      dispatch(setGroupNames(groupNames));
    }

    // ✅ base64로 변환 후 Redux에 프레임 저장
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result;
      dispatch(
        setUploadedFrame({
          frameName: file.name,
          frameType: file.type,
          frameBase64: base64,
        })
      );
    };
    reader.readAsDataURL(file);
  };

  // 👇 메인 핸들러
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      dispatch(clearUploadedFrame());
      return;
    }

    const fileExt = file.name.split(".").pop().toLowerCase();

    if (fileExt === "docx") {
      await handleFrameUpload(file, dispatch);
    } else {
      alert("docx 형식의 파일만 업로드할 수 있습니다.");
    }
  };

  const handleClearFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";

      dispatch(clearGroupNames());
      dispatch(clearUploadedFrame());
    }
  };

  const handleNext = () => {
    if (!fileName) {
      alert("파일을 먼저 업로드해주세요!");
      return;
    }

    if (!groupNames || groupNames.length === 0) {
      alert("프레임이 비어 있습니다.");
      return;
    }

    navigate("/select-tone");
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
              <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
              <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
              <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold mb-1">
              📑 내용 분석 프레임 업로드
            </h2>
            <p className="text-gray-500 text-[16px] font-regular">
              * 내용 분석 프레임은 docx 파일 형식이어야 합니다
            </p>
          </div>

          {/* Upload Box */}
          {!fileName ? (
            // 업로드 전 상태
            <label
              htmlFor="file-upload"
              className="w-full h-20 bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition mb-8 p-4"
            >
              <div className="flex flex-col items-center">
                <MdOutlineUploadFile className="text-gray-500 text-[16px]" />
                <p className="text-[16px] text-gray-500 mt-1">
                  내용 분석 프레임을 업로드해주세요.
                </p>
              </div>
            </label>
          ) : (
            // 업로드 후 상태
            <div className="w-full h-20 relative bg-white rounded-xl border border-gray-200 px-[20px] py-[16px]">
              {/* 닫기 버튼 - 오른쪽 상단 고정 */}
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                onClick={handleClearFile}
              >
                <IoCloseSharp className="text-[20px]" />
              </button>

              {/* 내용 */}
              <div className="w-full h-full flex items-center space-x-3">
                <div>
                  <p className="font-extrabold text-[16px] text-gray-800">
                    {fileName}
                  </p>
                  <span className="font-semibold text-gray-400 text-[12px]">
                    {fileSize}KB
                  </span>
                </div>
              </div>
            </div>
          )}
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          {/* Next Button - 화면 하단 고정 */}
          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4">
            <div className="max-w-[1024px] mx-auto px-4 flex justify-end">
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
