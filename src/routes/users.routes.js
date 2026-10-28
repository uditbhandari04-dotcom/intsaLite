import express from 'express';
import {
  create,
  list,
  getOne,
  update,
  remove
} from '../controllers/users.controller.js';

const router = express.Router();

router.post('/', create);
router.get('/', list);
router.get('/:id', getOne);
router.patch('/:id', update);
router.delete('/:id', remove);

export default router;


// import express from 'express';
// import prisma from '../db.js';

// const router = express.Router();

// router.post('/', async (req, res) => {
//   try {
//     const { username, email, fullname, bio } = req.body;

//     if (!username || !email || !fullname) {
//       return res.status(400).json({
//         error: 'username, email and fullname are required'
//       });
//     }

//     const existingUser = await prisma.user.findFirst({
//       where: {
//         OR: [{ username }, { email }]
//       }
//     });

//     if (existingUser) {
//       return res.status(409).json({
//         error: 'username or email already taken'
//       });
//     }

//     const user = await prisma.user.create({
//       data: { username, email, fullname, bio }
//     });

//     return res.status(201).json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//     error: 'Internal server error'
//     });
//   }
// });



// router.get('/', async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     return res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });



// router.get('/:id', async (req, res) => {
//   try {
//     const id =Number(req.params.id);
//     const user = await prisma.user.findUnique({
//       where: { id }
//     });

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }
//     return res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error:'Internal server error'
//     });
//   }
// });

// // 4. PATCH /users/:id — Update a user
// router.patch('/:id', async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const existingUser = await prisma.user.findUnique({
//       where: { id }
//     });

//     if (!existingUser) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }

//     const { fullname, bio, isPrivate } = req.body;
//     const data = {};

//     if (fullname !== undefined) data.fullname = fullname;
//     if (bio !== undefined) data.bio = bio;
//     if (isPrivate !== undefined) data.isPrivate = isPrivate;

//     const updatedUser = await prisma.user.update({
//       where: { id },
//       data
//     });

//     return res.status(200).json(updatedUser);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });

// // 5. DELETE /users/:id — Delete a user
// router.delete('/:id', async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const user = await prisma.user.findUnique({
//       where: { id }
//     });

//     if (!user) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }

//     await prisma.user.delete({
//       where: { id }
//     });

//     return res.status(204).send();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// });

// export default router;