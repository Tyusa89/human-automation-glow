import React, { useState } from 'react';
import CustomerServiceAgent from './CustomerServiceAgent';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const CustomerServiceWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={handleOpen}
          className="rounded-full w-14 h-14 bg-emerald-600 hover:bg-emerald-700 shadow-lg animate-pulse"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <CustomerServiceAgent
      onClose={handleClose}
      isMinimized={isMinimized}
      onMinimize={handleMinimize}
      onMaximize={handleMaximize}
    />
  );
};

export default CustomerServiceWidget;