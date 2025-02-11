'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChannelMemberResponse, Channel as ChannelType } from 'stream-chat';
import { useUser } from '@clerk/nextjs';
import {
  Channel,
  DefaultStreamChatGenerics,
  MessageInput,
  useChatContext,
  Window,
} from 'stream-chat-react';
import {
  Call,
  CallingState,
  MemberRequest,
  useCalls,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';

import Avatar from '@/components/Avatar';
import Calls from '@/components/Calls';
import ChannelLoading from '@/components/ChannelLoading';
import ChatLoading from '@/components/ChatLoading';
import DateSeparator from '@/components/DateSeparator';
import EmptyChat from '@/components/EmptyChat';
import { getLastSeen } from '@/lib/utils';
import Input from '@/components/MessageInput';
import Messages from '@/components/Messages';
import RippleButton from '@/components/RippleButton';

const Chat = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { client: chatClient } = useChatContext();
  const videoClient = useStreamVideoClient();
  const [activeCall] = useCalls();

  const [chatChannel, setChatChannel] =
    useState<ChannelType<DefaultStreamChatGenerics>>();
  const [channelCall, setChannelCall] = useState<Call>();
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const disableCreateCall = !channelCall;
  const callActive = activeCall?.cid === channelCall?.cid;

  useEffect(() => {
    const loadChannel = async () => {
      const chatChannel = chatClient.channel('messaging', channelId);
      await chatChannel.watch();

      const channelCall = videoClient?.call('default', channelId);
      setChannelCall(channelCall);
      setChatChannel(chatChannel);
      setLoading(false);
    };

    if (chatClient && !chatChannel) loadChannel();
  }, [channelId, chatChannel, chatClient, videoClient]);

  useEffect(() => {
    if (activeCall?.state.callingState === CallingState.RINGING) {
      setIsModalOpen(true);
    }
  }, [activeCall]);

  const isDMChannel = useMemo(
    () => chatChannel?.id?.startsWith('!members'),
    [chatChannel?.id]
  );

  const getDMUser = useCallback(() => {
    if (!chatChannel || !user) return;
    const members = { ...chatChannel.state.members };
    delete members[user!.id];
    return Object.values(members)[0].user!;
  }, [chatChannel, user]);

  const getChatName = useCallback(() => {
    if (!chatChannel || !user) return;
    if (isDMChannel) {
      const member = getDMUser()!;
      return member.name || `${member.first_name} ${member.last_name}`;
    } else {
      return chatChannel?.data?.name as string;
    }
  }, [chatChannel, user, isDMChannel, getDMUser]);

  const getImage = useCallback(() => {
    if (!chatChannel || !user) return;
    if (isDMChannel) {
      const member = getDMUser()!;
      return member.image;
    } else {
      return chatChannel?.data?.image;
    }
  }, [chatChannel, user, isDMChannel, getDMUser]);

  const getSubText = useCallback(() => {
    if (!chatChannel || !user) return;
    if (isDMChannel) {
      const member = getDMUser()!;
      return member.online ? 'Online' : getLastSeen(member.last_active!);
    } else {
      return chatChannel?.data?.member_count?.toLocaleString() + ' members';
    }
  }, [chatChannel, user, isDMChannel, getDMUser]);

  const initiateCall = useCallback(async () => {
    if (channelCall && channelCall.state.callingState === CallingState.JOINED) {
      await channelCall?.leave();
    }

    const initialMembers = chatChannel?.state.members as Record<
      string,
      ChannelMemberResponse<DefaultStreamChatGenerics>
    >;
    const members = Object.values(initialMembers).map<MemberRequest>(
      (member) => ({
        user_id: member.user?.id as string,
        name: member.user?.name as string,
        role: isDMChannel ? 'admin' : undefined,
      })
    );

    await channelCall?.getOrCreate({
      ring: true,
      data: {
        custom: {
          channelCid: chatChannel?.cid,
          channelName: getChatName(),
          isDMChannel,
          members,
        },
        members,
      },
    });

    await channelCall?.update({
      custom: {
        triggeredBy: user?.id,
        members,
      },
    });

    if (!isDMChannel) {
      channelCall?.join();
    }
    setChannelCall(channelCall);
    setIsModalOpen(true);
  }, [
    channelCall,
    chatChannel?.cid,
    chatChannel?.state.members,
    getChatName,
    isDMChannel,
    user,
  ]);

  const onCloseModal = async () => {
    setIsModalOpen(false);
  };

  if (loading) return <ChannelLoading />;

  return (
    <>
      <div className="flex items-center px-2 w-full bg-background relative z-10 py-1 md:pl-[23px] md:pr-[13px] shrink-0 h-[3.5rem]">
        {/* Chat Info */}
        <div className="flex grow overflow-hidden gap-2">
          <div className="lg:hidden [&>button]:pe-2">
            <RippleButton
              icon="arrow-left text-3xl ml-1"
              onClick={() => router.push('/a')}
            />
          </div>
          <div className="flex items-center cursor-pointer py-[.0625rem] pl-[.0625rem]">
            {/* Avatar */}
            <div className="w-10 h-10 mr-[.625rem] text-[1.0625rem]">
              <Avatar
                data={{
                  name: getChatName()!,
                  image: getImage(),
                }}
                width={40}
              />
            </div>
            {/* Info */}
            <div className="flex flex-col justify-center grow overflow-hidden">
              <div className="flex items-center gap-1">
                <h3 className="text-[1.0625rem] font-semibold leading-[1.375rem] whitespace-pre overflow-hidden text-ellipsis">
                  {getChatName()}
                </h3>
              </div>
              <span className="inline text-sm leading-[1.125rem] text-color-text-secondary overflow-hidden truncate">
                <span>{getSubText()}</span>
              </span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-1">
          <RippleButton icon="search" />
          <RippleButton
            icon="phone"
            onClick={initiateCall}
            disabled={disableCreateCall}
          />
          <RippleButton icon="more" />
        </div>
        {/* Active Call */}
        {callActive && (
          <div className="absolute top-[3.5rem] left-0 w-full z-[11] before:content-[''] before:absolute before:-top-0.5 before:h-0.5 before:left-0 before:right-0 before:z-[-100] before:shadow-[0_2px_2px_var(--color-light-shadow)]">
            <div className="absolute border-t border-t-color-borders top-0 z-[-1] w-full h-[2.875rem] flex justify-between items-center cursor-pointer px-3 py-[.375rem] bg-background">
              <div className="flex flex-col leading-4">
                <span className="text-[.875rem] text-black">Ongoing Call</span>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 h-[1.875rem] rounded-[1rem] border border-primary bg-primary text-white uppercase text-base font-medium"
              >
                Join
              </button>
            </div>
          </div>
        )}
      </div>
      <div id="channel" className="relative w-full h-full overflow-hidden">
        <div className="flex flex-col grow items-center w-full h-full">
          <Channel
            LoadingIndicator={ChatLoading}
            channel={chatChannel}
            DateSeparator={DateSeparator}
            EmptyStateIndicator={EmptyChat}
          >
            <Window>
              <Messages />
              <MessageInput Input={Input} />
            </Window>
            <Calls isModalOpen={isModalOpen} onClose={onCloseModal} />
          </Channel>
        </div>
      </div>
    </>
  );
};

export default Chat;
