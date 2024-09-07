const express=require('express');
const server=express();
const mongoose=require('mongoose');
const cors=require('cors')

const { createProduct } = require('./controller/Product');
const productsRouter=require('./routes/Products.js')
const categoriesRouter=require('./routes/Categories.js')
const brandsRouter=require('./routes/Brands.js')
const userRouter=require('./routes/Users.js')
const authRouter=require('./routes/Auth.js')
const cartRouter=require('./routes/Carts.js')
const orderRouter=require('./routes/Orders.js')

server.use(cors({
    exposedHeaders:['X-Total-Count']
}))
server.use(express.json());
server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/brands', brandsRouter.router);
server.use('/users',userRouter.router);
server.use('/auth',authRouter.router);
server.use('/cart',cartRouter.router);
server.use('/orders',orderRouter.router);


main().catch(err=>console.log(err));

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log("database connected");   
}


server.get('/',(req,res)=>{
    res.json({status:"Success"})
})


server.listen(8080, ()=>{
    console.log("server started");
});
