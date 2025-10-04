
import React from 'react';

const ErrorModal: React.FC<{ message: string | null; onClose: () => void; }> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-full mx-4 transform transition-all" role="document">
        <div className="flex flex-col items-center text-center">
            <div className="bg-red-100 p-3 rounded-full">
                <svg className="h-8 w-8 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            </div>
          <h2 className="text-xl font-bold text-slate-800 mt-4">Search Error</h2>
          <p className="text-slate-600 mt-2">{message}</p>
          <button
            onClick={onClose}
            className="mt-6 bg-red-500 text-white font-semibold py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
