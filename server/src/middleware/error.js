export function notFoundHandler(_req, res, _next) {
  res.status(404).json({ success: false, message: 'Not Found' });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(status).json({ success: false, message });
}


