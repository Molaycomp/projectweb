require("dotenv").config();
const path=require("path");
const express=require("express");
const hbs=require("hbs");
const bcrypt=require("bcryptjs");
const cookieParser=require("cookie-parser");
const multer=require("multer");
//const requests=require("requests");
const app=express();
const port=process.env.PORT || 3000;
require("./db/conn.js");
const Register=require("./models/registers");
const auth=require("./middleware/auth");
const upload=require("./middleware/upload");




const staticPath=path.join(__dirname,"../public");
const templatePath=path.join(__dirname,"../templates/views");
const partialsPath=path.join(__dirname,"../templates/partials");
app.set('view engine','hbs');
app.set('views',templatePath);
hbs.registerPartials(partialsPath);
app.use(express.static(staticPath));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(express.static("uploads"));



app.get('/',(req,res)=>{

  

    res.render("index");

})

app.get('/userdetails', function(req, res) {
    Register.find({active: true},function(e,docs){
    res.render('userdetails', {
      "joblist" : docs
    });
  });
})

  

  app.get("/update/:id",(req,res,next)=>{
      //console.log(req.params.id);
      Register.findOneAndUpdate({_id : req.params.id},req.body,{new:true},(e,docs)=>{
        if(e){
               console.log("not find data for update");
               next(e);
        }
        else{
        res.render('update', {
          joblist : docs
        });
      }
    });
    })



  app.post("/update/:id",(req,res,next)=>{
    Register.findByIdAndUpdate({_id : req.params.id},req.body,(e,docs)=>{
        if(e){
               console.log("Error");
               next(e);
        }
        else{
        res.redirect("/userdetails");
      }
    });
    
});


  app.get("/delete/:id",async(req,res)=>{
    try{
        
        const deleteData=await Register.findByIdAndDelete(req.params.id);
        if(!req.params.id){
            res.status(404).send();  
        }
        else{
            //res.send(deleteData); 
            res.redirect("/userdetails"); 
        }


    }
    catch(e){
        res.status(500).send(e);
    }
})
      
    
   








app.get('/secure',auth,(req,res)=>{
    //console.log("The cookies token is"+req.cookies.jwt);
    res.render("secure");

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


app.post('/register',upload,async(req,res)=>{
    
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
                confirmpassword : req.body.confirm,
                image : req.file.filename
            })

           //console.log(image);
            const token= await registerEmp.generateAuthToken();
            console.log("The token part is"+token);
           
            /*
            res.cookie("jwt",token,{
                expires: new Date(Date.now() + 5000),
                httpOnly : true
            });
            */
            //console.log(cookie);
            
            const registered=await registerEmp.save();
            //console.log("The page part is:"+registered);
            
            res.redirect("/userdetails");

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

        res.cookie("jwt",token,{
            expires: new Date(Date.now() + 50000),
            httpOnly : true
        });

        
        

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

app.get('/logout',auth,async(req,res)=>{
    try{
        // for logout single device//
        /*req.user.tokens=req.user.tokens.filter((currentToken)=>{
            return currentToken.token !== req.token;

        })*/

        // for logout all devices//
        req.user.tokens=[];
        
        res.clearCookie('jwt');
        console.log("Logout successfully");
        await req.user.save();
        res.render("login");

    }
    catch(error){
        res.status(500).send(error);
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