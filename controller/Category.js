const { Category } = require("../model/Category");

exports.fetchCategories=async(req,res)=>{
    try{
        const categories=await Category.find({}).exec();
        res.status(200).json(categories);
    }catch(err){
        res.status(400).json(err);
    }
};

exports.createCategory=async(req,res)=>{
    const category=new Category(req.body);
    try{ 
        const result=await category.save();
        res.status(200).json(result);
    }catch(err){
        res.status(400).json(err);
    }
};