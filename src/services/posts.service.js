import prisma from '../db.js';

export async function createPost(data) {
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

  const [posts, total] = await prisma.$transaction([
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: order
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
    where: { id }
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