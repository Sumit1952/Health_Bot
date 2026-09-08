import SymptomLog from '../models/SymptomLog.js';
import { analyzeSymptomsWithAI } from '../services/aiService.js';

export const checkSymptomsController = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || !symptoms.trim()) {
      return res.status(400).json({ error: 'Symptoms input is required.' });
    }

    const aiResult = await analyzeSymptomsWithAI(symptoms);

    // Save entry to MongoDB if database is connected
    try {
      const logEntry = new SymptomLog({
        symptoms,
        ...aiResult
      });
      await logEntry.save();
    } catch (dbErr) {
      console.warn('[MongoDB Log] Skipped saving symptom log:', dbErr.message);
    }

    return res.status(200).json(aiResult);
  } catch (err) {
    console.error('[SymptomController Error]:', err);
    return res.status(500).json({ error: 'Failed to analyze symptoms. Please try again later.' });
  }
};

export const getHistoryController = async (req, res) => {
  try {
    const history = await SymptomLog.find().sort({ createdAt: -1 }).limit(20);
    return res.status(200).json(history);
  } catch (err) {
    return res.status(500).json({ error: 'Could not fetch history' });
  }
};
