export function notFoundHandler(req, res) {
  return res.status(404).json({
    message: 'Endpoint bulunamadı.',
    code: 'NOT_FOUND'
  });
}
