
import prisma from '../src/db.js';
import { users, posts } from './seed-data.js';

async function main() {
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Create all users in one query
  const userResult = await prisma.user.createMany({
    data: users.map((user) => ({
      ...user,
      createdAt: new Date(user.createdAt)
    }))
  });

  // Fetch the IDs needed to connect posts to users
  const createdUsers = await prisma.user.findMany({
    select: {
      id: true,
      username: true
    }
  });

  const userIdByUsername = new Map(
    createdUsers.map((user) => [user.username, user.id])
  );

  // Create all posts in one query
  // Assign posts to users in a repeating sequence
  const postResult = await prisma.post.createMany({
    data: posts.map((post, index) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      userId: userIdByUsername.get(
        users[index % users.length].username
      )
    }))
  });

  
  console.log(
    `🌱 Seeded ${userResult.count} users and ${postResult.count} posts`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
