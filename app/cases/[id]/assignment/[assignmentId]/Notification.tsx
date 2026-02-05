'use client';

import { useEffect } from 'react';

interface NotificationProps {
  message: {
    title: string;
    text: string;
  };
  type: 'info' | 'error' | 'success';
  onClose: () => void;
}

const Notification = ({ message, type, onClose }: NotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, type === 'info' ? 3000 : 5000); // 3s for info, 5s for error/success

    return () => clearTimeout(timer);
  }, [onClose, type]);

  const baseClasses = 'fixed bottom-4 right-4 p-4 rounded shadow-md z-50 flex';
  const typeClasses = {
    info: 'bg-blue-100 border-l-4 border-blue-500 text-blue-700',
    error: 'bg-red-100 border-l-4 border-red-500 text-red-700',
    success: 'bg-green-100 border-l-4 border-green-500 text-green-700',
  };

  const icons = {
    info: (
      <svg className="h-6 w-6 text-blue-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
       <svg className="h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    success: (
        <svg className="h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    )
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]}`}>
      <div className="py-1">{icons[type]}</div>
      <div>
        <p className="font-bold">{message.title}</p>
        <p className="text-sm">{message.text}</p>
      </div>
    </div>
  );
};

export default Notification;
