import Avatar from './Avatar';
import ChatLoading from './ChatLoading';
import RippleButton from './RippleButton';

const ChannelLoading = () => {
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
          <ChatLoading />
        </div>
      </div>
    </>
  );
};

export default ChannelLoading;
