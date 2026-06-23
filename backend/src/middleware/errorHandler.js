export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  const status = error.status || error.statusCode || 500;
  const message = status >= 500 ? 'Beklenmeyen bir sunucu hatası oluştu.' : error.message;

  if (status >= 500) {
    console.error(error);
  }

  return res.status(status).json({
    message,
    code: error.code || 'SERVER_ERROR',
    fields: error.fields || {}
  });
}
