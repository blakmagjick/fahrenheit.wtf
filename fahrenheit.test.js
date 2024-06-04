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
  });
});

// The reverseLocationQuery function is used to look up a location by latitude and longitude.
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
});
