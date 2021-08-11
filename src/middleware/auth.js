const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth=async (req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token,process.env.SECRET_KEY);
        // console.log(verifyuser);
        const userdata = await Register.findOne({_id:verifyuser.id});
        // console.log(userdata.firstname);
        req.token = token;
        req.userdata = userdata;
        next();
    }catch(error){
        res.status(400).send(`Error Occured ${error}`);
    }
}

module.exports = auth;