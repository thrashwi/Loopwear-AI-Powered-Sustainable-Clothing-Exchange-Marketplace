import React, { useState } from 'react';
import { X, Leaf, Droplets, Wind, Shirt, Trophy, Sparkles, Calculator, Loader2, Check } from 'lucide-react';
import { apiClient } from '../api';

export default function SustainabilityModal({ currentUser, onClose }) {
  const stats = currentUser.sustainabilityScore || {
    co2KgSaved: 48,
    waterLitersSaved: 15400,
    garmentsDiverted: 14
  };

  const bathtubsOfWater = Math.round(stats.waterLitersSaved / 150);
  const carKmSaved = Math.round(stats.co2KgSaved * 6);

  // Interactive AI Calculator state
  const [calcGarment, setCalcGarment] = useState('Jackets & Outerwear');
  const [calcMaterial, setCalcMaterial] = useState('Cotton Denim');
  const [isCalculating, setIsCalculating] = useState(false);
  const [calcResult, setCalcResult] = useState(null);

  const handleCalculateSavings = async () => {
    setIsCalculating(true);
    try {
      const res = await apiClient.calculateSustainabilityAI({
        garmentType: calcGarment,
        material: calcMaterial
      });
      if (res.success) {
        setCalcResult(res);
      }
    } catch (err) {
      console.error('Calculation error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-emerald-950 text-white relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Leaf className="w-4 h-4" />
              <span>Loopwear Sustainability Score</span>
            </div>
            <h2 className="text-2xl font-bold font-serif-display">
              {currentUser.name}'s Eco Footprint
            </h2>
            <p className="text-xs text-emerald-200/80 mt-1">
              Every clothing barter prevents new textile manufacturing resource depletion.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition relative z-10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* User's Lifetime Impact Numbers */}
          <div className="grid grid-cols-3 gap-3 text-center">
            
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                <Droplets className="w-4 h-4" />
              </div>
              <div className="font-serif-display text-xl font-bold text-emerald-900">
                {stats.waterLitersSaved?.toLocaleString()} L
              </div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">Water Conserved</div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80">
              <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center mx-auto mb-2">
                <Wind className="w-4 h-4" />
              </div>
              <div className="font-serif-display text-xl font-bold text-teal-900">
                {stats.co2KgSaved} kg
              </div>
              <div className="text-[11px] text-teal-700 font-medium mt-0.5">CO₂ Offset</div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center mx-auto mb-2">
                <Shirt className="w-4 h-4" />
              </div>
              <div className="font-serif-display text-xl font-bold text-amber-900">
                {stats.garmentsDiverted}
              </div>
              <div className="text-[11px] text-amber-700 font-medium mt-0.5">Garments Saved</div>
            </div>

          </div>

          {/* Real-World Equivalence */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-700" />
              <span>Real-World Equivalents of Your Swaps</span>
            </h4>
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>Equals approx. <strong>{bathtubsOfWater} standard bathtubs</strong> of fresh drinking water saved.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-600"></span>
                <span>Equivalent to <strong>{carKmSaved} km of passenger car travel</strong> prevented in carbon emissions.</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                <span>Total verified swaps completed: <strong>{currentUser.swapsCompleted} direct exchanges</strong>.</span>
              </div>
            </div>
          </div>

          {/* ♻️ INTERACTIVE AI SUSTAINABILITY CALCULATOR */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-br from-stone-50 to-emerald-50/30 border border-emerald-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wide">
                    AI Circular Lifecycle Estimator
                  </h4>
                  <p className="text-[11px] text-stone-500">
                    Estimate ecological savings for any specific garment you plan to swap
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Garment Type</label>
                <select
                  value={calcGarment}
                  onChange={(e) => setCalcGarment(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option>Jackets & Outerwear</option>
                  <option>Bottoms</option>
                  <option>Dresses</option>
                  <option>Tops</option>
                  <option>Shoes</option>
                  <option>Accessories</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Material</label>
                <select
                  value={calcMaterial}
                  onChange={(e) => setCalcMaterial(e.target.value)}
                  className="w-full text-xs p-2 bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
                >
                  <option>Cotton Denim</option>
                  <option>Brushed Fleece</option>
                  <option>100% Organic Cotton</option>
                  <option>Polyester Chiffon</option>
                  <option>Down / Feather</option>
                  <option>Suede / Leather</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleCalculateSavings}
              disabled={isCalculating}
              className="w-full py-2 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
            >
              {isCalculating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Computing Impact...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Calculate Swap Impact with AI</span>
                </>
              )}
            </button>

            {calcResult && (
              <div className="p-3 bg-white rounded-xl border border-emerald-300/80 shadow-xs space-y-1.5 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-950">
                  <span>🌊 Water Saved: {calcResult.waterSavedLiters?.toLocaleString()} Liters</span>
                  <span>🌱 CO₂ Avoided: {calcResult.co2SavedKg} kg</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed pt-1 border-t border-stone-100">
                  {calcResult.insight}
                </p>
              </div>
            )}
          </div>

          {/* AI Circular Economy Insight */}
          <div className="p-4 rounded-2xl bg-emerald-900 text-white flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-emerald-300 mt-0.5 shrink-0" />
            <div className="text-xs space-y-1">
              <div className="font-bold text-emerald-200 uppercase tracking-wide">
                AI Circular Economy Insight
              </div>
              <p className="text-emerald-100/90 leading-relaxed font-light">
                By swapping instead of purchasing brand-new clothing, you extend a garment’s active lifecycle by an average of 2.2 years, reducing global fashion supply chain waste by over 70%.
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
          >
            Close Dashboard
          </button>

        </div>

      </div>
    </div>
  );
}
