import { useEffect, useRef } from 'react';
import { MessageList } from 'stream-chat-react';

import Message from './Message';

const Messages = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollToBottom = () => {
        scrollRef.current?.scrollTo({
          top: scrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      };

      // MutationObserver to detect changes in the DOM (like new messages added)
      const observer = new MutationObserver(scrollToBottom);
      observer.observe(scrollRef.current, { childList: true, subtree: true });

      scrollToBottom();

      // Cleanup observer on component unmount
      return () => observer.disconnect();
    }
  }, [scrollRef]);

  return (
    <div
      ref={scrollRef}
      className="custom-scroll flex-1 w-full mb-2 overflow-y-scroll overflow-x-hidden transition-[bottom,_transform] duration-[150ms,_300ms] ease-[ease-out,_cubic-bezier(0.33,1,0.68,1)] xl:transition-transform xl:duration-300 xl:ease-[cubic-bezier(0.33,1,0.68,1)] xl:translate-x-0 xl:translate-y-0"
    >
      <div className="flex flex-col justify-end mx-auto min-h-full w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] pt-4 pr-4 pl-[1.125rem]">
        <MessageList Message={Message} />
      </div>
    </div>
  );
};

export default Messages;
