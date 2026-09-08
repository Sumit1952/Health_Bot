import React, { useState } from 'react';
import { Loader, HeartPulse, Siren, Stethoscope, TestTube, Lightbulb, RefreshCcw, ChevronDown, ChevronUp, ShieldAlert, Activity, Info, AlertTriangle } from 'lucide-react';

export function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(0); // expand first condition by default

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) {
      setError('Please enter your symptoms.');
      return;
    }
    setLoading(true);
    setResult(null);
    setError(null);
    setExpandedIndex(0);

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
    setExpandedIndex(0);
  };

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
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
    <div className="w-full max-w-3xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xl overflow-hidden p-6 sm:p-8">
      <div className="flex items-center gap-2 text-red-600 text-xl sm:text-2xl md:text-3xl font-bold mb-6">
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
            className="w-full p-4 rounded-xl border border-gray-300 bg-white text-gray-900 text-base focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none shadow-sm transition-all disabled:opacity-50"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-grow bg-accent text-black font-semibold hover:bg-accent/90 py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow disabled:opacity-50 cursor-pointer text-base"
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
              className="border border-input bg-background text-foreground hover:bg-muted py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 text-base"
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
            <h3 className="text-lg font-bold flex items-center justify-between mb-3 text-foreground">
              <span className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-primary" /> Possible Conditions & Disease Details
              </span>
              <span className="text-xs text-muted-foreground font-normal">Click condition to expand details</span>
            </h3>
            <div className="space-y-4">
              {result.possibleConditions?.map((condition, index) => {
                const isExpanded = expandedIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                      isExpanded ? 'border-primary shadow-md bg-background' : 'border-border bg-background/70 hover:border-primary/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleExpand(index)}
                      className="w-full p-4 flex items-center justify-between text-left cursor-pointer transition-colors hover:bg-black/5"
                    >
                      <div className="flex-1 pr-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h4 className="font-bold text-primary text-base sm:text-lg">{condition.name}</h4>
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${getDangerColor(condition.dangerLevel)}`}>
                            {condition.dangerLevel} Risk
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{condition.explanation}</p>
                      </div>
                      <div className="text-primary p-1 rounded-full bg-primary/10">
                        {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-border/60 bg-card/60 space-y-4 text-sm">
                        {/* Overview */}
                        <div className="bg-primary/5 p-3 rounded-lg border border-primary/10">
                          <h5 className="font-bold text-primary flex items-center gap-2 mb-1">
                            <Info className="w-4 h-4 text-primary" /> Disease Overview
                          </h5>
                          <p className="text-foreground leading-relaxed">{condition.explanation}</p>
                        </div>

                        {/* Symptoms */}
                        {condition.commonSymptoms && (
                          <div>
                            <h5 className="font-semibold text-foreground flex items-center gap-2 mb-1">
                              <Activity className="w-4 h-4 text-blue-600" /> Key Associated Symptoms
                            </h5>
                            <p className="text-muted-foreground pl-6 leading-relaxed">{condition.commonSymptoms}</p>
                          </div>
                        )}

                        {/* Causes */}
                        {condition.causes && (
                          <div>
                            <h5 className="font-semibold text-foreground flex items-center gap-2 mb-1">
                              <AlertTriangle className="w-4 h-4 text-orange-600" /> Root Causes & Triggers
                            </h5>
                            <p className="text-muted-foreground pl-6 leading-relaxed">{condition.causes}</p>
                          </div>
                        )}

                        {/* Prevention */}
                        {condition.prevention && (
                          <div>
                            <h5 className="font-semibold text-foreground flex items-center gap-2 mb-1">
                              <ShieldAlert className="w-4 h-4 text-green-600" /> Prevention & Care Tips
                            </h5>
                            <p className="text-muted-foreground pl-6 leading-relaxed">{condition.prevention}</p>
                          </div>
                        )}

                        {/* Urgent Red Flags */}
                        {condition.urgentRedFlags && (
                          <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-900">
                            <h5 className="font-bold flex items-center gap-2 mb-1 text-red-700">
                              <Siren className="w-4 h-4 text-red-600" /> When to Seek Urgent Medical Care
                            </h5>
                            <p className="text-xs sm:text-sm leading-relaxed">{condition.urgentRedFlags}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-secondary/40 p-4 rounded-lg border border-secondary">
            <h3 className="text-lg font-bold flex items-center gap-2 mb-2 text-foreground">
              <Lightbulb className="w-5 h-5 text-yellow-600" /> General Home Treatments & Precautions
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
