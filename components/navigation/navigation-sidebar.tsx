import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

import { currentProfile } from '@/lib/current-profile';

import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { ModeToggle } from '../mode-toggle';
import { UserButton } from '@clerk/nextjs';

export async function NavigationSidebar() {
  const profile = await currentProfile();
  if (!profile) return redirect('/');

  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  return (
    <div className='py-e flex h-full w-full flex-col items-center space-y-4 bg-[#E3E5E8] text-primary dark:bg-[#1E1F22]'>
      <NavigationAction />
      <Separator className='mx-auto h-[2px] w-10 rounded-md bg-zinc-300 dark:bg-zinc-700' />
      <ScrollArea className='w-full flex-1'>
        {servers.map((server) => (
          <div key={server.id} className='mb-4'>
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className='mt-auto flex flex-col items-center gap-y-4 pb-3'>
        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={{ elements: { avatarbox: 'h-[48px] w-[48px]' } }}
        />
      </div>
    </div>
  );
}
