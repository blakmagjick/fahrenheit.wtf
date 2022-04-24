const state = {
  lat: 0,
  lon: 0,
  place: "",
};

const requestUrl = () => {
  const appid = atob("MTViMDM1YTcxMzFlYjNlMGY1YzNjOTg2YjEzY2JmNTA="); // ha ha
  return `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lon}&units=metric&appid=${appid}`;
};

const getWeather = () => {
  fetch(requestUrl())
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const temp_c = data.main.temp;
      const temp_f = temp_c * 1.8 + 32;
      const celsius_div = document.querySelector("#celsius div");
      celsius_div.innerHTML = Math.round(temp_c) + "ºC";
      const fahr_div = document.querySelector("#fahrenheit div");
      fahr_div.innerHTML = Math.round(temp_f) + "ºF";
      state.place = data.name;
      const location_div = document.querySelector("#location a");
      location_div.innerHTML = state.place;
    });
};

const showLocationInput = () => {
  const text = document.querySelector("#locationText");
  text.style.display = "none";
  const input = document.querySelector("#locationInput");
  input.style.display = "block";
  input.onblur = hideLocationInput;
  input.focus();
};

const hideLocationInput = () => {
  const text = document.querySelector("#locationText");
  text.style.display = "inline";
  const input = document.querySelector("#locationInput");
  input.style.display = "none";
};

const getDefaultLocation = () => {
  state.lat = 37.75;
  state.lon = -122.1;
  state.place = "Berkeley, CA";
};

const getLocation = () => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      getDefaultLocation();
      resolve(state);
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          state.lat = position.coords.latitude;
          state.lon = position.coords.longitude;
          resolve(state);
        },
        (err) => {
          console.log("Geolocation not permitted:", err);
          getDefaultLocation();
          resolve(state);
        }
      );
    }
  });
};

const pageLoaded = () => {
  getLocation().then(() => getWeather());
};
