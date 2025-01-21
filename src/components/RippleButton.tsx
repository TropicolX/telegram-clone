import React from 'react';

interface RippleButtonProps {
  icon: string;
  onClick?: () => void;
}

const RippleButton = ({ icon, onClick }: RippleButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="relative w-[2.5rem] h-[2.5rem] rounded-full p-[.3125rem] bg-transparent text-color-text-secondary flex items-center justify-center leading-[1.2] shrink-0 overflow-hidden transition-colors duration-150 uppercase hover:bg-interactive-element-hover"
    >
      <i className={`icon icon-${icon}`} aria-hidden="true" />
    </button>
  );
};

export default RippleButton;
