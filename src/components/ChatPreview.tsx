import clsx from 'clsx';

import Avatar from './Avatar';

interface ChatPreviewProps {
  active?: boolean;
}

const ChatPreview = ({ active = false }: ChatPreviewProps) => {
  return (
    <div
      className={clsx(
        'relative p-[.5625rem] cursor-pointer min-h-auto overflow-hidden flex items-center rounded-xl whitespace-nowrap gap-2',
        active && 'bg-chat-active text-white',
        !active && 'bg-background text-color-text hover:bg-chat-hover'
      )}
    >
      <Avatar
        data={{
          name: 'James',
        }}
        width={54}
      />
      <div className="flex-1 overflow-hidden">
        <div className="flex items-center justify-start overflow-hidden">
          <div className="flex items-center justify-start overflow-hidden gap-1">
            <h3 className="font-semibold truncate text-base">James</h3>
          </div>
          <div className="grow min-w-2" />
          <div className="flex items-center shrink-0 mr-[.1875rem] text-[.75rem]">
            <span className={active ? 'text-white' : 'text-color-text-meta'}>
              Sun
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
            spin gold, Solo Leveling Episode 12, Sendchamp Dev. Community
          </p>
          <div
            className={clsx(
              'min-w-6 h-6 shrink-0 rounded-xl text-sm leading-6 text-center py-0 px-[.4375rem] font-medium',
              active && 'bg-white text-primary',
              !active && 'bg-green text-white'
            )}
          >
            <span className="inline-flex whitespace-pre">16</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPreview;
