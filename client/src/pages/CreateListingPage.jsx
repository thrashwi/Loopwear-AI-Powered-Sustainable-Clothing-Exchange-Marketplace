import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Camera,
  Shirt,
  Info
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['Tops', 'Bottoms', 'Jackets & Outerwear', 'Dresses', 'Shoes', 'Accessories'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const CONDITIONS = ['Brand New with Tags', 'Like New', 'Gently Used', 'Fair'];

export default function CreateListingPage({ onItemCreated }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    category: 'Tops',
    size: 'M',
    condition: 'Like New',
    color: '',
    estimatedValue: '',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80',
    tags: '',
    location: currentUser?.location || 'Bengaluru, India'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(formData.imageUrl);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [isAiScanning, setIsAiScanning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorMsg('');
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image size exceeds 5MB limit.');
        return;
      }
      setImageFile(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  };

  // 1. AI Description & Valuation Generator
  const handleGenerateAI = async () => {
    setIsAiGenerating(true);
    setErrorMsg('');
    try {
      const res = await apiClient.generateAIDescription({
        brand: formData.brand,
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        color: formData.color,
        rawNotes: formData.description || formData.title
      });

      if (res.title || res.description) {
        setFormData(prev => ({
          ...prev,
          title: res.title || prev.title,
          description: res.description || prev.description,
          estimatedValue: res.suggestedEstimatedValue || prev.estimatedValue || 1600,
          tags: Array.isArray(res.tags) ? res.tags.join(', ') : prev.tags
        }));
      }
    } catch (err) {
      console.error('AI generation error:', err);
      setErrorMsg('AI description generator encountered an issue. You can fill details manually.');
    } finally {
      setIsAiGenerating(false);
    }
  };

  // 2. AI Image Scanner
  const handleScanImageAI = async () => {
    if (!imagePreview && !formData.imageUrl) {
      setErrorMsg('Please provide an image first to scan.');
      return;
    }
    setIsAiScanning(true);
    setErrorMsg('');
    try {
      const res = await apiClient.classifyImageAI(formData.imageUrl || imagePreview, formData.brand);
      if (res) {
        setFormData(prev => ({
          ...prev,
          category: res.category || prev.category,
          color: res.color || prev.color,
          brand: res.possibleBrand || prev.brand,
          condition: res.conditionEstimate || prev.condition
        }));
      }
    } catch (err) {
      console.error('AI Scan error:', err);
    } finally {
      setIsAiScanning(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title.trim()) {
      setErrorMsg('Item title is required.');
      return;
    }
    if (!formData.brand.trim()) {
      setErrorMsg('Brand name is required.');
      return;
    }
    if (!formData.estimatedValue || Number(formData.estimatedValue) <= 0) {
      setErrorMsg('Please specify a realistic estimated barter value (₹).');
      return;
    }

    setIsSubmitting(true);
    try {
      let finalImageUrl = formData.imageUrl;

      // Upload file if selected
      if (imageFile) {
        try {
          const uploadRes = await apiClient.uploadImage(imageFile, currentUser?.id);
          if (uploadRes.success && uploadRes.url) {
            finalImageUrl = uploadRes.url;
          }
        } catch (uploadErr) {
          console.warn('File upload fallback:', uploadErr);
        }
      }

      const tagsArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        : [formData.brand, formData.category];

      const itemPayload = {
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        size: formData.size,
        condition: formData.condition,
        color: formData.color.trim() || 'Neutral',
        estimatedValue: Number(formData.estimatedValue),
        description: formData.description.trim() || 'Curated pre-loved garment ready for swap.',
        images: [finalImageUrl],
        tags: tagsArray,
        location: formData.location.trim() || currentUser?.location || 'Bengaluru, India'
      };

      const res = await apiClient.createItem(itemPayload, currentUser?.id);
      if (res.success && res.item) {
        setSuccessMsg('Your listing was published successfully to the marketplace!');
        if (onItemCreated) onItemCreated(res.item);
        setTimeout(() => {
          navigate('/my-listings');
        }, 1200);
      } else {
        setErrorMsg(res.message || 'Failed to publish listing.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Server error occurred while creating listing.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Navigation back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        {/* Header */}
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>AI-Assisted Listing Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-display text-stone-900 tracking-tight">
            List a Garment for Barter Exchange
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Fill in details below or let Loopwear AI generate engaging descriptions and valuation estimates automatically.
          </p>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          
          {/* Image & Photo Scanner Section */}
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-stone-900 uppercase tracking-wider">Garment Photo</h3>
                <p className="text-[11px] text-stone-500">Provide an image URL or upload a photo from your device</p>
              </div>
              <button
                type="button"
                onClick={handleScanImageAI}
                disabled={isAiScanning}
                className="px-3.5 py-1.5 rounded-full bg-white border border-stone-200 hover:border-emerald-600 text-stone-700 hover:text-emerald-800 text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
              >
                <Camera className={`w-3.5 h-3.5 text-emerald-700 ${isAiScanning ? 'animate-spin' : ''}`} />
                <span>{isAiScanning ? 'Scanning...' : 'Scan Photo with AI'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-200 border border-stone-300 flex items-center justify-center">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-stone-400" />
                )}
              </div>

              <div className="sm:col-span-2 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => {
                      handleChange(e);
                      setImagePreview(e.target.value);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                    Or Upload File from Computer
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-stone-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-800 hover:file:bg-emerald-100 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Generator Helper Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900 to-forest-800 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-800 rounded-xl text-emerald-300">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-xs text-white">AI Description & Valuation Generator</p>
                <p className="text-[11px] text-emerald-200">Automatically creates title, fashion description, and estimated barter value.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGenerateAI}
              disabled={isAiGenerating}
              className="px-4 py-2 rounded-full bg-white text-stone-900 hover:bg-emerald-50 text-xs font-bold transition shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Sparkles className={`w-3.5 h-3.5 text-emerald-700 ${isAiGenerating ? 'animate-spin' : ''}`} />
              <span>{isAiGenerating ? 'Synthesizing...' : 'Generate with AI'}</span>
            </button>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Title */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Item Title *</label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Zara Vintage Wash Denim Trucker Jacket"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-medium"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Brand *</label>
              <input
                type="text"
                name="brand"
                required
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Zara, Nike, Levi's, H&M"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Size */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Size *</label>
              <select
                name="size"
                value={formData.size}
                onChange={handleChange}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Condition *</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              >
                {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Color */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Color / Tone</label>
              <input
                type="text"
                name="color"
                value={formData.color}
                onChange={handleChange}
                placeholder="e.g. Vintage Blue, Heather Grey, Charcoal"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Estimated Value */}
            <div>
              <label className="block font-semibold text-stone-700 mb-1">
                Estimated Barter Value (₹) *
              </label>
              <input
                type="number"
                name="estimatedValue"
                required
                min="100"
                step="50"
                value={formData.estimatedValue}
                onChange={handleChange}
                placeholder="e.g. 1750"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 font-bold text-emerald-900"
              />
            </div>

            {/* Location */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Location / City *</label>
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Koramangala, Bengaluru"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">Description *</label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe fabric feel, silhouette, how many times worn, condition flaws (if any)..."
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600 leading-relaxed"
              />
            </div>

            {/* Tags */}
            <div className="sm:col-span-2">
              <label className="block font-semibold text-stone-700 mb-1">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="e.g. Streetwear, Denim, Autumn, Casual"
                className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-full border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-full bg-stone-900 hover:bg-emerald-800 text-white font-bold text-xs tracking-wide shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Clothing Listing'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
