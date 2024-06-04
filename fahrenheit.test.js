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
