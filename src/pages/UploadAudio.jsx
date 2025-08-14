/* eslint-disable no-unused-vars */
import { MdOutlineUploadFile } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import soundIcon from "../assets/sound-icon.png";

import Header from "../components/Header";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useSelector } from "react-redux";

import Modal from "../components/Modal";
import { base64ToFile } from "../utils/fileUtils";
import axiosSecure from "../api/axiosSecure";

import { setJobId } from "../redux/jobSlice";

export default function UploadAudio() {
  const [fileNames, setFileNames] = useState([]);
  const [fileSizes, setFileSizes] = useState([]);
  const fileInputRefs = useRef([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const groupNames = useSelector((state) => state.groupNames.values);
  const uploadedFrame = useSelector((state) => state.uploadedFrame);
  const analysisStyle = useSelector((state) => state.analysisStyle.style);

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

    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index].value = null;
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
    navigate("/select-tone");
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    setFileNames(new Array(groupNames.length).fill(null));
    setFileSizes(new Array(groupNames.length).fill(null));
    navigate("/upload-frame");
  };

  const handleModalClose = () => setShowModal(false);

  const handleNext = async () => {
    setIsLoading(true);

    try {
      const requestFormData = new FormData();

      if (
        uploadedFrame.frameBase64 &&
        uploadedFrame.frameName &&
        uploadedFrame.frameType
      ) {
        const frameFile = base64ToFile(
          uploadedFrame.frameBase64,
          uploadedFrame.frameName,
          uploadedFrame.frameType
        );
        requestFormData.append("frame", frameFile);
      }

      requestFormData.append("template_type", analysisStyle || "refined");

      const mappingObj = {};
      const filesToUpload = [];

      fileInputRefs.current.forEach((inputEl, index) => {
        if (inputEl?.files?.[0]) {
          const audioFile = inputEl.files[0];
          const audioFileName = audioFile.name;

          requestFormData.append("filenames", audioFileName);
          mappingObj[audioFileName] = groupNames[index];
          filesToUpload.push({ name: audioFileName, file: audioFile });
        }
      });

      requestFormData.append("mapping", JSON.stringify(mappingObj));

      // 백엔드에 분석 요청
      const response = await axiosSecure.post(
        "/bomatic_pipeline/request-analysis",
        requestFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const { job_id, upload_urls } = response.data;
      console.log("✅ STEP 1 완료: Job ID와 업로드 URL 수신", {
        job_id,
        upload_urls,
      });

      const uploadPromises = filesToUpload.map(({ name, file }) => {
        const signedUrl = upload_urls[name];
        if (!signedUrl) {
          console.error(`'${name}'에 대한 업로드 URL을 찾을 수 없습니다.`);
          return Promise.reject(new Error(`URL for ${name} not found.`));
        }

        return fetch(signedUrl, {
          method: "PUT",
          headers: {
            "Content-Type": "application/octet-stream",
          },
          body: file,
        });
      });

      // 모든 파일 업로드가 완료될 때까지 기다림
      await Promise.all(uploadPromises);

      await axiosSecure.post(`/bomatic_pipeline/start-analysis/${job_id}`);

      dispatch(setJobId(job_id));
      navigate(`/result/${job_id}`);
    } catch (err) {
      console.error("전체 분석 과정 중 오류 발생:", err);
      alert("서버 요청 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    } finally {
      setIsLoading(false);
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
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
              <div className="h-2 w-1/4 bg-gray-300 rounded-full" />
            </div>
          </div>

          {/* Title + Subtitle */}
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold mb-1">
              🎙️ 오디오 파일 업로드
            </h2>
            <p className="text-gray-500 text-[16px] font-regular">
              * 각 그룹명에 해당되는 오디오 파일을 업로드해주세요.
            </p>
          </div>

          {/* Upload Grid - 2열 x 2행 */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 mb-8">
            {groupNames.map((groupName, index) => (
              <div key={index} className="w-full h-20">
                <div className="flex items-center mb-1">
                  <p className="text-sm text-gray-500 font-medium px-2 py-1 bg-gray-200 rounded-[10px] w-fit">
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
                      <div className="flex-[1] flex flex-col items-center justify-center mr-[8px]">
                        <img
                          src={soundIcon}
                          alt="Sound Icon"
                          className="w-10 h-10"
                        />
                      </div>
                      <div className="flex-[7]">
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
                  ref={(el) => (fileInputRefs.current[index] = el)}
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

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}
