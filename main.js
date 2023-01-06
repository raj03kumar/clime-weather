// get all the necessary elements from the DOM
const app=document.querySelector('.weather-app');
const temp=document.querySelector('.temp');
const dateOutput=document.querySelector('.date');
const timeOutput=document.querySelector('.time');
const conditionOutput=document.querySelector('.condition');
const nameOutput=document.querySelector('.name');
const icon=document.querySelector('.icon');
const cloudOutput=document.querySelector('.cloud');
const humidityOutput=document.querySelector('.humidity');
const windOutput=document.querySelector('.wind');
const form=document.getElementById('locationInput');
const search=document.querySelector('.search');
const btn=document.querySelector('.submit');
const cities=document.querySelectorAll('.city');

//Default city when the page loads
let cityInput="New Delhi";

//Add click event to each city in the panel
cities.forEach((city)=>{
    city.addEventListener('click', (e)=>{
        // change from default city to the clicked one
        cityInput=e.target.innerHTML;
        /*
        Function that fetches and displays all the data from the Weather API(we will write it soon)
        */
       fetchWeatherData();
       //fade out the app (simple animation)
       app.style.opacity="0";
    });
})

//Add submit event to the form 
form.addEventListener('submit', (e)=>{
    // If the input field(search bar) is empty, throw an alert
    if(search.value.length==0){
        alert("Please enter your city name");
    }
    else{
        // change from default city to the one written in the input field
        cityInput=search.value;
        // Function that fetches and displays all the data from the weather api. we will write it soon
        fetchWeatherData();
        // remove all text from the input field
        search.value="";
        // fade out the app (simple animation)
        app.style.opacity="0";
    }

    // prevents the default behaviour of the form
    e.preventDefault();
});

/*
Function that returns a day of the week(Monday, Tuesday, Friday...) from a date (12 03 2021). We will use this function later
*/
function dayOfTheWeek(day, month, year){
    const weekday=[
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thusday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${day}/${month}/${year}`).getDay()];
};

/*Function that fetches and displays the data from teh weather API.
*/
function fetchWeatherData(){
    // Fetch the data and dynamically add the city name with template literals
    // USE YOUR OWN KEY
    fetch(`https://api.weatherapi.com/v1/current.json?key=d2005a7fac4946baab2213651230501&q=${cityInput}&aqi=no`)
    // Take the data (which is in JSON format) and convert it to a regular JS Object
    .then(response=>response.json())
    .then(data=>{
        // you can console log the data to see what is available
        console.log(data);

        // let's start by adding the temperature and weather condition to the page
        // note here temp_c is apii data meaning temp in celcius.
        temp.innerHTML=data.current.temp_c+"&#176;";
        conditionOutput.innerHTML=data.current.condition.text;

        // get the date and time from the city and extract the day, month, year and time into individual varaibles
        const date=data.location.localtime;
        const y=parseInt(date.substr(0,4));
        const m=parseInt(date.substr(5,2));
        const d=parseInt(date.substr(8,2));
        const time=date.substr(11);

        /*Reformat the date into something more appealing and add it to the page
        Original Format: 2023-01-06 17:53
        New format: 17:53 - Friday 6, 01 2023
        */
       dateOutput.innerHTML=`${dayOfTheWeek(d,m,y)} ${d}, ${m} ${y}`;
       timeOutput.innerHTML=time;
        // add the name of the city into the page
        nameOutput.innerHTML=data.location.name;
        /*Get the corresponding icon url for the weather and extract a part of it
        */
       const iconId=data.current.condition.icon.substr("//cdn.weatherapi.com/weather/64x64/".length);
       /*Reformat the icon url to your own local folder path and add it to the page */
       icon.src="/icons/"+iconId;

        // Add the weather details to the page
        cloudOutput.innerHTML=data.current.cloud+"%";
        humidityOutput.innerHTML=data.current.humidity+"%";
        windOutput.innerHTML=data.current.wind_kph+"km/h";

        // Set default time of day
        let timeOfDay="day";
        // get the unique id for each weather condition
        const code=data.current.condition.code;

        // change to night if its night time in the city
        if(!data.current.is_day){
            timeOfDay="night";
        }

        if(code==1000){
            // set the background image to clear if the weather is clear
            app.style.backgroundImage=`url(/images/${timeOfDay}/clear.jpg)`;
            // change the button background bg color depending on if its day or night
            btn.style.background="#e5ba92";
            if(timeOfDay=="night"){
                btn.style.background="#181e27";
            }
        }
        // same thing for cloudy weather
        else if(code==1003 ||
                code==1006 ||
                code==1009 ||
                code==1030 ||
                code==1069 ||
                code==1087 ||
                code==1135 ||
                code==1273 ||
                code==1276 ||
                code==1279 ||
                code==1282)
        {
            app.style.backgroundImage=`url(/images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background="#fa6d1b";
            if(timeOfDay=="night"){
                btn.style.background="#181e27";
            }
        }
        // for rain
        else if(
            code==1063 ||
            code==1069 ||
            code==1072 ||
            code==1150 ||
            code==1153 ||
            code==1180 ||
            code==1183 ||
            code==1186 ||
            code==1189 ||
            code==1192 ||
            code==1195 ||
            code==1204 ||
            code==1207 ||
            code==1240 ||
            code==1243 ||
            code==1246 ||
            code==1249 ||
            code==1252
        ){
            app.style.backgroundImage=`url(/images/${timeOfDay}/rainy.jpg)`;
            btn.style.background="#647d75";
            if(timeOfDay=="night"){
                btn.style.background="#325c80";
            }
        }
        // and finally snow
        else{
            app.style.backgroundImage=`url(/images/${timeOfDay}/snowy.jpg)`;
            btn.style.background="#4d72aa";
            if(timeOfDay=="night"){
                btn.style.background="#1b1b1b";
            }
        }

        // fade in the page once all is done
        app.style.opacity="1";
    })
    // If the user types a city that doesn't exist, throw an alert
    .catch(()=>{
        alert('City not found, please try again');
        app.style.opacity="1";
    });
}

// call the function on page load
fetchWeatherData();

// fade in the page
app.style.opacity="1";


// disabling inspect element
document.addEventListener("contextmenu", function(e){
    e.preventDefault(); //this prevents right click
});
document.onkeydown=function(e){
    if(event.keycode==123){
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode=="I".charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode=="C".charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.shiftKey && e.keyCode=="J".charCodeAt(0)){
        return false;
    }
    if(e.ctrlKey && e.keyCode=="U".charCodeAt(0)){
        return false;
    }
};