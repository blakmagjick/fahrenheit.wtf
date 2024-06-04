/*
Fahrenheit.wtf is a simple weather app that displays the current temperature in
both Celsius and Fahrenheit for the user's current location. The user can also
search for the weather in a different location.
*/

const state = {
  lat: 0,
  lon: 0,
  place: "",
};

const appid = atob("MTViMDM1YTcxMzFlYjNlMGY1YzNjOTg2YjEzY2JmNTA="); // ha ha

// The weatherQuery function takes the current state of the app and returns a
// URL for the OpenWeatherMap API that includes the latitude and longitude of
// the user's current location.
const weatherQuery = (currentState) => {
  return `https://api.openweathermap.org/data/2.5/weather?lat=${currentState.lat}&lon=${currentState.lon}&units=metric&appid=${appid}`;
};

// The locationQuery function takes a place name and returns a URL for the
// OpenWeatherMap API that includes the place name in the query string.
const locationQuery = (search) => {
  const q = encodeURIComponent(search);
  const url = `https://api.openweathermap.org/geo/1.0/direct?q=${q}&limit=5&appid=${appid}`;
  return url;
};

// The reverseLocationQuery is used to look up a location by latitude and longitude.
const reverseLocationQuery = () => {
  return `https://api.openweathermap.org/geo/1.0/reverse?lat=${state.lat}&lon=${state.lon}&limit=1&appid=${appid}`;
};

// The extractTemperatures function takes the API response and extracts the
// current temperature in Celsius and Fahrenheit, as well as the location name.
const extractTemperatures = (apiResponse) => {
  const temp_c = apiResponse.main.temp;
  const temp_f = temp_c * 1.8 + 32;
  return {
    place: apiResponse.name,
    c: Math.round(temp_c) + "ºC",
    f: Math.round(temp_f) + "ºF",
  };
};

// The getWeather function fetches the weather data from the OpenWeatherMap API
// and updates the DOM with the current temperature in both Celsius and Fahrenheit.
const getWeather = () => {
  fetch(weatherQuery(state))
    .then((response) => response.json())
    .then((data) => {
      const temp = extractTemperatures(data);
      const celsius_div = document.querySelector("#celsius div");
      celsius_div.innerHTML = temp.c;
      const fahr_div = document.querySelector("#fahrenheit div");
      fahr_div.innerHTML = temp.f;
      if (!state.place) state.place = temp.place;
      const location_div = document.querySelector("#location a");
      location_div.innerHTML = state.place;
    });
};

// The setLocationState function updates the app's state with the latitude,
// longitude, and name of a location returned by the OpenWeatherMap API.
const setLocationState = (location) => {
  // location is an openweathermap geo API response object
  state.lat = location.lat;
  state.lon = location.lon;
  state.place = location.name;
  if (location.state) state.place += ", " + location.state;
  if (location.country) state.place += ", " + location.country;
};

// The getLocationByName function fetches the latitude, longitude, and name of a
// location based on a user-provided search string and updates the app's state.
// This function is currently unused in the app, but could be used to allow users
// to search for the weather in a specific location.
const getLocationByName = () => {
  const input = document.querySelector("#locationInput");
  const search = input.value;
  fetch(locationQuery(search))
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      // TODO: Let users select from a dropdown, rather than just using the first one
      setLocationState(data[0]);
      getWeather();
      hideLocationInput();
    });
};

// The showLocationInput function displays an input field for the user to enter
// a location name. The hideLocationInput function hides the input field and
// displays the location name as text.
// Both functions are currently unused in the app.
const showLocationInput = () => {
  const text = document.querySelector("#locationText");
  text.style.display = "none";
  const input = document.querySelector("#locationInput");
  input.value = "";
  input.style.display = "block";
  input.onblur = hideLocationInput;
  input.focus();
};

const hideLocationInput = () => {
  const text = document.querySelector("#locationText");
  text.style.display = "inline";
  const input = document.querySelector("#locationInput");
  input.style.display = "none";
  input.blur();
};

// The showLoadingText function displays a loading message while the app is
// fetching data from the OpenWeatherMap API.
const showLoadingText = () => {
  const text = document.querySelector("#locationText");
  text.innerHTML = "Loading...";
  const celsius_div = document.querySelector("#celsius div");
  celsius_div.innerHTML = "--ºC";
  const fahr_div = document.querySelector("#fahrenheit div");
  fahr_div.innerHTML = "--ºF";
};

// The getDefaultLocation function sets the app's state to a default location
// (Berkeley, California) in case the user's browser does not support geolocation.
// This was the location of the app's creator, so it's a good fallback.
const getDefaultLocation = () => {
  state.lat = 37.87;
  state.lon = -122.27;
};

// The getBrowserLocation function attempts to get the user's current location
// using the browser's geolocation API. If successful, it updates the app's state
// with the latitude and longitude. If unsuccessful, it falls back to the default location.
const getBrowserLocation = () => {
  const timeout_ms = 10000;
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.log("Geolocation not supported");
      getDefaultLocation();
      resolve(state);
    } else {
      showLoadingText();
      // const fallback = setTimeout(() => {
      //   if (!state.lat && !state.lon) {
      //     console.log("Geolocation never returned");
      //     getDefaultLocation();
      //     resolve(state);
      //   }
      // }, timeout_ms);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // clearTimeout(fallback);
          state.lat = position.coords.latitude;
          state.lon = position.coords.longitude;
          resolve(state);
        },
        (err) => {
          console.log("Geolocation not permitted:", err);
          // clearTimeout(fallback);
          getDefaultLocation();
          resolve(state);
        },
        { timeout: timeout_ms }
      );
    }
  });
};

// The pageLoaded function is called when the page is fully loaded. It first
// attempts to get the user's current location, then fetches the weather data
// from the OpenWeatherMap API and updates the DOM with the current temperature.
const pageLoaded = () => {
  getBrowserLocation()
    .then(() => fetch(reverseLocationQuery()))
    .then((response) => response.json())
    .then((data) => setLocationState(data[0]))
    .then(() => getWeather());
};

module.exports = { getDefaultLocation, weatherQuery, pageLoaded };
