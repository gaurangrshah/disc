import { NextResponse } from 'next/server';
import type { Message } from '@prisma/client';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

const MESSAGES_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get('cursor');
    const channelId = searchParams.get('channelId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    if (!channelId) {
      return new NextResponse('Missing channelId', { status: 400 });
    }

    let messages: Message[] = [];

    if (cursor) {
      // CURSOR_PAGINATION method
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } else {
      // NON_CURSOR method
      messages = await db.message.findMany({
        take: MESSAGES_BATCH,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }

    let nextCursor = null;
    if (messages.length === MESSAGES_BATCH) {
      nextCursor = messages[MESSAGES_BATCH - 1].id;
    }

    return new NextResponse(
      JSON.stringify({
        items: messages,
        nextCursor,
      }),
      {
        headers: {
          'content-type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.log('[MESSAGES_GET]', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
