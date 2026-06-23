export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error?.name === 'ZodError') {
    return res.status(400).json({
      message: 'Gönderilen bilgiler geçersiz.',
      code: 'VALIDATION_ERROR',
      fields: error.flatten?.().fieldErrors || {}
    });
  }

  if (error?.code === 'P2002') {
    const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : error.meta?.target;
    const messages = {
      email: 'Email zaten kayıtlı.',
      sku: 'SKU zaten kullanılıyor.',
      slug: 'Slug zaten kullanılıyor.'
    };
    return res.status(409).json({
      message: messages[target] || 'Benzersiz olması gereken bir alan zaten kullanılıyor.',
      code: 'UNIQUE_CONSTRAINT',
      fields: { target }
    });
  }

  if (error?.code === 'P2003') {
    return res.status(400).json({
      message: 'İlişkili kayıt bulunamadı. Lütfen kategori, ürün veya kullanıcı bağlantılarını kontrol edin.',
      code: 'RELATION_NOT_FOUND',
      fields: { field: error.meta?.field_name }
    });
  }

  if (error?.code === 'P2025') {
    return res.status(404).json({
      message: 'Kayıt bulunamadı.',
      code: 'RECORD_NOT_FOUND',
      fields: {}
    });
  }

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
