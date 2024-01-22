'use client';

import { MemberRole } from '@prisma/client';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import type { ServerWithMembersWithProfiles } from '@/types';
import { useModal } from '@/hooks/use-modal-store';

interface ServerHeaderProps {
  server: ServerWithMembersWithProfiles;
  role?: MemberRole;
}

export function ServerHeader({ server, role }: ServerHeaderProps) {
  const { onOpen } = useModal();
  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='focus:outline-none' asChild>
        <button className='text-md hover:bg-zinc-700/10dark:hover:bg-zinc-700/50 flex h-12 w-full items-center border-b-2 border-neutral-200 px-3 font-semibold transition dark:border-neutral-800'>
          {server.name}
          <ChevronDown className='ml-auto h-5 w-5' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56 space-y-[2px] text-xs font-medium text-black dark:text-neutral-400'>
        {isModerator && (
          <DropdownMenuItem
            className='cursor-pointer px-3 py-2 text-sm text-indigo-600 dark:text-indigo-400'
            onClick={() => onOpen('invite', { server })}
          >
            Invite People
            <UserPlus className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className='cursor-pointer px-3 py-2 text-sm'
            onClick={() => onOpen('editServer', { server })}
          >
            Server Settings
            <Settings className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <DropdownMenuItem
            className='cursor-pointer px-3 py-2 text-sm'
            onClick={() => onOpen('members', { server })}
          >
            Manage Members
            <Users className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isModerator && (
          <DropdownMenuItem
            className='cursor-pointer px-3 py-2 text-sm'
            onClick={() => onOpen('createChannel', { server })}
          >
            Create Channel
            <PlusCircle className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {isModerator && <DropdownMenuSeparator />}
        {isAdmin && (
          <DropdownMenuItem
            className='cursor-pointer px-3 py-2 text-sm text-rose-500'
            onClick={() => onOpen('deleteServer', { server })}
          >
            Delete Server
            <Trash className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
        {!isAdmin && (
          <DropdownMenuItem
            className='cursor-pointer px-3 py-2 text-sm text-rose-500'
            onClick={() => onOpen('leaveServer', { server })}
          >
            Leave Server
            <LogOut className='ml-auto h-4 w-4' />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
