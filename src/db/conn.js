const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Assignment",{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true,
    useFindAndModify:true, 
}).then(()=>{
    console.log(`Connection Successful`);
}).catch((err)=>{
    console.log(`Sorry! Some Error Occured ${err}`)
})