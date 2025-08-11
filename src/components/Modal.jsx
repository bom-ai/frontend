// components/Modal.jsx
export default function Modal({ title, message, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col items-center bg-white rounded-[20px] shadow-2xl w-full max-w-md p-6">
        <h2 className="text-[20px] font-bold mb-1">{title}</h2>
        <p className="text-[16px] text-gray-700 mb-6 whitespace-pre-line">
          {message}
        </p>

        <div className="w-full flex justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-[10px] bg-gray-300 hover:bg-gray-400 transition font-semibold"
          >
            취소
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded-[10px] bg-red-600 text-white hover:bg-red-700 transition font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
