function getAuth(authHeader) {
  const auth = Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
  const username = auth[0];
  const password = auth[1];
  return {
    username,
    password,
  };
}

function createSession(session, dataSession, body) {
  // eslint-disable-next-line no-param-reassign
  session.username = dataSession.username;
  return body;
}

module.exports = {
  getAuth,
  createSession,
};
