import { getAuth } from '@clerk/nextjs/server';
import { NextApiRequest } from 'next';

import { db } from '@/lib/db';

export /**
 * Get the current profile of the logged in user modified to work with the pages router
 *
 * @param {NextApiRequest} req
 * @return {*}
 */
const currentProfilePages = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) {
    return null;
  }

  const profile = await db.profile.findUnique({
    where: { userId },
  });

  return profile;
};
