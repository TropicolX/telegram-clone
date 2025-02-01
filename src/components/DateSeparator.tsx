import { DateSeparatorProps } from 'stream-chat-react';

import { formatDate } from '@/lib/utils';

const DateSeparator = ({ date }: DateSeparatorProps) => {
  return (
    <div className="sticky top-[.625rem] text-center select-none cursor-pointer my-4 z-[9] pointer-events-none opacity-100 transition-opacity duration-300 ease-[ease]">
      <div className="relative inline-block bg-[#4A8E3A8C] text-white text-sm leading-[16.5px] font-medium py-[.1875rem] px-2 rounded-full z-0 break-words">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default DateSeparator;
