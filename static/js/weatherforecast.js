async function api_fetch() {
    navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const airAPi = `https://api.open-meteo.com/v1/forecast?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&timezone=auto&current_weather=true&daily=temperature_2m_max,windspeed_10m_max,windgusts_10m_max,precipitation_sum,precipitation_probability_mean,weathercode,sunrise,sunset,apparent_temperature_max`
    async function air() {
        const KEY = "AIzaSyCu26zidBwPHKxebJeHwlEqjLlCBIaHXdc";
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${KEY}`
        const response = await fetch(url, {
            method: "GET"
        });
        let data = await response.json();
        let user_location = data.results[0].formatted_address
        document.getElementById("location").innerHTML = (user_location);
        document.getElementById("map").innerHTML = '<iframe class="responsivemap" width="100%" height="390" frameborder="0" style="border:0" src="https://maps.google.com/maps?q='+position.coords.latitude+','+position.coords.longitude+'&amp;z=15&amp;output=embed"></iframe>'
        const weather_response = await fetch(airAPi, {
            method: "GET"
        });
        let weather_data = await weather_response.json();
        console.log(weather_data);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        // dictionary used to match API weather code to respective description to be outputted to the user //
        let WeatherDictionary = {
          0 : { description : "Clear sky" },
          1 : { description : "Mainly clear, partly cloudy, and overcast" },
          2 : { description : "Mainly clear, partly cloudy, and overcast" },
          3 : { description : "Mainly clear, partly cloudy, and overcast" },
          45 : { description : "Fog and depositing rime fog" },
          48 : { description : "Fog and depositing rime fog" },
          51 : { description : "Drizzle: Light, moderate, and dense intensity" },
          53 : { description : "Drizzle: Light, moderate, and dense intensity" },
          55 : { description : "Drizzle: Light, moderate, and dense intensity" },
          56 : { description : "Freezing Drizzle: Light and dense intensity" },
          57 : { description : "Freezing Drizzle: Light and dense intensity" },
          61 : { description : "Rain: Slight, moderate and heavy intensity" },
          63 : { description : "Rain: Slight, moderate and heavy intensity" },
          65 : { description : "Rain: Slight, moderate and heavy intensity" },
          66 : { description : "Freezing Rain: Light and heavy intensity" },
          67 : { description : "Freezing Rain: Light and heavy intensity" },
          71 : { description : "Snow fall: Slight, moderate, and heavy intensity" },
          73 : { description : "Snow fall: Slight, moderate, and heavy intensity" },
          75 : { description : "Snow fall: Slight, moderate, and heavy intensity" },
          77 : { description : "Snow grains" },
          80 : { description : "Rain showers: Slight, moderate, and violent" },
          81 : { description : "Rain showers: Slight, moderate, and violent" },
          82 : { description : "Rain showers: Slight, moderate, and violent" },
          85 : { description : "Snow showers slight and heavy" },
          86 : { description : "Snow showers slight and heavy" },
          95 : { description : "Thunderstorm: Slight or moderate" },
          96 : { description : "Thunderstorm with slight and heavy hail" },
          99: { description : "Thunderstorm with slight and heavy hail" }
        };
        const today = new Date();
        let title_days = [];
        const current = weather_data.current_weather
        const daily = weather_data.daily
        var datetime = moment(`${daily.sunrise[0]}`).format("h:mm:ss a");
        const current_day = new Date(today);
        current_day.setDate(today.getDate());
        card_day = (days[current_day.getDay()]);
        for (let i = 1; i < 7; i++) {
          const nextDay = new Date(today);
          nextDay.setDate(today.getDate() + i);
          console.log(days[nextDay.getDay()]);
          document.getElementById(`day${i}`).textContent = (`${days[nextDay.getDay()]}`)
          document.getElementById(`temp${i}`).textContent = (`${daily.temperature_2m_max[i]} °C`)
          document.getElementById(`light${i}`).textContent = (`${daily.precipitation_sum[i]} mm`)
          document.getElementById(`heavy${i}`).textContent = (`${daily.precipitation_probability_mean[i]} %`)
          title_days.push(days[nextDay.getDay()]);
        }
        document.getElementById("current_day").textContent = (`Today: ${card_day}`);
        document.getElementById("weather").textContent = (`Weather: ${WeatherDictionary[current.weathercode].description}`);
        document.getElementById("current_temp").textContent = (`${current.temperature}°C`);
        document.getElementById("sunrise").textContent = (` sunrise: ${moment(`${daily.sunrise[0]}`).format("h:mm:ss a")}`);
        document.getElementById("sunset").textContent = (`sunset: ${moment(`${daily.sunset[0]}`).format("h:mm:ss a")}`);
        document.getElementById("rainchance").textContent = (`${daily.precipitation_probability_mean[0]}%`)
        document.getElementById("apparenttemp").textContent = (`${daily.apparent_temperature_max[0]}°C`)
        document.getElementById("windspeed").textContent = (`${daily.windspeed_10m_max[0]} Km/h`)
    }
  air();
})
}

api_fetch();