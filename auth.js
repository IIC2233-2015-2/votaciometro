'use strict';

const basicAuth = require('basic-auth');

module.exports = function auth(USER, PASS) {
  return (req, res, next) => {
    function unauthorized(res) {
      res.set('WWW-Authenticate', 'Basic realm=Authorization Required');
      return res.sendStatus(401);
    };

    const user = basicAuth(req);

    if (!user || !user.name || !user.pass) {
      return unauthorized(res);
    };

    const authed = user.name === USER && user.pass === PASS
    return authed ? next() : unauthorized(res);
  };
}
