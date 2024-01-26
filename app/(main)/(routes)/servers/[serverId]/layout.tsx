import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

import { ServerSidebar } from '@/components/server/server-sidebar';

import type { Irfc } from '@/types';

type ServerIdLayoutProps = {
  params: {
    serverId: string;
  };
} & Irfc;

export default async function ServerIdLayout({
  children,
  params,
}: ServerIdLayoutProps) {
  const profile = await currentProfile();
  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params?.serverId,
      members: {
        // limit access to only servers that the current user is a member of
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    return redirect('/');
  }

  return (
    <div className='h-full'>
      <div className='fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex'>
        <ServerSidebar serverId={params?.serverId} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
}
