const weatherUrl = "https://api.openweathermap.org/data/2.5/weather";
//To convert temperature from kelvins to farenheit// 
const queryString = "?units=imperial&appid=d928ffc4aa1b3bdd98b858a5a8fc2883&";
const fetchURL = weatherUrl + queryString
const btn = document.querySelector('button');
const weatherEl = document.getElementById('weather');
const weatherSearchEl = document.getElementById('weather-search');

//Open Weather API using JavaScript Fetch API//
async function getWeatherData(city) {
    try {
        //Template literals  and string interpolation//
        const response = await fetch(`${fetchURL}q=${city}`);
        console.log('The response from the API is: ', response);
        const responseAsJson = await response.json();
        console.log('The response as JSON is: ', JSON.stringify(responseAsJson));
        return responseAsJson;
    } catch(error){
        console.log('Failed to get a successful response from the API');  
        return Promise.reject(error);
    }
}
//Converting a named function declaration into a arrow function//
const getGoogleMapsUrl = (coords) => {
    //Object destructuring//
    const {lat,lon} = coords;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`;
}

function displayWeatherData(weatherData) {
    console.log('Displaying the provided weather data', weatherData);
    // Clear the elements from previous search
    weatherEl.textContent = '';
     //Object destructuring and renaming the variable//
    const {name: cityName} = weatherData;

    // Add the City and country to the UI
    //Notify the user that a location is not found//
    const cityCountryEl = document.createElement('h2');
    if (!cityName) {
        cityCountryEl.textContent = 'Location not found';
    } else {
        cityCountryEl.textContent = `${cityName}, ${weatherData.sys.country}`;
    }
    weatherEl.appendChild(cityCountryEl);

    // Add the Google Maps link on screen//
    //Template literals  and string interpolation//
    const googleMapsLink = `<a href="${getGoogleMapsUrl(weatherData.coord)}" target="__BLANK">Click to view map</a>`;
    weatherEl.innerHTML += googleMapsLink;

    //Add image on screen//
    const imageEl = document.createElement('img');
    imageEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + weatherData.weather[0].icon + '@2x.png');
    weatherEl.appendChild(imageEl);

    //Add condition on screen//
    const conditionEl = document.createElement('p');
    conditionEl.style.textTransform = 'capitalize';
    conditionEl.textContent = weatherData.weather[0].description;
    weatherEl.appendChild(conditionEl);

    //Add current temperature on screen//
    const currentTempEl = document.createElement('p')
    currentTempEl.textContent = 'Current: ' + weatherData.main.temp + '° F';
    weatherEl.appendChild(currentTempEl);

    //Add feels like on screen//
    const feelsLikeEl = document.createElement('p')
    feelsLikeEl.textContent = 'Feels Like: ' + weatherData.main.feels_like + '° F';
    weatherEl.appendChild(feelsLikeEl);

    //Last Updated Time//
    const date = new Date(weatherData.dt * 1000);
    const timeString = date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })
    const lastUpdatedEl = document.createElement('p')
    lastUpdatedEl.textContent = 'Last updated:' + timeString;
    weatherEl.appendChild(lastUpdatedEl);
}


function load() {
    //Access the form//
    const formEl = document.querySelector('#weather-app form');
    //When the form is submitted, only the input field and search button should be visible // 
    formEl.onsubmit = function (eventProperties) {
        eventProperties.preventDefault()
        console.log('submitted', eventProperties)

        const enteredCity = weatherSearchEl.value.trim();
        if (enteredCity == '') {
            return;
        }
        weatherSearchEl.value = '';
        // Clear the inputted value after the search
        console.log('The user city entered is:', enteredCity);
        //Converting a function declaration into a arrow function//
        getWeatherData(enteredCity).then((weatherData) => {
            console.log('The weather data for the city ' + enteredCity, weatherData)
            displayWeatherData(weatherData);
        }).catch(function(error){
            const cityCountryEl = document.createElement('h2');
            cityCountryEl.textContent = 'Please try again later';
            weatherEl.appendChild(cityCountryEl);
        });
    }
}
load();