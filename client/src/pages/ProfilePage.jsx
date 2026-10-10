import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  User, 
  MapPin, 
  Leaf, 
  ShieldCheck, 
  Edit3, 
  CheckCircle2, 
  Droplet, 
  Trash2, 
  LogOut,
  Shirt,
  Calendar,
  Sparkles
} from 'lucide-react';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ProfilePage() {
  const { currentUser, logout, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [completedSwaps, setCompletedSwaps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit form state
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const fetchProfile = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const res = await apiClient.getProfile(currentUser.id);
      if (res.success && res.profile) {
        setProfileData(res.profile);
        setCompletedSwaps(res.completedSwaps || []);
        setEditName(res.profile.name);
        setEditLocation(res.profile.location || '');
        setEditAvatar(res.profile.avatar || '');
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [currentUser?.id]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await apiClient.updateProfile({
        name: editName.trim(),
        location: editLocation.trim(),
        avatar: editAvatar.trim()
      }, currentUser.id);

      if (res.success && res.user) {
        setStatusMsg('Profile updated successfully!');
        setIsEditing(false);
        refreshUserData();
        fetchProfile();
        setTimeout(() => setStatusMsg(''), 3000);
      }
    } catch (err) {
      console.error('Update profile error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto py-16 text-center text-xs text-stone-400">Loading user profile...</div>;
  }

  const profile = profileData || currentUser;
  const sust = profile?.sustainabilityScore || { co2KgSaved: 0, waterLitersSaved: 0, garmentsDiverted: 0 };

  return (
    <div className="bg-[#faf9f6] min-h-screen py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={profile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={profile.name}
              className="w-20 h-20 rounded-3xl object-cover ring-2 ring-emerald-600 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold font-serif-display text-stone-900">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-1">@{profile.username || 'user'}</p>
              <p className="text-xs text-stone-600 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{profile.location || 'Bengaluru, India'}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 rounded-xl border border-stone-200 hover:border-emerald-600 text-xs font-semibold text-stone-700 hover:text-emerald-800 transition flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="px-4 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Status Message */}
        {statusMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{statusMsg}</span>
          </div>
        )}

        {/* Edit Profile Form */}
        {isEditing && (
          <form onSubmit={handleSaveProfile} className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-sm space-y-4 animate-in fade-in duration-200">
            <h3 className="font-bold text-sm text-stone-900">Update Profile Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Display Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div>
                <label className="block font-semibold text-stone-700 mb-1">City / Location</label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block font-semibold text-stone-700 mb-1">Avatar Image URL</label>
                <input
                  type="url"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-full bg-stone-900 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
              >
                {isSaving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Sustainability Milestones Grid */}
        <div className="bg-gradient-to-r from-emerald-950 to-emerald-900 text-white p-6 sm:p-8 rounded-3xl shadow-md space-y-6">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-emerald-400" />
            <h2 className="font-serif-display font-bold text-lg text-white">
              Lifetime Environmental Contribution
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-800/80">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Carbon Offset</span>
              <p className="text-3xl font-extrabold font-serif-display text-white mt-1">
                {sust.co2KgSaved} kg
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Equivalent to ~15 miles driven offset</p>
            </div>

            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-800/80">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Water Preserved</span>
              <p className="text-3xl font-extrabold font-serif-display text-white mt-1">
                {sust.waterLitersSaved?.toLocaleString()} L
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Textile dyeing wastewater diverted</p>
            </div>

            <div className="bg-emerald-900/60 p-5 rounded-2xl border border-emerald-800/80">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider block">Garments Circulated</span>
              <p className="text-3xl font-extrabold font-serif-display text-white mt-1">
                {sust.garmentsDiverted} pieces
              </p>
              <p className="text-[11px] text-emerald-300 mt-1">Diverted from city landfills</p>
            </div>
          </div>
        </div>

        {/* Completed Swap History Timeline */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif-display font-bold text-lg text-stone-900">
              Completed Swap History ({completedSwaps.length})
            </h3>
            <Link to="/swaps" className="text-xs font-semibold text-emerald-800 hover:underline">
              View All Swaps
            </Link>
          </div>

          {completedSwaps.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              No completed swaps yet. Finalize an accepted swap to track your history here!
            </p>
          ) : (
            <div className="space-y-3">
              {completedSwaps.map((s) => (
                <div key={s.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Exchanged with {s.requesterId === profile.id ? 'Partner' : 'Member'}</span>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Completed on {new Date(s.updatedAt || s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 font-bold rounded-full text-[10px] uppercase">
                    Completed & Diverted
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
