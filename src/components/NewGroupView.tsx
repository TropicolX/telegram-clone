import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react';
import { DefaultStreamChatGenerics, useChatContext } from 'stream-chat-react';
import { UserResponse } from 'stream-chat';

import Avatar from './Avatar';
import Button from './Button';
import RippleButton from './RippleButton';
import Spinner from './Spinner';
import { customAlphabet } from 'nanoid';
import { getLastSeen } from '../lib/utils';
import clsx from 'clsx';

interface NewGroupViewProps {
  goBack: () => void;
}

const NewGroupView = ({ goBack }: NewGroupViewProps) => {
  const { client } = useChatContext();

  const [creatingGroup, setCreatingGroup] = useState(false);
  const [query, setQuery] = useState('');
  const [groupName, setGroupName] = useState('');
  const [users, setUsers] = useState<UserResponse<DefaultStreamChatGenerics>[]>(
    []
  );
  const [originalUsers, setOriginalUsers] = useState<
    UserResponse<DefaultStreamChatGenerics>[]
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    const getAllUsers = async () => {
      const userId = client.userID;
      const { users } = await client.queryUsers(
        // @ts-expect-error - id
        { id: { $ne: userId } },
        { id: 1, name: 1 },
        { limit: 20 }
      );

      setUsers(users);
      setOriginalUsers(users);
    };
    getAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserSearch = async (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.trim();
    setQuery(query);

    if (!query) {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      cancelled.current = true;
      setUsers(originalUsers);
      return;
    }

    cancelled.current = false;

    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      if (cancelled.current) return;

      try {
        const userId = client.userID;
        const { users } = await client.queryUsers(
          {
            $or: [
              { id: { $autocomplete: query } },
              { name: { $autocomplete: query } },
            ],
            // @ts-expect-error - id
            id: { $ne: userId },
          },
          { id: 1, name: 1 },
          { limit: 5 }
        );

        if (!cancelled.current) setUsers(users);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    }, 200);
  };

  const leave = () => {
    setCreatingGroup(false);
    setGroupName('');
    setQuery('');
    setSelectedUsers([]);
    goBack();
  };

  const createNewGroup = async () => {
    if (!groupName) {
      alert('Please enter a group name.');
      return;
    }
    if (selectedUsers.length < 2) {
      alert('Please select at least two users.');
      return;
    }

    setCreatingGroup(true);

    try {
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      const nanoid = customAlphabet(alphabet, 7);
      const group = client.channel('messaging', nanoid(7), {
        name: groupName,
        members: [...selectedUsers, client.userID!],
      });

      await group.create();
      leave();
    } catch (error) {
      console.error(error);
      alert('Error creating group');
    } finally {
      setCreatingGroup(false);
    }
  };

  const onSelectUser = (e: ChangeEvent<HTMLInputElement>) => {
    const userId = e.target.id;
    setSelectedUsers((prevSelectedUsers) => {
      if (prevSelectedUsers.includes(userId)) {
        return prevSelectedUsers.filter((id) => id !== userId);
      } else {
        return [...prevSelectedUsers, userId];
      }
    });
  };

  const sortedUsers = useMemo(
    () =>
      users.sort((a, b) => {
        if (selectedUsers.includes(a.id)) {
          return -1;
        } else if (selectedUsers.includes(b.id)) {
          return 1;
        } else {
          return 0;
        }
      }),
    [users, selectedUsers]
  );

  return (
    <>
      <div className="flex items-center bg-background px-[.8125rem] pt-1.5 pb-2 gap-[1.375rem] h-[56px]">
        <RippleButton onClick={leave} icon="arrow-left" />
        <h3 className="text-[1.25rem] font-medium mr-auto select-none truncate">
          New Group
        </h3>
      </div>
      <div className="flex flex-col px-5 h-[calc(100%-3.5rem)] overflow-hidden">
        <div>
          <label
            htmlFor="groupName"
            className="relative block mt-5 py-[11px] px-[18px] rounded-xl border border-color-borders-input shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary"
          >
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="peer caret-primary border-none bg-transparent placeholder-transparent placeholder:text-base focus:border-transparent focus:outline-none focus:ring-0"
              placeholder="Group name"
            />
            <span className="pointer-events-none absolute start-[18px] top-0 -translate-y-1/2 bg-white p-0.5 text-sm text-[#a2acb4] transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-0 peer-focus:text-xs peer-focus:text-primary">
              Group name
            </span>
          </label>
          <h3 className="my-4 mx-1 font-medium text-[1rem] text-color-text-secondary">
            Add members
          </h3>
          <label
            htmlFor="user"
            className="relative caret-primary block overflow-hidden border-b border-color-borders-input bg-transparent py-3 px-5 focus-within:border-primary"
          >
            <input
              type="text"
              id="users"
              placeholder="Who would you like to add?"
              value={query}
              onChange={(e) => handleUserSearch(e)}
              className="text-base h-8 w-full border-none bg-transparent p-0 placeholder:text-base focus:border-transparent focus:outline-none focus:ring-0"
            />
          </label>
          <fieldset className="flex flex-col gap-2 mt-2 custom-scroll">
            {sortedUsers.map((user) => (
              <UserCheckbox
                key={user.id}
                user={user}
                checked={selectedUsers.includes(user.id)}
                onChange={onSelectUser}
              />
            ))}
          </fieldset>
        </div>
      </div>
      <div className="absolute right-4 bottom-4 transition-transform duration-[.25s] ease-[cubic-bezier(0.34,1.56,0.64,1)] translate-y-0">
        <Button
          active
          icon="arrow-right"
          onClick={createNewGroup}
          disabled={creatingGroup}
          className={clsx('sidebar-button', creatingGroup ? 'active' : '')}
        >
          <div className="icon-loading absolute">
            <div className="relative w-6 h-6 before:relative before:content-none before:block before:pt-full">
              <Spinner />
            </div>
          </div>
        </Button>
      </div>
    </>
  );
};

interface UserCheckboxProps {
  user: UserResponse<DefaultStreamChatGenerics>;
  checked: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const UserCheckbox = ({ user, checked, onChange }: UserCheckboxProps) => {
  return (
    <label
      htmlFor={user.id}
      className="flex items-center gap-2 p-2 h-[3.5rem] rounded-xl hover:bg-chat-hover bg-background-compact-menu cursor-pointer"
    >
      <div className="relative h-10 w-10">
        <Avatar
          data={{
            name: user.name || `${user.first_name} ${user.last_name}`,
            image: user.image || '',
          }}
          width={40}
        />
      </div>
      <div>
        <p className="text-base leading-5">
          {user.name || `${user.first_name} ${user.last_name}`}
        </p>
        <p className="text-sm text-color-text-meta">
          {getLastSeen(user.last_active!)}
        </p>
      </div>
      <div className="flex items-center ml-auto">
        &#8203;
        <input
          id={user.id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="size-4 rounded border-2 border-color-borders-input"
        />
      </div>
    </label>
  );
};

export default NewGroupView;
