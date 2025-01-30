import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  lat: number;
  lon: number;
}


// Define a class for the Weather object
class Weather {
  temp: number;
  description: string;
  icon: string;

  constructor(temp: number, description: string, icon: string) {
    this.temp = temp; // Temperature
    this.description = description; // Weather description
    this.icon = icon; // Weather icon URL
  }
}

// Define the WeatherService class
class WeatherService { 
  getWeatherByCityName(_cityName: any) {
    throw new Error('Method not implemented.');
  }

  private baseURL: string;
  private apiKey: string | undefined;
  constructor() {
    this.baseURL = 'https://api.openweathermap.org/';
  const apiKey = process.env.WEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('WEATHER_API_KEY is not defined in the environment variables');
  }
  this.apiKey = apiKey;
}

// Create fetchLocationData method
private async fetchLocationData(query: string): Promise<Coordinates> {
    const url = `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
    const response = await fetch(url);

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
  }

  // Build a query URL for fetching weather data
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/weather?lat=${coordinates.lat}&lon=${coordinates.lon}&units=metric&appid=${this.apiKey}`;
  }

  // Fetch and parse weather data for the given coordinates
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const url = this.buildWeatherQuery(coordinates);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Error fetching weather data');
    }

    return response.json();
  }

  // Parse the current weather data from the response
  private parseCurrentWeather(response: any): Weather {
    const temp = response.main.temp;
    const description = response.weather[0].description;
    const icon = `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`;

    return new Weather(temp, description, icon);
  }

  // Fetch location data, extract coordinates, and fetch weather data
  async getWeatherForCity(city: string): Promise<Weather[]> {

      const coordinates = await this.fetchLocationData(city);
      const weatherData = await this.fetchWeatherData(coordinates);
      const currentWeather = this.parseCurrentWeather(weatherData);

      return [currentWeather];
    } catch (error: { message: any; }) {
      if (error instanceof Error) {
        throw new Error(`Error getting weather for city: ${error.message}`);
      } else {
        throw new Error('Error getting weather for city');
      }
    }
  }


export default new WeatherService();
