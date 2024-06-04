const { weatherQuery } = require("./fahrenheit");

describe("Weather Query", () => {
  describe("When provided a valid latitude and longitude", () => {
    const validLocation = { lat: 38, lon: -119 };

    test("weatherQuery returns an API endpoint URL", () => {
      const url = weatherQuery(validLocation);
      expect(url).toBeTruthy();
      expect(url).toMatch(/^https:\/\/api\./);
    });

    test("weatherQuery includes latitudinal geographic position in the query string", () => {
      const url = weatherQuery(validLocation);
      expect(url).toMatch(/[^a-z]lat=38&/);
    });

    test("weatherQuery includes longitudinal geographic position in the query string", () => {
      const url = weatherQuery(validLocation);
      expect(url).toMatch(/[^a-z]lon=-119&/);
    });

    test("weatherQuery includes an appid query parameter", () => {
      const url = weatherQuery(validLocation);
      expect(url).toMatch(/appid=[a-z0-9]+/);
    });
  });
});

describe("Location Query", () => {
  const { locationQuery } = require("./fahrenheit");

  describe("When provided a place name", () => {
    const place = "San Francisco";

    test("locationQuery returns an API endpoint URL", () => {
      const url = locationQuery(place);
      expect(url).toBeTruthy();
      expect(url).toMatch(/^https:\/\/api\./);
    });

    test("locationQuery includes the place name in the query string", () => {
      const url = locationQuery(place);
      expect(url).toMatch(/[^a-z]q=San%20Francisco&/);
    });

    test("locationQuery includes an appid query parameter", () => {
      const url = locationQuery(place);
      expect(url).toMatch(/appid=[a-z0-9]+/);
    });
  });
});

describe("Reverse Location Query", () => {
  const { reverseLocationQuery } = require("./fahrenheit");
  const apiResponse = { lat: 38, lon: -119 };

  test("reverseLocationQuery returns an API endpoint URL", () => {
    const url = reverseLocationQuery(apiResponse);
    expect(url).toBeTruthy();
    expect(url).toMatch(/^https:\/\/api\./);
  });

  test("reverseLocationQuery includes latitudinal geographic position in the query string", () => {
    const url = reverseLocationQuery(apiResponse);
    expect(url).toMatch(/[^a-z]lat=38&/);
  });

  test("reverseLocationQuery includes longitudinal geographic position in the query string", () => {
    const url = reverseLocationQuery(apiResponse);
    expect(url).toMatch(/[^a-z]lon=-119&/);
  });

  test("reverseLocationQuery includes an appid query parameter", () => {
    const url = reverseLocationQuery(apiResponse);
    expect(url).toMatch(/appid=[a-z0-9]+/);
  });
});

describe("Extract Temperatures", () => {
  const { extractTemperatures } = require("./fahrenheit");

  describe("When provided an API response object", () => {
    const apiResponse = { main: { temp: 20 }, name: "San Francisco" };

    test("extractTemperatures returns an object with the location name", () => {
      const temp = extractTemperatures(apiResponse);
      expect(temp.place).toBe("San Francisco");
    });

    test("extractTemperatures returns an object with the temperature in Celsius", () => {
      const temp = extractTemperatures(apiResponse);
      expect(temp.c).toBe("20ºC");
    });

    test("extractTemperatures returns an object with the temperature in Fahrenheit", () => {
      const temp = extractTemperatures(apiResponse);
      expect(temp.f).toBe("68ºF");
    });
  });
});
