import clsx from 'clsx';
import { ReactNode } from 'react';

interface ButtonProps {
  active?: boolean;
  children?: ReactNode;
  className?: string;
  icon: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  active = false,
  className,
  children,
  disabled = false,
  icon,
  onClick,
}: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'relative w-[3.5rem] h-[3.5rem] rounded-full p-[.625rem] shadow-[0_1px_2px_var(--color-default-shadow)] flex items-center justify-center leading-[1.2] shrink-0 overflow-hidden transition-colors duration-150 uppercase',
        active && 'bg-primary text-white hover:bg-primary-shade',
        !active &&
          'bg-background text-[#707579bf] hover:bg-primary hover:text-white',
        className
      )}
      disabled={disabled}
    >
      <i className={`icon icon-${icon}`} aria-hidden="true" />
      {children}
    </button>
  );
};

export default Button;
