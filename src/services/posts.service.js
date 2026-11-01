import prisma from '../db.js';

export async function createPost(data) {
  const user = await prisma.user.findUnique({
    where: { id: data.authorId }
  });

  if (!user) {
    return null;
  }

  return await prisma.post.create({
    data
  });
}

export async function listPosts(page, limit, sortBy, order, filters = {}) {
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.location && {
      location: {
        equals: filters.location,
        mode: 'insensitive'
      }
    }),

    ...(filters.search && {
      caption: {
        contains: filters.search,
        mode: 'insensitive'
      }
    }),

    ...(filters.from || filters.to
      ? {
          createdAt: {
            ...(filters.from && {
              gte: new Date(`${filters.from}T00:00:00.000Z`)
            }),
            ...(filters.to && {
              lt: new Date(`${filters.to}T00:00:00.000Z`)
            })
          }
        }
      : {})
  };

  const orderBy = sortBy === 'likes'
    ? [
        { likes: { _count: order } },
        { createdAt: 'desc' }
      ]
    : {
        [sortBy]: order
      };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      include: {
        author: {
          select: {
            id: true,
            username: true,
            fullname: true
          }
        },
        _count: {
          select: {
            likes: true
          }
        }
      }
    }),
    prisma.post.count({ where })
  ]);

  return {
    data: posts,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}


export async function getPostById(id) {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          username: true,
          fullname: true
        }
      },
      _count: {
        select: {
          likes: true
        }
      }
    }
  });
}

export async function updatePost(id, data) {
  return await prisma.post.update({
    where: { id },
    data: {
      caption: data.caption,
      location: data.location
    }
  });
}

export async function deletePost(id) {
  return await prisma.post.delete({
    where: { id }
  });
}

export async function getPostLikes(id) {
  return await prisma.user.findMany({
    where: {
      likes: {
        some: {
          postId: id
        }
      }
    },
    select: {
      id: true,
      username: true,
      fullname: true
    },
    orderBy: {
      username: 'asc'
    }
  });
}