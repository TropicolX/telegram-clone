import { useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  messageHasAttachments,
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

const Message = () => {
  const { message, messageIsUnread, isMyMessage } = useMessageContext();
  const { channel } = useChannelStateContext('ChannelMessage');
  const { user } = useUser();

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

  const createdAt = new Date(message.created_at!).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
  });

  const downloadFile = async (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = url.split('/').pop()!;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const own = isMyMessage();

  return (
    <div className={clsx('message', own && 'own')}>
      <div className="content-wrapper">
        <div className="message-content relative max-w-[var(--max-width)] bg-[var(--background-color)] shadow-[0_1px_2px_var(--color-default-shadow)] p-[.3125rem_.5rem_.375rem] text-[15px]">
          <div className="content-inner min-w-0">
            <div className="break-words whitespace-pre-wrap leading-[1.3125] block rounded-[.25rem] relative overflow-clip">
              <div
                className={clsx(
                  message.attachments && message.attachments.length > 0
                    ? 'flex'
                    : 'hidden',
                  'mt-3 flex-col gap-2'
                )}
              >
                {message.attachments?.map((attachment) => (
                  <div
                    key={
                      attachment?.id ||
                      attachment.image_url ||
                      attachment.asset_url
                    }
                    className={clsx(
                      'group/attachment relative cursor-pointer flex items-center rounded-xl gap-3 border border-[#d6d6d621] bg-[#1a1d21]',
                      attachment?.image_url && !attachment.asset_url
                        ? 'max-w-[360px] p-0'
                        : 'max-w-[426px] p-3'
                    )}
                  >
                    {attachment.asset_url && (
                      <>
                        <Avatar
                          width={32}
                          borderRadius={8}
                          data={{
                            name: attachment!.title!,
                            image: attachment!.image_url!,
                          }}
                        />
                        <div className="flex flex-col gap-0.5">
                          <p className="text-sm text-[#d1d2d3] break-all whitespace-break-spaces line-clamp-1 mr-2">
                            {attachment.title || `attachment`}
                          </p>
                          <p className="text-[13px] text-[#ababad] break-all whitespace-break-spaces line-clamp-1">
                            {attachment.type}
                          </p>
                        </div>
                      </>
                    )}
                    {attachment.image_url && !attachment.asset_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={attachment.image_url}
                        alt="attachment"
                        className="w-full max-h-[358px] aspect-auto rounded-lg"
                      />
                    )}
                    {/* Message Actions */}
                  </div>
                ))}
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
                <div className="mr-1 text-[.75rem] whitespace-nowrap">
                  {createdAt}
                </div>
                {own && (
                  <div className="w-[1.1875rem] h-[1.1875rem] overflow-hidden inline-block leading-[1] text-accent-own ml-[-0.1875rem] rounded-[.625rem] shrink-0">
                    <i className="icon icon-message-succeeded pl-[.125rem] text-[1.1875rem]" />
                  </div>
                )}
              </div>
            </div>
          </div>
          {own && <Appendix className="hidden" position="right" />}
          {!own && <Appendix className="hidden" />}
          {!own && (
            <div className="absolute w-[2.125rem] h-[2.125rem] left-[-2.5rem] bottom-[.0625rem] overflow-hidden">
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
