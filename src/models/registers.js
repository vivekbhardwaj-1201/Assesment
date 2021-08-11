const mongoose = require("mongoose");
const bcrypt =require("bcryptjs");
const jwt = require('jsonwebtoken');
const StudentSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    phone:{
        type:Number,
    },
    password:{
        type:String,
    },
    lastname:{
        type:String,
    },
    rno:{
        type:Number,
        unique:true,
    },
    gender:{
        type:String,
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

StudentSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({id:this._id.toString()},process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        res.send(err);
        console.log(err);
    }
}
//hashing
StudentSchema.pre("save",async function(next){
    if(this.isModified("password")){
    // console.log(` Before hashing password ${this.password}`);
    this.password = await bcrypt.hash(this.password,10);
    // console.log(`After hashing password ${this.password}`);
    }
    next();
})
//creating collections
const  Register= new mongoose.model("Student",StudentSchema);
 
module.exports=Register;