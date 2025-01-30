'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChannelMemberResponse, Channel as ChannelType } from 'stream-chat';
import {
  Channel,
  DefaultStreamChatGenerics,
  MessageInput,
  useChatContext,
  Window,
} from 'stream-chat-react';
import { useUser } from '@clerk/nextjs';

import Appendix from '@/components/Appendix';
import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import DateSeparator from '@/components/DateSeparator';
import EmptyChat from '@/components/EmptyChat';
import Input from '@/components/MessageInput';
import Messages from '@/components/Messages';
import RippleButton from '@/components/RippleButton';
import { getLastSeen } from '@/lib/utils';
import {
  Call,
  MemberRequest,
  useStreamVideoClient,
} from '@stream-io/video-react-sdk';
import { Video } from '../../../components/Video';

const Chat = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const router = useRouter();
  const { user } = useUser();
  const { client: chatClient } = useChatContext();
  const videoClient = useStreamVideoClient();

  const [chatChannel, setChatChannel] =
    useState<ChannelType<DefaultStreamChatGenerics>>();
  const [channelCall, setChannelCall] = useState<Call>();
  const [loading, setLoading] = useState(true);

  const disableCreateCall = !channelCall;

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
  }, [channelId, chatChannel, chatClient, router, videoClient]);

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

  const initiateCall = useCallback(() => {
    const initialMembers = chatChannel?.state.members as Record<
      string,
      ChannelMemberResponse<DefaultStreamChatGenerics>
    >;
    const members = Object.values(initialMembers).map<MemberRequest>(
      (member) => ({
        user_id: member.user?.id as string,
      })
    );

    channelCall?.getOrCreate({
      ring: true,
      data: {
        custom: {
          channelCid: chatChannel?.cid,
          channelName: getChatName(),
        },
        members,
      },
    });
  }, [channelCall, chatChannel?.cid, chatChannel?.state.members, getChatName]);

  if (loading)
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
                    name: '',
                  }}
                  width={40}
                />
              </div>
              {/* Info */}
              <div className="flex flex-col justify-center grow overflow-hidden">
                <div className="flex items-center gap-1"></div>
                <span className="inline text-sm leading-[1.125rem] text-color-text-secondary overflow-hidden truncate"></span>
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
            <div className="custom-scroll flex-1 w-full mb-2 overflow-y-scroll overflow-x-hidden transition-[bottom,_transform] duration-[150ms,_300ms] ease-[ease-out,_cubic-bezier(0.33,1,0.68,1)] xl:transition-transform xl:duration-300 xl:ease-[cubic-bezier(0.33,1,0.68,1)] xl:translate-x-0 xl:translate-y-0"></div>
            <div className="relative flex items-end gap-2 z-10 mb-5 w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] px-4 transition-[top,_transform] duration-[200ms,_300ms] ease-[ease,_cubic-bezier(0.33,1,0.68,1)]">
              <div className="composer-wrapper relative z-[1] grow bg-background max-w-[calc(100%-4rem)] rounded-[var(--border-radius-messages)] rounded-br-none shadow-[0_1px_2px_var(--color-default-shadow)] transition-[transform,_border-bottom-right-radius] duration-200 ease-out">
                <Appendix position="right" />
                <div className="flex opacity-100 transition-opacity duration-200 ease-out">
                  <div className="relative w-8 h-14 ml-3 flex items-center justify-center leading-[1.2] overflow-hidden transition-colors duration-150 uppercase rounded-full self-end shrink-0 text-color-composer-button">
                    <i className="icon icon-smile" />
                  </div>
                  <div className="relative grow">
                    <div className="custom-scroll mr-2 pr-1 min-h-14 max-h-[26rem] overflow-y-auto transition-[height] duration-100 ease-[ease]">
                      <div className="pl-2 py-4"></div>
                    </div>
                  </div>
                  <div className="self-end">
                    <button className="relative w-14 h-14 ml-3 flex items-center justify-center leading-[1.2] overflow-hidden transition-colors duration-150 uppercase rounded-full self-end shrink-0 text-color-composer-button">
                      <i className="icon icon-attach" />
                    </button>
                  </div>
                </div>
              </div>
              <Button className="text-primary" icon="send" />
            </div>
          </div>
        </div>
      </>
    );

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
            <Video />
          </Channel>
        </div>
      </div>
    </>
  );
};

export default Chat;
