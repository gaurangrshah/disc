import { NextResponse } from 'next/server';

import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';

/**
 * Used to update server details and limit access to admins
 *
 * @export
 * @param {Request} req
 * @param {{ params: { serverId: string } }} { params }
 * @return {*}
 */
export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id }, // ensures only an admin can modify server details. The same profile id used to create the server is needed to modify it.
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

/**
 * Used to delete a server completely
 *
 * @export
 * @param {Request} req
 * @param {{ params: { serverId: string } }} { params }
 * @return {*}
 */
export async function DELETE(
  req: Request,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();
    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.delete({
      where: { id: params.serverId, profileId: profile.id },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log('[SERVER_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
