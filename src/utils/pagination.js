export function getPagination(query) {
  const page = query.page === undefined
    ? 1
    : Number(query.page);

  let limit = query.limit === undefined
    ? 10
    : Number(query.limit);

  if (
    !Number.isSafeInteger(page) ||
    page <= 0 ||
    !Number.isSafeInteger(limit) ||
    limit <= 0
  ) {
    return {
      error: 'page and limit must be positive integers'
    };
  }

  limit = Math.min(limit, 50);

  return { page, limit };
}