import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
 
// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  tempF: number;
  windSpeed: number;
  humidity: number;

  constructor(city: string, date: string, icon: string, iconDescription: string, tempF: number, windSpeed: number, humidity: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  city: string;

  constructor() {
    this.city = '';
  }


  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string) {
    const geoCodeResponse = await fetch(query);
    const geoCodeData = await geoCodeResponse.json();
    return geoCodeData;
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const coordinates = {
      latitude: locationData[0].lat,
      longitude: locationData[0].lon,
    }
    return coordinates
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    const geocodeQuery = `http://api.openweathermap.org/geo/1.0/direct?q=${this.city}&limit=1&appid=${process.env.API_KEY}`;
    return geocodeQuery
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    const currentWeatherQuery = `https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.API_KEY}&units=imperial`;
    return currentWeatherQuery
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(query: string): Promise<Coordinates> {
    const geoCodeData = await this.fetchLocationData(query);
    const coordinates = this.destructureLocationData(geoCodeData);
    return coordinates;
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(query: string) {
    const currentWeatherResponse = await fetch(query);
    const currentWeatherData = await currentWeatherResponse.json();
    return currentWeatherData
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(currentWeatherData: any) {
     
    const parsedCurentWeather = {
      // city, date, icon, iconDescription, tempF, windSpeed, humidity
      city: currentWeatherData.name,
      date: new Date(currentWeatherData.dt * 1000).toLocaleDateString(),
      icon: currentWeatherData.weather[0].icon,
      iconDescription: currentWeatherData.weather[0].description,
      tempF: currentWeatherData.main.temp,
      windSpeed: currentWeatherData.wind.speed,
      humidity: currentWeatherData.main.humidity
    }
    return parsedCurentWeather
  }

  // TODO: Complete buildForecastArray method
  private async buildForecastArray(currentWeather: any, coordinates: Coordinates): Promise<any> {
    const forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&appid=${process.env.API_KEY}&units=imperial`;
    const forecastResponse = await fetch(forecastQuery);
    const forecastData = await forecastResponse.json();
    const forecastArray = forecastData.list.map((forecast: any) => {
      return {
        date: new Date(forecast.dt * 1000).toLocaleDateString(),
        icon: forecast.weather[0].icon,
        iconDescription: forecast.weather[0].description,
        tempF: forecast.main.temp,
        windSpeed: forecast.wind.speed,
        humidity: forecast.main.humidity
      }
    })
    return [
      currentWeather,
      forecastArray[0],
      forecastArray[8],
      forecastArray[16],
      forecastArray[24],
      forecastArray[32]
    ]

  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string) {
    this.city = city;
    const geocodeQuery = this.buildGeocodeQuery();
    const coordinates = await this.fetchAndDestructureLocationData(geocodeQuery);
    const currentWeatherQuery = this.buildWeatherQuery(coordinates);
    const currentWeatherData = await this.fetchWeatherData(currentWeatherQuery);
    const parsedCurentWeather = this.parseCurrentWeather(currentWeatherData);
    const weatherArray = await this.buildForecastArray(parsedCurentWeather, coordinates);
  return weatherArray
  }
}

export default new WeatherService();