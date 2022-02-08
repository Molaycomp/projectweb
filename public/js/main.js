const submitbtn=document.getElementById("submitbtn");

const cityname=document.getElementById('cityname');
const city_name=document.getElementById('city_name');
const temp=document.getElementById('temp');
const temp_status=document.getElementById('temp_status');



const getinfo = async(event) =>{
    event.preventDefault();
    let cityval=cityname.value;
    
    
    
    if(cityval === ""){

         city_name.innerText=`please write your city name`;

    }
    else{
        try{
        let url= `https://api.openweathermap.org/data/2.5/weather?q=${cityval}&units=metric&appid=ea529c73d060467b5ac9c780b01c8bff`;
        const response= await fetch(url);
        const data=await response.json();
        const arrData=[data];
        city_name.innerText=arrData[0].name;
        temp.innerText=arrData[0].main.temp;
        
        
        const tempmod=arrData[0].weather[0].main;

        if(tempmod==='Clear'){
            temp_status.innerHTML="<i calss='fas fa-sun' style='color : #eccc68;'></i>";
        }
        else if(tempmod==='Clouds'){
            temp_status.innerHTML="<i calss='fas fa-cloud' style='color : #f1f2f6;'></i>";  
        }
        else if(tempmod==='Rain'){
            temp_status.innerHTML="<i calss='fas fa-cloud-rain' style='color : #a4b0be;'></i>";
        }
        else{
            temp_status.innerHTML="<i calss='fas fa-sun' style='color : #eccc68;'></i>";

        }






        console.log(data);
        }
        catch{
            city_name.innerText=`please enter your city name properly`;
        }



    }

}

submitbtn.addEventListener('click',getinfo);