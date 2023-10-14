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
                obtainTodayData(chosenCityLon, chosenCityLat);
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
                console.log(data);
            })
        }
        else {
            alert('Error ' + response.status + ': ' + response.statusText);
        }
    })
}


/* ---------------------- Weather Forecast Handling ---------------------- */


/* ---------------------- Data Storage ---------------------- */