import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

/**
 * Used to update channel details and limit access to admins
 *
 * @export
 * @param {Request} req
 * @param {{ params: { channelId: string } }} { params }
 * @return {*}
 */
export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);

    const serverId = searchParams.get('serverId');

    if (!name && !type) {
      return new NextResponse('Missing name or type', { status: 400 });
    }

    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 });
    }

    if (!params?.channelId) {
      return new NextResponse('Channel ID missing', { status: 400 });
    }

    if (name === 'general') {
      return new NextResponse('Cannot edit the general channel', {
        status: 400,
      });
    }

    const server = await db.server.update({
      where: {
        id: `${serverId}`,
        members: {
          some: {
            profileId: profile.id,
            role: { in: [MemberRole.ADMIN, MemberRole.MODERATOR] },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: { id: params?.channelId, name: { not: 'general' } },
            data: { name, type },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

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
          delete: { id: params?.channelId, name: { not: 'general' } },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[CHANNEL_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
