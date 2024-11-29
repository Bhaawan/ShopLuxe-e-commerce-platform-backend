const passport = require('passport');
const nodemailer=require('nodemailer');

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
  //token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZWE5NDhlMDdlMWVhOTNkZGNjZWQ5OSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzI2NjQ5NDg2fQ.ib0pKOgmJ0uSbmz-WFUkltu5pxO-Co-VDGrDvERt5mQ"

  return token;
};

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: "bhaawan272002@gmail.com",
    pass: "ixsr ecmb rktw qrer",
  },
});

exports.sendMail=async function({to,subject,text,html}){
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"E-commerce" <order@ecommerce.com>', // sender address
      to,
      subject,
      text,
      html
    });
    
    return info;
}