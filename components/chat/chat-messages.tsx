'use client';

import { Loader2 } from 'lucide-react';

import ChatWelcome from './chat-welcome';

import { useChatQuery } from '@/hooks/use-chat-query';

import type { Member, Message, Profile } from '@prisma/client';
import { Fragment } from 'react';

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
  const { data, fetchNextPage, isFetchingNextPage, status } = useChatQuery({
    queryKey: `chat:${chatId}`,
    apiUrl,
    paramKey,
    paramValue,
  });

  if (status === 'pending')
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
              {group.items.map((message: MessageWithMemberWithProfile) => (
                <div key={message.id}>{message.content}</div>
              ))}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
