import {
  MouseEvent,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Attachment,
  MessageText,
  renderText,
  useChannelStateContext,
  useMessageContext,
} from 'stream-chat-react';
import clsx from 'clsx';
import emojiData from '@emoji-mart/data';

import Appendix from './Appendix';
import EmojiPicker from './EmojiPicker';
import Avatar from './Avatar';
import useClickOutside from '../hooks/useClickOutside';
import useIsMobile from '../hooks/useIsMobile';
import useClampPopup from '../hooks/useClampPopup';

const Message = () => {
  const { message, isMyMessage, handleAction, readBy, handleRetry } =
    useMessageContext();
  const { channel } = useChannelStateContext('ChannelMessage');
  const { user } = useUser();
  const messageRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const popupRef = useClickOutside(() => {
    setShowPopup(false);
  }) as RefObject<HTMLDivElement>;
  const isMobile = useIsMobile();
  const [showPopup, setShowPopup] = useState(false);
  const [popupPosition, setPopupPosition] = useState({
    x: 0,
    y: 0,
  });

  const isDMChannel = channel?.id?.startsWith('!members');
  const own = isMyMessage();
  const createdAt = new Date(message.created_at!).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });
  const justReadByMe =
    readBy?.length === 0 || (readBy?.length === 1 && readBy[0].id === user?.id);
  const sending = message.status === 'sending';
  const delivered = message.status === 'received';
  const deliveredAndRead = delivered && !justReadByMe;
  const allowRetry =
    message.status === 'failed' && message.errorStatusCode !== 403;

  useClampPopup({
    wrapperRef,
    popupRef,
    showPopup,
    popupPosition,
    setPopupPosition,
  });

  useEffect(() => {
    if (!own || !deliveredAndRead) return;

    const message = messageRef.current;
    if (message) {
      const parentLi = message?.parentElement;
      let lastLi = parentLi?.previousElementSibling as HTMLElement;

      while (lastLi) {
        const status = lastLi.querySelector('.delivery-status');
        if (status) {
          status.classList.add('icon-message-read');
          status.classList.remove('icon-message-succeeded');
        }
        lastLi = lastLi.previousElementSibling as HTMLElement;
      }
    }
  }, [deliveredAndRead, messageRef, own]);

  const reactionCounts = useMemo(() => {
    if (!message.reaction_groups) {
      return [];
    }
    return Object.entries(
      Object.entries(message.reaction_groups!)
        ?.sort(
          (a, b) =>
            new Date(a[1].first_reaction_at!).getTime() -
            new Date(b[1].first_reaction_at!).getTime()
        )
        .reduce((acc, entry) => {
          const [type, event] = entry;
          acc[type] = acc[type] || { count: 0, reacted: false };
          acc[type].count = event.count;
          if (
            message.own_reactions?.some(
              (reaction) =>
                reaction.type === type && reaction.user_id === user!.id
            )
          ) {
            acc[type].reacted = true;
          }
          return acc;
        }, {} as Record<string, { count: number; reacted: boolean }>)
    );
  }, [message.reaction_groups, message.own_reactions, user]);

  const handleReaction = async (e: { id: string; native?: string }) => {
    await channel.sendReaction(message.id, { type: e.id });
  };

  const removeReaction = async (reactionType: string) => {
    await channel.deleteReaction(message.id, reactionType);
  };

  const handleReactionClick = async (
    reactionType: string,
    isActive: boolean
  ) => {
    if (isActive) {
      removeReaction(reactionType);
    } else {
      handleReaction({ id: reactionType });
    }
  };

  const getReactionEmoji = (reactionType: string) => {
    const data = emojiData as {
      emojis: {
        [key: string]: { skins: { native: string }[] };
      };
    };
    const emoji = data.emojis[reactionType];
    if (emoji) return emoji.skins[0].native;
    return null;
  };

  const setPosition = (e: MouseEvent<HTMLDivElement>) => {
    const containerRect =
      messageRef?.current?.getBoundingClientRect() as DOMRect;
    const top = e.clientY - containerRect.top + 10;
    const left = e.clientX - containerRect.left + 10;

    setPopupPosition({ x: left, y: top });
    setShowPopup(true);
  };

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    if (allowRetry) {
      handleRetry(message);
    }

    if (isMobile && !showPopup) {
      e.preventDefault();
      setPosition(e);
    }
  };

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    e.preventDefault();

    if (showPopup) return setShowPopup(false);
    setPosition(e);
  };

  return (
    <div
      ref={messageRef}
      className={clsx(
        'message before:absolute before:bg-[#4A8E3A8C] before:top-[-0.1875rem] before:bottom-[-0.1875rem] before:left-[-50vw] before:right-[-50vw] before:z-0 before:transition-opacity before:duration-200 before:ease-out',
        showPopup ? 'before:opacity-55' : 'before:opacity-0',
        own && 'own'
      )}
      onClick={handleClick}
      onContextMenu={!isMobile ? handleContextMenu : undefined}
    >
      {showPopup && (
        <div className="fixed z-[1] top-0 left-0 w-full h-full"></div>
      )}
      <div ref={wrapperRef} className="relative content-wrapper">
        {/* Popup */}
        {showPopup && (
          <div
            ref={popupRef}
            className="absolute flex flex-col w-[200px] py-1 z-10 bg-background-compact-menu backdrop-blur-[10px] shadow-[0_.25rem_.5rem_.125rem_var(--color-default-shadow)] rounded-xl"
            style={{ top: popupPosition.y, left: popupPosition.x }}
          >
            <EmojiPicker
              buttonIcon={
                <>
                  <i className="icon icon-smile" />
                  Add reaction
                </>
              }
              wrapperClassName="contents"
              buttonClassName="flex grow relative items-center whitespace-nowrap hover:bg-background-compact-menu-hover text-black text-sm leading-6 mx-1 my-[.125rem] p-1 pe-3 rounded-[.375rem] font-medium [&>i]:max-w-5 [&>i]:text-[1.25rem] [&>i]:ms-2 [&>i]:me-[1.25rem] [&>i]:mr-4 [&>i]:text-[#707579]"
              onEmojiSelect={handleReaction}
            />
            <MenuItem label="Reply" icon="reply" />
            <MenuItem label="Copy Text" icon="copy" />
            <MenuItem label="Forward" icon="forward" />
            <MenuItem label="Select" icon="select" />
            <MenuItem label="Report" icon="flag" />
          </div>
        )}
        <div className="message-content relative max-w-[var(--max-width)] bg-[var(--background-color)] shadow-[0_1px_2px_var(--color-default-shadow)] p-[.3125rem_.5rem_.375rem] text-[15px]">
          <div className="content-inner min-w-0">
            <div className="break-words whitespace-pre-wrap leading-[1.3125] block rounded-[.25rem] relative overflow-clip">
              <div
                className={clsx(
                  message.attachments && message.attachments.length > 0
                    ? 'flex'
                    : 'hidden',
                  'mt-1 mb-1.5 flex-col gap-2 [&>div]:max-w-[315px] sm:[&>div]:max-w-none'
                )}
              >
                {message.attachments?.length && !message.quoted_message ? (
                  <Attachment
                    actionHandler={handleAction}
                    attachments={message.attachments}
                  />
                ) : null}
              </div>
              <MessageText
                renderText={(text, mentionedUsers) =>
                  renderText(text, mentionedUsers, {
                    customMarkDownRenderers: {
                      br: () => <span className="paragraph_break block h-2" />,
                    },
                  })
                }
                customWrapperClass="contents"
                customInnerClass="contents [&>*]:contents [&>*>*]:contents"
              />
              {reactionCounts.length > 0 && (
                <div className="flex-shrink flex items-center gap-1 flex-wrap mt-2 mr-[62px]">
                  {reactionCounts.map(([reactionType, data], index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleReactionClick(reactionType, data.reacted)
                      }
                      className={clsx(
                        'px-2 mb-1 h-[30px] flex items-center gap-1.5 border text-[11.8px] rounded-full transition-colors',
                        data.reacted &&
                          own &&
                          'text-white bg-[#45af54] border-[#45af54] hover:bg-[#3f9d4b] hover:border-[#3f9d4b]',
                        !data.reacted &&
                          own &&
                          'text-[#45af54] bg-[#c6eab2] border-[#c6eab2] hover:bg-[#b5e0a4] hover:border-[#b5e0a4]',
                        data.reacted &&
                          !own &&
                          'text-white bg-[#3390ec] border-[#3390ec] hover:bg-[#1a82ea] hover:border-[#1a82ea]',
                        !data.reacted &&
                          !own &&
                          'text-[#3390ec] bg-[#ebf3fd] border-[#ebf3fd] hover:bg-[#c5def9] hover:border-[#c5def9]'
                      )}
                    >
                      <span className="emoji text-[16px] mt-[1px]">
                        {getReactionEmoji(reactionType)}
                      </span>{' '}
                      <span className="text-sm font-medium whitespace-pre">
                        {data.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div
                className={clsx(
                  'relative top-[.375rem] bottom-auto right-0 flex items-center rounded-[.625rem] px-1 cursor-pointer select-none float-right leading-[1.35] h-[19px] ml-[.4375rem] mr-[-0.375rem]',
                  own && 'text-message-meta-own',
                  !own && 'text-[#686c72bf]',
                  reactionCounts.length > 0 && '-mt-5'
                )}
              >
                <div className="mr-1 text-[.75rem] whitespace-nowrap">
                  {createdAt}
                </div>
                {own && (
                  <div className="overflow-hidden inline-block leading-[1] text-accent-own ml-[-0.1875rem] rounded-[.625rem] shrink-0">
                    <i
                      className={clsx(
                        'delivery-status icon pl-[.125rem] text-[1.1875rem]',
                        sending && 'icon-message-pending',
                        delivered &&
                          !deliveredAndRead &&
                          'icon-message-succeeded',
                        deliveredAndRead && 'icon-message-read'
                      )}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          {own && <Appendix className="hidden" position="right" />}
          {!own && <Appendix className="hidden" />}
          {!own && !isDMChannel && (
            <div className="message-dp absolute w-[2.125rem] h-[2.125rem] left-[-2.5rem] bottom-[.0625rem] overflow-hidden">
              <Avatar
                data={{
                  name: message.user?.name as string,
                  image: message.user?.image as string,
                }}
                width={34}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface MenuItem {
  label: string;
  onClick?: () => void;
  icon: string;
}

const MenuItem = ({ label, onClick, icon }: MenuItem) => {
  return (
    <button
      onClick={onClick}
      className="flex grow relative items-center whitespace-nowrap hover:bg-background-compact-menu-hover text-black text-sm leading-6 mx-1 my-[.125rem] p-1 pe-3 rounded-[.375rem] font-medium [&>i]:max-w-5 [&>i]:text-[1.25rem] [&>i]:ms-2 [&>i]:me-[1.25rem] [&>i]:mr-4 [&>i]:text-[#707579]"
    >
      <i className={`icon icon-${icon}`} />
      {label}
    </button>
  );
};

export default Message;
