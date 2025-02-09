import dotenv from 'dotenv';
dotenv.config();

// Define the interface for coordinates
interface Coordinates {
  /**
   * Latitude of the location
   */
  lat: number;
  /**
   * Longitude of the location
   */
  lon: number;
}


// Define the Weather class
class Weather {
  /**
   * Temperature in Celsius
   */
  public temp: number;
  /**
   * Description of the weather
   */
  public description: string;
  /**
   * URL of the weather icon
   */
  public icon: string;

  /**
   * Constructor for the Weather class
   * @param temp Temperature in Celsius
   * @param description Description of the weather
   * @param icon URL of the weather icon
   */
  constructor(temp: number, description: string, icon: string) {
    this.temp = temp;
    this.description = description;
    this.icon = icon;
  }
}

// Define the WeatherService class
class WeatherService {
  /**
   * Base URL for the OpenWeatherMap API
   */
  private readonly baseURL: string;
  /**
   * API key for the OpenWeatherMap API
   */
  private readonly apiKey: string;

  /**
   * Constructor for the WeatherService class
   */
  constructor() {
    this.baseURL = 'https://api.openweathermap.org';
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error('WEATHER_API_KEY is not defined in the environment variables');
    }
    this.apiKey = apiKey;
  }

  /**
   * Fetches the current weather data for a given city
   * @param city Name of the city
   * @returns A promise that resolves to an array of Weather objects
   */
  public async getWeatherForCity(city: string): Promise<Weather[]> {
    try {
      // Fetch location data for the given city
      const coordinates = await this.fetchLocationData(city);
      // Fetch weather data for the given coordinates
      const weatherData = await this.fetchWeatherData(coordinates);
      // Parse the current weather data
      const currentWeather = this.parseCurrentWeather(weatherData);
      return [currentWeather];
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching weather data for city ${city}: ${error.message}`);
      } else {
        throw new Error(`Error fetching weather data for city ${city}: ${String(error)}`);
      }
    }
  }

  /**
   * Fetches weather data by city name
   * @param cityName Name of the city
   * @returns A promise that resolves to the weather data
   */
  public async getWeatherByCityName(cityName: string): Promise<Weather> {
    try {
      const location = await this.fetchLocationData(cityName);
      return await this.getWeatherByCoordinates(location.lat, location.lon);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching weather data for city ${cityName}: ${error.message}`);
      } else {
        throw new Error(`Error fetching weather data for city ${cityName}: ${String(error)}`);
      }
    }
  }

  /**
   * Fetches location data for a given query
   * @param query Query to search for
   * @returns A promise that resolves to the coordinates of the location
   */
  private async fetchLocationData(query: string): Promise<Coordinates> {
    try {
      // Use the OpenWeatherMap API to fetch location data
      const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
      const response = await fetch(url);
      console.log('Hello from fetchLocationData:');
      // Handle errors and parse the response
      if (!response.ok) {
        throw new Error('Error fetching location data');
      }
      const locationData = await response.json();
      if (locationData.length === 0) {
        throw new Error('No location found for the given query');
      }
      return {
        lat: locationData[0].lat,
        lon: locationData[0].lon,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching location data for query ${query}: ${error.message}`);
      } else {
        throw new Error(`Error fetching location data for query ${query}: ${String(error)}`);
      }
    }
  }

  /**
   * Fetches weather data for a given set of coordinates
   * @param coordinates Coordinates to fetch weather data for
   * @returns A promise that resolves to the weather data
   */
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    try {
      console.log(coordinates);
      


      // Use the OpenWeatherMap API to fetch weather data
      //const url = `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
      const url = `${this.baseURL}/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;    
      console.log(url);
      const response = await fetch(url);
      
      // Handle errors and parse the response
      if (!response.ok) {
        throw new Error('Error fetching weather data');
      }
      return response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching weather data for coordinates ${JSON.stringify(coordinates)}: ${error.message}`);
      } else {
        throw new Error(`Error fetching weather data for coordinates ${JSON.stringify(coordinates)}: ${String(error)}`);
      }
    }
  }

  /**
   * Fetches weather data by coordinates
   * @param lat Latitude of the location
   * @param lon Longitude of the location
   * @returns A promise that resolves to the weather data
   */
  private async getWeatherByCoordinates(lat: number, lon: number): Promise<Weather> {
    const coordinates = { lat, lon };
    try {
      console.log('Hello from getWeatherByCoordinates:');
      const weatherData = await this.fetchWeatherData(coordinates);
      return this.parseCurrentWeather(weatherData);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error fetching weather data for coordinates ${JSON.stringify(coordinates)}: ${error.message}`);
      } else {
        throw new Error(`Error fetching weather data for coordinates ${JSON.stringify(coordinates)}: ${String(error)}`);
      }
    }
  }

  /**
   * Parses the current weather data from the response
   * @param response Response from the OpenWeatherMap API
   * @returns A Weather object representing the current weather
   */
  private parseCurrentWeather(response: any): Weather {
    if (!response || !response.main || !response.weather || response.weather.length === 0) {
      throw new Error("Invalid weather data structure received from API.");
    }
    // Parse the current weather data from the response
    const temp = response.main.temp;
    const description = response.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`;
    return new Weather(temp, description, icon);
  }
}

// Example usage:
const weatherService = new WeatherService();
weatherService.getWeatherForCity("London")
  .then((weather) => console.log(weather))
  .catch((error) => console.error(error));

export default new WeatherService();
