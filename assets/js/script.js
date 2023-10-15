/* ---------------------- Open Weather API Key ---------------------- */
const apiKey = '36d68183b792de93fe129695d1ec1458';

/* ---------------------- Initialise Variables ---------------------- */

// Search Section Variables
var cityInputEl = document.getElementById('city-input');
var searchBtnEl = document.getElementById('search-button');
var searchHistEl = document.getElementById('search-history');
var clearBtnEl = document.getElementById('clear-button');

// Chosen City Variables
var chosenCityEl = document.getElementById('chosen-city');
var chosenCountryEl = document.getElementById('chosen-country');

// Today's Weather Variables
var todayTempEl = document.getElementById('today-temp');
var todayWindEl = document.getElementById('today-wind');
var todayHumidityEl = document.getElementById('today-humidity');
var todayIconEl = document.getElementById('today-icon');
var todayDateEl = document.getElementById('today-date');

// Forecast Weather Variables
var forecastTempEls = document.querySelectorAll('.forecast-temp');
var forecastWindEls = document.querySelectorAll('.forecast-wind');
var forecastHumidityEls = document.querySelectorAll('.forecast-humidity');
var forecastIconEls = document.querySelectorAll('.forecast-icon');
var forecastDateEls = document.querySelectorAll('.forecast-date');

/* ---------------------- User Input Handling ---------------------- */

// Assign user input to chosenCity variable
var assignCity = event => {
    event.preventDefault();
    var chosenCity = cityInputEl.value

    // Alert user if user input is "falsy" (i.e. null, undefined, false, 0, etc)
    if (!chosenCity) {
        alert('Please enter a city!');
        return;
    }

    obtainLonLatValues(chosenCity);
    storeCity(chosenCity);
    cityInputEl.value = ''
}

searchBtnEl.addEventListener('click', assignCity);

// Obtain longitude and langitude of chosenCity
var obtainLonLatValues = chosenCity => {
    // Open Weather API URL for geocoding
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + chosenCity + '&limit=1&appid=' + apiKey;
    fetch(apiUrl)
    .then(response => {
        if (response.ok) {
            response.json()
            .then(data => {
                var chosenCityLon = data[0].lon;
                var chosenCityLat = data[0].lat;
                var chosenCityCountry = data[0].country;
                chosenCityEl.textContent = chosenCity;
                chosenCountryEl.textContent = chosenCityCountry;
                obtainTodayData(chosenCityLon, chosenCityLat);
                obtainForecastData(chosenCityLon, chosenCityLat)
            })
        }
        else {
            alert('Error ' + response.status + ': ' + response.statusText);
        }
    })
}


/* ---------------------- Today's Weather Handling ---------------------- */

// Obtain today's weather data for chosenCity
var obtainTodayData = (longitude, latitude) => {
    var apiDataUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,daily,alerts&units=metric' + '&appid=' + apiKey;
    fetch(apiDataUrl)
    .then(response => {
        if (response.ok) {
            response.json()
            .then(data => {
                todayTempEl.textContent = data.list[0].main.temp;
                todayWindEl.textContent = data.list[0].wind.speed;
                todayHumidityEl.textContent = data.list[0].main.humidity;
                var todayIconID = data.list[0].weather[0].icon;
                var todayIconUrl = 'https://openweathermap.org/img/wn/' + todayIconID + '@2x.png'
                todayIconEl.setAttribute('src', todayIconUrl);
                todayDateEl.textContent = dayjs(data.list[0].dt_txt).format('dddd D MMMM, YYYY');
            })
        }
        else {
            alert('Error ' + response.status + ': ' + response.statusText);
        }
    })
}

/* ---------------------- Weather Forecast Handling ---------------------- */

// Display Weather Forecast for relevant Day
var obtainForecastData = (longitude, latitude) => {
    var apiDataUrl = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + latitude + '&lon=' + longitude + '&exclude=minutely,hourly,daily,alerts&units=metric' + '&appid=' + apiKey;
    fetch(apiDataUrl)
    .then(response => {
        if (response.ok) {
            response.json()
            .then(data => {
                for (var i = 0; i < forecastDateEls.length; i++){
                    // Note below i in list[i] needs to be updated to list[i+5 or something]
                    forecastTempEls[i].textContent = data.list[(i+1)*8-1].main.temp;
                    forecastWindEls[i].textContent = data.list[(i+1)*8-1].wind.speed;
                    forecastHumidityEls[i].textContent = data.list[(i+1)*8-1].main.humidity;
                    var forecastIconID = data.list[(i+1)*8-1].weather[0].icon;
                    var forecastIconUrl = 'https://openweathermap.org/img/wn/' + forecastIconID + '@2x.png'
                    forecastIconEls[i].setAttribute('src', forecastIconUrl);
                    forecastDateEls[i].textContent = dayjs(data.list[(i+1)*8-1].dt_txt).format('dddd D MMMM, YYYY');
                }
            })
        }
        else {
            alert('Error ' + response.status + ': ' + response.statusText);
        }
    })
}

/* ---------------------- Data Storage ---------------------- */

// Store chosenCity input and display storedCities as buttons
var storeCity = chosenCity => {
    // Convert storedCities string to JSON object and assign to storedCities variable for processing
    var storedCities = JSON.parse(localStorage.getItem("storedCities"))

    if (storedCities === null) {
        storedCities = [chosenCity];
    } else {
        storedCities.push(chosenCity);
    }

    // Update storedCities key in localStorage and store as string
    localStorage.setItem("storedCities", JSON.stringify(storedCities));
    
    // Resets inner HTML within search-history element
    searchHistEl.innerHTML = '';

    // Obtains unique list in reverse order
    var uniqueStoredCities = storedCities.filter((item, index, array) => array.indexOf(item) === index);
    uniqueStoredCities = uniqueStoredCities.reverse();

    // Creates a button for each element in storedCities
    if (uniqueStoredCities !== null) {
        for (var i = 0; i < uniqueStoredCities.length; i++) {
            var city = uniqueStoredCities[i];
            var li = document.createElement("li");
            li.classList = 'btn btn-secondary btn-dark btn-sm btn-block d-block';
            li.textContent = city;
            searchHistEl.appendChild(li);
        }
    }
}

// For clicked button in search history, display weather (today + forecast)
searchHistEl.addEventListener('click', function(event) {
    var clickedCity = event.target.innerHTML;
    obtainLonLatValues(clickedCity);
})

// When clear button clicked, clear search history
clearBtnEl.addEventListener('click', function(event) {
    searchHistEl.innerHTML = '';
    localStorage.clear();
})

// Autopopulate with Sydney Weather when page loads
window.addEventListener('load', function() {
    obtainLonLatValues('Sydney');
    var distinctCities = JSON.parse(localStorage.getItem("storedCities")).filter((item, index, array) => array.indexOf(item) === index).reverse();
    // Creates a button for each element in distinctCities
    if (distinctCities !== null) {
        for (var i = 0; i < distinctCities.length; i++) {
            var city = distinctCities[i];
            var li = document.createElement("li");
            li.classList = 'btn btn-secondary btn-dark btn-sm btn-block d-block';
            li.textContent = city;
            searchHistEl.appendChild(li);
        }
    }
});