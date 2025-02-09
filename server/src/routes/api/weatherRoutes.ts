import { Router } from 'express';

const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
// /api /api/weather/ 
router.post('/', async (req, res) => {
  const cityName = req.body.city;
  if (!cityName) {
    return res.status(400).send({ error: 'City name is required' });
  }

  try {
    // GET weather data from city name
    const weatherData = await WeatherService.getWeatherByCityName(cityName);
    
    // save city to search history
    await HistoryService.saveCityToHistory(cityName);

    return res.status(200).send(weatherData);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching weather data:', error.message);
    } else {
      console.error('Error fetching weather data:', error);
    }
    return res.status(500).send({ error: 'Failed to retrieve weather data' });
  }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const cities = await HistoryService.getCities();
    res.status(200).json({ history: cities });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching search history:', error.message);
    } else {
      console.error('Error fetching search history:', error);
    }
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});


// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: 'City ID is required' });
    }

    await HistoryService.removeCity(Number(id));
    return res.status(200).json({ message: `City with ID ${id} removed from history` });
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error removing city from search history:', error.message);
    } else {
      console.error('Error removing city from search history:', error);
    }
    return res.status(500).json({ error: 'Failed to remove city from search history' });
  }
});

export default router;
