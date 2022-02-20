require("dotenv").config();
const path=require("path");
const express=require("express");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
//const requests=require("requests");
const app=express();
const port=process.env.PORT || 3000;
require("./db/conn.js");
const Register=require("./models/registers");




const staticPath=path.join(__dirname,"../public");
const templatePath=path.join(__dirname,"../templates/views");
const partialsPath=path.join(__dirname,"../templates/partials");
app.set('view engine','hbs');
app.set('views',templatePath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));

app.use(express.json());
app.use(express.urlencoded({extended:false}));



app.get('/',(req,res)=>{
    res.render("index");

})

app.get('/about',(req,res)=>{
    res.render("about");

})

app.get('/weather',(req,res)=>{
    res.render("weather");

})

app.get('/register',(req,res)=>{
    res.render("register");

})


// Register with bcrypt//


app.post('/register',async(req,res)=>{
    
    try{
        const password = req.body.password;
        
        if(password===req.body.confirm){
            const registerEmp= new Register({
                fname : req.body.fname,
                lname : req.body.lname,
                email : req.body.email,
                gender : req.body.gender,
                phoneno : req.body.phone,
                age : req.body.age,
                password : password,
                confirmpassword : req.body.confirm
            })


            const token= await registerEmp.generateAuthToken();
            console.log("The token part is"+token);
            
            const registered=await registerEmp.save();
            console.log("The page part is:"+registered);
            res.status(201).render("index");

        }
        else{
            res.send("password are not matching");
        }
    }
    catch(error){
        res.status(400).send(error);
    }

})



app.get('/login',(req,res)=>{
    res.render("login");

})




//login with bcrypt password//

app.post('/login',async(req,res)=>{
    try{
        const email= req.body.email;
        const password= req.body.password;
        const useremail=await Register.findOne({email:email});

  
        const isMatch=await bcrypt.compare(password,useremail.password);
        const token= await useremail.generateAuthToken();
        console.log("The token part is"+token);

        if(isMatch){
           res.status(201).render("index");
        }
        else{
            res.send("invalid login");
        }
        

    }
    catch(error){
        res.status(400).send("invalid email");
    }



   
})

app.get('*',(req,res)=>{
    res.render("404error",{
        errormsg : "oops page not found please go back"
    });

})







app.listen(port,()=>{
    console.log(`Listening the port ${port}`);
})