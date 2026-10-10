import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  ArrowRightLeft, 
  User, 
  Clock, 
  Check, 
  CheckCheck,
  Shirt,
  Info
} from 'lucide-react';
import { io } from 'socket.io-client';
import { apiClient } from '../api';
import { useAuth } from '../context/AuthContext';

export default function ChatPage() {
  const { conversationId: paramConvId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(paramConvId || null);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [partner, setPartner] = useState(null);
  const [swapContext, setSwapContext] = useState(null);
  const [inputText, setInputText] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [loadingConv, setLoadingConv] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO
  useEffect(() => {
    const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;
    socketRef.current = io(socketUrl, {
      transports: ['websocket', 'polling']
    });

    socketRef.current.on('receive_message', (newMsg) => {
      setMessages(prev => {
        // Prevent duplicate appending
        if (prev.some(m => m.id === newMsg.id)) return prev;
        return [...prev, newMsg];
      });
    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  // Fetch all user conversations
  const loadConversations = async () => {
    if (!currentUser) return;
    try {
      const res = await apiClient.getConversations(currentUser.id);
      if (res.success && res.conversations) {
        setConversations(res.conversations);
        if (!activeConvId && res.conversations.length > 0) {
          setActiveConvId(res.conversations[0].swapId || res.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [currentUser?.id]);

  // Update activeConvId if param changes
  useEffect(() => {
    if (paramConvId) setActiveConvId(paramConvId);
  }, [paramConvId]);

  // Load active conversation messages
  useEffect(() => {
    if (!activeConvId || !currentUser) return;
    setLoadingConv(true);

    async function loadChat() {
      try {
        const res = await apiClient.getConversation(activeConvId, currentUser.id);
        if (res.success && res.conversation) {
          setActiveConversation(res.conversation);
          setMessages(res.conversation.messages || []);
          setPartner(res.partner);
          setSwapContext(res.swap);

          // Join Socket.IO room
          if (socketRef.current) {
            socketRef.current.emit('join_swap_room', { swapId: activeConvId });
            socketRef.current.emit('join_room', { roomId: activeConvId });
          }

          // Fetch AI Negotiation suggestions
          fetchAiSuggestions(res.swap);
        }
      } catch (err) {
        console.error('Failed to load chat:', err);
      } finally {
        setLoadingConv(false);
      }
    }

    loadChat();
  }, [activeConvId, currentUser?.id]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI Negotiation Assistant
  const fetchAiSuggestions = async (swap) => {
    if (!swap) return;
    setLoadingSuggestions(true);
    try {
      const isRequester = swap.requesterId === currentUser?.id;
      const res = await apiClient.getChatSuggestionsAI({
        userRole: isRequester ? 'requester' : 'recipient',
        offeredTitle: swap.offeredItem?.title || 'Garment',
        requestedTitle: swap.requestedItem?.title || 'Garment',
        differenceAmount: swap.aiFairnessAssessment?.differenceAmount || 0,
        verdict: swap.aiFairnessAssessment?.verdict || 'Fair Swap'
      });

      if (res.success && res.suggestions) {
        setAiSuggestions(res.suggestions);
      }
    } catch (err) {
      console.warn('AI suggestions notice:', err);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId) return;

    const textToSend = inputText.trim();
    setInputText('');

    // Emit via Socket.IO for instant delivery
    if (socketRef.current) {
      socketRef.current.emit('send_message', {
        swapId: activeConvId,
        senderId: currentUser.id,
        text: textToSend
      });
    }

    // Persist to backend database
    try {
      await apiClient.sendMessage(activeConvId, textToSend, currentUser.id);
      loadConversations();
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleApplySuggestion = (suggestionText) => {
    setInputText(suggestionText);
  };

  return (
    <div className="bg-[#faf9f6] min-h-[85vh] py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[700px]">
          
          {/* Left Pane: Conversations List (4 cols) */}
          <div className="md:col-span-4 border-r border-stone-200 flex flex-col bg-stone-50/50">
            <div className="p-4 sm:p-5 border-b border-stone-200">
              <h2 className="font-serif-display font-bold text-lg text-stone-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <span>Negotiations & Chat</span>
              </h2>
              <p className="text-[11px] text-stone-500 mt-0.5">Private real-time conversation between swappers</p>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-xs text-stone-400">
                  <MessageSquare className="w-8 h-8 text-stone-300 mx-auto mb-2" />
                  <p>No active conversations yet.</p>
                  <p className="text-[11px] mt-1">Start a conversation by proposing a swap!</p>
                </div>
              ) : (
                conversations.map((conv) => {
                  const isActive = (conv.swapId || conv.id) === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => {
                        const targetId = conv.swapId || conv.id;
                        setActiveConvId(targetId);
                        navigate(`/chat/${targetId}`);
                      }}
                      className={`w-full text-left p-4 transition flex items-start gap-3 ${
                        isActive ? 'bg-emerald-50/80 border-l-4 border-emerald-800' : 'hover:bg-stone-100/70'
                      }`}
                    >
                      <img
                        src={conv.partner?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                        alt={conv.partner?.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-xs text-stone-900 truncate">
                            {conv.partner?.name || 'Swapper'}
                          </p>
                          {conv.swapContext?.status && (
                            <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 bg-stone-200 text-stone-700 rounded">
                              {conv.swapContext.status}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-500 truncate mt-1">
                          {conv.lastMessage?.text || 'No messages yet'}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Pane: Active Chat Room (8 cols) */}
          <div className="md:col-span-8 flex flex-col justify-between bg-white">
            
            {/* Chat Room Header */}
            {activeConvId && partner ? (
              <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-white z-10">
                <div className="flex items-center gap-3">
                  <img
                    src={partner.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                    alt={partner.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-600/30"
                  />
                  <div>
                    <h3 className="font-bold text-xs sm:text-sm text-stone-900">{partner.name}</h3>
                    <p className="text-[11px] text-stone-500">{partner.location || 'Bengaluru, India'}</p>
                  </div>
                </div>

                {swapContext && (
                  <Link
                    to="/swaps"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold hover:bg-emerald-100 transition"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5" />
                    <span>Swap Details</span>
                  </Link>
                )}
              </div>
            ) : (
              <div className="p-5 border-b border-stone-100 text-xs text-stone-400">
                Select a conversation on the left to start negotiating
              </div>
            )}

            {/* Swap Context Summary Banner */}
            {swapContext && (
              <div className="bg-stone-50 px-5 py-2.5 border-b border-stone-200 text-[11px] text-stone-600 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 truncate">
                  <Shirt className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span className="truncate">
                    Trading: <strong className="text-stone-900">{swapContext.offeredItem?.title || 'Offered Item'}</strong> for <strong className="text-stone-900">{swapContext.requestedItem?.title || 'Requested Item'}</strong>
                  </span>
                </div>
                <span className="shrink-0 font-bold text-emerald-800">
                  Status: {swapContext.status}
                </span>
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-[#faf9f6]/40">
              {loadingConv ? (
                <div className="text-center py-12 text-xs text-stone-400">Loading conversation history...</div>
              ) : messages.length === 0 ? (
                <div className="text-center py-16 text-stone-400 text-xs">
                  <p>Send a friendly greeting to coordinate your sustainable exchange!</p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.senderId === currentUser?.id;
                  const isSystem = msg.senderId === 'system';

                  if (isSystem) {
                    return (
                      <div key={index} className="flex justify-center my-2">
                        <div className="bg-stone-200/80 text-stone-700 text-[11px] px-4 py-1.5 rounded-full max-w-md text-center">
                          {msg.text}
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={index}
                      className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] sm:max-w-[65%] rounded-2xl p-3 sm:px-4 sm:py-2.5 text-xs ${
                          isMine
                            ? 'bg-stone-900 text-white rounded-br-xs'
                            : 'bg-white border border-stone-200 text-stone-800 rounded-bl-xs shadow-2xs'
                        }`}
                      >
                        <p className="leading-relaxed">{msg.text}</p>
                      </div>
                      <span className="text-[10px] text-stone-400 mt-1 px-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Negotiation Assistant Suggestions Panel */}
            {aiSuggestions.length > 0 && (
              <div className="px-4 py-2.5 bg-emerald-50/80 border-t border-emerald-100">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-[11px] font-bold text-emerald-900">
                    AI Negotiation Suggestions (Click to insert):
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {aiSuggestions.map((suggestion, sIdx) => (
                    <button
                      key={sIdx}
                      type="button"
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="px-3 py-1 rounded-full bg-white hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 text-[11px] text-left transition shadow-2xs"
                    >
                      "{suggestion}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input Composer */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-stone-200 bg-white">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message or use an AI counteroffer suggestion above..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="flex-1 px-4 py-3 bg-stone-100 border border-stone-200 rounded-full text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-700"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-3 rounded-full bg-stone-900 hover:bg-emerald-800 text-white transition disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
}
