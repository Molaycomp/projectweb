const mongoose=require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");

const employeeSchema=new mongoose.Schema({
    
    fname : {
        type : String,
        required : true,
     
    },
    lname : {
        type : String,
        required : true,
     
    },
    email :{
        type : String,
        required : true,
        unique : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid");
            }
        }
    },
    gender : {
        type : String,
        required : true,
     
    },
    phoneno : {
        type : Number,
        required : true,
        unique : true
     
    },

    age : {
        type : Number,
        required : true,
     
    },

    password : {
        type : String,
        required : true,
     
    },
    confirmpassword : {
        type : String,
        required : true,
     
    },
    tokens:[{
           token:{
            type : String,
            required : true,

           }
    }]


})

// Token middleware//
employeeSchema.methods.generateAuthToken= async function(){
    try{
        const token= jwt.sign({_id : this._id},process.env.SECRET_KEY);
        this.tokens=this.tokens.concat({token:token});
        await this.save();
        return token;

    }
    catch(error){
        res.send("The error part is"+error);
        console.log("The error part is"+error);
    }
}


// hash middleware//
employeeSchema.pre("save", async function(next){

    if(this.isModified("password")){

    this.password=await bcrypt.hash(this.password,10);
    
    //this.confirmpassword=undefined;
    }
    next();
})


//Model creation//
const Register=new mongoose.model("Register",employeeSchema);

module.exports=Register;