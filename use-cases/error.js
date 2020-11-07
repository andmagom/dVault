function createError(title, message) {
  return {
    title,
    message,
  };
}

function createErrorHttp(data) {
  const error = {
    error: data.err,
    status: data.status,
  };
  data.res.status(data.status).send(error);
}

module.exports = {
  createError,
  createErrorHttp,
};
