import { Server } from '@prisma/client';

interface Irfc {
  children: React.ReactNode;
}

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
