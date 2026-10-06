import React, { useState, useEffect } from 'react';
import { X, ArrowRightLeft, Scale, Sparkles, CheckCircle2, AlertTriangle, AlertCircle, Loader2, Layers, Check } from 'lucide-react';
import { apiClient } from '../api';

export default function SwapProposalModal({ 
  requestedItem, 
  currentUser, 
  userWardrobe = [], 
  onClose, 
  onProposalSent,
  onOpenCreateListing
}) {
  // Array of selected offered item IDs for multi-item bundle support
  const [selectedOfferedIds, setSelectedOfferedIds] = useState(
    userWardrobe.length > 0 ? [userWardrobe[0].id] : []
  );
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedOfferedItems = userWardrobe.filter(i => selectedOfferedIds.includes(i.id));
  const totalOfferedValue = selectedOfferedItems.reduce((acc, i) => acc + (Number(i.estimatedValue) || 1000), 0);

  // Toggle item selection in bundle
  const toggleItemSelection = (itemId) => {
    setSelectedOfferedIds(prev => {
      if (prev.includes(itemId)) {
        if (prev.length === 1) return prev; // Keep at least one item selected
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };

  // Run AI Swap Assessment whenever selected items or requested item change
  useEffect(() => {
    if (selectedOfferedItems.length > 0 && requestedItem) {
      runAIEvaluation(selectedOfferedItems, requestedItem);
    }
  }, [selectedOfferedIds.join(','), requestedItem?.id]);

  const runAIEvaluation = async (offered, requested) => {
    setIsEvaluating(true);
    try {
      const res = await apiClient.evaluateSwapAI(offered, requested);
      if (res.success) {
        setEvaluation(res);
      }
    } catch (err) {
      console.error('Swap evaluation error:', err);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleSendProposal = async () => {
    if (selectedOfferedItems.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await apiClient.createSwapProposal(
        selectedOfferedIds, 
        requestedItem.id, 
        currentUser.id
      );
      if (res.success) {
        onProposalSent(res.swap);
        onClose();
      }
    } catch (err) {
      console.error('Submit proposal error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getVerdictStyle = (verdict) => {
    switch (verdict) {
      case 'Fair Swap':
        return {
          bg: 'bg-emerald-50 border-emerald-300 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          icon: CheckCircle2,
          color: 'text-emerald-600'
        };
      case 'Slightly Unbalanced':
        return {
          bg: 'bg-amber-50 border-amber-300 text-amber-900',
          badge: 'bg-amber-500 text-white',
          icon: AlertTriangle,
          color: 'text-amber-600'
        };
      default:
        return {
          bg: 'bg-rose-50 border-rose-300 text-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: AlertCircle,
          color: 'text-rose-600'
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <Scale className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold font-serif-display text-stone-900">
                Propose a Clothing Swap
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Select one or bundle multiple items. Our AI evaluates trade equity in real time.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Side-by-Side Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 relative">
            
            {/* Left: Your Wardrobe Offer & Bundling */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    <span>Your Offer ({selectedOfferedIds.length} item{selectedOfferedIds.length > 1 ? 's' : ''})</span>
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Total: ₹{totalOfferedValue.toLocaleString('en-IN')}
                  </span>
                </div>

                {userWardrobe.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-xs text-stone-500 mb-3">
                      You haven't listed any items in your wardrobe yet!
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onOpenCreateListing();
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-emerald-800 text-white text-xs font-semibold"
                    >
                      + List an item first
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    <p className="text-[10px] text-stone-400 font-medium">
                      Check items to bundle together:
                    </p>
                    {userWardrobe.map(item => {
                      const isSelected = selectedOfferedIds.includes(item.id);
                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleItemSelection(item.id)}
                          className={`flex items-center gap-2.5 p-2 rounded-xl border cursor-pointer transition ${
                            isSelected
                              ? 'bg-emerald-50/80 border-emerald-600/90 ring-1 ring-emerald-600/20'
                              : 'bg-white border-stone-200 hover:bg-stone-100/60'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center border text-white text-xs ${
                            isSelected ? 'bg-emerald-700 border-emerald-700' : 'border-stone-300 bg-white'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <img 
                            src={item.images?.[0]} 
                            alt={item.title} 
                            className="w-10 h-10 object-cover rounded-lg shrink-0"
                          />

                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-stone-800 truncate">
                              {item.brand} • {item.title}
                            </div>
                            <div className="text-[11px] text-emerald-800 font-semibold">
                              ₹{item.estimatedValue?.toLocaleString('en-IN')} • {item.condition}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Target Requested Item */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Requested Garment
                  </span>
                  <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md">
                    Target: ₹{requestedItem.estimatedValue?.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-stone-200 space-y-2 mt-2">
                  <div className="flex items-center gap-3">
                    <img 
                      src={requestedItem.images?.[0]} 
                      alt={requestedItem.title} 
                      className="w-16 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold">
                        {requestedItem.brand}
                      </span>
                      <div className="text-xs font-bold text-stone-900 mt-1 line-clamp-2">
                        {requestedItem.title}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Size: {requestedItem.size} • {requestedItem.condition}
                      </div>
                      <div className="text-xs font-bold text-emerald-800 mt-1">
                        Est. ₹{requestedItem.estimatedValue?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    Owner: <span className="font-semibold text-stone-800">{requestedItem.ownerName}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ⚖️ FEATURE 2: AI FAIR SWAP EVALUATION BADGE */}
          {selectedOfferedItems.length > 0 && (
            <div className="rounded-2xl border p-4.5 transition-all duration-300 relative overflow-hidden bg-gradient-to-br from-stone-50 to-white shadow-sm">
              
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                      Feature 2: AI Fair Swap Assessment
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      Evaluates brand tiers, combined equity, and market desirability
                    </p>
                  </div>
                </div>

                {isEvaluating ? (
                  <div className="flex items-center gap-1.5 text-xs text-stone-500">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing trade...</span>
                  </div>
                ) : evaluation ? (
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getVerdictStyle(evaluation.verdict).badge}`}>
                    {evaluation.verdict} ({evaluation.score || 95}%)
                  </span>
                ) : null}
              </div>

              {evaluation && !isEvaluating && (
                <div className="mt-3 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-600 font-medium">
                      Equity Difference ({totalOfferedValue >= requestedItem.estimatedValue ? 'You offer more' : 'They offer more'}):
                    </span>
                    <span className="font-bold text-stone-900">
                      ₹{evaluation.differenceAmount?.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed bg-stone-100/70 p-3 rounded-xl border border-stone-200/60">
                    "{evaluation.analysisText}"
                  </p>

                  <div className="text-[11px] text-emerald-900 font-medium bg-emerald-50 px-3 py-2.5 rounded-xl border border-emerald-200/60 flex items-start gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                    <span><strong>AI Recommendation:</strong> {evaluation.recommendation}</span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* Action */}
          <div className="pt-1">
            <button
              onClick={handleSendProposal}
              disabled={isSubmitting || selectedOfferedItems.length === 0}
              className="w-full py-3.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Proposal...</span>
                </>
              ) : (
                <>
                  <ArrowRightLeft className="w-4 h-4" />
                  <span>Send Proposal ({selectedOfferedIds.length} {selectedOfferedIds.length > 1 ? 'Items' : 'Item'} for 1)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
