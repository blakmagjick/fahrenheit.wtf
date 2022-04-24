const state = {
  lat: 0,
  lon: 0,
  place: "",
};

const appid = atob("MTViMDM1YTcxMzFlYjNlMGY1YzNjOTg2YjEzY2JmNTA="); // ha ha

const weatherQuery = () => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${state.lat}&lon=${state.lon}&units=metric&appid=${appid}`;
};

const locationQuery = (search) => {
  const q = encodeURIComponent(search);
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${appid}`;
  console.log("locationQuery", url);
  return url;
};

const getWeather = () => {
  fetch(weatherQuery())
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const temp_c = data.main.temp;
      const temp_f = temp_c * 1.8 + 32;
      const celsius_div = document.querySelector("#celsius div");
      celsius_div.innerHTML = Math.round(temp_c) + "ºC";
      const fahr_div = document.querySelector("#fahrenheit div");
      fahr_div.innerHTML = Math.round(temp_f) + "ºF";
      if (!state.place) state.place = data.name;
      const location_div = document.querySelector("#location a");
      location_div.innerHTML = state.place;
    });
};

const getLocationByName = () => {
  const input = document.querySelector("#locationInput");
  const search = input.value;
  fetch(locationQuery(search))
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // TODO: Let users select from a dropdown, rather than just using the first one
      const location = data[0];
      state.lat = location.lat;
      state.lon = location.lon;
      state.place = location.name;
      if (location.state) state.place += ", " + location.state;
      if (location.country) state.place += ", " + location.country;
      getWeather();
      hideLocationInput();
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

const getBrowserLocation = () => {
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
  getBrowserLocation().then(() => getWeather());
};
