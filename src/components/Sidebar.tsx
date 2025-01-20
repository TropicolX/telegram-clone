'use client';
import { useState, useEffect } from 'react';
import RippleButton from './RippleButton';
import SearchInput from './SearchInput';

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
      className="bg-background h-screen flex-shrink-0 relative"
    >
      <div className="flex items-center bg-background px-[.8125rem] pt-1.5 pb-2 gap-[.625rem]">
        <RippleButton icon="menu" />
        <SearchInput value="" onChange={() => null} />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute z-20 top-0 -right-1 h-full w-2 cursor-ew-resize"
        onMouseDown={handleResize}
      />
    </div>
  );
}
