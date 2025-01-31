import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import {
  ChannelList,
  ChannelSearchProps,
  useChatContext,
} from 'stream-chat-react';

import ChatPreview from './ChatPreview';
import SearchBar from './SearchBar';
import Spinner from './Spinner';

const ChatFolders = ({}: ChannelSearchProps) => {
  const { user } = useUser();
  const { client } = useChatContext();
  const router = useRouter();

  return (
    <div className="flex-1 overflow-hidden relative w-full h-[calc(100%-3.5rem)]">
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex-1 overflow-hidden relative w-full h-full">
          <div className="w-full h-full">
            <div className="custom-scroll p-2 overflow-y-scroll overflow-x-hidden h-full bg-background pe-2 min-[820px]:pe-[0px]">
              <ChannelList
                Preview={ChatPreview}
                sort={{
                  last_message_at: -1,
                }}
                filters={{
                  members: { $in: [client.userID!] },
                }}
                showChannelSearch
                additionalChannelSearchProps={{
                  searchForChannels: true,
                  onSelectResult: async (_, result) => {
                    if (result.cid) {
                      router.push(`/a/${result.id}`);
                    } else {
                      const channel = client.getChannelByMembers('messaging', {
                        members: [user!.id, result.id!],
                      });
                      await channel.create();
                      router.push(`/a/${channel.data?.id}`);
                    }
                  },
                  SearchBar: SearchBar,
                }}
                LoadingIndicator={() => (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="relative w-12 h-12">
                      <Spinner color="var(--color-primary)" />
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFolders;
