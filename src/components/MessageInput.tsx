'use client';
import { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  RenderLeafProps,
  RenderElementProps,
} from 'slate-react';
import {
  Editor,
  Transforms,
  createEditor,
  Descendant as SlateDescendant,
  Element as SlateElement,
  Text,
} from 'slate';
import isHotkey from 'is-hotkey';
import { withHistory } from 'slate-history';
import {
  useChannelActionContext,
  useMessageInputContext,
} from 'stream-chat-react';

type Descendant = Omit<SlateDescendant, 'children'> & {
  children: (
    | {
        text: string;
      }
    | {
        text: string;
        bold: boolean;
      }
    | {
        text: string;
        italic: boolean;
      }
    | {
        text: string;
        code: boolean;
      }
    | {
        text: string;
        strikethrough: boolean;
      }
  )[];
  url?: string;
  type: string;
};

type FileInfo = {
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
};

interface PopupPosition {
  top: number;
  left: number;
}

const HOTKEYS: {
  [key: string]: string;
} = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
];

import Appendix from './Appendix';
import Avatar from './Avatar';
import Button from './Button';
import EmojiPicker from './EmojiPicker';

const MessageInput = () => {
  const { sendMessage } = useChannelActionContext();
  const { uploadNewFiles, attachments, removeAttachments, cooldownRemaining } =
    useMessageInputContext();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [filesInfo, setFilesInfo] = useState<FileInfo[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<PopupPosition>({
    top: 0,
    left: 0,
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderElement = useCallback(
    (props: ElementProps) => <Element {...props} />,
    []
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  );
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  const serializeToMarkdown = (nodes: Descendant[]) => {
    return nodes.map((n) => serializeNode(n)).join('\n');
  };

  const serializeNode = (
    node: Descendant | Descendant['children'],
    indentation: string = ''
  ) => {
    if (Text.isText(node)) {
      let text = node.text;
      const formattedNode = node as Text & {
        bold?: boolean;
        italic?: boolean;
        code?: boolean;
        strikethrough?: boolean;
      };
      if (formattedNode.bold) text = `**${text}**`;
      if (formattedNode.italic) text = `*${text}*`;
      if (formattedNode.strikethrough) text = `~~${text}~~`;
      if (formattedNode.code) text = `\`${text}\``;

      return text;
    }

    const formattedNode = node as Descendant;
    const children: string = formattedNode.children
      .map((n) => serializeNode(n as never, indentation))
      .join('');

    return `${children}`;
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      uploadNewFiles(files);
      const newFilesInfo: FileInfo[] = [];
      filesArray.forEach((file) => {
        const fileData: FileInfo = {
          name: file.name,
          size: file.size,
          type: file.type,
        };

        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setFilesInfo((prevFiles) => [
              ...prevFiles,
              { ...fileData, previewUrl: reader.result as string },
            ]);
          };
          reader.readAsDataURL(file);
        } else {
          newFilesInfo.push(fileData);
        }
      });
      setFilesInfo((prevFiles) => [...prevFiles, ...newFilesInfo]);
      e.currentTarget.value = '';
    }
  };

  const handleUploadButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current?.click();
    }
  };

  const handleRemoveFile = (index: number) => {
    setFilesInfo((prevFiles) => {
      const newFiles = prevFiles.filter((_, i) => i !== index);
      return newFiles;
    });

    removeAttachments([attachments[index].localMetadata.id]);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {
    const clipboardItems = event.clipboardData.items;
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i];
      if (item.type.indexOf('image') !== -1) {
        const imageFile = item.getAsFile();
        if (imageFile) {
          const fileData: FileInfo = {
            name: imageFile.name,
            size: imageFile.size,
            type: imageFile.type,
          };
          const reader = new FileReader();
          reader.onloadend = () => {
            uploadNewFiles([imageFile]);
            setFilesInfo((prevFiles) => [
              ...prevFiles,
              { ...fileData, previewUrl: reader.result as string },
            ]);
          };
          reader.readAsDataURL(imageFile);
        }
        event.preventDefault();
      }
    }
  };

  const handleSubmit = async () => {
    const text = serializeToMarkdown(editor.children as Descendant[]);
    if (text || attachments.length > 0) {
      sendMessage({
        text,
        attachments,
      });
      setFilesInfo([]);
      removeAttachments(attachments.map((a) => a.localMetadata.id));

      const point = { path: [0, 0], offset: 0 };
      editor.selection = { anchor: point, focus: point };
      editor.history = { redos: [], undos: [] };
      editor.children = initialValue;
    }
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection) {
      setIsVisible(false);
      return;
    }

    if (selection.isCollapsed) {
      setIsVisible(false);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const selectionTop = rect.top - containerRect.top;
      const selectionLeft = rect.left - containerRect.left;

      setPosition({
        top: selectionTop - 55,
        left: selectionLeft - 55,
      });

      setIsVisible(true);
    }
  };

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <div className="relative flex items-end gap-2 z-10 mb-5 w-full xl:w-[calc(100%-25vw)] max-w-[45.5rem] px-4 transition-[top,_transform] duration-[200ms,_300ms] ease-[ease,_cubic-bezier(0.33,1,0.68,1)]">
        {/* Input */}
        <div
          ref={containerRef}
          className="composer-wrapper relative z-[1] grow bg-background max-w-[calc(100%-4rem)] rounded-[var(--border-radius-messages)] rounded-br-none shadow-[0_1px_2px_var(--color-default-shadow)] transition-[transform,_border-bottom-right-radius] duration-200 ease-out"
        >
          <Appendix position="right" />
          <div className="flex opacity-100 transition-opacity duration-200 ease-out">
            {/* Popup */}
            {isVisible && (
              <div
                ref={popupRef}
                style={{ top: position.top, left: position.left }}
                className="absolute z-30 bg-background rounded-[.9375rem] py-2 px-[.375rem] shadow-[0_1px_2px_var(--color-default-shadow)]"
              >
                <div
                  onClick={() => setIsVisible(false)}
                  className="flex flex-nowrap items-center"
                >
                  <FormattingButton type="mark" format="bold" icon="bold" />
                  <FormattingButton type="mark" format="italic" icon="italic" />
                  <FormattingButton
                    type="mark"
                    format="strikethrough"
                    icon="strikethrough"
                  />
                  <FormattingButton
                    type="mark"
                    format="code"
                    icon="monospace"
                  />
                </div>
              </div>
            )}
            <EmojiPicker
              buttonClassName="relative w-8 h-14 ml-3 flex items-center justify-center leading-[1.2] overflow-hidden transition-colors duration-150 uppercase rounded-full self-end shrink-0 text-color-composer-button"
              buttonIcon={<i className="icon icon-smile" />}
              wrapperClassName="relative flex"
              onEmojiSelect={(e) => {
                Transforms.insertText(editor, e.native);
              }}
            />
            <div
              style={{
                wordBreak: 'break-word',
              }}
              className="relative grow whitespace-pre-wrap"
            >
              <div className="custom-scroll mr-2 pr-1 min-h-14 max-h-[26rem] overflow-y-auto transition-[height] duration-100 ease-[ease]">
                <div className="pl-2 py-4">
                  {/* File preview section */}
                  {filesInfo.length > 0 && (
                    <div className="relative mb-4 flex items-center gap-3 flex-wrap">
                      {filesInfo.map((file, index) => (
                        <div
                          key={index}
                          className="group relative max-w-[234px]"
                        >
                          {file.previewUrl ? (
                            <div className="relative w-[62px] h-[62px] grow shrink-0 cursor-pointer">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={file.previewUrl}
                                alt={`File Preview ${index}`}
                                className="w-full h-full object-cover rounded-xl border-[#46ba431a] border"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center rounded-xl gap-3 p-3 border border-[#46ba431a] bg-[#46ba431a]">
                              <Avatar
                                width={32}
                                borderRadius={8}
                                data={{ name: file.type }}
                              />
                              <div className="flex flex-col gap-0.5">
                                <p className="text-sm text-black break-all whitespace-break-spaces line-clamp-1 mr-2">
                                  {file.name}
                                </p>
                                <p className="text-[13px] text-black break-all whitespace-break-spaces line-clamp-1">
                                  {file.type}
                                </p>
                              </div>
                            </div>
                          )}
                          <div className="group-hover:opacity-100 opacity-0 absolute -top-2.5 -right-2.5 flex items-center justify-center w-[22px] h-[22px] rounded-full bg-slate-200">
                            <button
                              onClick={() => handleRemoveFile(index)}
                              className="w-[18px] h-[18px] flex items-center justify-center rounded-full bg-slate-200"
                            >
                              <i className="icon icon-close text-sm text-black" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <Editable
                    renderElement={renderElement as never}
                    renderLeaf={renderLeaf}
                    onMouseUp={handleMouseUp}
                    className="editable outline-none leading-[1.3125]"
                    onPaste={handlePaste}
                    spellCheck
                    autoFocus
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        if (event.shiftKey) {
                          return;
                        } else {
                          event.preventDefault();
                          handleSubmit();
                        }
                      }
                      if (isHotkey('mod+a', event)) {
                        event.preventDefault();
                        Transforms.select(editor, []);
                        return;
                      }
                      for (const hotkey in HOTKEYS) {
                        if (isHotkey(hotkey, event as never)) {
                          event.preventDefault();
                          const mark = HOTKEYS[hotkey];
                          toggleMark(editor, mark);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="self-end">
              <button
                onClick={handleUploadButtonClick}
                className="relative w-14 h-14 ml-3 flex items-center justify-center leading-[1.2] overflow-hidden transition-colors duration-150 uppercase rounded-full self-end shrink-0 text-color-composer-button"
              >
                <i className="icon icon-attach" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileInputChange}
                />
              </button>
            </div>
          </div>
        </div>
        <Button
          onClick={handleSubmit}
          disabled={!!cooldownRemaining}
          className="text-primary"
          icon="send"
        />
      </div>
    </Slate>
  );
};

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as Descendant).type),
    split: true,
  });
  const newProperties: Partial<Descendant> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  };
  Transforms.setNodes<SlateElement>(editor, newProperties);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
};

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
};

