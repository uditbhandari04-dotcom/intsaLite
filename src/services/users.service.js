
import prisma from '../db.js';

export async function createUser(data) {
  return await prisma.user.create({
    data
  });
}

export async function listUsers(page, limit, sortBy, order, filters = {}) {
  const skip = (page - 1) * limit;

  const where = {
    ...(filters.isPrivate !== undefined && {
      isPrivate: filters.isPrivate
    }),

    ...(filters.search && {
      OR: [
        {
          username: {
            contains: filters.search,
            mode: 'insensitive'
          }
        },
        {
          fullname: {
            contains: filters.search,
            mode: 'insensitive'
          }
        }
      ]
    }),

    ...(filters.hasPosts === true && {
      posts: {
        some: {}
      }
    }),

    ...(filters.hasPosts === false && {
      posts: {
        none: {}
      }
    })
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order
      }
    }),
    prisma.user.count({ where })
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getUserPosts(id, page, limit) {
  const skip = (page - 1) * limit;

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where: {
        authorId: id
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        _count: {
          select: {
            likes: true
          }
        }
      }
    }),

    prisma.post.count({
      where: {
        authorId: id
      }
    })
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

export async function getUserLikedPosts(id, page, limit) {
  const skip = (page - 1) * limit;

  const where = {
    likes: {
      some: {
        userId: id
      }
    }
  };

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
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





export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          posts: true,
          likes: true
        }
      }
    }
  });
}

export async function updateUser(id, data) {
  return await prisma.user.update({
    where: { id },
    data
  });
}

export async function deleteUser(id) {
  return await prisma.user.delete({
    where: { id }
  });
}
