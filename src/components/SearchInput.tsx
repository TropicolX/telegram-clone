import { SearchInputProps } from 'stream-chat-react';

const SearchInput = ({ query, onSearch }: SearchInputProps) => {
  return (
    <div className="relative w-full bg-chat-hover text-[rgba(var(--color-text-secondary-rgb),0.5)] max-w-[calc(100%-3.25rem)] border-[2px] border-chat-hover has-[:focus]:border-primary has-[:focus]:bg-background rounded-[1.375rem] flex items-center pe-[.1875rem] transition-opacity ease-[cubic-bezier(0.33,1,0.68,1)] duration-[330ms]">
      <input
        type="text"
        name="Search"
        value={query}
        onChange={onSearch}
        placeholder="Search"
        autoComplete="off"
        className="peer order-2 h-10 rounded-[1.375rem] bg-transparent pl-[11px] pt-[6px] pb-[7px] pr-[9px] focus:outline-none focus:caret-primary"
      />
      <div className="w-6 h-6 ms-3 shrink-0 flex items-center justify-center peer-focus:text-primary">
        <i className="icon icon-search text-2xl leading-[1]" />
      </div>
    </div>
  );
};

export default SearchInput;
