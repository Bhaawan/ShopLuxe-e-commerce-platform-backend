const express=require('express');
const server=express();
const mongoose=require('mongoose');
const cors=require('cors');
const session = require('express-session');
const passport = require('passport');
const crypto = require('crypto');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const jwt = require('jsonwebtoken');

const { createProduct } = require('./controller/Product');
const productsRouter=require('./routes/Products.js')
const categoriesRouter=require('./routes/Categories.js')
const brandsRouter=require('./routes/Brands.js')
const userRouter=require('./routes/Users.js')
const authRouter=require('./routes/Auth.js')
const cartRouter=require('./routes/Carts.js')
const orderRouter=require('./routes/Orders.js');
const { User } = require('./model/User.js');
const { isAuth, sanitizeUser } = require('./services/common.js');

const SECRET_KEY='SECRET_KEY';

var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = SECRET_KEY;


const LocalStrategy=require('passport-local').Strategy;

server.use(session({
    secret: 'keyboard cat',
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
}));
server.use(passport.authenticate('session'));

server.use(cors({
    exposedHeaders:['X-Total-Count']
}))
server.use(express.json());
server.use('/products', isAuth(), productsRouter.router);
server.use('/categories',isAuth(), categoriesRouter.router);
server.use('/brands', isAuth(), brandsRouter.router);
server.use('/users', isAuth(),userRouter.router);
server.use('/auth',authRouter.router);
server.use('/cart', isAuth(),cartRouter.router);
server.use('/orders', isAuth(),orderRouter.router);

passport.use('local',new LocalStrategy(
    {username:'email'},
    async function(email, password, done) {
        try{ 
            const user= await User.findOne({email:email});
            if(!user)
            {
                return done(null,false,{message:'no such user email'});
            }

            crypto.pbkdf2(
                password,
                user.salt,
                310000,
                32,
                'sha256',
                async function (err, hashedPassword) {
                  if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
                    return done(null, false, { message: 'invalid credentials' });
                  }
                  const token = jwt.sign(sanitizeUser(user),SECRET_KEY);
                  done(null, token); // this lines sends to serializer
                }
            );
        }catch(err){
            done(err)
        }
    }
));

passport.use('jwt', new JwtStrategy(opts, async function(jwt_payload, done) {
    console.log({jwt_payload});
    try{
        const user=await User.findOne({id: jwt_payload.sub})
        if (user) {
            return done(null, sanitizeUser(user));
        } else {
            return done(null, false);
            // or you could create a new account
        }
    }
    catch(err){
        return done(err, false);
    }
}));

passport.serializeUser(function(user, cb) {
    console.log('serialize',user)
    process.nextTick(function() {
      return cb(null,{id:user.id, role:user.role});
    });
});
  
  passport.deserializeUser(function(user, cb) {
    console.log('de-serialize',user)
    process.nextTick(function() {
      return cb(null, user);
    });
});


main().catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("database connected");   
}


server.listen(8080, ()=>{
    console.log("server started");
});
