export function listResponse(items = [], options = {}) {
  const page = Number(options.page || 1);
  const limit = Number(options.limit || items.length || 24);
  const total = Number(options.total ?? items.length);

  return {
    items,
    total,
    page,
    limit,
    totalPages: total === 0 ? 0 : Math.ceil(total / Math.max(1, limit))
  };
}
