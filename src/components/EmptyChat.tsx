import { EmptyStateIndicatorProps } from 'stream-chat-react';

const EmptyChat = ({}: EmptyStateIndicatorProps) => {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center text-center gap-2">
      <div className="inline-flex flex-col items-center bg-[#4A8E3A8C] w-[14.5rem] py-3 px-4 text-white rounded-3xl">
        <p className="font-medium">No messages here yet...</p>
        <p className="text-[.9375rem]">
          Send a message or send a greeting below
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;
