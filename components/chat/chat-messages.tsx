'use client';

import { Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

import { ChatItem } from './chat-item';
import ChatWelcome from './chat-welcome';

import { useChatQuery } from '@/hooks/use-chat-query';
import { useChatSocket } from '@/hooks/use-chat-socket';

import type { Member, Message, Profile } from '@prisma/client';

interface ChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: 'channelId' | 'conversationId';
  paramValue: string;
  type: 'channel' | 'conversation';
}

type MessageWithMemberWithProfile = Message & {
  member: Member & { profile: Profile };
};

// formats date to 'dd MMM yyyy HH:mm' e.g. 01 Jan 2021 12:00
const DATE_FORMAT = 'dd MMM yyyy HH:mm';

export function ChatMessages({
  name,
  member,
  chatId,
  apiUrl,
  socketUrl,
  socketQuery,
  paramKey,
  paramValue,
  type,
}: ChatMessagesProps) {
  const queryKey = `chat:${chatId}:messages`;
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:update`;

  const { data, fetchNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  });

  useChatSocket({
    queryKey,
    addKey,
    updateKey,
  });

  if (status === 'loading')
    return (
      <div className='flex-collectAppConfig flex flex-1 justify-center'>
        <Loader2 className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>Loading...</p>
      </div>
    );
  if (status === 'error')
    return (
      <div className='flex-collectAppConfig flex flex-1 justify-center'>
        <Loader2 className='my-4 h-7 w-7 animate-spin text-zinc-500' />
        <p className='text-xs text-zinc-500 dark:text-zinc-400'>
          Something went wrong...
        </p>
      </div>
    );

  return (
    <div className='flex flex-1 flex-col overflow-y-auto py-4'>
      <div className='flex-1'>
        <ChatWelcome name={name} type={type} />
        <div className='mt-auto flex flex-col-reverse'>
          {data?.pages?.map((group, i) => (
            <Fragment key={i}>
              {!!group &&
                !!group.items.length &&
                group.items.map((message: MessageWithMemberWithProfile) => (
                  <ChatItem
                    key={message.id}
                    id={message.id}
                    currentMember={member}
                    member={message.member}
                    content={message.content}
                    fileUrl={message.fileUrl || ''}
                    deleted={message.deleted}
                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    isUpdated={message.updatedAt !== message.createdAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                  />
                ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
