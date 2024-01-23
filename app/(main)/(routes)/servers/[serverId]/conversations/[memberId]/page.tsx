import { redirectToSignIn } from '@clerk/nextjs';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import { getOrCreateConversation } from '@/lib/conversation';
import { ChatHeader } from '@/components/chat/chat-header';

interface MemberIdPageProps {
  params: {
    serverId: string;
    memberId: string;
  };
}

export default async function MemberIdPage({ params }: MemberIdPageProps) {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  if (!params.memberId || !params.serverId) {
    return redirect(params.serverId ? `/servers/${params.serverId}` : '/');
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect('/');
  }

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId
  );

  if (!conversation) {
    return redirect(`/servers/${params.serverId}`);
  }

  const { memberOne, memberTwo } = conversation;
  // bc we cannot know which member started the conversation, we want to make sure we identify the other member accordingly.
  const otherMember = memberOne.id === currentMember.id ? memberTwo : memberOne;

  return (
    <div className='flex h-full flex-col bg-white dark:bg-[#313338]'>
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type='conversation'
      />
    </div>
  );
}