const isBlockActive = (editor: Editor, format: string, blockType = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        (n as never)[blockType] === format,
    })
  );

  return !!match;
};

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor) as null;
  return marks ? marks[format] : false;
};

type ElementProps = RenderElementProps & {
  element: {
    type: string;
    align?: CanvasTextAlign;
  };
};

const Element = (props: ElementProps) => {
  const { attributes, children } = props;
  return <p {...attributes}>{children}</p>;
};

interface LeafProps extends RenderLeafProps {
  leaf: {
    bold?: boolean;
    code?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    text: string;
  };
}

const Leaf = ({ attributes, children, leaf }: LeafProps) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.strikethrough) {
    children = <s>{children}</s>;
  }

  return <span {...attributes}>{children}</span>;
};

interface ButtonProps {
  active?: boolean;
  className?: string;
  icon: string;
  format: string;
  type?: 'mark' | 'block';
}

const FormattingButton = ({ className, format, icon, type }: ButtonProps) => {
  const editor = useSlate();
  const isActive =
    type === 'block'
      ? isBlockActive(editor, format)
      : isMarkActive(editor, format);

  return (
    <button
      className={clsx(
        'w-8 h-8 p-1 text-[1.5rem] text-color-text-secondary leading-[1.2] mx-0.5 shrink-0 flex items-center justify-center rounded-[.375rem] transition-colors duration-150',
        isActive
          ? 'bg-interactive-element-hover'
          : 'bg-transparent hover:bg-interactive-element-hover',
        className
      )}
      onClick={(e) => {
        e.preventDefault();
        if (type === 'block') {
          toggleBlock(editor, format);
        } else if (type === 'mark') {
          toggleMark(editor, format);
        }
      }}
    >
      <i className={`icon icon-${icon}`} aria-hidden="true" />
    </button>
  );
};

export default MessageInput;
