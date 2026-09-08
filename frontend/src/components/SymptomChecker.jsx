import React, { useState } from 'react';
import { Loader, HeartPulse, Siren, Stethoscope, TestTube, Lightbulb, RefreshCcw } from 'lucide-react';

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter your symptoms.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch('/api/symptoms/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error('Error checking symptoms:', err);
      setError('An error occurred while analyzing symptoms. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSymptoms('');
    setResult(null);
    setError(null);
  };

  const getDangerColor = (level) => {
    switch (level) {
      case 'Low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'High':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-foreground bg-gray-50';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card/90 backdrop-blur-sm rounded-xl border border-border shadow-lg overflow-hidden p-6 sm:p-8">
      <div className="flex items-center gap-2 text-red-700/90 text-xl sm:text-2xl md:text-3xl font-bold mb-6">
        <HeartPulse className="w-8 h-8 text-red-600 animate-pulse" />
        <span>Hii ! I'm Here</span>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid w-full gap-4">
          <textarea
            placeholder="Enter all your symptoms clearly (e.g., fever, headache, vomiting, body pain)"
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            rows={6}
            disabled={loading}
            className="w-full p-4 rounded-lg border border-input bg-background text-foreground text-base focus:ring-2 focus:ring-primary focus:outline-none transition-all disabled:opacity-50"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-grow bg-accent text-black font-semibold hover:bg-accent/90 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Analyzing Symptoms...</span>
                </>
              ) : (
                'Analyze Symptoms'
              )}
            </button>
            <button
              type="button"
              onClick={handleReset}
              disabled={loading}
              className="border border-input bg-background text-foreground hover:bg-muted py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <div className="font-bold text-lg mb-1">Error</div>
          <div className="text-sm">{error}</div>
        </div>
      )}

      {result && (
        <div className="mt-8 space-y-6 text-left">
          {result.emergencyAlert && (
            <div className="p-4 bg-red-600 text-white rounded-lg border border-red-700 shadow-md flex items-start gap-3">
              <Siren className="h-6 w-6 shrink-0 mt-1 animate-bounce" />
              <div>
                <h4 className="font-bold text-lg">🚨 Emergency Alert!</h4>
                <p className="text-sm mt-1 text-red-100">
                  Your symptoms seem dangerous. Please seek immediate medical attention at the nearest hospital or call emergency services.
                </p>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-bold flex items-center gap-2 mb-3 text-foreground">
              <Stethoscope className="w-5 h-5 text-primary" /> Possible Conditions
            </h3>
            <div className="space-y-3">
              {result.possibleConditions?.map((condition, index) => (
                <div key={index} className="bg-background/80 p-4 rounded-lg border border-border shadow-sm">
                  <div className="flex justify-between items-start gap-2">
                    <h4 className="font-bold text-primary text-base sm:text-lg">{condition.name}</h4>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${getDangerColor(condition.dangerLevel)}`}>
                      {condition.dangerLevel}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1.5">{condition.explanation}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-secondary/40 p-4 rounded-lg border border-secondary">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
              <Lightbulb className="w-5 h-5 text-yellow-600" /> Home Treatments & Precautions
            </h3>
            <p className="text-sm text-secondary-foreground whitespace-pre-wrap leading-relaxed">{result.homeTreatments}</p>
          </div>

          {result.doctorVisitRecommendation && (
            <div className="bg-background/80 p-4 rounded-lg border border-border">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
                <Stethoscope className="w-5 h-5 text-primary" /> Do you need to see a doctor?
              </h3>
              <p className="text-sm text-muted-foreground">{result.doctorVisitRecommendation}</p>
            </div>
          )}

          {result.recommendedTests && (
            <div className="bg-background/80 p-4 rounded-lg border border-border">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
                <TestTube className="w-5 h-5 text-purple-600" /> Recommended Tests
              </h3>
              <p className="text-sm text-muted-foreground">{result.recommendedTests}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
