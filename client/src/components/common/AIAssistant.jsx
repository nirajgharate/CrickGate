import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Sparkles, Mic, MicOff, Volume2, VolumeX, Paperclip } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SUGGESTIONS = [
  "Find a cricket turf near Baner",
  "Is Green Arena available on 2026-09-20 at 6:00 PM?",
  "Book Green Arena on 2026-09-20 at 6:00 PM",
  "How to earn loyalty points?"
];

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hey there! 👋 Welcome to TurfGate. I can help you find turfs, check availability, or guide you through bookings. You can type or tap the microphone to talk to me! What are we playing today?",
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  // Advanced features state
  const [attachment, setAttachment] = useState({ data: null, type: null, name: null });
  const [micLevels, setMicLevels] = useState([5, 5, 5, 5, 5]);

  const messagesEndRef = useRef(null);
  const sessionIdRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const micStreamRef = useRef(null);
  const animationFrameRef = useRef(null);

  const { theme } = useTheme();

  // Generate unique session ID on mount
  useEffect(() => {
    if (!sessionIdRef.current) {
      sessionIdRef.current = 'session_' + Math.random().toString(36).substring(2, 9);
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.lang = 'en-IN'; // Indian English
      rec.interimResults = false;
      rec.maxAlternatives = 1;

      rec.onstart = () => {
        setIsListening(true);
        startAudioAnalysis();
      };

      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        handleSend(transcript);
      };

      rec.onerror = (event) => {
        console.error('Speech recognition error', event);
        setIsListening(false);
        stopAudioAnalysis();
      };

      rec.onend = () => {
        setIsListening(false);
        stopAudioAnalysis();
      };

      recognitionRef.current = rec;
    }
  }, []);

  // DOM Action Listener (Screen Linking)
  useEffect(() => {
    const handleAction = (e) => {
      const { type, target } = e.detail;
      console.log(`Executing screen action: ${type} for ${target}`);
      if (type === 'highlight-turf') {
        const elements = document.querySelectorAll('*');
        for (const el of elements) {
          // Look for leaf node containing the turf name
          if (el.children.length === 0 && el.textContent.toLowerCase().includes(target.toLowerCase())) {
            let parent = el;
            // Traverse up to find the closest card container
            while (parent && parent !== document.body) {
              if (
                parent.classList.contains('border') || 
                parent.classList.contains('shadow') || 
                parent.classList.contains('rounded-2xl') ||
                parent.classList.contains('rounded-xl')
              ) {
                parent.scrollIntoView({ behavior: 'smooth', block: 'center' });
                parent.classList.add(
                  'ring-4', 
                  'ring-emerald-500', 
                  'ring-offset-2', 
                  'dark:ring-offset-slate-900', 
                  'transition-all', 
                  'duration-500'
                );
                setTimeout(() => {
                  parent.classList.remove('ring-4', 'ring-emerald-500', 'ring-offset-2');
                }, 3000);
                break;
              }
              parent = parent.parentElement;
            }
            break;
          }
        }
      }
    };
    window.addEventListener('turfbot-action', handleAction);
    return () => window.removeEventListener('turfbot-action', handleAction);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Audio frequency analysis (Microphone volume waveform)
  const startAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioContext();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 32;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const draw = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        // Map frequency bins to 5 heights
        const levels = Array.from({ length: 5 }, (_, i) => {
          const val = dataArray[i * 2] || 0;
          // Scale to pixels between 5 and 35
          return Math.max(5, Math.min(35, val / 6));
        });

        setMicLevels(levels);
        animationFrameRef.current = requestAnimationFrame(draw);
      };

      draw();
    } catch (e) {
      console.error("Audio Context setup failed", e);
    }
  };

  const stopAudioAnalysis = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
    }
    setMicLevels([5, 5, 5, 5, 5]);
  };

  const getUserId = () => {
    try {
      const userStr = localStorage.getItem("User");
      if (userStr) {
        return JSON.parse(userStr);
      }
    } catch (e) {
      return localStorage.getItem("User");
    }
    return null;
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Please try Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG/JPEG/GIF) for receipt verification.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      // Get base64 content
      const base64Data = reader.result.split(',')[1];
      setAttachment({
        data: base64Data,
        type: file.type,
        name: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const speakText = (text) => {
    if (!voiceEnabled) return;
    try {
      window.speechSynthesis.cancel();
      // Clean syntax triggers
      const cleanText = text
        .replace(/\[ACTION:.*?\]/g, '')
        .replace(/[*#_~`]/g, '')
        .replace(/---/g, '')
        .replace(/match \d+/gi, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'en-IN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Text-to-speech error:", e);
    }
  };

  const handleSend = async (text) => {
    if (!text.trim() && !attachment.data) return;

    const messageText = text.trim();
    
    // Add user message to UI (include thumbnail if image was attached)
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: messageText || `Sent attachment: ${attachment.name}`
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    window.speechSynthesis.cancel();

    // Cache attachment data to send, then clear state
    const currentAttachment = { ...attachment };
    setAttachment({ data: null, type: null, name: null });

    try {
      const userId = getUserId();
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:9005";
      const response = await fetch(`${baseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: messageText || "Analyze this receipt image.",
          session_id: sessionIdRef.current,
          user_id: userId,
          image_data: currentAttachment.data,
          image_mime_type: currentAttachment.type
        })
      });

      if (!response.ok) {
        throw new Error("Failed to communicate with AI Agent");
      }

      const data = await response.json();
      setIsTyping(false);

      let botReply = data.reply;

      // Extract and execute structured UI action triggers
      const actionRegex = /\[ACTION:\s*([\w-]+)\s*\|\s*TARGET:\s*([^\]]+)\]/i;
      const match = botReply.match(actionRegex);
      if (match) {
        const actionType = match[1].trim();
        const targetName = match[2].trim();
        
        // Dispatch UI action event locally
        window.dispatchEvent(new CustomEvent('turfbot-action', {
          detail: { type: actionType, target: targetName }
        }));

        // Clean action tag out of user visible response
        botReply = botReply.replace(actionRegex, '').trim();
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: botReply
      }]);

      speakText(botReply);

    } catch (err) {
      console.error("Chat error:", err);
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: "I'm having trouble connecting to my brain right now. Please make sure the AI Agent backend service is online."
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="mb-4 w-[350px] sm:w-[400px] h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors duration-300"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot size={22} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide">TurfGate Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping"></span>
                    <span className="text-[10px] text-emerald-100 font-medium">TurfBot Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* Voice Output Toggle */}
                <button
                  onClick={() => {
                    const newVoice = !voiceEnabled;
                    setVoiceEnabled(newVoice);
                    if (!newVoice) window.speechSynthesis.cancel();
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-emerald-100 cursor-pointer"
                  title={voiceEnabled ? "Mute Voice Output" : "Enable Voice Output"}
                >
                  {voiceEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
                
                {/* Close Button */}
                <button
                  onClick={() => {
                    window.speechSynthesis.cancel();
                    setIsOpen(false);
                  }}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                      <Bot size={15} className="text-emerald-600 dark:text-emerald-400" />
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 text-sm shadow-sm whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                      <User size={15} className="text-slate-600 dark:text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center shrink-0">
                    <Bot size={15} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Attachment Preview thumbnail above input */}
            {attachment.data && (
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                  <img
                    src={`data:${attachment.type};base64,${attachment.data}`}
                    alt="Receipt preview"
                    className="w-10 h-10 object-cover rounded-md border border-slate-300 dark:border-slate-700"
                  />
                  <span className="text-xs text-slate-500 truncate max-w-[200px]">{attachment.name}</span>
                </div>
                <button
                  onClick={() => setAttachment({ data: null, type: null, name: null })}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Suggestions */}
            {messages.length === 1 && !isTyping && (
              <div className="px-4 py-2 flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1">
                  <Sparkles size={10} className="text-amber-500" /> Suggestion Chips
                </span>
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {SUGGESTIONS.map((chip, i) => (
                    <button
                      key={i}
                      onClick={() => handleSend(chip)}
                      className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-white hover:bg-emerald-600 dark:hover:bg-emerald-600 border border-emerald-500/20 dark:border-emerald-400/20 bg-emerald-500/5 dark:bg-emerald-400/5 rounded-full px-2.5 py-1 text-left transition-all hover:scale-[1.02] cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2">
              
              {/* File Attachment Input (hidden) */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />

              {/* Attachment Button */}
              <button
                onClick={() => fileInputRef.current.click()}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-all cursor-pointer"
                title="Attach receipt image"
              >
                <Paperclip size={16} />
              </button>

              {/* Voice Input Toggle Button / Audio Waveform */}
              <button
                onClick={toggleListening}
                className={`p-2 rounded-xl transition-all flex items-center gap-1 cursor-pointer ${
                  isListening
                    ? 'bg-rose-500 text-white px-3'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title={isListening ? "Listening... click to stop" : "Start speaking"}
              >
                {isListening ? (
                  <>
                    <MicOff size={16} />
                    {/* Animated Volume Waveform Bars */}
                    <div className="flex items-end gap-0.5 h-4.5">
                      {micLevels.map((h, i) => (
                        <motion.div
                          key={i}
                          animate={{ height: h }}
                          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                          className="w-1 bg-white rounded-full"
                          style={{ height: '5px' }}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <Mic size={16} />
                )}
              </button>

              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
                placeholder={isListening ? "Listening..." : "Ask TurfBot..."}
                className="flex-1 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-sm rounded-xl px-3 py-2 border-0 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                disabled={isListening}
              />
              <button
                onClick={() => handleSend(inputValue)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white p-4 rounded-full shadow-2xl hover:shadow-emerald-500/30 flex items-center justify-center cursor-pointer border border-emerald-400/20 relative group"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        
        {/* Hover Tooltip */}
        {!isOpen && (
          <span className="absolute right-16 scale-0 group-hover:scale-100 bg-slate-900 text-white text-xs rounded-lg px-2.5 py-1.5 shadow-xl font-medium border border-slate-800 transition-all duration-200 whitespace-nowrap">
            Chat with TurfGate AI 🤖
          </span>
        )}
      </motion.button>
    </div>
  );
};

export default AIAssistant;
