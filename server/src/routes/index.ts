import { Router } from 'express';
const router = Router();

import apiRoutes from './api/index.js';
import htmlRoutes from './htmlRoutes.js';
// /api /api 
router.use('/api', apiRoutes);
// /api/
router.use('/', htmlRoutes);

export default router;
