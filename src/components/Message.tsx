import { useEffect, useMemo, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  Attachment,
  MessageActions,
  messageHasAttachments,
  messageHasReactions,
  MessageText,
  ReactionsList,
  renderText,
  useChannelStateContext,
  useMessageContext,
} from 'stream-chat-react';
import clsx from 'clsx';
import emojiData from '@emoji-mart/data';

import Appendix from './Appendix';
import EmojiPicker from './EmojiPicker';
import Avatar from './Avatar';

const Message = () => {
  const { message, isMyMessage, handleAction, readBy, handleRetry } =
    useMessageContext();
  const { channel } = useChannelStateContext('ChannelMessage');
  const { user } = useUser();
  const messageRef = useRef<HTMLDivElement>(null);

  const hasReactions = messageHasReactions(message);
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

  const handleClick = () => {
    if (allowRetry) {
      handleRetry(message);
    }
  };

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
  }, [deliveredAndRead, own]);

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

  return (
    <div
      ref={messageRef}
      onClick={handleClick}
      className={clsx('message', own && 'own')}
    >
      <div className="content-wrapper">
        <div className="message-content relative max-w-[var(--max-width)] bg-[var(--background-color)] shadow-[0_1px_2px_var(--color-default-shadow)] p-[.3125rem_.5rem_.375rem] text-[15px]">
          <div className="content-inner min-w-0">
            <div className="break-words whitespace-pre-wrap leading-[1.3125] block rounded-[.25rem] relative overflow-clip">
              {/* <MessageActions  /> */}
              <div
                className={clsx(
                  message.attachments && message.attachments.length > 0
                    ? 'flex'
                    : 'hidden',
                  'mt-1 mb-1.5 flex-col gap-2'
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
              <div
                className={clsx(
                  'relative top-[.375rem] bottom-auto right-0 flex items-center rounded-[.625rem] px-1 cursor-pointer select-none float-right leading-[1.35] h-[19px] ml-[.4375rem] mr-[-0.375rem]',
                  own && 'text-message-meta-own',
                  !own && 'text-[#686c72bf]'
                )}
              >
                <div className="str-chat__message-reactions-host">
                  {hasReactions && <ReactionsList reverse />}
                </div>
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

export default Message;
