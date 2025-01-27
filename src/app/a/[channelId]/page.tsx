'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Channel as ChannelType } from 'stream-chat';
import {
  Channel,
  DefaultStreamChatGenerics,
  MessageInput,
  useChatContext,
  Window,
} from 'stream-chat-react';
// import { useCalls } from '@stream-io/video-react-sdk';

import Avatar from '@/components/Avatar';
import DateSeparator from '@/components/DateSeparator';
import Input from '@/components/MessageInput';
import RippleButton from '@/components/RippleButton';
import EmptyChat from '../../../components/EmptyChat';
import Messages from '../../../components/Messages';

const Chat = () => {
  const { channelId } = useParams<{ channelId: string }>();
  // const router = useRouter();

  // const [currentCall] = useCalls();
  const { client: chatClient } = useChatContext();

  const [chatChannel, setChatChannel] =
    useState<ChannelType<DefaultStreamChatGenerics>>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChannel = async () => {
      const chatChannel = chatClient.channel('messaging', channelId);

      await chatChannel.create();

      // if (currentCall?.id === channelId) {
      //   setChannelCall(currentCall);
      // } else {
      //   const channelCall = videoClient?.call('default', channelId);
      //   setChannelCall(channelCall);
      // }

      setChatChannel(chatChannel);
      setLoading(false);
    };

    if (chatClient && !chatChannel) loadChannel();
  }, [channelId, chatChannel, chatClient]);

  if (loading) return null;

  return (
    <>
      <div className="flex items-center w-full bg-background relative z-10 py-1 pl-[23px] pr-[13px] shrink-0 h-[3.5rem]">
        {/* Chat Info */}
        <div className="grow overflow-hidden">
          <div className="flex items-center cursor-pointer py-[.0625rem] pl-[.0625rem]">
            {/* Avatar */}
            <div className="w-10 h-10 mr-[.625rem] text-[1.0625rem]">
              <Avatar
                data={{
                  name: chatChannel?.data?.name as string,
                  image: chatChannel?.data?.image,
                }}
                width={40}
              />
            </div>
            {/* Info */}
            <div className="flex flex-col justify-center grow overflow-hidden">
              <div className="flex items-center gap-1">
                <h3 className="text-[1.0625rem] font-semibold leading-[1.375rem] whitespace-pre overflow-hidden text-ellipsis">
                  {chatChannel?.data?.name}
                </h3>
              </div>
              <span className="inline text-sm leading-[1.125rem] text-color-text-secondary overflow-hidden truncate">
                <span>last seen recently</span>
              </span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-1">
          <RippleButton icon="search" />
          <RippleButton icon="phone" />
          <RippleButton icon="more" />
        </div>
      </div>
      <div id="channel" className="relative w-full h-full overflow-hidden">
        <div className="flex flex-col grow items-center w-full h-full">
          <Channel
            LoadingIndicator={() => <div>Loading...</div>}
            channel={chatChannel}
            DateSeparator={DateSeparator}
            EmptyStateIndicator={EmptyChat}
          >
            <Window>
              <Messages />
              <MessageInput Input={Input} />
            </Window>
          </Channel>
        </div>
      </div>
    </>
  );
};

export default Chat;
