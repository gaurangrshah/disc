'use client';

import { useSocket } from '@/components/providers/socket-provider';
import { Badge } from './ui/badge';
import { cn } from '@/lib/utils';

export function SocketIndicator() {
  const { isConnected } = useSocket();
  return (
    <Badge
      className={cn(
        'border-none text-white',
        isConnected ? 'bg-amber-500' : 'bg-green-500'
      )}
    >
      {isConnected
        ? 'Fallback: Polling every 1s'
        : 'Live: Real-time updates enabled'}
    </Badge>
  );
}
