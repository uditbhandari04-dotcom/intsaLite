import {
  createPost,
  listPosts,
  getPostById,
  updatePost,
  deletePost
} from '../services/posts.service.js';

export const create = async (req, res) => {
  try {
    const { imageUrl, caption, location, userId } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        error: 'imageUrl is required'
      });
    }

    if (userId === undefined || !Number.isInteger(Number(userId))) {
      return res.status(400).json({
        error: 'userId is required and must be a valid integer'
      });
    }

    const post = await createPost({
      imageUrl,
      caption,
      location,
      user: {
        connect: { id: Number(userId) }
      }
    });

    return res.status(201).json(post);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    console.error('POST /posts error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};










export const list = async (req, res) => {
  try {
    const posts = await listPosts();
    return res.status(200).json(posts);
  } catch (error) {
    console.error('GET /posts error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};

export const getOne = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const post = await getPostById(id);

    if (!post) {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('GET /posts/:id error:', error);
    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};


export const update = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const data = {};

    if (req.body.caption !== undefined) {
      data.caption = req.body.caption;
    }

    if (req.body.location !== undefined) {
      data.location = req.body.location;
    }

    const post = await updatePost(id, data);

    return res.status(200).json(post);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    console.error('PATCH /posts/:id error:', error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};



export const remove = async (req, res) => {
  try {
    const id = Number(req.params.id);

    await deletePost(id);

    return res.status(204).end();
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    console.error('DELETE /posts/:id error:', error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};
