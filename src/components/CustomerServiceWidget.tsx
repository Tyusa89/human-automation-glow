import React, { useState } from 'react';
import CustomerServiceAgent from './CustomerServiceAgent';
import { MessageCircle } from 'lucide-react';

const RobotWidget = ({ openChat }: { openChat: () => void }) => {
  return (
    <div
      onClick={openChat}
      className="fixed bottom-6 right-6 w-32 h-32 rounded-full shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform z-[9999]"
    >
      <iframe
        src="https://app.spline.design/community/file/8cfb6748-f3dd-44dd-89fb-f46c7ab4186e"
        frameBorder="0"
        width="100%"
        height="100%"
        title="AI Robot Widget"
      />
    </div>
  );
};

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
    return <RobotWidget openChat={handleOpen} />;
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