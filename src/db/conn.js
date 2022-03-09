const mongoose=require("mongoose")

const db="mongodb+srv://molay:molaygiri@cluster0.26kgb.mongodb.net/projecdbb?retryWrites=true&w=majority";

mongoose.connect(db,{
    useNewUrlParser : true,
    
})
.then( ()=>console.log("connection successful.....") )
.catch((err)=> console.log(err));


/*
mongoose.connect(process.env.DB_CONNECT)
.then( ()=>console.log("connection successful.....") )
.catch((err)=> console.log(err));
*/

