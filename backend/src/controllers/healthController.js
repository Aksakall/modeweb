export function health(req, res) {
  res.json({
    ok: true,
    service: 'modeweb-backend',
    timestamp: new Date().toISOString()
  });
}
