import { Menu } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Button } from './ui';
import { NavigationSidebar } from './navigation/navigation-sidebar';
import { ServerSidebar } from './server/server-sidebar';

export function MobileToggle({ serverId }: { serverId: string }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='ghost' size='icon' className='md:hidden'>
          <Menu className='h-5 w-5 text-zinc-500 dark:text-zinc-400' />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <div className='flex w-[72px] flex-col items-center justify-center'>
          <NavigationSidebar />
          <ServerSidebar serverId={serverId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
