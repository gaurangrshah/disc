import { Server as NetServer } from 'http';

import { NextApiRequest } from 'next';

import { Server as ServerID } from 'socket.io';

import { NextApiResponseServerIO } from '@/types';

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
    console.log('*First use, starting socket.io');

    const path = '/api/socket/io';
    const httpServer: NetServer = res.socket.server as any;

    const io = new ServerID(httpServer, {
      path,
      addTrailingSlash: false, // this property might cause ts warning (use @ts-ignore to suppress)
    });

    res.socket.server.io = io;
  }
  res.end();
}
