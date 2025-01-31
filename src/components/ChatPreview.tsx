import { useCallback, useMemo } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { ChannelPreviewUIComponentProps } from 'stream-chat-react';
import clsx from 'clsx';

import Avatar from './Avatar';
import { useUser } from '@clerk/nextjs';
import { StreamTheme, useCalls } from '@stream-io/video-react-sdk';

const ChatPreview = ({
  channel,
  displayTitle,
  unread,
  displayImage,
  lastMessage,
}: ChannelPreviewUIComponentProps) => {
  const { user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [activeCall] = useCalls();

  const callActive = activeCall?.id === channel.id;

  const goToChat = () => {
    const channelId = channel.id;
    router.push(`/a/${channelId}`);
  };

  const getDMUser = useCallback(() => {
    const members = { ...channel.state.members };
    delete members[user!.id];
    return Object.values(members)[0].user!;
  }, [channel.state.members, user]);

  const getChatName = useCallback(() => {
    if (displayTitle) return displayTitle;
    else {
      const member = getDMUser();
      return member.name || `${member.first_name} ${member.last_name}`;
    }
  }, [displayTitle, getDMUser]);

  const getImage = useCallback(() => {
    if (displayImage) return displayImage;
    else {
      const member = getDMUser();
      return member.image;
    }
  }, [displayImage, getDMUser]);

  const lastText = useMemo(() => {
    if (lastMessage) {
      return lastMessage.text;
    }
    const isDMChannel = channel.id?.startsWith('!members');

    if (isDMChannel) {
      return `${getChatName()} joined Telegram`;
    } else {
      return `${
        // @ts-expect-error one of these will be defined
        channel.data?.created_by?.first_name ||
        // @ts-expect-error one of these will be defined
        channel.data?.created_by?.name.split(' ')[0]
      } created the group "${displayTitle}"`;
    }
  }, [
    lastMessage,
    channel.id,
    channel.data?.created_by,
    getChatName,
    displayTitle,
  ]);

  const lastMessageDate = useMemo(() => {
    const date = new Date(
      lastMessage?.created_at || (channel.data?.created_at as string)
    );
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
    } else if (date.getFullYear() === today.getFullYear()) {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }
  }, [lastMessage, channel.data?.created_at]);

  const active = useMemo(() => {
    const pathChannelId = pathname.split('/').filter(Boolean).pop();
    return pathChannelId === channel.id;
  }, [pathname, channel.id]);

  return (
    <div
      className={clsx(
        'relative p-[.5625rem] cursor-pointer min-h-auto overflow-hidden flex items-center rounded-xl whitespace-nowrap gap-2',
        active && 'bg-chat-active text-white',
        !active && 'bg-background text-color-text hover:bg-chat-hover'
      )}
      onClick={goToChat}
    >
      <div className="relative">
        <Avatar
          data={{
            name: getChatName(),
            image: getImage(),
          }}
          width={54}
        />
        {callActive && (
          <StreamTheme>
            <div className="absolute bottom-0.5 right-0 w-4 h-4 flex items-center justify-center bg-white border-2 border-primary rounded-full">
              <span className="str-video__speech-indicator str-video__speech-indicator--speaking">
                <span className="str-video__speech-indicator__bar !w-0.5 !h-1/2" />
                <span className="str-video__speech-indicator__bar !w-0.5 !h-1/2" />
                <span className="str-video__speech-indicator__bar !w-0.5 !h-1/2" />
              </span>
            </div>
          </StreamTheme>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-start overflow-hidden">
          <div className="flex items-center justify-start overflow-hidden gap-1">
            <h3 className="font-semibold truncate text-base">
              {getChatName()}
            </h3>
          </div>
          <div className="grow min-w-2" />
          <div className="flex items-center shrink-0 mr-[.1875rem] text-[.75rem]">
            <span className={active ? 'text-white' : 'text-color-text-meta'}>
              {lastMessageDate}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-start truncate">
          <p
            className={clsx(
              'truncate text-[.9375rem] text-left pr-1 grow',
              active && 'text-white',
              !active && 'text-color-text-secondary'
            )}
          >
            {lastText}
          </p>
          {unread !== undefined && unread > 0 && (
            <div
              className={clsx(
                'min-w-6 h-6 shrink-0 rounded-xl text-sm leading-6 text-center py-0 px-[.4375rem] font-medium',
                active && 'bg-white text-primary',
                !active && 'bg-green text-white'
              )}
            >
              <span className="inline-flex whitespace-pre">{unread}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
