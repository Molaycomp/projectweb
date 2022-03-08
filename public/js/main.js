const submitbtn=document.getElementById("submitbtn");

const cityname=document.getElementById('cityname');
const city_name=document.getElementById('city_name');
const temp_real_val=document.getElementById('temp_real_val');
const temp_status=document.getElementById('temp_status');
const datahide=document.querySelector(".middle-layer");



const getinfo = async(event) =>{
    event.preventDefault();
    let cityval=cityname.value;
    
    
    
    if(cityval === ""){

         city_name.innerText=`please write your city name`;
         datahide.classList.add("data_hide");

    }
    else{
        try{
        let url= `https://api.openweathermap.org/data/2.5/weather?q=${cityval}&units=metric&appid=ea529c73d060467b5ac9c780b01c8bff`;
        const response= await fetch(url);
        const data=await response.json();
        const arrData=[data];
        city_name.innerText=arrData[0].name;
        temp_real_val.innerText=arrData[0].main.temp;
        
        
        const tempmod=arrData[0].weather[0].main;

        if(tempmod==='Clear'){
            temp_status.innerHTML="<i calss='fas fa-sun' aria-hidden='true' style='color : #eccc68;'></i>";
        }
        else if(tempmod==='Clouds'){
            temp_status.innerHTML="<i class='fas fa-cloud' aria-hidden='true' style='color : #42b0d1;'></i>";  
        }
        else if(tempmod==='Rain'){
            temp_status.innerHTML="<i class='fa-solid fa-cloud-drizzle' style='color : #42b0d1;'></i>";
        }
        else{
            temp_status.innerHTML="<i class='fas fa-sun' aria-hidden='true' style='color : #eccc68;'></i>";

        }
        datahide.classList.remove("data_hide");





        console.log(data);
        }
        catch{
            city_name.innerText=`please enter your city name properly`;
            datahide.classList.add("data_hide");
        }



    }

}

submitbtn.addEventListener('click',getinfo);