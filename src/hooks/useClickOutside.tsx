import { useEffect, useRef } from 'react';

const useClickOutside = (handler: () => void, shallow?: boolean) => {
  const domNode = useRef<HTMLElement>(null);

  useEffect(() => {
    const maybeHandler = (event: MouseEvent | TouchEvent) => {
      if (
        domNode.current &&
        !domNode.current!.contains(event.target as HTMLElement) &&
        (shallow
          ? !domNode.current!.parentElement?.contains(
              event.target as HTMLElement
            )
          : true)
      ) {
        handler();
      }
    };

    document.addEventListener('mousedown', maybeHandler);
    document.addEventListener('touchstart', maybeHandler);

    return () => {
      document.removeEventListener('mousedown', maybeHandler);
      document.removeEventListener('touchstart', maybeHandler);
    };
  });

  return domNode;
};

export default useClickOutside;
