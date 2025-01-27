import { DateSeparatorProps } from 'stream-chat-react';

function getOrdinalSuffix(day: number) {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

const DateSeparator = ({ date }: DateSeparatorProps) => {
  function formatDate(date: Date) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const isToday = date >= today;
    const isYesterday = date >= yesterday && date < today;

    if (isToday) {
      return 'Today';
    } else if (isYesterday) {
      return 'Yesterday';
    } else {
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      };
      const day = date.getDate();
      const suffix = getOrdinalSuffix(day);
      return `${date.toLocaleDateString('en-US', options)}${suffix}`;
    }
  }

  return (
    <div className="sticky top-[.625rem] text-center select-none cursor-pointer my-4 z-[9] pointer-events-none opacity-100 transition-opacity duration-300 ease-[ease]">
      <div className="relative inline-block bg-[#4A8E3A8C] text-white text-sm leading-[16.5px] font-medium py-[.1875rem] px-2 rounded-full z-0 break-words">
        {formatDate(date)}
      </div>
    </div>
  );
};

export default DateSeparator;
