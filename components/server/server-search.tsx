'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';

interface ServerSearchProps {
  data: {
    label: string;
    type: 'channel' | 'member';
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}

export const ServerSearch = ({ data }: ServerSearchProps) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);

    return () => {
      // cleanup
      document.removeEventListener('keydown', down);
    };
  }, []);

  const handleClick = ({
    id,
    type,
  }: {
    id: string;
    type: 'channel' | 'member';
  }) => {
    setOpen(false);
    if (type === 'channel') {
      router.push(`/servers/${params.serverId}/channels/${id}`);
    }
    if (type === 'member') {
      router.push(`/servers/${params?.serverId}/conversations/${id}`);
    }
  };
  return (
    <>
      <button
        className='group flex w-full items-center gap-x-2 rounded-md px-2 py-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'
        onClick={() => setOpen(true)}
      >
        <Search className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
        <p className='text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300'>
          Search
        </p>
        <kbd className='pointer-events-none ml-auto inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono font-medium text-muted-foreground'>
          <span className='text-gray-500 dark:text-gray-400'>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and members' />
        <CommandList>
          <CommandEmpty>No Results Found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data?.length) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => {
                  return (
                    <CommandItem
                      key={id}
                      onSelect={() => handleClick({ id, type })}
                    >
                      {icon}
                      <span>{name}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};
