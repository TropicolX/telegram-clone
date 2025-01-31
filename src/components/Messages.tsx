import { useEffect, useRef } from 'react';
import { MessageList } from 'stream-chat-react';

import Message from './Message';

const Messages = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollToTarget = () => {
        const unreadSeparator = scrollRef.current?.querySelector(
          '.str-chat__li.str-chat__unread-messages-separator-wrapper'
        ) as HTMLDivElement | null;

        if (unreadSeparator) {
          // Scroll to the unread separator
          const separatorPosition =
            unreadSeparator.offsetTop -
            (scrollRef.current?.offsetTop as number);

          // Scroll to the unread separator
          scrollRef.current?.scrollTo({
            top: separatorPosition,
            behavior: 'smooth',
          });
        } else {
          // Scroll to the bottom
          scrollRef.current?.scrollTo({
            top: scrollRef.current?.scrollHeight,
            behavior: 'smooth',
          });
        }
      };

      const chatListObserver = new MutationObserver((mutations) => {
        const hasNewLI = mutations.some((mutation) =>
          Array.from(mutation.addedNodes).some(
            (node) =>
              node.nodeType === 1 && (node as HTMLElement).tagName === 'LI'
          )
        );

        if (hasNewLI) {
          scrollToTarget();
        }
      });

      const addChatListObserver = () => {
        const chatList = scrollRef.current?.querySelector('.str-chat__ul');
        if (!chatList) return;
        chatListObserver.observe(chatList, { childList: true });
      };

      const scrollObserver = new MutationObserver(addChatListObserver);
      scrollObserver.observe(scrollRef.current, {
        childList: true,
        subtree: true,
      });

      // Cleanup observers
      return () => {
        scrollObserver.disconnect();
        chatListObserver.disconnect();
      };
    }
  }, [scrollRef]);

  return (
    <div
      ref={scrollRef}
      className="custom-scroll px-8 xl:px-0 flex-1 w-full mb-2 overflow-y-scroll overflow-x-hidden transition-[bottom,_transform] duration-[150ms,_300ms] ease-[ease-out,_cubic-bezier(0.33,1,0.68,1)] xl:transition-transform xl:duration-300 xl:ease-[cubic-bezier(0.33,1,0.68,1)]"
    >
      <div className="flex flex-col justify-end mx-auto min-h-full w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] pt-4 pr-4 pl-[1.125rem]">
        <MessageList Message={Message} />
      </div>
    </div>
  );
};

export default Messages;
