require('dotenv').config();
const express = require("express");
const app = express();
const hbs = require("hbs");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt =require("bcryptjs");
const auth = require("./middleware/auth");
const cookieParser = require("cookie-parser");
require("./db/conn")
const Register = require('./models/registers');
const view_path = path.join(__dirname,"../templates/views");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
// console.log(view_path);
const partials_path = path.join(__dirname,"../templates/partials");
// console.log(partials_path);
const port = process.env.PORT ||3000;
app.set("view engine","hbs");
app.set("views",view_path);
hbs.registerPartials(partials_path);

app.get("/",(req,res)=>{
    res.render("login");
})
app.get("/register",(req,res)=>{
    res.render("register");
})

app.get("/profile",auth,(req,res)=>{
   res.render("profile")
})

app.get("/login",(req,res)=>{
    res.render("login");
})   

app.get("/updatePassword",auth,(req,res)=>{
    res.render("updatePassword");
})
app.get("/logout",auth,async(req,res)=>{
    try{
        // searching values in tokens array and filtering out the latest token and keep te rest same this will remove the user authentication from database
        req.userdata.tokens = req.userdata.tokens.filter((currElement)=>{
            return currElement.token !== req.token
        })
        // console.log(req.userdata.firstname);
        res.clearCookie("jwt");
        console.log("Logout Successful");
        await req.userdata.save();
        console.log()
        res.render("login");
    }catch(err){
        res.status(500).send(err);
    }
})

app.post("/register", async(req,res)=>{
    try{
        //Updating values to the database
        const registerStudent = new Register({
            firstname : req.body.firstname,
            lastname : req.body.lastname,
            email : req.body.email,
            phone : req.body.phone,
            password : req.body.password,
            rno : req.body.rno,
            gender : req.body.gender
        })
        //generating token at the time of registration
        const token = await registerStudent.generateAuthToken();
        res.cookie("jwt",token,{
            expires:new Date(Date.now() + 900000),//token expires every 15 mins from cookies
            httpOnly:true
        });

        const registered = await registerStudent.save();
        res.status(200).render("register");

    }catch(err){
        res.status(400).send(err)
    }
})
app.get("/index",auth,async(req,res)=>{
    res.status(200).render("index");
})
app.post("/login",async(req,res)=>{
    try{
        const rno=req.body.rno;
        const password=req.body.password;
        const registrationno = await Register.findOne({rno:rno});
        const Match = await bcrypt.compare(password,registrationno.password);
        // console.log(` Password saved in database hashed  ${registrationno.password}`);
        // console.log(`normal saved password ${password}`);
        // console.log(Match);
        const token = await registrationno.generateAuthToken(); //Generrating tokens every time user login
        res.cookie("jwt",token,{
            expires:new Date(Date.now() + 900000),
            httpOnly:true
        });
        if(Match){
            res.status(201).render("index");
        }
        else{
            res.status(201).send("Deatils Mismatch");
        }
    }catch(err){
        res.status(400).send(`Details Mismatch ${err}`);
    }
})
app.post("/profile",auth,async(req,res)=>{
    try{
        // console.log(req.userdata.rno);
        const first = req.userdata.firstname;
        const last = req.userdata.lastname;
        const phon = req.userdata.phone;
        const Email = req.userdata.email;
        // console.log(first);
        // console.log(req.body.firstname);
        const update = await Register.updateOne({firstname:first},{$set:{firstname:req.body.firstname}});
        const updateL = await Register.updateOne({lastname:last},{$set:{lastname:req.body.lastname}});
        const updateP = await Register.updateOne({phone:phon},{$set:{phone:req.body.phone}});
        const updateE = await Register.updateOne({email:Email},{$set:{email:req.body.email}});
        // console.log(updateL);
        res.status(200).render("profile");

    }catch(err){
        res.status(400).send(`Error Occured ${err}`);
    }
})

app.listen(port,()=>{
    console.log(`listening to port no. ${port}`);
})