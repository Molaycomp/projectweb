const bcrypt=require("bcryptjs");

const checkp= async(password)=>{
    const np=await bcrypt.hash(password,10);
    console.log(np);
    
    const cp= await bcrypt.compare(password,np);
    console.log(cp);


}


checkp("molay@123")