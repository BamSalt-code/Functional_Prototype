async function api_fetch() {
    navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    const airAPi = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&hourly=pm10,pm2_5,european_aqi,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen`;
    async function air() {
        const KEY = "AIzaSyCu26zidBwPHKxebJeHwlEqjLlCBIaHXdc";
        let url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=${KEY}`
        const response = await fetch(url, {
            method: "GET"
        });
        let data = await response.json();
        let user_location = data.results[0].formatted_address
        // gets user address from google API //
        document.getElementById("location").innerHTML = (user_location);
        document.getElementById("map").innerHTML = '<iframe class="responsivemap" width="100%" height="390" frameborder="0" style="border:0" src="https://maps.google.com/maps?q='+position.coords.latitude+','+position.coords.longitude+'&amp;z=15&amp;output=embed"></iframe>'
        // inserts map and location details //
        const weather_response = await fetch(airAPi, {
            method: "GET"
        });
        let weather_data = await weather_response.json();
        const time = document.getElementById("usertime").value;
        const hourlydata =weather_data.hourly;
        const indexid = hourlydata.time.indexOf(`${time}`);
        // finds list index for the current time //
        // code for getting all weekly info //
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        let title_days = [];
        console.log(today, title_days);
        const current_day = new Date(today);
        current_day.setDate(today.getDate());
        // loop is shorter than weather forecaster as less data is provided by API company //
        for (let i = 1; i < 4; i++) {
          const nextDay = new Date(today);
          nextDay.setDate(today.getDate() + i);
          console.log(days[nextDay.getDay()]);
          title_days.push(days[nextDay.getDay()]);
          document.getElementById(`day${i}`).textContent = (`${days[nextDay.getDay()]}`)
          // adds the index id to 24 * i to get the API index for the current loop day //
          document.getElementById(`temp${i}`).textContent = (`${hourlydata.alder_pollen[indexid + (24 * i)]} Grains/m³`)
          document.getElementById(`light${i}`).textContent = (`${hourlydata.birch_pollen[indexid + (24 * i)]} Grains/m³`)
          document.getElementById(`heavy${i}`).textContent = (`${hourlydata.grass_pollen[indexid + (24 * i)]} Grains/m³`)
        }
        // sets all current day information //
        card_day = (days[current_day.getDay()]);
        document.getElementById("current_day").textContent = (`Today: ${card_day}`);
        document.getElementById("European_AQI").textContent = (`AQI: ${hourlydata.european_aqi[indexid]} `);
        document.getElementById("alder").textContent = (`Alder Pollen: ${hourlydata.alder_pollen[indexid]} Grains/m³`);
        document.getElementById("birch").textContent = (`Birch Pollen: ${hourlydata.birch_pollen[indexid]} Grains/m³`);
        document.getElementById("grass").textContent = (`Grass pollen: ${hourlydata.grass_pollen[indexid]} Grains/m³`);
        document.getElementById("mugwort").textContent = (`Mugwort pollen: ${hourlydata.mugwort_pollen[indexid]} Grains/m³`);
    }
  air();
})
}
// runs on page load //
api_fetch();