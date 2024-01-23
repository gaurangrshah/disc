import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

/**
 * Used to delete a channel
 *
 * @export
 * @param {Request} req
 * @param {{ params: { channelId: string } }} { params }
 * @return {*}
 */
export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  console.log('[CHANNEL_ID_DELETE]-start');
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get('serverId');

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 });
    }

    if (!params?.channelId) {
      return new NextResponse('Channel ID missing', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            // only allow admins and moderators to delete channels
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          // delete channel as long as it is not named general
          delete: { id: params.channelId, name: { not: 'general' } },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
