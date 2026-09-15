export function notFound(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);

  console.error(`${req.method} ${req.originalUrl}`, err);

  if (err.code === 11000) {
    return res.status(409).json({ message: 'That record already exists.' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON request body.' });
  }

  return res.status(err.status || 500).json({
    message: err.message || 'Server error.',
  });
}
