import React, { useState } from 'react';

interface ControlButtonProps {
  onClick: () => void;
  active: boolean;
  activeColor: string;
  inactiveColor?: string;
  tooltip: string;
  className?: string;
  children: React.ReactNode;
}

const ControlButton: React.FC<ControlButtonProps> = ({
  onClick,
  active,
  activeColor,
  inactiveColor = 'bg-gray-600 hover:bg-gray-500',
  tooltip,
  className = '',
  children,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={onClick}
        className={`
          relative flex h-12 w-12 items-center justify-center rounded-full transition-all duration-200 transform hover:scale-105 active:scale-95 ${
            active ? activeColor : inactiveColor
          } ${className}
        `}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {children}
      </button>
      
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 transform whitespace-nowrap">
          <div className="rounded bg-black/80 px-2 py-1 text-xs text-white">
            {tooltip}
          </div>
          <div className="absolute left-1/2 top-full -ml-1 h-2 w-2 -translate-x-1/2 transform rotate-45 bg-black/80"></div>
        </div>
      )}
    </div>
  );
};

export default ControlButton;