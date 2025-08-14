import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaCheckCircle,
  FaSpinner,
  FaDownload,
  FaExclamationTriangle,
} from "react-icons/fa";

import Header from "../components/Header";
import axiosSecure from "../api/axiosSecure";
import { base64ToFile } from "../utils/fileUtils";

// Redux 액션 import
import { clearGroupNames } from "../redux/groupNamesSlice";
import { clearUploadedFrame } from "../redux/uploadedFrameSlice";
import { setAnalysisStyle } from "../redux/analysisStyleSlice";
import { clearJobId } from "../redux/jobSlice";

export default function Result() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { jobId } = useParams();
  // const jobId = useSelector((state) => state.job.jobId);
  const uploadedFrame = useSelector((state) => state.uploadedFrame);

  const [jobStatus, setJobStatus] = useState({
    status: "initializing",
    message: "작업 상태를 확인 중입니다...",
    processed_files: 0,
    total_files: 0,
  });
  const [error, setError] = useState(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const pollingTimeoutId = useRef(null);

  useEffect(() => {
    if (!jobId) {
      setError("유효한 작업 ID가 없습니다. 다시 시도해주세요.");
      return;
    }

    let isMounted = true; // 컴포넌트 언마운트 시 비동기 상태 업데이트를 막기 위함

    const pollStatus = async () => {
      try {
        const response = await axiosSecure.get(
          `/bomatic_pipeline/batch-status/${jobId}`
        );

        if (!isMounted) return; // 컴포넌트가 사라졌다면 아무 작업도 하지 않음

        console.log("상태 업데이트:", response.data);
        setJobStatus(response.data);

        if (
          response.data.status !== "completed" &&
          response.data.status !== "failed"
        ) {
          // ✅ 작업이 계속 진행 중일 때만 다음 폴링을 예약
          pollingTimeoutId.current = setTimeout(pollStatus, 5000);
        } else {
          console.log("작업 완료 또는 실패. 폴링을 중단합니다.");
        }
      } catch (err) {
        if (!isMounted) return;

        console.error("상태 확인 실패:", err);
        setError("작업 상태를 확인하는 중 오류가 발생했습니다.");
      }
    };

    pollStatus(); // 최초 실행

    // Cleanup 함수
    return () => {
      isMounted = false;
      // 컴포넌트가 언마운트되면 예약된 timeout을 반드시 취소
      if (pollingTimeoutId.current) {
        clearTimeout(pollingTimeoutId.current);
      }
    };
  }, [jobId]);

  const handleDownload = async () => {
    if (
      !uploadedFrame.frameBase64 ||
      !uploadedFrame.frameName ||
      !uploadedFrame.frameType
    ) {
      setDownloadError("다운로드할 프레임 파일 정보가 없습니다.");
      console.log(downloadError);
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const frameFile = base64ToFile(
        uploadedFrame.frameBase64,
        uploadedFrame.frameName,
        uploadedFrame.frameType
      );

      const formData = new FormData();
      formData.append("frame", frameFile);

      const response = await axiosSecure.post(
        `/bomatic_pipeline/download/${jobId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      // 4. 브라우저에서 파일 다운로드 트리거
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `analysis_result_${jobId}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("다운로드 실패:", err);
      setDownloadError("파일을 다운로드하는 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRetry = () => {
    dispatch(clearGroupNames());
    dispatch(clearUploadedFrame());
    dispatch(setAnalysisStyle(null));
    dispatch(clearJobId());
    navigate("/upload-frame");
  };

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-xl">
          <FaExclamationTriangle className="text-red-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-red-700 mb-2">오류 발생</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      );
    }

    // ✅ 'completed' 상태일 때 UI 변경
    if (jobStatus.status === "completed") {
      return (
        <div className="text-center p-10 border border-gray-200 rounded-xl">
          <FaCheckCircle className="text-gray-500 text-[32px] mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">작업 완료</h3>
          {/* <p className="text-gray-600">
            모든 파일의 분석이 성공적으로 완료되었습니다!
          </p> */}
          <div className="mt-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="inline-flex items-center justify-center bg-[#474E93] text-[16px] text-white px-6 py-2 rounded-xl hover:bg-gray-600 transition"
            >
              {isDownloading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  다운로드 중...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" />
                  보고서 다운로드
                </>
              )}
            </button>
            {downloadError && (
              <p className="text-red-500 text-sm mt-2">{downloadError}</p>
            )}
          </div>
        </div>
      );
    }

    // 진행 중 상태 UI 개선
    return (
      <div className="text-center p-10 bg-white border border-gray-200 rounded-xl">
        <div className="w-10 h-10 border-4 border-gray-200 mx-auto mb-4 border-t-transparent rounded-full animate-spin"></div>
        <h3 className="text-xl font-bold mb-2">분석이 진행 중입니다</h3>
        {/* <p className="text-gray-600">{jobStatus.message}</p> */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
          <div
            className="bg-gray-800 h-2.5 rounded-full"
            style={{
              width: `${
                (jobStatus.processed_files / (jobStatus.total_files || 1)) * 100
              }%`,
            }}
          ></div>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          ({jobStatus.processed_files} / {jobStatus.total_files} 개 처리중)
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8">
        <div className="w-full max-w-[1024px] mx-auto">
          <div className="w-full mb-10">
            <div className="flex items-center space-x-3">
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
              <div className="h-2 w-1/4 bg-[#474E93] rounded-full" />
            </div>
          </div>
          <div className="text-left mb-8">
            <h2 className="text-2xl font-extrabold mb-1">
              🌟 내용 분석 보고서 생성
            </h2>
          </div>

          <div className="w-full">{renderContent()}</div>

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
