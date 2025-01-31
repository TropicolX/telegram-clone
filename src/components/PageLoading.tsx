import { useState } from 'react';
import { defaultWidth } from './Sidebar';

const PageLoading = () => {
  const [width] = useState(() => {
    const savedWidth =
      parseInt(window.localStorage.getItem('sidebarWidth') as string) ||
      defaultWidth;
    window.localStorage.setItem('sidebarWidth', String(savedWidth));
    return savedWidth;
  });

  return (
    <div className="flex h-full w-full">
      <div
        style={{
          width: `${width}px`,
        }}
        className="bg-background h-full flex-shrink-0 relative"
      ></div>
      <div className="relative flex flex-col items-center w-full h-full overflow-hidden border-l border-solid border-l-color-borders">
        <div className="chat-background absolute top-0 left-0 w-full h-full -z-10 overflow-hidden bg-theme-background"></div>
      </div>
    </div>
  );
};

export default PageLoading;
