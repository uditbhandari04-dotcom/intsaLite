
import {
  createUser,
  listUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../services/users.service.js';


export const create = async (req, res) => {
  try {
    const { username, email, fullname, bio } = req.body;

    if (!username || !email || !fullname) {
      return res.status(400).json({
        error: 'username, email and fullname are required'
      });
    }

    const user = await createUser({ username, email, fullname, bio });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'username or email already taken'
      });
    }

    console.error(error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};


export const list = async (req, res) => {
  try {
    const users = await listUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const user = await getUserById(id);

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

// PATCH /users/:id
export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    const { fullname, bio, isPrivate } = req.body;
    const data = {};

    if (fullname !== undefined) data.fullname = fullname;
    if (bio !== undefined) data.bio = bio;
    if (isPrivate !== undefined) data.isPrivate = isPrivate;

    const user = await updateUser(id, data);
    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const existingUser = await getUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    await deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};


// import prisma from '../db.js';

// export const create = async (req, res) => {
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
//       error: 'Internal server error'
//     });
//   }
// };


// export const list = async (req, res) => {
//   try {
//     const users = await prisma.user.findMany();
//     return res.status(200).json(users);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// };

// export const getOne = async (req, res) => {
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

//     return res.status(200).json(user);
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//       error: 'Internal server error'
//     });
//   }
// };



// export const update = async (req, res) => {
//   try {
//     const id = Number(req.params.id);

//     const existingUser = await prisma.user.findUnique({
//       where: {id}
//     });

//     if (!existingUser) {
//       return res.status(404).json({
//         error: 'User not found'
//       });
//     }
//     const { fullname, bio, isPrivate } = req.body;
//     const data ={};

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
// };



// export const remove =async (req, res) => {
//   try {
//     const id =Number(req.params.id);

//     const user= await prisma.user.findUnique({
//       where : {id }
//     });

//     if (!user ){
//       return res.status(404).json({
//         error:'User not found'
//       });
//     }

//     await prisma.user.delete({
//       where: { id }
//     });

//     return res.status(204).send();
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({
//     error: 'Internal server error'
//     });
//   }

// };