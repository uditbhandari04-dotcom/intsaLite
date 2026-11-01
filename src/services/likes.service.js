import prisma from '../db.js';

export async function createLike(postId, userId) {
  const post = await prisma.post.findUnique({
    where: { id: postId }
  });

  if (!post) {
    return { error: 'Post not found' };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    return { error: 'User not found' };
  }

  return await prisma.like.create({
    data: {
      userId,
      postId
    }
  });
}

export async function deleteLike(postId, userId) {
  return await prisma.like.delete({
    where: {
      userId_postId: {
        userId,
        postId
      }
    }
  });
}