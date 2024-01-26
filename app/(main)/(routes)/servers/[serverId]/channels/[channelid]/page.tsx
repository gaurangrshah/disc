import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { ChatHeader, ChatInput, ChatMessages } from '@/components/chat';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { MediaRoom } from '@/components/media-room';

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

export default async function ChannelIdPage({ params }: ChannelIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }
  const { serverId, channelId } = params;

  if (!serverId || !channelId) {
    return redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) {
    return redirect('/');
  }

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#313338]'>
      <ChatHeader
        serverId={channel.serverId}
        name={channel.name}
        type='channel'
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            name={channel.name}
            member={member}
            chatId={channel.id}
            apiUrl='/api/messages'
            socketUrl='/api/socket/messages'
            socketQuery={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
            paramKey='channelId'
            paramValue={channel.id}
            type='channel'
          />
          <ChatInput
            name={channel.name}
            type='channel'
            apiUrl='/api/socket/messages'
            query={{
              serverId: channel.serverId,
              channelId: channel.id,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio={true} />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video={true} audio={true} />
      )}
    </div>
  );
}
