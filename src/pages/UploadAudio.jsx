import { MdOutlineUploadFile } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";

import Header from "../components/Header";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";
import Modal from "../components/Modal";

export default function UploadAudio() {
  const [fileNames, setFileNames] = useState([]);
  const [fileSizes, setFileSizes] = useState([]);
  const fileInputRefs = useRef([]);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const groupNames = useSelector((state) => state.groupNames.values);

  useEffect(() => {
    setFileNames(new Array(groupNames.length).fill(null));
    setFileSizes(new Array(groupNames.length).fill(null));

    fileInputRefs.current = groupNames.map(
      (_, i) => fileInputRefs.current[i] || document.createElement("input")
    );
  }, [groupNames]);

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    const newFileNames = [...fileNames];
    const newFileSizes = [...fileSizes];
    newFileNames[index] = file ? file.name : null;
    newFileSizes[index] = file ? file.size : null;
    setFileNames(newFileNames);
    setFileSizes(newFileSizes);
  };

  const handleClearFile = (index) => {
    const newFileNames = [...fileNames];
    const newFileSizes = [...fileSizes];
    newFileNames[index] = null;
    newFileSizes[index] = null;
    setFileNames(newFileNames);
    setFileSizes(newFileSizes);

    if (fileInputRefs.current[index]?.current) {
      fileInputRefs.current[index].current.value = null;
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (sizeInBytes >= 1024 * 1024) {
      return (sizeInBytes / (1024 * 1024)).toFixed(2) + "MB";
    } else {
      return Math.round(sizeInBytes / 1024) + "KB";
    }
  };

  const handleBefore = () => {
    const hasUploadedFile = fileNames.some((name) => name !== null);
    if (hasUploadedFile) {
      setShowModal(true);
      return;
    }
    navigate("/upload-frame");
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    setFileNames(new Array(groupNames.length).fill(null));
    setFileSizes(new Array(groupNames.length).fill(null));
    // dispatch(clearAllAudioFiles()); // 선택적으로
    navigate("/upload-frame");
  };

  const handleModalClose = () => setShowModal(false);

  const handleNext = () => {
    // if (!fileName) {
    //   alert("파일을 먼저 업로드해주세요!");
    //   return;
    // }
    navigate("/result"); // ✅ 페이지 이동
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
              <div className="h-2 w-1/3 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold mb-1">
              🎙️ 오디오 파일 업로드
            </h2>
            <p className="text-gray-500 text-[16px] font-regular">
              오디오 파일 업로드 관련 부연설명
            </p>
          </div>

          {/* Upload Grid - 2열 x 2행 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 mb-8">
            {groupNames.map((groupName, index) => (
              <div key={index} className="w-full h-20">
                <div className="flex items-center mb-1">
                  <p className="text-sm text-white font-regular px-2 py-1 bg-gray-800 rounded-[10px] w-fit">
                    그룹명
                  </p>
                  <p className="ml-2 font-semibold text-gray-500">
                    {groupName}
                  </p>
                </div>
                {fileNames[index] ? (
                  // 업로드 후 상태
                  <div className="relative bg-white rounded-xl border border-gray-200 w-full h-full px-[20px] py-[16px]">
                    <button
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
                      onClick={() => handleClearFile(index)}
                    >
                      <IoCloseSharp className="text-[20px]" />
                    </button>

                    {/* 내용 */}
                    <div className="w-full h-full flex items-center space-x-3">
                      <div className="flex-[1] flex flex-col items-center justify-center">
                        <FaCheckCircle className="text-green-500 text-[20px]" />
                        <p className="text-sm text-green-600 text-[16px] font-medium mt-[4px]">
                          완료
                        </p>
                      </div>
                      <div className="flex-[11]">
                        <p className="font-extrabold text-[16px] text-gray-800">
                          {fileNames[index]}
                        </p>
                        <span className="font-semibold text-gray-400 text-[12px]">
                          {fileSizes[index]
                            ? formatFileSize(fileSizes[index])
                            : ""}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // 업로드 전 상태
                  <label
                    htmlFor={`file-upload-${index}`}
                    className="w-full h-full bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-200 transition p-4"
                  >
                    <div className="flex flex-col items-center">
                      <MdOutlineUploadFile className="text-gray-500 text-[16px]" />
                      <p className="text-[16px] text-gray-500 mt-1">
                        오디오 파일을 업로드해주세요
                      </p>
                    </div>
                  </label>
                )}
                <input
                  id={`file-upload-${index}`}
                  type="file"
                  className="hidden"
                  onChange={(e) => handleFileChange(e, index)}
                  ref={fileInputRefs.current[index]}
                />
              </div>
            ))}
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 py-4">
            <div className="max-w-[1024px] mx-auto px-4 flex justify-between">
              {/* 이전 버튼 */}
              <button
                className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                onClick={handleBefore}
              >
                이전으로
              </button>

              {/* 다음 버튼 */}
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
      {showModal && (
        <Modal
          title="정말 이전으로 돌아가시겠습니까?"
          message="이전 페이지로 이동하면 업로드한 오디오 파일이 모두 삭제됩니다."
          onConfirm={handleModalConfirm}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
