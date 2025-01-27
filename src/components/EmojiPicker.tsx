import { ReactNode, useEffect, useState } from 'react';
import Picker from '@emoji-mart/react';
import emojiData from '@emoji-mart/data';
import { usePopper } from 'react-popper';

interface EmojiPickerProps {
  buttonIcon: ReactNode;
  buttonClassName?: string;
  wrapperClassName?: string;
  onEmojiSelect: (e: { id: string; native: string }) => void;
}

const EmojiPicker = ({
  buttonClassName,
  buttonIcon,
  onEmojiSelect,
  wrapperClassName,
}: EmojiPickerProps) => {
  const [displayPicker, setDisplayPicker] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );
  const { attributes, styles } = usePopper(referenceElement, popperElement, {
    placement: 'top-start',
  });

  useEffect(() => {
    if (!referenceElement) return;
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node;
      const rootNode = target.getRootNode() as ShadowRoot;
      if (
        popperElement?.contains(!!rootNode?.host ? rootNode?.host : target) ||
        referenceElement.contains(target)
      ) {
        return;
      }
      setDisplayPicker(false);
    };
    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, [referenceElement, popperElement]);

  return (
    <div className={wrapperClassName}>
      {displayPicker && (
        <div
          ref={setPopperElement}
          {...attributes.popper}
          style={styles.popper}
          className="z-50"
        >
          <Picker
            data={(emojiData as { default: object }).default}
            onEmojiSelect={onEmojiSelect}
            placement="top-start"
            theme="light"
          />
        </div>
      )}
      <button
        ref={setReferenceElement}
        onClick={() => setDisplayPicker((prev) => !prev)}
        aria-expanded="true"
        aria-label="Emoji picker"
        className={buttonClassName}
      >
        {buttonIcon}
      </button>
    </div>
  );
};

export default EmojiPicker;
