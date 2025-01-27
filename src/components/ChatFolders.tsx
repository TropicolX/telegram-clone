import {
  ChannelList,
  ChannelSearch,
  ChannelSearchProps,
} from 'stream-chat-react';
import ChatPreview from './ChatPreview';
import { useUser } from '@clerk/nextjs';

const ChatFolders = ({}: ChannelSearchProps) => {
  const { user } = useUser();

  return (
    <div className="flex-1 overflow-hidden relative w-full h-[calc(100%-3.5rem)]">
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex-1 overflow-hidden relative w-full h-full">
          <div className="w-full h-full">
            <div className="custom-scroll p-2 overflow-y-scroll overflow-x-hidden h-full bg-background pe-[0px]">
              <ChannelList
                Preview={ChatPreview}
                ChannelSearch={ChannelSearch}
                sort={{
                  created_at: 1,
                }}
                filters={{
                  members: { $in: [user!.id] },
                }}
                showChannelSearch
                additionalChannelSearchProps={{}}
                LoadingIndicator={() => null}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFolders;
