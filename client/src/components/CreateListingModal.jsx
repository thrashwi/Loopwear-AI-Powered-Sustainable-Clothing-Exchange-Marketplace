import React, { useState } from 'react';
import { X, Sparkles, Loader2, Image, Check, AlertCircle, Shirt, Scan, Wand2 } from 'lucide-react';
import { apiClient } from '../api';

const PRESET_IMAGES = [
  { label: 'Denim Jacket', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' },
  { label: 'Hoodie', url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80' },
  { label: 'Jeans', url: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80' },
  { label: 'Dress', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' },
  { label: 'Sneakers', url: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=800&q=80' }
];

export default function CreateListingModal({ currentUser, onClose, onItemCreated }) {
  const [formData, setFormData] = useState({
    brand: 'Zara',
    category: 'Jackets & Outerwear',
    size: 'M',
    condition: 'Like New',
    color: 'Vintage Blue',
    rawNotes: 'Worn only twice for a campus event. No tears, original hardware intact.',
    title: '',
    description: '',
    estimatedValue: 1800,
    tags: ['Zara', 'Denim', 'Sustainable', 'Outerwear'],
    imageUrl: PRESET_IMAGES[0].url
  });

  const [isScanningPhoto, setIsScanningPhoto] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🔍 Feature: AI Image-Based Clothing Recognition
  const handleScanPhotoAI = async () => {
    setIsScanningPhoto(true);
    setScanResult(null);
    try {
      const res = await apiClient.classifyImageAI(formData.imageUrl, formData.rawNotes);
      if (res.success) {
        setScanResult(res);
        setFormData(prev => ({
          ...prev,
          category: res.category || prev.category,
          brand: res.possibleBrand || prev.brand,
          color: res.color || prev.color,
          condition: res.conditionEstimate || prev.condition,
          rawNotes: `${res.style || ''} in ${res.material || 'quality fabric'}. ${prev.rawNotes}`.trim()
        }));
      }
    } catch (err) {
      console.error('Scan photo error:', err);
    } finally {
      setIsScanningPhoto(false);
    }
  };

  // ✨ Feature 1: AI Clothing Description & Valuation Generator
  const handleGenerateAI = async () => {
    setIsGeneratingAI(true);
    setAiSuccessMessage(false);
    try {
      const res = await apiClient.generateAIDescription({
        brand: formData.brand,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        color: formData.color,
        rawNotes: formData.rawNotes
      });

      if (res.success) {
        setFormData(prev => ({
          ...prev,
          title: res.title || prev.title,
          description: res.description || prev.description,
          estimatedValue: res.suggestedEstimatedValue || prev.estimatedValue,
          tags: res.tags || prev.tags
        }));
        setAiSuccessMessage(true);
      }
    } catch (err) {
      console.error('AI Generation error:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiClient.createItem({
        title: formData.title || `${formData.brand} ${formData.category}`,
        brand: formData.brand,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        color: formData.color,
        estimatedValue: Number(formData.estimatedValue) || 1500,
        description: formData.description || 'Pre-loved garment ready for a sustainable swap.',
        images: [formData.imageUrl],
        tags: formData.tags
      }, currentUser.id);

      if (res.success) {
        onItemCreated(res.item);
        onClose();
      }
    } catch (err) {
      console.error('Submit item error:', err);
    } finally {
      setIsSubmitting(false);
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
                <Shirt className="w-4 h-4" />
              </span>
              <h2 className="text-xl font-bold font-serif-display text-stone-900">
                List an Item for Swap
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Scan your photo or enter details to let AI curate the title, description, and fair valuation.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          
          {/* Photo Selection with AI Scanner */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-stone-800 flex items-center gap-1.5">
                <Image className="w-3.5 h-3.5 text-emerald-700" />
                <span>Garment Photo</span>
              </label>

              {/* 🔍 Scan Photo with AI Button */}
              <button
                type="button"
                onClick={handleScanPhotoAI}
                disabled={isScanningPhoto}
                className="px-3 py-1 rounded-xl bg-emerald-100/80 hover:bg-emerald-200/80 text-emerald-900 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-60"
              >
                {isScanningPhoto ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-800" />
                    <span>Scanning Photo...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Scan Photo with AI</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.label}
                  onClick={() => {
                    setFormData({ ...formData, imageUrl: preset.url });
                    setScanResult(null);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition shrink-0 ${
                    formData.imageUrl === preset.url
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-800 ring-1 ring-emerald-600'
                      : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-5 h-5 rounded-md object-cover" />
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            <input 
              type="text"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="w-full px-3 py-1.5 text-xs bg-white border border-stone-200 rounded-lg text-stone-600"
              placeholder="Or paste any custom image URL..."
            />

            {/* AI Image Classification banner */}
            {scanResult && (
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/90 text-xs text-emerald-900 flex items-start gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>AI Photo Recognition:</strong> Identified <strong>{scanResult.style}</strong> ({scanResult.possibleBrand}) in <strong>{scanResult.color}</strong>. Confidence: {scanResult.confidenceScore}%. Form fields auto-populated below!
                </div>
              </div>
            )}
          </div>

          {/* Garment Core Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Brand</label>
              <input 
                type="text" 
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Zara, Nike, H&M"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option>Jackets & Outerwear</option>
                <option>Tops</option>
                <option>Bottoms</option>
                <option>Dresses</option>
                <option>Shoes</option>
                <option>Accessories</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Size</label>
              <select
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option>XS</option>
                <option>S</option>
                <option>M</option>
                <option>L</option>
                <option>XL</option>
                <option>XXL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              >
                <option>Brand New with Tags</option>
                <option>Like New</option>
                <option>Gently Used</option>
                <option>Fair</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Color / Wash</label>
              <input 
                type="text" 
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                placeholder="e.g. Heather Grey"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Est. Value (₹)</label>
              <input 
                type="number" 
                value={formData.estimatedValue}
                onChange={(e) => setFormData({ ...formData, estimatedValue: e.target.value })}
                placeholder="1500"
                className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
                required
              />
            </div>
          </div>

          {/* Quick Raw Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Rough Notes (AI will transform this into styling copy)
            </label>
            <input 
              type="text" 
              value={formData.rawNotes}
              onChange={(e) => setFormData({ ...formData, rawNotes: e.target.value })}
              placeholder="e.g. Bought last season, worn 3 times, fits slightly oversized, pristine condition."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* ✨ AI MAGIC ACTION BUTTON */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950 via-forest-900 to-emerald-900 text-white relative overflow-hidden shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Feature 1: AI Description & Valuation</span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Let AI write a professional fashion description and calculate balanced swap pricing.
                </p>
              </div>

              <button
                type="button"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 shrink-0 disabled:opacity-75 cursor-pointer"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Styling with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate with AI</span>
                  </>
                )}
              </button>
            </div>

            {aiSuccessMessage && (
              <div className="mt-2.5 pt-2 border-t border-emerald-800/80 flex items-center gap-1.5 text-xs text-emerald-300">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Title, description, and fair valuation successfully generated by AI!</span>
              </div>
            )}
          </div>

          {/* AI-Generated / Editable Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Listing Title
            </label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Click 'Generate with AI' or type your title..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700"
              required
            />
          </div>

          {/* AI-Generated / Editable Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Curated Description
            </label>
            <textarea 
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Click 'Generate with AI' above to auto-craft an engaging, professional description..."
              className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-700 leading-relaxed"
              required
            />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-2xl bg-stone-900 hover:bg-emerald-800 text-white font-semibold text-sm shadow-md transition flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Listing...</span>
                </>
              ) : (
                <span>Publish Listing to Marketplace</span>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
