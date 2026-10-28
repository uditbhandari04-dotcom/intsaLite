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
    const page = req.query.page === undefined
      ? 1
      : Number(req.query.page);

    let limit = req.query.limit === undefined
      ? 10
      : Number(req.query.limit);

    const sortBy = req.query.sortBy ?? 'createdAt';
    const order = req.query.order ?? 'desc';

    if (
      !Number.isSafeInteger(page) ||
      page <= 0 ||
      !Number.isSafeInteger(limit) ||
      limit <= 0
    ) {
      return res.status(400).json({
        error: 'page and limit must be positive integers'
      });
    }

    const allowedSortFields = ['createdAt', 'updatedAt'];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        error: 'sortBy must be one of: createdAt, updatedAt'
      });
    }

    if (!['asc', 'desc'].includes(order)) {
      return res.status(400).json({
        error: 'order must be asc or desc'
      });
    }

    limit = Math.min(limit, 50);


const location = req.query.location;
const search = req.query.search;
const from = req.query.from;
const to = req.query.to;

function isValidDate(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value;
}

if (
  (from !== undefined && !isValidDate(from)) ||
  (to !== undefined && !isValidDate(to))
) {
  return res.status(400).json({
    error: 'from and to must be valid dates'
  });
}

const filters = {
  ...(location !== undefined && location.trim() !== '' && {
    location: location.trim()
  }),
  ...(search !== undefined && search.trim() !== '' && {
    search: search.trim()
  }),
  ...(from !== undefined && {
    from
  }),
  ...(to !== undefined && {
    to
  })
};


    const result = await listPosts(page, limit, sortBy, order, filters);

    return res.status(200).json(result);
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
