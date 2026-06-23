export function pagination(query = {}) {
  const page = Math.max(1, Number(query.page || 1));
  const limit = Math.min(100, Math.max(1, Number(query.limit || 24)));
  return {
    page,
    limit,
    skip: (page - 1) * limit,
    take: limit
  };
}
