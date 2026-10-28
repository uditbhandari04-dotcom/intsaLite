import express from 'express';
import prisma from './db.js';
import usersRouter from './routes/users.routes.js';
import postsRouter from './routes/posts.routes.js';
const app = express();

app.use(express.json());

app.use('/users', usersRouter);
app.use('/posts', postsRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

// app.get('/users', async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();

//     return res.status(200).json(users);
//   } catch (error) {
//     console.error('GET /users error:', error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });


// app.get('/users/:id', async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const user = await prisma.user.findUnique({
//       where: { id: id }
//     });

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error('GET /users/:id error:', error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });


// app.post("/users", async (req, res) => {
//   try {
//     const { username, email, fullname, bio } = req.body;

//     if (!username || !email || !fullname) {
//       return res.status(400).json({
//         error: "username, email and fullname are required"
//       });
//     }

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [
//           { username: username },
//           { email: email }
//         ]
//       }
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         error: "username or email already taken"
//       });
//     }

//     const user = await prisma.user.create({
//       data: {
//         username,
//         email,
//         fullname,
//         bio
//       }
//     });

//     return res.status(201).json(user);

//   } catch (error) {
//   console.error("POST /users error:", error);

//   return res.status(500).json({
//     error: "Internal server error"
//   });
// }
// });


// app.patch('/users/:id', async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const existingUser = await prisma.user.findUnique({
//       where: { id: id }
//     });

//     if (!existingUser) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }

//     const { fullname, bio, isPrivate } = req.body;

//     const data = {};

//     if (fullname !== undefined) {
//       data.fullname = fullname;
//     }

//     if (bio !== undefined) {
//       data.bio = bio;
//     }

//     if (isPrivate !== undefined) {
//       data.isPrivate = isPrivate;
//     }

//     const updatedUser = await prisma.user.update({
//       where: { id: id },
//       data: data
//     });

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error('PATCH /users/:id error:', error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });


// app.delete('/users/:id', async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const user = await prisma.user.findUnique({
//       where: { id: id }
//     });

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }

//     await prisma.user.delete({
//       where: { id: id }
//     });

//     return res.status(204).send();
//   } catch (error) {
//     console.error('DELETE /users/:id error:', error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });


// app.listen(3000 , ()=>{
//     console.log("Server started on port 3000")
// });

