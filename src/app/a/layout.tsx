'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import { StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk';

import PageLoading from '../../components/PageLoading';
import Sidebar from '@/components/Sidebar';

interface LayoutProps {
  children?: ReactNode;
}

const tokenProvider = async (userId: string) => {
  const response = await fetch('/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: userId }),
  });
  const data = await response.json();
  return data.token;
};

const API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY as string;

export default function Layout({ children }: LayoutProps) {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [chatClient, setChatClient] = useState<StreamChat>();
  const [videoClient, setVideoClient] = useState<StreamVideoClient>();

  useEffect(() => {
    const customProvider = async () => {
      const token = await tokenProvider(user!.id);
      return token;
    };

    const setUpChatAndVideo = async () => {
      const chatClient = StreamChat.getInstance(API_KEY);
      const clerkUser = user!;
      const chatUser = {
        id: clerkUser.id,
        name: clerkUser.fullName!,
        image: clerkUser.hasImage ? clerkUser.imageUrl : undefined,
        custom: {
          username: clerkUser.username,
        },
      };

      if (!chatClient.user) {
        await chatClient.connectUser(chatUser, customProvider);
      }

      setChatClient(chatClient);
      const videoClient = StreamVideoClient.getOrCreateInstance({
        apiKey: API_KEY,
        user: chatUser,
        tokenProvider: customProvider,
      });
      setVideoClient(videoClient);
      setLoading(false);
    };

    if (user) setUpChatAndVideo();
  }, [user, videoClient, chatClient]);

  if (loading) return <PageLoading />;

  return (
    <Chat client={chatClient!}>
      <StreamVideo client={videoClient!}>
        <div className="flex h-full w-full">
          <Sidebar />
          <div className="relative flex flex-col items-center w-full h-full overflow-hidden border-l border-solid border-l-color-borders">
            <div className="chat-background absolute top-0 left-0 w-full h-full -z-10 overflow-hidden bg-theme-background"></div>
            {children}
          </div>
        </div>
      </StreamVideo>
    </Chat>
  );
}
