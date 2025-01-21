'use client';
import { useState, useEffect } from 'react';

import Button from './Button';
import RippleButton from './RippleButton';
import SearchInput from './SearchInput';
import ChatFolders from './ChatFolders';

const [minWidth, defaultWidth, defaultMaxWidth] = [256, 420, 424];

export default function Sidebar() {
  const getMaxWidth = () => {
    const windowWidth = window.innerWidth;
    let newMaxWidth = defaultMaxWidth;

    if (windowWidth >= 1276) {
      newMaxWidth = Math.floor(windowWidth * 0.33);
    } else if (windowWidth >= 926) {
      newMaxWidth = Math.floor(windowWidth * 0.4);
    }

    return newMaxWidth;
  };

  const [width, setWidth] = useState(() => {
    const savedWidth =
      parseInt(window.localStorage.getItem('sidebarWidth') as string) ||
      defaultWidth;
    window.localStorage.setItem('sidebarWidth', String(savedWidth));
    return savedWidth;
  });
  const [maxWidth, setMaxWidth] = useState(getMaxWidth());
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const calculateMaxWidth = () => {
      const newMaxWidth = getMaxWidth();
      setMaxWidth(newMaxWidth);
      setWidth(width >= newMaxWidth ? newMaxWidth : width);
    };

    calculateMaxWidth();

    window.addEventListener('resize', calculateMaxWidth);

    return () => {
      window.removeEventListener('resize', calculateMaxWidth);
    };
  }, [width]);

  useEffect(() => {
    if (width) {
      let newWidth = width;
      if (width > maxWidth) {
        newWidth = maxWidth;
      }
      setWidth(newWidth);
      localStorage.setItem('sidebarWidth', String(width));
    }
  }, [width, maxWidth]);

  // Handler for resizing the sidebar
  const handleResize = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const startX = event.clientX;
    const startWidth = width;

    const onMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(
        Math.max(minWidth, startWidth + (e.clientX - startX)),
        maxWidth
      );
      setWidth(newWidth);
    };

    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      style={{ width: `${width}px` }}
      className="group bg-background h-full flex-shrink-0 relative"
    >
      <div className="flex items-center bg-background px-[.8125rem] pt-1.5 pb-2 gap-[.625rem] h-[56px]">
        <RippleButton icon="menu" />
        <SearchInput value="" onChange={() => null} />
      </div>
      <ChatFolders />
      {/* New Chat Button */}
      <div className="absolute right-4 bottom-4 translate-y-20 transition-transform duration-[.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0">
        <Button
          active
          icon="new-chat-filled"
          onClick={() => setOpen(!open)}
          className={open && 'active'}
        >
          <i className="absolute icon icon-close" />
        </Button>
      </div>
      {/* Resize Handle */}
      <div
        className="absolute z-20 top-0 -right-1 h-full w-2 cursor-ew-resize"
        onMouseDown={handleResize}
      />
    </div>
  );
}
