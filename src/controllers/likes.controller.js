import {
  createLike,
  deleteLike
} from '../services/likes.service.js';

export const likePost = async (req, res) => {
  try {
    const { userId } = req.body;

    // 1. Validate userId
    if (
      userId === undefined ||
      userId === null ||
      userId === '' ||
      !Number.isInteger(Number(userId))
    ) {
      return res.status(400).json({
        error: 'userId is required'
      });
    }

    const postId = Number(req.params.id);
    const parsedUserId = Number(userId);

    // 2. Create like
    const like = await createLike(postId, parsedUserId);

    if (like?.error === 'Post not found') {
      return res.status(404).json({
        error: 'Post not found'
      });
    }

    if (like?.error === 'User not found') {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    return res.status(201).json(like);

  } catch (error) {
    // 3. Handle duplicate like
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Already liked'
      });
    }

    console.error('POST /posts/:id/likes error:', error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};


export const unlikePost = async (req, res) => {
  try {
    const postId = Number(req.params.id);
    const userId = Number(req.params.userId);

    await deleteLike(postId, userId);

    return res.status(204).send();

  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({
        error: 'Like not found'
      });
    }

    console.error('DELETE /posts/:id/likes/:userId error:', error);

    return res.status(500).json({
      error: 'Internal server error'
    });
  }
};