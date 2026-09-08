import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeSymptomsWithAI(symptomsText) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

  const promptText = `
You are a professional medical symptom checker AI.
Your goal is to analyze user-provided symptoms and give helpful, safe, and preliminary advice with IN-DEPTH disease details.

User's symptoms: "${symptomsText}"

Analyze the symptoms and provide the response ONLY as a raw, valid JSON object matching this exact schema:
{
  "possibleConditions": [
    {
      "name": "Disease / Condition Name",
      "explanation": "Clear overview explanation of what this condition is",
      "dangerLevel": "Low" | "Medium" | "High",
      "commonSymptoms": "Key hallmark symptoms associated with this condition",
      "causes": "Primary causes, triggers, or pathogens",
      "prevention": "Preventive measures, hygiene, or lifestyle precautions",
      "urgentRedFlags": "Critical warning signs that require immediate emergency medical care"
    }
  ],
  "homeTreatments": "Recommended home care and general recovery precautions. Do NOT recommend specific medicines or drug dosages.",
  "doctorVisitRecommendation": "Clear guidance on when and why to see a doctor.",
  "recommendedTests": "Recommended clinical tests if necessary (e.g. CBC, X-ray, PCR).",
  "emergencyAlert": true | false
}

CRITICAL RULES:
1. DO NOT give a final medical diagnosis. Always state that these are possibilities.
2. DO NOT recommend specific medicines, drugs, or dosages. Recommend general care like hydration and rest.
3. Provide top 1 to 3 possible conditions with DETAILED fields for each disease (commonSymptoms, causes, prevention, urgentRedFlags).
4. Set "emergencyAlert" to true ONLY if symptoms indicate severe danger (e.g. chest pain, difficulty breathing, stroke, severe bleeding).
5. Output MUST be ONLY valid JSON, with NO markdown formatting (no \`\`\`json).
`;

  if (apiKey) {
    const modelNames = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
    const genAI = new GoogleGenerativeAI(apiKey);

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const response = await model.generateContent(promptText);
        let text = response.response.text() || '';
        text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();

        const parsed = JSON.parse(text);
        console.log(`[AI Service] Successfully generated detailed symptom analysis using model: ${modelName}`);
        return sanitizeResponse(parsed);
      } catch (err) {
        console.warn(`[AI Service] Model ${modelName} failed (${err.message}). Trying next...`);
      }
    }
  }

  // Smart heuristic fallback if API key is not configured or fails
  console.log('[AI Service] Utilizing fallback rule engine for detailed symptom analysis');
  return fallbackAnalysis(symptomsText);
}

