import ChatPreview from './ChatPreview';

const ChatFolders = () => {
  const active = false;

  return (
    <div className="flex-1 overflow-hidden relative w-full h-[calc(100%-3.5rem)]">
      <div className="flex flex-col w-full h-full overflow-hidden">
        <div className="flex-1 overflow-hidden relative w-full h-full">
          <div className="w-full h-full">
            <div className="custom-scroll p-2 overflow-y-scroll overflow-x-hidden h-full bg-background pe-[0px]">
              <ChatPreview active={active} />
              <ChatPreview active={active} />
              <ChatPreview active={active} />
              <ChatPreview active={active} />
              <ChatPreview active={active} />
              <ChatPreview active={active} />
              <ChatPreview active={active} />
              <ChatPreview active={active} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatFolders;
