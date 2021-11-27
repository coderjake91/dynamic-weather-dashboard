//Pseudocode
/*
-> onload, make API fetch requests, get page weather data based upon user city input
-> break up data rendering to index.html based up use-case (current weather, 5-day forcast, city search history data-persistance)
-> functions that handle data-rendering will be currentWeather(), fiveDayForecast(), citySearchHistory()
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
		return data.results[0]
	} catch (err) {
		console.error(err);
	}
}

//get location-based weather data from openweather.org
const getWeatherData = async (city) => {
	console.log(city);
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

//render current userCity weather to the page
const currentWeather = async (weatherData) => {
	console.log(weatherData);
	let { address } = weatherData.localInfo;
	let { temp,
		  wind_speed,
		  humidity,
		  uvi,
		  weather,
		  dt
		} = weatherData.weatherInfo.current;


		let epochUTC= new Date(dt * 1000);

	//format date/time from UTC to a more readable form...
	let date = new Intl.DateTimeFormat('en-US', { dateStyle: 'short', timeStyle: 'short' }).format(epochUTC);
	//convert temp from kelvin to degrees F
	let tempF = Math.floor((temp - 273.15) * (9/5) + 32);
	//convert from wind speed in meters/sec to miles/hour
	let windMPH = Math.floor(wind_speed * 2.23694);
	let [ weatherArray ] = weather;
	let { icon, description } = weatherArray;
	console.log(icon);
	$("#city").html(`${address}`);
	$("#date").html(`(${date})`);
	$("#temp").html(`Temp: ${tempF}&#176 F`);
	$("#wind").html(`Wind: ${windMPH} MPH`);
	$("#humid").html(`Humidity: ${humidity}%`);

	console.log(uvi);

	//add uv-status indicators
	if(uvi <= 2 ){
		$("#uv").html(`UV Index: ${uvi}`);
		$("#uv").addClass('badge bg-success');
	} else if (uvi <= 5 && uvi > 2) {
		$("#uv").html(`UV Index: ${uvi}`);
		$("#uv").addClass('badge bg-warning');
	} else if (uvi <= 10 && uvi > 6) {
		$("#uv").html(`UV Index: ${uvi}`);
		$("#uv").addClass('badge bg-danger');
	};

	$("#icon").html(`<img src="http://openweathermap.org/img/wn/${icon}@2x.png"><br>${description}</img>`)
}

const fiveDayForecast= async (weatherData) => {
	let dailyWeather = weatherData.weatherInfo.daily;

	console.log(dailyWeather);

	for(let day = 0; day < 5; day++) {
		//destructure daily forecast parameters
		let { temp,
			wind_speed,
			humidity,
			uvi,
			weather,
			dt
		  } = dailyWeather[day];

		  let epochUTC= new Date(dt * 1000);

		//format date/time from UTC to a more readable form...
		let date = new Intl.DateTimeFormat('en-US', {dateStyle: 'short'}).format(epochUTC);
		console.log(date);
		//convert temp from kelvin to degrees F
		let tempF = Math.floor((temp.day - 273.15) * (9/5) + 32);
		//convert from wind speed in meters/sec to miles/hour
		let windMPH = Math.floor(wind_speed * 2.23694);
		let [ weatherArray ] = weather;
		let { icon, description } = weatherArray;
		$(`#temp${day}`).html(`Temp: ${tempF}&#176 F`);
		$(`#wind${day}`).html(`Wind: ${windMPH} MPH`);
		$(`#humid${day}`).html(`Humidity: ${humidity}%`);

		//add uv-status indicators
		if(uvi <= 2 ){
			$(`#uv${day}`).html(`UV Index: ${uvi}`);
			$(`#uv${day}`).addClass('badge bg-success');
		} else if (uvi <= 5 && uvi > 2) {
			$(`#uv${day}`).html(`UV Index: ${uvi}`);
			$(`#uv${day}`).addClass('badge bg-warning');
		} else if (uvi <= 10 && uvi> 6) {
			$(`#uv${day}`).html(`UV Index: ${uvi}`);
			$(`#uv${day}`).addClass('badge bg-danger');
		};

		$(`#icon${day}`).html(`${date}<img src="http://openweathermap.org/img/wn/${icon}@2x.png"><br>${description}</img>`)
	}
}

const userCitySearch = async () => {
	//on-click, capture user city input from the input field
	$("#button-addon2").on("click", async (event) => {
		event.preventDefault();

		let userCity = $("#city-search").val();
		console.log(userCity);
		if(userCity) {
			try {
				let weatherData = await getWeatherData(userCity);
				currentWeather(weatherData);
				fiveDayForecast(weatherData);
			} catch (err) {
				console.log(err);
			}
		} else {
			window.alert("Please Enter a City!");
		}
	});
}

window.onload = async () => {
	userCitySearch();
}