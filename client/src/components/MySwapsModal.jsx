import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowRightLeft, 
  MessageSquare, 
  Sparkles, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  CheckCheck,
  Scale,
  Loader2
} from 'lucide-react';
import { apiClient } from '../api';
import io from 'socket.io-client';

export default function MySwapsModal({ 
  currentUser, 
  onClose, 
  onSwapUpdated 
}) {
  const [swaps, setSwaps] = useState([]);
  const [activeSwap, setActiveSwap] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [socket, setSocket] = useState(null);

  // Load swaps
  useEffect(() => {
    loadUserSwaps();
  }, [currentUser]);

  const loadUserSwaps = async () => {
    try {
      const res = await apiClient.getSwaps(currentUser.id);
      if (res.success) {
        setSwaps(res.swaps);
        if (res.swaps.length > 0 && !activeSwap) {
          setActiveSwap(res.swaps[0]);
        }
      }
    } catch (err) {
      console.error('Error loading swaps:', err);
    }
  };

  // Connect socket and load conversation when active swap changes
  useEffect(() => {
    if (!activeSwap) return;

    // Load existing messages
    loadConversation(activeSwap.id);

    // Fetch Feature 3: AI Negotiation suggestions
    loadAISuggestions(activeSwap);

    // Connect to Socket.IO
    const newSocket = io('http://localhost:5000', { transports: ['websocket'] });
    setSocket(newSocket);

    newSocket.emit('join_swap_room', { swapId: activeSwap.id });

    newSocket.on('receive_message', (newMsg) => {
      setMessages(prev => [...prev, newMsg]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeSwap?.id]);

  const loadConversation = async (swapId) => {
    try {
      const res = await apiClient.getConversation(swapId);
      if (res.success && res.conversation) {
        setMessages(res.conversation.messages || []);
      }
    } catch (err) {
      console.error('Error loading conversation:', err);
    }
  };

  // Load Feature 3: AI Negotiation Suggestions
  const loadAISuggestions = async (swap) => {
    setIsLoadingSuggestions(true);
    try {
      const userRole = swap.requesterId === currentUser.id ? 'requester' : 'recipient';
      const offeredTitle = swap.offeredItem?.title || 'Clothing item';
      const requestedTitle = swap.requestedItem?.title || 'Clothing item';
      const diff = swap.aiFairnessAssessment?.differenceAmount || 0;
      const verdict = swap.aiFairnessAssessment?.verdict || 'Fair Swap';

      const res = await apiClient.getChatSuggestionsAI({
        userRole,
        offeredTitle,
        requestedTitle,
        differenceAmount: diff,
        verdict
      });

      if (res.success && res.suggestions) {
        setAiSuggestions(res.suggestions);
      }
    } catch (err) {
      console.error('Error getting AI suggestions:', err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSendMessage = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeSwap) return;

    if (socket && socket.connected) {
      socket.emit('send_message', {
        swapId: activeSwap.id,
        senderId: currentUser.id,
        text
      });
    } else {
      // Fallback via REST
      apiClient.sendMessage(activeSwap.id, text, currentUser.id).then(res => {
        if (res.success) {
          setMessages(prev => [...prev, res.message]);
        }
      });
    }

    setInputText('');
  };

  const handleUpdateStatus = async (status) => {
    if (!activeSwap) return;
    try {
      const res = await apiClient.updateSwapStatus(activeSwap.id, status, currentUser.id);
      if (res.success) {
        setActiveSwap(prev => ({ ...prev, status }));
        loadUserSwaps();
        if (onSwapUpdated) onSwapUpdated();
      }
    } catch (err) {
      console.error('Update status error:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div 
        className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-stone-200 flex flex-col h-[85vh] animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-sm">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif-display text-stone-900 leading-none">
                Swap Negotiations & Messages
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                Real-time negotiation chat with AI-assisted counteroffers
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center hover:bg-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Body: Swaps List (Left) + Chat Pane (Right) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          
          {/* Left Column: Swaps List */}
          <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-stone-200/80 bg-stone-50/40 overflow-y-auto flex flex-col">
            <div className="p-3 text-[11px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200/60">
              Active Swap Proposals ({swaps.length})
            </div>

            {swaps.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-400">
                No active swaps yet. Propose a swap on any item to begin!
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {swaps.map((s) => {
                  const isSelected = activeSwap?.id === s.id;
                  const otherParty = s.requesterId === currentUser.id ? s.recipient : s.requester;
                  const isOutgoing = s.requesterId === currentUser.id;

                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveSwap(s)}
                      className={`w-full text-left p-3.5 transition flex items-start gap-3 ${
                        isSelected ? 'bg-white shadow-sm border-l-4 border-emerald-700' : 'hover:bg-stone-100/70'
                      }`}
                    >
                      <img 
                        src={otherParty.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'} 
                        alt={otherParty.name}
                        className="w-10 h-10 rounded-full object-cover mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-stone-900 truncate">
                            {otherParty.name}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                            s.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                            s.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {s.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 truncate mt-0.5">
                          {isOutgoing ? `You proposed for: ${s.requestedItem?.title}` : `Proposed for your: ${s.requestedItem?.title}`}
                        </div>
                        {s.aiFairnessAssessment && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-800 font-medium">
                            <Scale className="w-3 h-3" />
                            <span>AI Verdict: {s.aiFairnessAssessment.verdict}</span>
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Chat Room with AI Suggestion Chips */}
          {activeSwap ? (
            <div className="flex-1 flex flex-col bg-white overflow-hidden">
              
              {/* Swap Summary Bar */}
              <div className="p-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-semibold text-stone-800 truncate">
                    Trade: {activeSwap.offeredItem?.brand} ({activeSwap.offeredItem?.title}) ⟷ {activeSwap.requestedItem?.brand} ({activeSwap.requestedItem?.title})
                  </span>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeSwap.status === 'pending' && activeSwap.recipientId === currentUser.id && (
                    <>
                      <button
                        onClick={() => handleUpdateStatus('accepted')}
                        className="px-3 py-1 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-sm transition"
                      >
                        Accept Swap
                      </button>
                      <button
                        onClick={() => handleUpdateStatus('rejected')}
                        className="px-3 py-1 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 font-semibold text-xs transition"
                      >
                        Decline
                      </button>
                    </>
                  )}

                  {activeSwap.status === 'accepted' && (
                    <button
                      onClick={() => handleUpdateStatus('completed')}
                      className="px-3 py-1 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Confirm Items Swapped</span>
                    </button>
                  )}

                  {activeSwap.status === 'completed' && (
                    <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs flex items-center gap-1">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Exchange Completed!</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Chat Message History */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#faf9f6]/40">
                {messages.map((msg) => {
                  const isMe = msg.senderId === currentUser.id;
                  const isSystem = msg.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={msg.id} className="text-center my-3">
                        <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div 
                      key={msg.id} 
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] text-stone-400 mb-1 px-1">
                        {isMe ? 'You' : msg.senderName}
                      </span>
                      <div className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-emerald-800 text-white rounded-br-xs' 
                          : 'bg-white text-stone-800 border border-stone-200 shadow-xs rounded-bl-xs'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 💬 FEATURE 3: AI NEGOTIATION ASSISTANT CHIPS */}
              <div className="p-3 bg-stone-50 border-t border-stone-200/80">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-700 uppercase tracking-wide mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Feature 3: AI Negotiation Suggestions</span>
                  {isLoadingSuggestions && (
                    <Loader2 className="w-3 h-3 text-stone-400 animate-spin ml-1" />
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {aiSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(suggestion)}
                      className="px-3 py-1.5 rounded-xl bg-white border border-emerald-200/90 text-stone-700 hover:border-emerald-600 hover:bg-emerald-50 text-xs text-left truncate max-w-xs shrink-0 shadow-2xs transition"
                      title={suggestion}
                    >
                      <span className="text-emerald-700 font-bold mr-1">✨</span>
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Input Box */}
              <div className="p-3.5 bg-white border-t border-stone-200 flex items-center gap-2">
                <input 
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type a message or click an AI suggestion chip above..."
                  className="flex-1 px-4 py-2 text-xs bg-stone-100 rounded-full border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-700"
                />
                <button
                  onClick={() => handleSendMessage()}
                  className="w-8 h-8 rounded-full bg-emerald-800 hover:bg-emerald-700 text-white flex items-center justify-center shadow-sm transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center p-8 text-stone-400 text-sm">
              Select a swap proposal from the left to start negotiating.
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
