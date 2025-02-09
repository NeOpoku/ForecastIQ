import { Router } from 'express';
const router = Router();

import weatherRoutes from './weatherRoutes.js';
// /api /api/weather
router.use('/weather', weatherRoutes);

export default router;
