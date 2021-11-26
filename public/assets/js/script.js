//Pseudocode
/*
-> onload, make API fetch requests, get page weather data based upon user city input
-> break up data rendering to index.html based up use-case (current weather, 5-day forcast, city search history data-persistance)
-> functions that handle data-rendering will be currentWeather(), fiveDayForcast(), citySearchHistory()

*/


const userCity = 'austin'

//convert city string to geocode (lan, lng)
const geoCode = async (location) =>{
	try {
		const response = await fetch(`https://trueway-geocoding.p.rapidapi.com/Geocode?address=${location}`, {
			"method": "GET",
			"headers": {
				"x-rapidapi-host": "trueway-geocoding.p.rapidapi.com",
				"x-rapidapi-key": "1b3e17da97msh8784bd378de9d66p17b153jsn255eb2ee1914"
			}
		});
		const data = await response.json();
		//fetch one city, returned data is an array of length 1 with an object having multiple properties including location
		console.log(data.results[0]);
		return data.results[0]
	} catch (err) {
		console.error(err);
	}
}

//get location-based weather data from openweather.org
const getWeatherData = async (city) => {
	let locationData = await geoCode(city);

	let { lat, lng } = locationData.location;

	try{
		const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lng}&appid=298d99e9901af6a77d87f19356a23cd3`)
		
		const data = await response.json();
		return {
			weatherInfo: data,
			localInfo: locationData
		};
		
	} catch (err) {
		console.error(err);
	}

}

// const renderDailyWeatherData = async () => {

// }

const weatherData = getWeatherData(userCity);

console.log(weatherData);