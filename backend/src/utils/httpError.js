export function httpError(status, message, code = 'REQUEST_ERROR', fields = {}) {
  const error = new Error(message);
  error.status = status;
  error.code = code;
  error.fields = fields;
  return error;
}
