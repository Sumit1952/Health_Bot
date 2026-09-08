import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeSymptomsWithAI(symptomsText) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  const promptText = `
You are a professional medical symptom checker AI.
Your goal is to analyze user-provided symptoms and give helpful, safe, and preliminary advice.

User's symptoms: "${symptomsText}"

Analyze the symptoms and provide the response ONLY as a raw, valid JSON object with the following exact keys:
{
  "possibleConditions": [
    {
      "name": "Condition Name",
      "explanation": "Short clear explanation",
      "dangerLevel": "Low" | "Medium" | "High"
    }
  ],
  "homeTreatments": "Recommended home treatments and precautions. Do NOT recommend specific medicines.",
  "doctorVisitRecommendation": "Clear advice on whether the patient needs to visit a doctor or hospital.",
  "recommendedTests": "Recommended medical tests if necessary.",
  "emergencyAlert": true | false
}

CRITICAL RULES:
1. DO NOT give a final medical diagnosis. Always state that these are possibilities.
2. DO NOT recommend any specific medicines, drugs, or dosages. You can suggest general care like "stay hydrated" or "rest".
3. "possibleConditions" MUST contain top 1 to 3 conditions.
4. Set "emergencyAlert" to true ONLY if symptoms indicate severe danger (e.g. chest pain, difficulty breathing, stroke symptoms, uncontrolled bleeding).
5. Output MUST be ONLY valid JSON, with NO markdown code block formatting (no \`\`\`json).
`;

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const response = await model.generateContent(promptText);
      let text = response.response.text() || '';
      // Clean potential JSON markdown blocks
      text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

      const parsed = JSON.parse(text);
      return sanitizeResponse(parsed);
    } catch (err) {
      console.error('[AI Service] Error calling Gemini API:', err.message);
    }
  }

  // Smart heuristic fallback if API key is not configured or fails
  console.log('[AI Service] Utilizing fallback rule engine for symptom analysis');
  return fallbackAnalysis(symptomsText);
}

function sanitizeResponse(parsed) {
  return {
    possibleConditions: Array.isArray(parsed.possibleConditions) ? parsed.possibleConditions.map(c => ({
      name: c.name || 'Unspecified Condition',
      explanation: c.explanation || 'Consult a healthcare professional for guidance.',
      dangerLevel: ['Low', 'Medium', 'High'].includes(c.dangerLevel) ? c.dangerLevel : 'Low'
    })) : [],
    homeTreatments: parsed.homeTreatments || 'Rest well, maintain good hydration, and monitor your symptoms closely.',
    doctorVisitRecommendation: parsed.doctorVisitRecommendation || 'If symptoms persist or worsen over 24-48 hours, please consult a medical practitioner.',
    recommendedTests: parsed.recommendedTests || 'Complete Blood Count (CBC) or relevant clinical examination as advised by a doctor.',
    emergencyAlert: Boolean(parsed.emergencyAlert)
  };
}

function fallbackAnalysis(symptoms) {
  const lower = symptoms.toLowerCase();
  const isEmergency = lower.includes('chest pain') || lower.includes('breathing') || lower.includes('unconscious') || lower.includes('severe bleeding') || lower.includes('heart attack');
  const isFever = lower.includes('fever') || lower.includes('temperature') || lower.includes('chill');
  const isHeadache = lower.includes('headache') || lower.includes('head pain') || lower.includes('migraine');
  const isCough = lower.includes('cough') || lower.includes('cold') || lower.includes('sore throat');

  const conditions = [];

  if (isFever && isHeadache) {
    conditions.push(
      { name: 'Viral Infection / Flu', explanation: 'A common viral infection causing elevated body temperature and headache.', dangerLevel: 'Medium' },
      { name: 'Dehydration', explanation: 'Lack of adequate fluid intake can cause headaches and body temperature fluctuations.', dangerLevel: 'Low' },
      { name: 'Seasonal Influenza', explanation: 'Influenza virus leading to systemic fever, soreness, and fatigue.', dangerLevel: 'Medium' }
    );
  } else if (isEmergency) {
    conditions.push(
      { name: 'Acute Cardiovascular / Respiratory Distress', explanation: 'Critical condition requiring immediate emergency evaluation.', dangerLevel: 'High' }
    );
  } else if (isCough) {
    conditions.push(
      { name: 'Upper Respiratory Tract Infection', explanation: 'Common cold or mild throat irritation.', dangerLevel: 'Low' },
      { name: 'Bronchial Irritation', explanation: 'Mild inflammation of airways from dust or allergy.', dangerLevel: 'Low' }
    );
  } else {
    conditions.push(
      { name: 'General Mild Fatigue / Stress', explanation: 'Possible physical strain or mild non-specific symptoms.', dangerLevel: 'Low' },
      { name: 'Seasonal Allergy / Mild Irritation', explanation: 'Environmental triggers causing mild systemic response.', dangerLevel: 'Low' }
    );
  }

  return {
    possibleConditions: conditions,
    homeTreatments: '• Get plenty of rest\n• Drink warm fluids & stay hydrated\n• Avoid strenuous physical activities\n• Monitor your body temperature',
    doctorVisitRecommendation: isEmergency ? 'Urgent emergency medical evaluation recommended immediately.' : 'Consider visiting a general physician if symptoms persist for more than 2 days.',
    recommendedTests: 'Basic health checkup, CBC, or specific blood panel as advised by your physician.',
    emergencyAlert: isEmergency
  };
}
