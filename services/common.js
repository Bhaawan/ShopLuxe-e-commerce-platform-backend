const passport = require('passport');

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt')
};

exports.sanitizeUser = (user)=>{
    return {id:user.id, role:user.role}
}

exports.cookieExtractor = function(req) {
  let token = null;
  if (req && req.cookies) {
      token = req.cookies['jwt'];
  }
  token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWE5NDhlMDdlMWVhOTNkZGNjZWQ5OSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI2NjQ5NDg2fQ.ib0pKOgmJ0uSbmz-WFUkltu5pxO-Co-VDGrDvERt5mQ"

  return token;
};