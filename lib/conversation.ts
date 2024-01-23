import { db } from './db';

/**
 * Used to get a conversation between two users, if it doesn't exist, it will create one
 *
 * @export
 * @param {string} memberOneId
 * @param {string} memberTwoId
 * @return {*}
 */
export async function getOrCreateConversation(
  memberOneId: string,
  memberTwoId: string
) {
  try {
    let conversation =
      // find convo with either variation if it exists
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));

    if (!conversation) {
      conversation = await createConversation(memberOneId, memberTwoId);
    }

    return conversation;
  } catch (error) {
    console.log('🚀 | error:', error);
    return null;
  }
}

/**
 * Used to find an existing conversation between two users
 *
 * @param {string} memberOneId
 * @param {string} memberTwoId
 * @return {*}
 */
async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log('🚀 | error:', error);
    return null;
  }
}

/**
 * Used to create a new conversation between two users
 *
 * @param {string} memberOneId
 * @param {string} memberTwoId
 * @return {*}
 */
async function createConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
  } catch (error) {
    console.log('🚀 | error:', error);
    return null;
  }
}
