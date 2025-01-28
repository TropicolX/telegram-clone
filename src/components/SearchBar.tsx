import { UserButton, useUser } from '@clerk/nextjs';
import { SearchBarProps } from 'stream-chat-react';

import RippleButton from './RippleButton';

const SearchBar = ({ exitSearch, onSearch, query }: SearchBarProps) => {
  const { user } = useUser();

  const handleClick = () => {
    if (query) {
      exitSearch();
    }
  };

  return (
    <div className="flex items-center bg-background px-[.8125rem] pt-1.5 pb-2 gap-[.625rem] h-[56px]">
      <div className="relative h-10 w-10 [&>div:first-child]">
        <div className="[&>div]:opacity-0">
          {user && !query && <UserButton />}
        </div>
        <div className="absolute left-0 top-0 flex items-center justify-center pointer-events-none">
          <RippleButton
            onClick={handleClick}
            icon={query ? 'arrow-left' : 'menu'}
          />
        </div>
      </div>
      <div className="relative w-full bg-chat-hover text-[rgba(var(--color-text-secondary-rgb),0.5)] max-w-[calc(100%-3.25rem)] border-[2px] border-chat-hover has-[:focus]:border-primary has-[:focus]:bg-background rounded-[1.375rem] flex items-center pe-[.1875rem] transition-opacity ease-[cubic-bezier(0.33,1,0.68,1)] duration-[330ms]">
        <input
          type="text"
          name="Search"
          value={query}
          onChange={onSearch}
          placeholder="Search"
          autoComplete="off"
          className="peer order-2 h-10 text-black rounded-[1.375rem] bg-transparent pl-[11px] pt-[6px] pb-[7px] pr-[9px] focus:outline-none focus:caret-primary"
        />
        <div className="w-6 h-6 ms-3 shrink-0 flex items-center justify-center peer-focus:text-primary">
          <i className="icon icon-search text-2xl leading-[1]" />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
