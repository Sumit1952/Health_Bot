import mongoose from 'mongoose';

const ConditionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  explanation: { type: String, required: true },
  dangerLevel: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'], 
    default: 'Low' 
  },
  commonSymptoms: { type: String, default: '' },
  causes: { type: String, default: '' },
  prevention: { type: String, default: '' },
  urgentRedFlags: { type: String, default: '' }
});

const SymptomLogSchema = new mongoose.Schema({
  symptoms: { type: String, required: true },
  possibleConditions: [ConditionSchema],
  homeTreatments: { type: String, required: true },
  doctorVisitRecommendation: { type: String, required: true },
  recommendedTests: { type: String, default: '' },
  emergencyAlert: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('SymptomLog', SymptomLogSchema);
