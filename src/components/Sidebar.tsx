'use client';
import React, { useState, useEffect, RefObject } from 'react';
import clsx from 'clsx';

import Button from './Button';
import ChatFolders from './ChatFolders';
import { minWidth, defaultMaxWidth } from '@/app/a/layout';
import NewGroupView from './NewGroupView';
import useClickOutside from '@/hooks/useClickOutside';

enum SidebarView {
  Default,
  NewGroup,
}

interface SidebarProps {
  width: number;
  setWidth: React.Dispatch<React.SetStateAction<number>>;
}

export default function Sidebar({ width, setWidth }: SidebarProps) {
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

  const [maxWidth, setMaxWidth] = useState(getMaxWidth());
  const [menuOpen, setMenuOpen] = useState(false);
  const [view, setView] = useState(SidebarView.Default);

  const menuDomNode = useClickOutside(() => {
    setMenuOpen(false);
  }) as RefObject<HTMLDivElement>;

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const openNewGroupView = () => {
    setView(SidebarView.NewGroup);
    setMenuOpen(false);
  };

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
  }, [setWidth, width]);

  useEffect(() => {
    if (width) {
      let newWidth = width;
      if (width > maxWidth) {
        newWidth = maxWidth;
      }
      setWidth(newWidth);
      localStorage.setItem('sidebarWidth', String(width));
    }
  }, [width, maxWidth, setWidth]);

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
      id="sidebar"
      style={{ width: `${width}px` }}
      className="max-[600px]:!w-full max-[925px]:!w-[26.5rem] w-auto group bg-background h-full flex-shrink-0 relative"
      onMouseLeave={() => setMenuOpen(false)}
    >
      {/* Default View */}
      <div
        className={clsx(
          'contents',
          view === SidebarView.Default ? 'block' : 'hidden'
        )}
      >
        <ChatFolders />
      </div>
      {/* New Group View */}
      <div
        className={clsx(
          'contents',
          view === SidebarView.NewGroup ? 'block' : 'hidden'
        )}
      >
        <NewGroupView goBack={() => setView(SidebarView.Default)} />
      </div>
      {/* New Chat Button */}
      <div
        className={clsx(
          'absolute right-4 bottom-4 translate-y-20 transition-transform duration-[.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:translate-y-0',
          menuOpen && 'translate-y-0',
          view === SidebarView.NewGroup && 'hidden'
        )}
      >
        <Button
          active
          icon="new-chat-filled"
          onClick={toggleMenu}
          className={clsx('sidebar-button', menuOpen ? 'active' : '')}
        >
          <i className="absolute icon icon-close" />
        </Button>
        <div>
          {menuOpen && (
            <div className="fixed left-[-100vw] right-[-100vw] top-[-100vh] bottom-[-100vh] z-20" />
          )}
          <div
            ref={menuDomNode}
            className={clsx(
              'bg-background-compact-menu backdrop-blur-[10px] custom-scroll py-1 bottom-[calc(100%+0.5rem)] right-0 origin-bottom-right overflow-hiddden list-none absolute shadow-[0_.25rem_.5rem_.125rem_#72727240] rounded-xl min-w-[13.5rem] z-[21] overscroll-contain text-black transition-[opacity,_transform] duration-150 ease-[cubic-bezier(0.2,0.0.2,1)]',
              menuOpen
                ? 'block opacity-100 scale-100'
                : 'hidden opacity-0 scale-[.85]'
            )}
          >
            <div
              onClick={openNewGroupView}
              className="text-sm my-[.125rem] mx-1 p-1 pe-3 rounded-md font-medium scale-100 transition-transform duration-150 ease-in-out bg-transparent flex items-center relative overflow-hidden leading-6 whitespace-nowrap text-black cursor-pointer"
            >
              <i
                className="icon icon-group max-w-5 text-[1.25rem] me-5 ms-2 text-[#707579]"
                aria-hidden="true"
              />
              {'New Group'}
            </div>
          </div>
        </div>
      </div>
      {/* Resize Handle */}
      <div
        className="hidden lg:block absolute z-20 top-0 -right-1 h-full w-2 cursor-ew-resize"
        onMouseDown={handleResize}
      />
    </div>
  );
}