function sanitizeResponse(parsed) {
  return {
    possibleConditions: Array.isArray(parsed.possibleConditions) ? parsed.possibleConditions.map(c => ({
      name: c.name || 'Unspecified Condition',
      explanation: c.explanation || 'Consult a healthcare professional for guidance.',
      dangerLevel: ['Low', 'Medium', 'High'].includes(c.dangerLevel) ? c.dangerLevel : 'Low',
      commonSymptoms: c.commonSymptoms || 'Fever, fatigue, body discomfort.',
      causes: c.causes || 'Viral or bacterial exposure, environmental stress.',
      prevention: c.prevention || 'Maintain good hygiene, adequate rest, and balanced nutrition.',
      urgentRedFlags: c.urgentRedFlags || 'High fever over 103°F, difficulty breathing, chest pain.'
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
      { 
        name: 'Viral Influenza (Flu)', 
        explanation: 'A acute contagious respiratory illness caused by influenza viruses affecting the nose, throat, and lungs.', 
        dangerLevel: 'Medium',
        commonSymptoms: 'High fever, muscle or body aches, severe headaches, chills, fatigue, and dry cough.',
        causes: 'Influenza virus A or B transmitted via respiratory droplets.',
        prevention: 'Annual flu vaccination, frequent handwashing with soap, and avoiding close contact with infected individuals.',
        urgentRedFlags: 'Difficulty breathing, chest pressure, persistent dizziness, or confusion.'
      },
      { 
        name: 'Dehydration & Heat Exhaustion', 
        explanation: 'Occurs when the body loses more fluids than it takes in, leading to electrolyte imbalance and reduced body cooling.', 
        dangerLevel: 'Low',
        commonSymptoms: 'Thirst, dark-colored urine, headache, lightheadedness, fatigue, and muscle cramps.',
        causes: 'Inadequate fluid intake, excessive sweating, fever, or vomiting.',
        prevention: 'Drink 2-3 liters of water daily, consume electrolyte fluids during illness, and avoid extreme heat exposure.',
        urgentRedFlags: 'Inability to keep fluids down, extreme lethargy, rapid heart rate, or faintness.'
      },
      { 
        name: 'Acute Sinusitis', 
        explanation: 'Inflammation or swelling of the tissue lining the sinuses, often trapping fluid and causing pressure.', 
        dangerLevel: 'Low',
        commonSymptoms: 'Facial pain or pressure, nasal congestion, thick nasal discharge, headache, and mild fever.',
        causes: 'Viral cold infection, nasal polyps, or allergies leading to sinus blockage.',
        prevention: 'Use saline nasal rinses, manage seasonal allergies, and use humidifiers in dry air.',
        urgentRedFlags: 'Swelling or redness around eyes, severe stiff neck, or sudden visual changes.'
      }
    );
  } else if (isEmergency) {
    conditions.push(
      { 
        name: 'Acute Cardiovascular / Respiratory Distress', 
        explanation: 'A critical emergency state affecting heart function or airway delivery requiring immediate medical intervention.', 
        dangerLevel: 'High',
        commonSymptoms: 'Severe squeezing chest pain, shortness of breath, radiating arm or jaw pain, cold sweats, and nausea.',
        causes: 'Coronary artery blockage, severe asthma, pulmonary embolism, or acute heart strain.',
        prevention: 'Maintain cardiovascular health, manage blood pressure, refrain from smoking, and seek emergency care immediately.',
        urgentRedFlags: 'Chest pain lasting more than 5 minutes, loss of consciousness, or bluish lips/fingertips.'
      }
    );
  } else if (isCough) {
    conditions.push(
      { 
        name: 'Upper Respiratory Infection (Common Cold)', 
        explanation: 'A mild viral infection affecting the nose, throat, and upper airways.', 
        dangerLevel: 'Low',
        commonSymptoms: 'Runny or stuffy nose, sore throat, mild cough, sneezing, and low-grade fever.',
        causes: 'Rhinoviruses, coronaviruses, or adenovirus airborne spread.',
        prevention: 'Wash hands regularly, avoid touching eyes/nose, and keep immunity strong.',
        urgentRedFlags: 'Cough lasting over 3 weeks, coughing up blood, or high persistent fever.'
      },
      { 
        name: 'Bronchitis', 
        explanation: 'Inflammation of the lining of your bronchial tubes, which carry air to and from your lungs.', 
        dangerLevel: 'Medium',
        commonSymptoms: 'Persistent cough with mucus, chest discomfort, fatigue, and mild wheezing.',
        causes: 'Viral infection following a cold or exposure to respiratory irritants/smoke.',
        prevention: 'Avoid tobacco smoke, wear mask in dusty environments, and practice hand hygiene.',
        urgentRedFlags: 'High fever, shortness of breath, or thick yellowish-green phlegm with blood.'
      }
    );
  } else {
    conditions.push(
      { 
        name: 'General Viral Syndrome / Fatigue', 
        explanation: 'Systemic mild immune response causing non-specific body malaise and tiredness.', 
        dangerLevel: 'Low',
        commonSymptoms: 'Mild fatigue, non-specific ache, low appetite, and mild head tightness.',
        causes: 'Stress, lack of sleep, mild immune activation, or minor viral exposure.',
        prevention: 'Get 7-8 hours of quality sleep, stay hydrated, and maintain a balanced diet.',
        urgentRedFlags: 'Symptoms worsening progressively past 5 days or high fever developing.'
      }
    );
  }

  return {
    possibleConditions: conditions,
    homeTreatments: '• Get plenty of rest\n• Drink warm fluids & stay hydrated\n• Avoid strenuous physical activities\n• Monitor your body temperature regularly',
    doctorVisitRecommendation: isEmergency ? 'Urgent emergency medical evaluation recommended immediately.' : 'Consider visiting a general physician if symptoms persist for more than 2 days.',
    recommendedTests: 'Basic health checkup, CBC, or specific blood panel as advised by your physician.',
    emergencyAlert: isEmergency
  };
}
