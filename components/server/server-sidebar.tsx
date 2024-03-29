import { redirect } from 'next/navigation';
import { ChannelType, MemberRole } from '@prisma/client';
import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from 'lucide-react';

import { ScrollArea, Separator } from '../ui';
import { ServerHeader } from './server-header';
import { ServerSearch } from './server-search';
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

interface ServerSidebarProps {
  serverId: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

const roleIconMap = {
  [MemberRole.GUEST]: <User className='mr-2 h-4 w-4 text-zinc-500' />,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className='mr-2 h-4 w-4 text-indigo-500' />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 h-4 w-4 text-rose-500' />,
};

export async function ServerSidebar({ serverId }: ServerSidebarProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirect('/');
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );
  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );
  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  // remove current user from members list to avoid showing their profile image twice
  const members = server?.members.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) {
    return redirect('/');
  }

  const role = server.members.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className='flex h-full w-full flex-col bg-[#F2F3F5] px-3 text-primary dark:bg-[#2B2D31]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='mt-2'>
          <ServerSearch
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  icon: iconMap[channel.type],
                  name: channel.name,
                  id: channel.id,
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: members?.map((member) => {
                  return {
                    id: member.id,
                    name: member.profile.name,
                    icon: roleIconMap[member.role],
                  };
                }),
              },
            ]}
          />
        </div>
      </ScrollArea>
      <Separator className='my-2 rounded-md bg-zinc-200 dark:bg-zinc-700' />
      {!!textChannels?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='channels'
            channelType={ChannelType.TEXT}
            role={role}
            label='Text Channels'
          />
          <div className='space-y-[2px]'>
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        </div>
      )}
      {!!audioChannels?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='channels'
            channelType={ChannelType.AUDIO}
            role={role}
            label='Voice Channels'
          />
          <div className='space-y-[2px]'>
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        </div>
      )}
      {!!videoChannels?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='channels'
            channelType={ChannelType.VIDEO}
            role={role}
            label='Video Channels'
          />
          <div className='space-y-[2px]'>
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                server={server}
                role={role}
              />
            ))}
          </div>
        </div>
      )}
      {!!members?.length && (
        <div className='mb-2'>
          <ServerSection
            sectionType='members'
            role={role}
            label='Members'
            server={server}
          />
          <div className='space-y-[2px]'>
            {members.map((member) => (
              <ServerMember key={member.id} member={member} server={server} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
