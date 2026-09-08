import express from 'express';
import { checkSymptomsController, getHistoryController } from '../controllers/symptomController.js';

const router = express.Router();

router.post('/check', checkSymptomsController);
router.get('/history', getHistoryController);

export default router;
