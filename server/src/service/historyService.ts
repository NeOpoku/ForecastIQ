import * as fs from 'fs';
import * as path from 'path';

// TODO: Define a City class with name and id properties
class City {
  id: number;
  name: string;

  constructor(id: number, name: string) {
    this.id = id;
    this.name = name;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  saveCityToHistory(_cityName: any) {
    throw new Error('Method not implemented.');
  }
    filePath: string;
    constructor() {
      this.filePath = path.join(path.resolve(), 'searchHistory.json');
    }
    async read() {
      try {
        const data = await fs.promises.readFile(this.filePath, 'utf8');
        return JSON.parse(data);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return [];
        }
        throw error;
      }
      
    } 
    async write(data: City[]) {
      await fs.promises.writeFile(this.filePath, JSON.stringify(data));
    }

  async getCities() {
    return await this.read();
  }

  async addCity(city: City) {
    const cities = await this.getCities();
    cities.push(city);
    await this.write(cities);
  }

  async removeCity(id: number) {
    let cities = await this.getCities();
    cities = cities.filter((city: { id: number; }) => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
