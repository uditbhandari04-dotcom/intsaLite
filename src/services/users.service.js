
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





export async function getUserById(id) {
  return await prisma.user.findUnique({
    where: { id }
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
