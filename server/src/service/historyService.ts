import { promises as fs } from 'fs';

// TODO: Define a City class with name and id properties
class City {
  name: string;
  id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
    private async read() {
      return await fs.readFile('db/db.json', {
        flag: 'a+',
        encoding: 'utf8',
      });
    }
  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
   private async write(cities: City[]) { 
    console.log('cities:', cities);
    return await fs.writeFile('db/db.json', JSON.stringify(cities, null, '\t'));
   }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
   async getCities() {
    return await this.read().then((cities) => {
      console.log('cities:', cities);
      console.log("typeof cities:", typeof cities);
      let parsedCities: City[];
      try {
        parsedCities = [].concat(JSON.parse(cities));
      } catch (error) {
        parsedCities = [];
      }
      return parsedCities;
    })
   }
   
  // TODO Define an addCity method that adds a city to the searchHistory.json file
   async addCity(city: string) {
    if (!city) {
      throw new Error('City name is required');
    }
    const cities = await this.getCities();
    const newCity = new City(city, (cities.length + 1).toString());
    cities.push(newCity);
    await this.write(cities);
    return newCity;
   }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    if (!id) {
      throw new Error('City ID is required');
    }
    const cities = await this.getCities();
    const cityIndex = cities.findIndex((city) => city.id === id);
    if (cityIndex === -1) {
      throw new Error('City ID not found');
    }
    const removedCity = cities.splice(cityIndex, 1);
    await this.write(cities);
    return removedCity;
  }
}

export default new HistoryService();