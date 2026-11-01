
// import prisma from '../src/db.js';
// import { users, posts } from './seed-data.js';

// async function main() {
//   await prisma.post.deleteMany();
//   await prisma.user.deleteMany();

//   // Create all users in one query
//   const userResult = await prisma.user.createMany({
//     data: users.map((user) => ({
//       ...user,
//       createdAt: new Date(user.createdAt)
//     }))
//   });

//   // Fetch the IDs needed to connect posts to users
//   const createdUsers = await prisma.user.findMany({
//     select: {
//       id: true,
//       username: true
//     }
//   });

//   const userIdByUsername = new Map(
//     createdUsers.map((user) => [user.username, user.id])
//   );

//   // Create all posts in one query
//   // Assign posts to users in a repeating sequence
//   const postResult = await prisma.post.createMany({
//     data: posts.map((post, index) => ({
//       ...post,
//       createdAt: new Date(post.createdAt),
//       userId: userIdByUsername.get(
//         users[index % users.length].username
//       )
//     }))
//   });

  
//   console.log(
//     `🌱 Seeded ${userResult.count} users and ${postResult.count} posts`
//   );
// }

// main()
//   .catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
import prisma from "../src/db.js";
import { users, posts, likes } from "./seed-data.js";

async function main() {
  try {
    
    await prisma.like.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    
    const createdUsers = await prisma.user.createManyAndReturn({
      data: users.map(user => ({
        ...user,
        createdAt: new Date(user.createdAt)
      }))
    });
    const userIdMap = new Map(
      createdUsers.map(user => [user.username, user.id])
    );
    const createdPosts = await prisma.post.createManyAndReturn({
      data: posts.map(({ author, ...post }) => ({
        ...post,
        createdAt: new Date(post.createdAt),
        authorId: userIdMap.get(author)
      }))
    });
    const postIdMap = new Map(
      createdPosts.map(post => [
        post.imageUrl.split("/")[4],
        post.id
      ])
    );
    const createdLikes = await prisma.like.createManyAndReturn({
      data: likes.map(({ user, post }) => ({
        userId: userIdMap.get(user),
        postId: postIdMap.get(post)
      }))
    });

   
  console.log(
      `🌱 Seeded ${createdUsers.length} users, ${createdPosts.length} posts and ${createdLikes.length} likes`
    );

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();