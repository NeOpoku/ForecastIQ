import * as fs from 'fs';


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
    
    async read() {
      try {
        const data = await fs.promises.readFile("db/db.json", 'utf8');
        return JSON.parse(data);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return [];
        }
        throw error;
      }
      
    } 
    async write(data: City[]) {
      await fs.promises.writeFile("db/db.json", JSON.stringify(data));
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
