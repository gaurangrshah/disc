import type { Server as NetServer } from 'http';

import { Server as ServerIO } from 'socket.io';

import type { NextApiRequest } from 'next';
import type { NextApiResponseServerIO } from '@/types';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default function ioHandler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerIO(httpServer, {
      path,
      // this property might cause ts warning (use @ts-ignore to suppress)
      // note this is also defined in providers/socket-provider
      addTrailingSlash: false,
      // cors: { origin: '*' },
    });
    res.socket.server.io = io;
  }
  res.end();
  return;
}
