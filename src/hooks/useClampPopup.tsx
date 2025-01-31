import { RefObject, useLayoutEffect } from 'react';

interface useClampPopupProps {
  wrapperRef: RefObject<HTMLDivElement | null>;
  popupRef: RefObject<HTMLDivElement | null>;
  showPopup: boolean;
  popupPosition: { x: number; y: number };
  setPopupPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number }>
  >;
}

const useClampPopup = ({
  wrapperRef,
  popupRef,
  showPopup,
  popupPosition,
  setPopupPosition,
}: useClampPopupProps) => {
  useLayoutEffect(() => {
    if (!showPopup) return;

    const popupEl = popupRef.current;
    const containerEl = wrapperRef?.current;
    if (!popupEl || !containerEl) return;

    const popupRect = popupEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();

    const popupWidth = popupRect.width;
    const popupHeight = popupRect.height;

    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;

    // The position the user clicked/tapped (relative to container).
    let desiredX = popupPosition.x;
    const desiredY = popupPosition.y;

    // Check horizontal overflow first (simple clamp)
    if (desiredX + popupWidth > containerWidth) {
      desiredX = containerWidth - popupWidth;
    }
    if (desiredX < 0) {
      desiredX = 0;
    }

    // Now handle "flip" logic vertically
    // 1. Check if there's enough space below
    const spaceBelow = containerHeight - desiredY;
    const spaceAbove = desiredY;

    // By default, we place the popup below the pointer
    let finalY = desiredY;

    if (popupHeight > spaceBelow) {
      // Not enough space below. Try flipping above.
      if (popupHeight <= spaceAbove) {
        // Enough space above => flip it above
        finalY = desiredY - popupHeight;
      } else {
        // Not enough space above either => place it at whichever side has more space
        if (spaceAbove > spaceBelow) {
          // place above, clamped at top if it goes negative
          finalY = desiredY - popupHeight;
        } else {
          // place below, clamped at bottom if it overflows
          finalY = containerHeight - popupHeight;
        }
      }
    }

    // Put it all together
    if (finalY !== popupPosition.y || desiredX !== popupPosition.x) {
      setPopupPosition({ x: desiredX, y: finalY - 20 });
    }
  }, [wrapperRef, popupRef, showPopup, popupPosition, setPopupPosition]);

  return;
};

export default useClampPopup;
