'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  show: boolean;
  onClose: () => void;
}

export default function Notification({ 
  message, 
  type = 'success', 
  duration = 5000, 
  show, 
  onClose 
}: NotificationProps) {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-50' : 
                 type === 'error' ? 'bg-red-50' : 
                 'bg-blue-50';
  
  const textColor = type === 'success' ? 'text-green-800' : 
                   type === 'error' ? 'text-red-800' : 
                   'text-blue-800';
  
  const borderColor = type === 'success' ? 'border-green-200' : 
                     type === 'error' ? 'border-red-200' : 
                     'border-blue-200';

  if (!isVisible) return null;

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm p-4 rounded-lg shadow-md ${bgColor} border ${borderColor}`}>
      <div className="flex items-start justify-between">
        <p className={`${textColor}`}>{message}</p>
        <button 
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className="ml-4 inline-flex text-gray-500 hover:text-gray-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
} 