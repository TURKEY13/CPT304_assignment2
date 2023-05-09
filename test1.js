// Fetch countries when the page is loaded
document.addEventListener('DOMContentLoaded', fetchCountries);

async function fetchCountries() {
    // Use the REST Countries API to get the list of countries
    const countriesResponse = await fetch('https://restcountries.com/v3.1/all');
    const countries = await countriesResponse.json();

    displayCountries(countries);
}

function displayCountries(countries) {
    const countrySelect = document.getElementById('country');
    countrySelect.innerHTML = '<option value="">Select a country</option>';

    countries.forEach(country => {
        const countryOption = document.createElement('option');
        countryOption.value = country.cca2; // Use the 2-letter country code as the value
        countryOption.innerText = country.name.common; // Use the common name of the country
        countrySelect.appendChild(countryOption);
    });
}

async function fetchCities() {
    const country = document.getElementById('country').value;
    if (!country) {
        return;
    }

    // Use a cities API to get the cities for the selected country
    const citiesResponse = await fetch(`https://api.api-ninjas.com/v1/city?country=${country}&limit=30`, {
        method: "GET",
        headers: {
            'X-Api-Key': 'N+XqoTtRmL9A3euG1i8Cag==awNTfQtyQbmtBmzk'
        }
    })

    const cities = await citiesResponse.json();
    displayCities(cities);
}

function displayCities(cities) {
    const citySelect = document.getElementById('city');
    citySelect.innerHTML = '<option value="">Select a city</option>';

    cities.forEach(city => {
        const cityOption = document.createElement('option');
        cityOption.value = city.name;
        cityOption.innerText = city.name;
        cityOption.dataset.lat = city.latitude;
        cityOption.dataset.lon = city.longitude;
        citySelect.appendChild(cityOption);
    });
}

async function fetchHolidays() {
    const country = document.getElementById('country').value;
    if (!country) {
        return;
    }

    // Use a holidays API to get the holidays for the selected country
    const holidaysResponse = await fetch(`https://api.api-ninjas.com/v1/holidays?country=${country}&year=2023&type=major_holiday`, 
    {
        method: "GET",
        headers: {
            'X-Api-Key': 'N+XqoTtRmL9A3euG1i8Cag==awNTfQtyQbmtBmzk'
        }
    })

    const holidays = await holidaysResponse.json();
    displayHolidays(holidays);
}

function displayHolidays(holidays) {
    const holidaySelect = document.getElementById('holiday');
    holidaySelect.innerHTML = '<option value="">Select a holiday</option>';

    holidays.forEach(holiday => {
        const holidayOption = document.createElement('option');
        holidayOption.value = holiday.date;
        holidayOption.innerText = holiday.name;
        holidaySelect.appendChild(holidayOption);
    });
}

async function getWeather() {
    const citySelect  = document.getElementById('city');
    const cityOption = citySelect.options[citySelect.selectedIndex];
    const city_lat=cityOption.dataset.lat;
    const city_lon=cityOption.dataset.lon;

    console.log(city_lat);
    console.log(city_lon);

    const date = document.getElementById('holiday').value;
 
    
    const apiKey = 'e74651ca2cab5c49f00602e6a32b46bf';
    const baseUrl = 'https://api.openweathermap.org/data/2.5';
  
    const currentDate = new Date();
    const targetDate = new Date(date);
    const diffInDays = (targetDate - currentDate) / (1000 * 60 * 60 * 24);
    console.log(targetDate);
    if (diffInDays > 4 || diffInDays < 0) {
      console.log("Weather forecast for four days only, not available for selected holiday");
      const weatherDiv = document.getElementById('weather');
      weatherDiv.innerHTML = "Weather forecast for four days only, not available for selected holiday";
      return;
    }

     const weatherResponse = await fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${city_lat}&lon=${city_lon}&appid=${apiKey}`);
    const weatherData = await weatherResponse.json();
    displayWeather(weatherData,date);
}

function displayWeather(weatherData, inputDate) {
    const parsedDate = new Date(inputDate);
    const formattedDate = `${parsedDate.getFullYear()}-${String(parsedDate.getMonth() + 1).padStart(2, '0')}-${String(parsedDate.getDate()).padStart(2, '0')}`;
    
    const weatherChanges = weatherData.list.filter(weatherItem => {
      return weatherItem.dt_txt.startsWith(formattedDate);
    }).map(weatherItem => {
      return {
        time: weatherItem.dt_txt.slice(11, 16),
        temperature: weatherItem.main.temp,
        weather: weatherItem.weather[0].description
      };
    });
  
    const weatherList = document.createElement('ul');
    weatherChanges.forEach(weatherChange => {
      const listItem = document.createElement('li');
      listItem.textContent = `Time: ${weatherChange.time}, Temperature: ${(weatherChange.temperature-273.15).toFixed(2)}degree Celsius, Weather: ${weatherChange.weather}`;
      weatherList.appendChild(listItem);
    });
  
    const weatherDiv = document.getElementById('weather');
    weatherDiv.innerHTML = ''; // 清空先前的内容
    weatherDiv.appendChild(weatherList);
}
   
async function getAccommodations() {
    var citySelect  = document.getElementById('city').value;
    citySelect=citySelect.toLowerCase();
    const url = `https://hotels4.p.rapidapi.com/locations/v2/search?query=${citySelect}`;
    console.log(citySelect);
    const options = {
        method: 'GET',
        headers: {    
            'X-RapidAPI-Key': '658e173c55msh74466c0f9538c1bp1a49dajsn4a20732bbf26',
            'X-RapidAPI-Host': 'hotels4.p.rapidapi.com'
        }
    };
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        console.log(result);
        
        const accommodationsDiv = document.getElementById('accommodations');
        accommodationsDiv.innerHTML = ''; // Clear any existing content
        
        const hotelGroup = result.suggestions.find(suggestion => suggestion.group === 'HOTEL_GROUP');
        if (hotelGroup && hotelGroup.entities.length > 0) {
            let count = 0;
            for (const hotel of hotelGroup.entities) {
                if (count >= 5) break; // Limit to 5 accommodations
                
                const hotelInfo = document.createElement('p');
                hotelInfo.innerHTML = `<strong>Name:</strong> ${hotel.name} <br>
                                       <strong>Address:</strong> ${hotel.caption} <br>`;
                accommodationsDiv.appendChild(hotelInfo);
                count++;
            }
        } else {
            accommodationsDiv.innerHTML = 'No accommodations found.';
        }
    } catch (error) {
        console.error(error);
    }
}


async function onchange_country(){
    fetchCities();
    fetchHolidays();
}

async function onchange_city(){
    
}

async function onchange_holiday(){
    
}

async function click_button(){
    getWeather();
    getAccommodations();
}