import { 
  Music, Type, Sun, Volume2, QrCode, FileText, Video, Scissors, Image as ImageIcon, 
  Smartphone, Battery, Wind, Youtube, PenTool, RefreshCw, Home, Heart, Bell, Settings, X, Magnet, Plus, Code, Smile,
  Calculator, Clock, Gamepad2, Globe, Lock, Mail, Map, MessageSquare, Mic, Moon, Palette, Search, Share2, Shield, 
  ShoppingBag, Star, Terminal, Trash2, User, Zap, Cpu, Database, Hash, Layout, List, Play, Save, Send, Settings2,
  Trello, Tv, Watch, Wifi, Activity, AlertCircle, Archive, ArrowRight, Award, BarChart2, Book, Bookmark, Briefcase,
  Camera, Check, ChevronRight, Clipboard, Cloud, Coffee, Command, Compass, CreditCard, DollarSign, Download,
  Edit, ExternalLink, Eye, Facebook, FastForward, Feather, Filter, Flag, Folder, Gift, Github, Grid, HardDrive,
  Headphones, HelpCircle, Image, Inbox, Info, Instagram, Key, Laptop, Layers, LifeBuoy, Link, Linkedin, Loader,
  LogIn, LogOut, MapPin, Maximize, Menu, Minimize, Monitor, MoreHorizontal, MoreVertical, MousePointer, Move,
  Navigation, Package, Paperclip, Pause, Phone, PieChart, PlayCircle, Power, Printer, Radio, Repeat, Rewind,
  Rss, Server, Share, ShoppingCart, Shuffle, Sidebar, SkipBack, SkipForward, Slack, Slash, Sliders, Speaker,
  Square, Tablet, Tag, Target, Thermometer, ThumbsDown, ThumbsUp, ToggleLeft, ToggleRight, Truck, Twitter,
  Umbrella, Underline, Unlock, Upload, VideoOff, Voicemail, Volume, Volume1, VolumeX, Watch as WatchIcon, XCircle,
  XSquare, Youtube as YoutubeIcon, ZapOff, ZoomIn, ZoomOut, Circle, Sparkles, Megaphone, Copy
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GoogleGenAI } from "@google/genai";
import QRCode from 'qrcode';
import { jsPDF } from 'jspdf';
import Markdown from 'react-markdown';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

/** Utility for Tailwind class merging */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---

type Category = 'AI' | 'Utility' | 'Math' | 'Games' | 'Dev' | 'Lifestyle' | 'Social';

interface Tool {
  id: string;
  title: string;
  icon: any;
  color: string;
  category: Category;
  isAi?: boolean;
}

// --- Constants ---

const TOOLS: Tool[] = [
  // AI Tools
  { id: 'text-art', title: 'Text Art', icon: Type, color: 'bg-blue-500/20 text-blue-500', category: 'AI', isAi: true },
  { id: 'background-remover', title: 'Background Remover', icon: Scissors, color: 'bg-amber-500/20 text-amber-500', category: 'AI', isAi: true },
  { id: 'text-to-image', title: 'Text to Image', icon: ImageIcon, color: 'bg-violet-500/20 text-violet-500', category: 'AI', isAi: true },
  { id: 'yt-description', title: 'YT Description', icon: Youtube, color: 'bg-red-500/20 text-red-500', category: 'AI', isAi: true },
  { id: 'caption-generator', title: 'Caption Generator', icon: PenTool, color: 'bg-yellow-500/20 text-yellow-500', category: 'AI', isAi: true },
  { id: 'paraphraser', title: 'Paraphraser', icon: RefreshCw, color: 'bg-teal-500/20 text-teal-500', category: 'AI', isAi: true },
  { id: 'text-summarizer', title: 'Text Summarizer', icon: FileText, color: 'bg-emerald-600/20 text-emerald-600', category: 'AI', isAi: true },
  { id: 'code-generator', title: 'Code Generator', icon: Code, color: 'bg-blue-600/20 text-blue-600', category: 'AI', isAi: true },
  { id: 'sentiment-analyzer', title: 'Sentiment Analyzer', icon: Smile, color: 'bg-pink-600/20 text-pink-600', category: 'AI', isAi: true },
  { id: 'ai-story', title: 'Story Teller', icon: Book, color: 'bg-orange-500/20 text-orange-500', category: 'AI', isAi: true },
  { id: 'ai-translator', title: 'AI Translator', icon: Globe, color: 'bg-blue-400/20 text-blue-400', category: 'AI', isAi: true },
  { id: 'ai-grammar', title: 'Grammar Fixer', icon: Check, color: 'bg-green-500/20 text-green-500', category: 'AI', isAi: true },
  { id: 'ai-email', title: 'Email Writer', icon: Mail, color: 'bg-indigo-500/20 text-indigo-500', category: 'AI', isAi: true },
  { id: 'ai-recipe', title: 'Recipe Finder', icon: Coffee, color: 'bg-amber-500/20 text-amber-500', category: 'AI', isAi: true },
  { id: 'ai-fitness', title: 'Workout Plan', icon: Activity, color: 'bg-rose-500/20 text-rose-500', category: 'AI', isAi: true },

  // Utilities
  { id: 'frequency-generator', title: 'Frequency Gen', icon: Music, color: 'bg-emerald-500/20 text-emerald-500', category: 'Utility' },
  { id: 'light-meter', title: 'Light Meter', icon: Sun, color: 'bg-orange-500/20 text-orange-500', category: 'Utility' },
  { id: 'sound-meter', title: 'Sound Meter', icon: Volume2, color: 'bg-rose-500/20 text-rose-500', category: 'Utility' },
  { id: 'qr-generator', title: 'QR Generator', icon: QrCode, color: 'bg-indigo-500/20 text-indigo-500', category: 'Utility' },
  { id: 'pdf-maker', title: 'PDF Maker', icon: FileText, color: 'bg-purple-500/20 text-purple-500', category: 'Utility' },
  { id: 'video-to-audio', title: 'Video to Audio', icon: Video, color: 'bg-pink-500/20 text-pink-500', category: 'Utility' },
  { id: 'device-info', title: 'Device Info', icon: Smartphone, color: 'bg-cyan-500/20 text-cyan-500', category: 'Utility' },
  { id: 'battery-info', title: 'Battery Info', icon: Battery, color: 'bg-green-500/20 text-green-500', category: 'Utility' },
  { id: 'speaker-cleaner', title: 'Speaker Cleaner', icon: Wind, color: 'bg-sky-500/20 text-sky-500', category: 'Utility' },
  { id: 'metal-detector', title: 'Metal Detector', icon: Magnet, color: 'bg-amber-600/20 text-amber-600', category: 'Utility' },
  { id: 'compass', title: 'Compass', icon: Compass, color: 'bg-blue-500/20 text-blue-500', category: 'Utility' },
  { id: 'magnifier', title: 'Magnifier', icon: ZoomIn, color: 'bg-gray-500/20 text-gray-500', category: 'Utility' },
  { id: 'ruler', title: 'Ruler', icon: Sliders, color: 'bg-yellow-500/20 text-yellow-500', category: 'Utility' },

  // Math & Finance
  { id: 'calculator', title: 'Calculator', icon: Calculator, color: 'bg-blue-500/20 text-blue-500', category: 'Math' },
  { id: 'unit-converter', title: 'Unit Converter', icon: RefreshCw, color: 'bg-teal-500/20 text-teal-500', category: 'Math' },
  { id: 'currency-converter', title: 'Currency', icon: DollarSign, color: 'bg-green-500/20 text-green-500', category: 'Math' },
  { id: 'bmi-calculator', title: 'BMI Calc', icon: Activity, color: 'bg-rose-500/20 text-rose-500', category: 'Math' },
  { id: 'discount-calc', title: 'Discount Calc', icon: Tag, color: 'bg-orange-500/20 text-orange-500', category: 'Math' },
  { id: 'tip-calc', title: 'Tip Calc', icon: Coffee, color: 'bg-amber-500/20 text-amber-500', category: 'Math' },
  { id: 'loan-calc', title: 'Loan Calc', icon: CreditCard, color: 'bg-indigo-500/20 text-indigo-500', category: 'Math' },

  // Games
  { id: 'tic-tac-toe', title: 'Tic Tac Toe', icon: Gamepad2, color: 'bg-purple-500/20 text-purple-500', category: 'Games' },
  { id: 'snake-game', title: 'Snake', icon: Zap, color: 'bg-green-500/20 text-green-500', category: 'Games' },
  { id: 'memory-game', title: 'Memory', icon: Layout, color: 'bg-blue-500/20 text-blue-500', category: 'Games' },
  { id: 'dice-roller', title: 'Dice Roller', icon: Grid, color: 'bg-gray-500/20 text-gray-500', category: 'Games' },
  { id: 'coin-flip', title: 'Coin Flip', icon: Circle, color: 'bg-yellow-500/20 text-yellow-500', category: 'Games' },

  // Dev Tools
  { id: 'json-formatter', title: 'JSON Format', icon: Terminal, color: 'bg-blue-600/20 text-blue-600', category: 'Dev' },
  { id: 'base64', title: 'Base64', icon: Hash, color: 'bg-gray-600/20 text-gray-600', category: 'Dev' },
  { id: 'password-gen', title: 'Password Gen', icon: Lock, color: 'bg-red-500/20 text-red-500', category: 'Dev' },
  { id: 'color-picker', title: 'Color Picker', icon: Palette, color: 'bg-pink-500/20 text-pink-500', category: 'Dev' },
  { id: 'lorem-ipsum', title: 'Lorem Ipsum', icon: Type, color: 'bg-teal-500/20 text-teal-500', category: 'Dev' },

  // Lifestyle
  { id: 'stopwatch', title: 'Stopwatch', icon: Clock, color: 'bg-blue-500/20 text-blue-500', category: 'Lifestyle' },
  { id: 'timer', title: 'Timer', icon: WatchIcon, color: 'bg-orange-500/20 text-orange-500', category: 'Lifestyle' },
  { id: 'todo-list', title: 'To-Do List', icon: List, color: 'bg-emerald-500/20 text-emerald-500', category: 'Lifestyle' },
  { id: 'notes', title: 'Notes', icon: Edit, color: 'bg-yellow-500/20 text-yellow-500', category: 'Lifestyle' },
  { id: 'weather', title: 'Weather', icon: Cloud, color: 'bg-sky-400/20 text-sky-400', category: 'Lifestyle' },
  { id: 'age-calculator', title: 'Age Calc', icon: User, color: 'bg-blue-500/20 text-blue-500', category: 'Math' },
  { id: 'percent-calc', title: 'Percent Calc', icon: Hash, color: 'bg-teal-500/20 text-teal-500', category: 'Math' },
  { id: 'random-number', title: 'Random Num', icon: Shuffle, color: 'bg-gray-500/20 text-gray-500', category: 'Math' },
  { id: 'world-clock', title: 'World Clock', icon: Globe, category: 'Lifestyle', color: 'bg-indigo-500/20 text-indigo-500' },
  { id: 'alarm', title: 'Alarm', icon: Bell, category: 'Lifestyle', color: 'bg-red-500/20 text-red-500' },
  { id: 'habit-tracker', title: 'Habits', icon: Check, category: 'Lifestyle', color: 'bg-green-500/20 text-green-500' },
  { id: 'expense-tracker', title: 'Expenses', icon: DollarSign, category: 'Lifestyle', color: 'bg-rose-500/20 text-rose-500' },
  { id: 'water-reminder', title: 'Water', icon: Coffee, category: 'Lifestyle', color: 'bg-blue-500/20 text-blue-500' },
  { id: 'meditation', title: 'Meditation', icon: Moon, category: 'Lifestyle', color: 'bg-purple-500/20 text-purple-500' },
  { id: 'journal', title: 'Journal', icon: Book, category: 'Lifestyle', color: 'bg-amber-500/20 text-amber-500' },
  { id: 'quote-gen', title: 'Daily Quote', icon: MessageSquare, category: 'AI', isAi: true, color: 'bg-pink-500/20 text-pink-500' },
  { id: 'unit-converter-ai', title: 'Smart Converter', icon: RefreshCw, category: 'AI', isAi: true, color: 'bg-teal-500/20 text-teal-500' },
  { id: 'math-solver', title: 'Math Solver', icon: Calculator, category: 'AI', isAi: true, color: 'bg-blue-500/20 text-blue-500' },
  { id: 'code-explainer', title: 'Code Explainer', icon: Terminal, category: 'AI', isAi: true, color: 'bg-gray-500/20 text-gray-500' },
  { id: 'resume-builder', title: 'Resume Builder', icon: FileText, category: 'AI', isAi: true, color: 'bg-purple-500/20 text-purple-500' },
  { id: 'travel-planner', title: 'Travel Planner', icon: Map, category: 'AI', isAi: true, color: 'bg-orange-500/20 text-orange-500' },
  { id: 'gift-ideas', title: 'Gift Ideas', icon: Gift, category: 'AI', isAi: true, color: 'bg-pink-500/20 text-pink-500' },
  { id: 'joke-gen', title: 'Joke Gen', icon: Smile, category: 'AI', isAi: true, color: 'bg-yellow-500/20 text-yellow-500' },
  { id: 'lyrics-gen', title: 'Lyrics Gen', icon: Music, category: 'AI', isAi: true, color: 'bg-emerald-500/20 text-emerald-500' },
  { id: 'name-gen', title: 'Name Gen', icon: User, category: 'AI', isAi: true, color: 'bg-blue-500/20 text-blue-500' },
  { id: 'slogan-gen', title: 'Slogan Gen', icon: Zap, category: 'AI', isAi: true, color: 'bg-violet-500/20 text-violet-500' },
  { id: 'hashtag-gen', title: 'Hashtag Gen', icon: Hash, category: 'AI', isAi: true, color: 'bg-teal-500/20 text-teal-500' },
  { id: 'domain-gen', title: 'Domain Gen', icon: Globe, category: 'AI', isAi: true, color: 'bg-cyan-500/20 text-cyan-500' },
  { id: 'color-palette-ai', title: 'AI Palette', icon: Palette, category: 'AI', isAi: true, color: 'bg-rose-500/20 text-rose-500' },
  { id: 'interview-prep', title: 'Interview Prep', icon: MessageSquare, category: 'AI', isAi: true, color: 'bg-indigo-500/20 text-indigo-500' },
  { id: 'learning-path', title: 'Learning Path', icon: Book, category: 'AI', isAi: true, color: 'bg-emerald-500/20 text-emerald-500' },
  { id: 'ai-assistant', title: 'AI Assistant', icon: MessageSquare, category: 'AI', isAi: true, color: 'bg-blue-500/20 text-blue-500' },
  { id: 'ai-video-gen', title: 'AI Video Gen', icon: Video, category: 'AI', isAi: true, color: 'bg-purple-500/20 text-purple-500' },
  { id: 'ai-presentation', title: 'AI Presentation', icon: Layout, category: 'AI', isAi: true, color: 'bg-orange-500/20 text-orange-500' },
];

// --- Components ---

const ToolCard = ({ tool, onClick, isFavorite, onToggleFavorite, resolvedTheme }: { tool: Tool; onClick: () => void; isFavorite: boolean; onToggleFavorite: (e: React.MouseEvent) => void; resolvedTheme?: string }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center p-6 rounded-3xl cursor-pointer aspect-square group border transition-all",
        resolvedTheme === 'light' 
          ? "bg-white border-slate-200 hover:border-emerald-500/30" 
          : "bg-[#1A1C1E] border-white/5 hover:border-emerald-500/30"
      )}
    >
      <button 
        onClick={onToggleFavorite}
        className="absolute top-4 right-4 z-10 p-1"
      >
        <Heart className={cn("w-5 h-5 transition-colors", isFavorite ? "text-rose-500 fill-rose-500" : "text-gray-600")} />
      </button>
      <div className={cn("p-4 rounded-full mb-4 transition-colors", tool.color)}>
        <tool.icon className="w-8 h-8" />
      </div>
      <span className={cn(
        "text-sm font-medium text-center leading-tight",
        resolvedTheme === 'light' ? "text-slate-700" : "text-gray-300"
      )}>
        {tool.title}
      </span>
    </motion.div>
  );
};

const Modal = ({ isOpen, onClose, title, children, resolvedTheme }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; resolvedTheme: string }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "relative w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden flex flex-col max-h-[90vh] border transition-colors",
              resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#121416] border-white/5"
            )}
          >
            <div className={cn(
              "p-6 border-b flex items-center justify-between",
              resolvedTheme === 'light' ? "border-slate-100" : "border-white/5"
            )}>
              <h2 className={cn("text-xl font-semibold", resolvedTheme === 'light' ? "text-slate-900" : "text-white")}>{title}</h2>
              <button onClick={onClose} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// --- Tool Implementations ---

const FrequencyGenerator = () => {
  const [freq, setFreq] = useState(440);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  const toggle = () => {
    if (!isPlaying) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      oscillator.current = audioCtx.current.createOscillator();
      oscillator.current.type = 'sine';
      oscillator.current.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
      oscillator.current.connect(audioCtx.current.destination);
      oscillator.current.start();
      setIsPlaying(true);
    } else {
      oscillator.current?.stop();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (oscillator.current && isPlaying) {
      oscillator.current.frequency.setValueAtTime(freq, audioCtx.current!.currentTime);
    }
  }, [freq]);

  useEffect(() => {
    return () => oscillator.current?.stop();
  }, []);

  return (
    <div className="space-y-8 py-4">
      <div className="text-center">
        <span className="text-6xl font-mono font-bold text-emerald-500">{freq}</span>
        <span className="text-xl text-gray-500 ml-2">Hz</span>
      </div>
      <input 
        type="range" min="20" max="20000" value={freq} 
        onChange={(e) => setFreq(Number(e.target.value))}
        className="w-full h-2 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
      />
      <button 
        onClick={toggle}
        className={cn(
          "w-full py-4 rounded-2xl font-bold text-lg transition-all",
          isPlaying ? "bg-rose-500 text-white" : "bg-emerald-500 text-black"
        )}
      >
        {isPlaying ? 'Stop' : 'Start'}
      </button>
    </div>
  );
};

const getApiKey = () => (process.env as any).API_KEY || process.env.GEMINI_API_KEY;

const AiTool = ({ prompt, systemInstruction, placeholder, resolvedTheme }: { prompt: string; systemInstruction: string; placeholder: string; resolvedTheme: string }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [style, setStyle] = useState('Default');

  const styles = ['Default', 'Formal', 'Informal', 'Creative', 'Professional', 'Funny'];

  const generate = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: getApiKey()! });
      const styleInstruction = style !== 'Default' ? ` Use a ${style.toLowerCase()} writing style.` : '';
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `${prompt}${styleInstruction}: ${input}`,
        config: { systemInstruction }
      });
      setOutput(response.text || '');
    } catch (e) {
      console.error(e);
      setOutput('Error generating content. Please check your API key or connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {styles.map((s) => (
          <button
            key={s}
            onClick={() => setStyle(s)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-bold transition-all border",
              style === s 
                ? "bg-emerald-500 text-black border-emerald-500" 
                : resolvedTheme === 'light'
                  ? "bg-white text-slate-600 border-slate-200 hover:border-emerald-500/30"
                  : "bg-[#1A1C1E] text-gray-400 border-white/5 hover:border-white/20"
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full h-32 border rounded-2xl p-4 transition-all focus:outline-none focus:border-emerald-500/50",
          resolvedTheme === 'light'
            ? "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            : "bg-[#1A1C1E] border-white/5 text-white placeholder:text-gray-600"
        )}
      />
      <button 
        onClick={generate}
        disabled={loading}
        className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate'}
      </button>
      {output && (
        <div className={cn(
          "p-4 rounded-2xl border max-w-none transition-all",
          resolvedTheme === 'light'
            ? "bg-white border-slate-200 prose prose-slate"
            : "bg-[#1A1C1E] border-white/5 prose prose-invert"
        )}>
          <Markdown>{output}</Markdown>
        </div>
      )}
    </div>
  );
};

const SoundMeter = () => {
  const [level, setLevel] = useState(0);
  const [active, setActive] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const animationId = useRef<number | null>(null);

  const start = async () => {
    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyser.current = audioCtx.current.createAnalyser();
      const source = audioCtx.current.createMediaStreamSource(stream.current);
      source.connect(analyser.current);
      analyser.current.fftSize = 256;
      
      const bufferLength = analyser.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const update = () => {
        analyser.current!.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
        const avg = sum / bufferLength;
        setLevel(Math.round(avg));
        animationId.current = requestAnimationFrame(update);
      };
      update();
      setActive(true);
    } catch (e) {
      console.error(e);
      alert('Microphone access denied or not supported.');
    }
  };

  const stop = () => {
    if (animationId.current) cancelAnimationFrame(animationId.current);
    stream.current?.getTracks().forEach(t => t.stop());
    setActive(false);
    setLevel(0);
  };

  useEffect(() => {
    return () => stop();
  }, []);

  return (
    <div className="space-y-8 py-4 text-center">
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full" />
        <motion.div 
          animate={{ scale: 1 + (level / 100) }}
          className="w-32 h-32 bg-rose-500/20 rounded-full flex items-center justify-center"
        >
          <Volume2 className="w-12 h-12 text-rose-500" />
        </motion.div>
        <div className="absolute -bottom-4 bg-[#1A1C1E] px-4 py-1 rounded-full border border-white/10">
          <span className="text-2xl font-bold text-white">{level}</span>
          <span className="text-xs text-gray-500 ml-1">dB</span>
        </div>
      </div>
      <button 
        onClick={active ? stop : start}
        className={cn("w-full py-4 rounded-2xl font-bold", active ? "bg-rose-500 text-white" : "bg-emerald-500 text-black")}
      >
        {active ? 'Stop Meter' : 'Start Meter'}
      </button>
    </div>
  );
};

const LightMeter = () => {
  const [lux, setLux] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!active) return;
    
    // AmbientLightSensor is experimental and mostly Chrome-only
    if ('AmbientLightSensor' in window) {
      try {
        const sensor = new (window as any).AmbientLightSensor();
        sensor.onreading = () => setLux(sensor.illuminance);
        sensor.start();
        return () => sensor.stop();
      } catch (e) {
        console.error(e);
      }
    }
    
    // Fallback: Use camera to estimate brightness
    let video: HTMLVideoElement;
    let canvas: HTMLCanvasElement;
    let ctx: CanvasRenderingContext2D;
    let interval: any;

    const estimate = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video = document.createElement('video');
        video.srcObject = stream;
        video.play();
        canvas = document.createElement('canvas');
        ctx = canvas.getContext('2d')!;
        
        interval = setInterval(() => {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(video, 0, 0, 100, 100);
            const data = ctx.getImageData(0, 0, 100, 100).data;
            let brightness = 0;
            for (let i = 0; i < data.length; i += 4) {
              brightness += (data[i] * 299 + data[i + 1] * 587 + data[i + 2] * 114) / 1000;
            }
            setLux(Math.round(brightness / (data.length / 4)));
          }
        }, 500);
      } catch (e) {
        console.error(e);
      }
    };

    estimate();
    return () => {
      if (interval) clearInterval(interval);
      if (video?.srcObject) (video.srcObject as MediaStream).getTracks().forEach(t => t.stop());
    };
  }, [active]);

  return (
    <div className="space-y-8 py-4 text-center">
      <div className="w-48 h-48 mx-auto bg-orange-500/10 rounded-full flex flex-col items-center justify-center border-4 border-orange-500/20">
        <Sun className="w-12 h-12 text-orange-500 mb-2" />
        <span className="text-4xl font-bold text-white">{lux}</span>
        <span className="text-xs text-gray-500 uppercase">Lux (Estimated)</span>
      </div>
      <button 
        onClick={() => setActive(!active)}
        className={cn("w-full py-4 rounded-2xl font-bold", active ? "bg-rose-500 text-white" : "bg-orange-500 text-black")}
      >
        {active ? 'Stop Meter' : 'Start Meter'}
      </button>
      <p className="text-xs text-gray-500">Note: Uses camera to estimate brightness if hardware sensor is unavailable.</p>
    </div>
  );
};

const VideoToAudio = () => {
  return (
    <div className="space-y-6 text-center py-4">
      <div className="w-24 h-24 mx-auto bg-pink-500/10 rounded-3xl flex items-center justify-center">
        <Video className="w-10 h-10 text-pink-500" />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Video to Audio Converter</h3>
        <p className="text-gray-500 text-sm">Extract high-quality MP3 audio from any video file instantly.</p>
      </div>
      <div className="border-2 border-dashed border-white/10 rounded-3xl p-8 hover:border-pink-500/50 transition-colors cursor-pointer">
        <Plus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
        <span className="text-gray-500 font-medium">Select Video File</span>
      </div>
      <button className="w-full py-4 bg-pink-500 text-white rounded-2xl font-bold opacity-50 cursor-not-allowed">Convert to Audio</button>
    </div>
  );
};
const QrGenerator = () => {
  const [text, setText] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [color, setColor] = useState('#10b981');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(400);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');

  const generate = async () => {
    if (!text) return;
    const url = await QRCode.toDataURL(text, { 
      width: size, 
      margin: 2, 
      errorCorrectionLevel: level,
      color: { dark: color, light: bgColor } 
    });
    setQrUrl(url);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Content</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter URL or text"
          className="w-full bg-[#1A1C1E] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500/50"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Foreground</label>
          <div className="flex items-center gap-3 bg-[#1A1C1E] border border-white/5 rounded-2xl p-3">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded bg-transparent border-none cursor-pointer"
            />
            <span className="text-sm font-mono text-gray-300 uppercase">{color}</span>
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Background</label>
          <div className="flex items-center gap-3 bg-[#1A1C1E] border border-white/5 rounded-2xl p-3">
            <input 
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)}
              className="w-8 h-8 rounded bg-transparent border-none cursor-pointer"
            />
            <span className="text-sm font-mono text-gray-300 uppercase">{bgColor}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Size (px)</label>
          <select 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            className="w-full bg-[#1A1C1E] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
          >
            <option value="200">200 x 200</option>
            <option value="400">400 x 400</option>
            <option value="600">600 x 600</option>
            <option value="800">800 x 800</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Correction Level</label>
          <select 
            value={level} 
            onChange={(e) => setLevel(e.target.value as any)}
            className="w-full bg-[#1A1C1E] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-emerald-500/50 appearance-none"
          >
            <option value="L">Low (7%)</option>
            <option value="M">Medium (15%)</option>
            <option value="Q">Quartile (25%)</option>
            <option value="H">High (30%)</option>
          </select>
        </div>
      </div>

      <button onClick={generate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Generate QR</button>
      
      {qrUrl && (
        <div className="flex flex-col items-center gap-4 pt-4 border-t border-white/5">
          <motion.img 
            key={qrUrl}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            src={qrUrl} 
            alt="QR Code" 
            className="w-64 h-64 rounded-2xl bg-white/5 p-4" 
          />
          <a href={qrUrl} download="qrcode.png" className="text-emerald-500 font-medium">Download PNG</a>
        </div>
      )}
    </div>
  );
};

const BackgroundRemover = () => {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleProcess = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const base64Data = image.split(',')[1];
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            { inlineData: { data: base64Data, mimeType: 'image/png' } },
            { text: 'Remove the background from this image and return only the subject on a transparent or solid white background.' }
          ]
        }
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setResult(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      {!image ? (
        <label className="block border-2 border-dashed border-white/10 rounded-3xl p-12 text-center cursor-pointer hover:border-amber-500/50 transition-colors">
          <input type="file" className="hidden" onChange={handleUpload} accept="image/*" />
          <Scissors className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <span className="text-gray-500 font-medium">Upload Image to Remove Background</span>
        </label>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-white/5">
            <img src={result || image} alt="Preview" className="w-full" />
            {loading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          {!result && (
            <button 
              onClick={handleProcess} 
              disabled={loading}
              className="w-full py-4 bg-amber-500 text-black rounded-2xl font-bold disabled:opacity-50"
            >
              Remove Background
            </button>
          )}
          {result && (
            <div className="flex gap-4">
              <button onClick={() => { setImage(null); setResult(null); }} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold">New Image</button>
              <a href={result} download="no-bg.png" className="flex-1 py-4 bg-amber-500 text-black rounded-2xl font-bold text-center">Download</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PdfMaker = () => {
  const [text, setText] = useState('');
  
  const download = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Smart AI Tools Document", 20, 20);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(text || "No content provided.", 170);
    doc.text(splitText, 20, 40);
    doc.save("smart-ai-doc.pdf");
  };

  return (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-500 uppercase tracking-wider">Document Content</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste the content for your PDF..."
          className="w-full h-48 bg-[#1A1C1E] border border-white/5 rounded-2xl p-4 text-white focus:outline-none focus:border-purple-500/50"
        />
      </div>
      <button 
        onClick={download}
        className="w-full py-4 bg-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2"
      >
        <FileText className="w-5 h-5" />
        Create & Download PDF
      </button>
    </div>
  );
};

const MetalDetector = () => {
  const [magnitude, setMagnitude] = useState(0);
  const [active, setActive] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  const playBeep = (freq: number) => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  };

  useEffect(() => {
    if (!active) return;
    audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();

    let sensor: any;
    if ('Magnetometer' in window) {
      try {
        sensor = new (window as any).Magnetometer({ frequency: 60 });
        sensor.addEventListener('reading', () => {
          const mag = Math.sqrt(sensor.x ** 2 + sensor.y ** 2 + sensor.z ** 2);
          const roundedMag = Math.round(mag);
          setMagnitude(roundedMag);
          if (roundedMag > 70) {
            playBeep(400 + (roundedMag * 2));
            if ('vibrate' in navigator) {
              navigator.vibrate(50);
            }
          }
        });
        sensor.start();
      } catch (e) {
        console.error(e);
      }
    } else {
      // Mock data for demo if sensor not available
      const interval = setInterval(() => {
        const mockMag = Math.round(40 + Math.random() * 50);
        setMagnitude(mockMag);
        if (mockMag > 70) {
          playBeep(400 + (mockMag * 2));
          if ('vibrate' in navigator) {
            navigator.vibrate(50);
          }
        }
      }, 500);
      return () => clearInterval(interval);
    }

    return () => {
      sensor?.stop();
      audioCtx.current?.close();
    };
  }, [active]);

  return (
    <div className="space-y-8 py-4 text-center">
      <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-gray-800 rounded-full" />
        <motion.div 
          animate={{ 
            scale: 1 + (Math.min(magnitude, 100) / 200),
            backgroundColor: magnitude > 70 ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'
          }}
          className="w-32 h-32 rounded-full flex items-center justify-center"
        >
          <Magnet className={cn("w-12 h-12", magnitude > 70 ? "text-rose-500" : "text-emerald-500")} />
        </motion.div>
        <div className="absolute -bottom-4 bg-[#1A1C1E] px-4 py-1 rounded-full border border-white/10">
          <span className="text-2xl font-bold text-white">{magnitude}</span>
          <span className="text-xs text-gray-500 ml-1">µT</span>
        </div>
      </div>

      <div className="h-8">
        <AnimatePresence>
          {magnitude > 70 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-rose-500 font-black uppercase tracking-widest animate-pulse"
            >
              Metal Detected!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => setActive(!active)}
        className={cn("w-full py-4 rounded-2xl font-bold", active ? "bg-rose-500 text-white" : "bg-emerald-500 text-black")}
      >
        {active ? 'Stop Detector' : 'Start Detector'}
      </button>
      <p className="text-xs text-gray-500">Note: Requires a device with a magnetometer (compass) sensor. Showing simulated data if sensor is unavailable.</p>
    </div>
  );
};

const CalculatorTool = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleBtn = (val: string) => {
    if (val === '=') {
      try {
        const result = eval(equation.replace('×', '*').replace('÷', '/'));
        setDisplay(String(result));
        setEquation(String(result));
      } catch {
        setDisplay('Error');
      }
    } else if (val === 'C') {
      setDisplay('0');
      setEquation('');
    } else {
      setEquation(prev => prev + val);
      setDisplay(prev => prev === '0' ? val : prev + val);
    }
  };

  const btns = ['C', '÷', '×', '7', '8', '9', '-', '4', '5', '6', '+', '1', '2', '3', '=', '0', '.'];

  return (
    <div className="bg-[#1A1C1E] p-6 rounded-[2.5rem] border border-white/5 space-y-4">
      <div className="text-right p-4 bg-black/20 rounded-2xl">
        <div className="text-gray-500 text-sm h-6">{equation}</div>
        <div className="text-4xl font-bold text-white truncate">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {btns.map(b => (
          <button 
            key={b} 
            onClick={() => handleBtn(b)}
            className={cn(
              "h-16 rounded-2xl font-bold text-xl transition-all active:scale-95",
              ['+', '-', '×', '÷', '='].includes(b) ? "bg-emerald-500 text-black" : "bg-white/5 text-white hover:bg-white/10",
              b === '=' && "col-span-1",
              b === '0' && "col-span-1"
            )}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};

const StopwatchTool = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval: any;
    if (running) {
      interval = setInterval(() => setTime(t => t + 10), 10);
    }
    return () => clearInterval(interval);
  }, [running]);

  const format = (ms: number) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.floor((ms % 60000) / 1000);
    const msec = Math.floor((ms % 1000) / 10);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${msec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="text-center space-y-8 py-8">
      <div className="text-7xl font-mono font-black text-white tabular-nums tracking-tighter">
        {format(time)}
      </div>
      <div className="flex gap-4">
        <button 
          onClick={() => setRunning(!running)}
          className={cn("flex-1 py-4 rounded-2xl font-bold", running ? "bg-rose-500 text-white" : "bg-emerald-500 text-black")}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button 
          onClick={() => { setTime(0); setRunning(false); }}
          className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

const UnitConverter = () => {
  const [val, setVal] = useState('1');
  const [from, setFrom] = useState('km');
  const [to, setTo] = useState('mi');
  const [result, setResult] = useState('');

  const units: any = {
    km: 1000, m: 1, cm: 0.01, mm: 0.001,
    mi: 1609.34, yd: 0.9144, ft: 0.3048, in: 0.0254
  };

  const convert = () => {
    const meters = Number(val) * units[from];
    const res = meters / units[to];
    setResult(res.toFixed(4));
  };

  return (
    <div className="space-y-6">
      <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <select value={from} onChange={e => setFrom(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
          {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
          {Object.keys(units).map(u => <option key={u} value={u}>{u}</option>)}
        </select>
      </div>
      <button onClick={convert} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Convert</button>
      {result && <div className="text-center text-3xl font-bold">{result} {to}</div>}
    </div>
  );
};

const BmiCalculator = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const h = Number(height) / 100;
    const res = Number(weight) / (h * h);
    setBmi(Number(res.toFixed(1)));
  };

  return (
    <div className="space-y-6">
      <input type="number" placeholder="Weight (kg)" value={weight} onChange={e => setWeight(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <input type="number" placeholder="Height (cm)" value={height} onChange={e => setHeight(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <button onClick={calculate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Calculate BMI</button>
      {bmi && (
        <div className="text-center space-y-2">
          <div className="text-5xl font-bold text-white">{bmi}</div>
          <div className={cn("font-bold", bmi < 18.5 ? "text-blue-400" : bmi < 25 ? "text-emerald-400" : "text-rose-400")}>
            {bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal' : 'Overweight'}
          </div>
        </div>
      )}
    </div>
  );
};

const PasswordGen = () => {
  const [length, setLength] = useState(12);
  const [password, setPassword] = useState('');

  const generate = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let res = "";
    for (let i = 0; i < length; i++) res += charset.charAt(Math.floor(Math.random() * charset.length));
    setPassword(res);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
        <span className="text-gray-400">Length: {length}</span>
        <input type="range" min="6" max="32" value={length} onChange={e => setLength(Number(e.target.value))} className="accent-emerald-500" />
      </div>
      <button onClick={generate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Generate Password</button>
      {password && (
        <div className="p-4 bg-black/20 rounded-2xl border border-white/5 break-all text-center font-mono text-lg">
          {password}
        </div>
      )}
    </div>
  );
};

const TodoList = () => {
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [input, setInput] = useState('');

  const add = () => {
    if (!input) return;
    setTodos([...todos, { id: Date.now(), text: input, done: false }]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="Add a task..." className="flex-1 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
        <button onClick={add} className="p-4 bg-emerald-500 text-black rounded-2xl font-bold"><Plus /></button>
      </div>
      <div className="space-y-2">
        {todos.map(t => (
          <div key={t.id} className="flex items-center gap-3 p-4 bg-[#1A1C1E] rounded-2xl border border-white/5">
            <input type="checkbox" checked={t.done} onChange={() => setTodos(todos.map(td => td.id === t.id ? {...td, done: !td.done} : td))} className="w-5 h-5 accent-emerald-500" />
            <span className={cn("flex-1", t.done && "line-through text-gray-500")}>{t.text}</span>
            <button onClick={() => setTodos(todos.filter(td => td.id !== t.id))} className="text-rose-500"><Trash2 className="w-5 h-5" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

const CurrencyConverter = () => {
  const [val, setVal] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  const [result, setResult] = useState('');

  const rates: any = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.12, JPY: 150.14, CAD: 1.35 };

  const convert = () => {
    const res = (Number(val) / rates[from]) * rates[to];
    setResult(res.toFixed(2));
  };

  return (
    <div className="space-y-6">
      <input type="number" value={val} onChange={e => setVal(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <select value={from} onChange={e => setFrom(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
          {Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={to} onChange={e => setTo(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
          {Object.keys(rates).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <button onClick={convert} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Convert</button>
      {result && <div className="text-center text-3xl font-bold">{result} {to}</div>}
    </div>
  );
};

const DiscountCalculator = () => {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const d = Number(price) * (Number(discount) / 100);
    setResult({ saved: d.toFixed(2), final: (Number(price) - d).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <input type="number" placeholder="Original Price" value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <input type="number" placeholder="Discount %" value={discount} onChange={e => setDiscount(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <button onClick={calculate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Calculate</button>
      {result && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-emerald-500/10 rounded-2xl text-center">
            <span className="block text-xs text-emerald-500 uppercase font-bold">You Save</span>
            <span className="text-2xl font-bold text-white">${result.saved}</span>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl text-center">
            <span className="block text-xs text-gray-500 uppercase font-bold">Final Price</span>
            <span className="text-2xl font-bold text-white">${result.final}</span>
          </div>
        </div>
      )}
    </div>
  );
};

const TipCalculator = () => {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('15');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const t = Number(bill) * (Number(tip) / 100);
    const total = Number(bill) + t;
    setResult({ tip: t.toFixed(2), total: total.toFixed(2), perPerson: (total / Number(people)).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <input type="number" placeholder="Bill Amount" value={bill} onChange={e => setBill(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Tip %" value={tip} onChange={e => setTip(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
        <input type="number" placeholder="People" value={people} onChange={e => setPeople(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      </div>
      <button onClick={calculate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Calculate Tip</button>
      {result && (
        <div className="space-y-4">
          <div className="p-6 bg-emerald-500/10 rounded-3xl text-center">
            <span className="block text-sm text-emerald-500 font-bold uppercase mb-1">Total Per Person</span>
            <span className="text-5xl font-black text-white">${result.perPerson}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl text-center">
              <span className="block text-xs text-gray-500 font-bold uppercase">Total Tip</span>
              <span className="text-xl font-bold">${result.tip}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl text-center">
              <span className="block text-xs text-gray-500 font-bold uppercase">Total Bill</span>
              <span className="text-xl font-bold">${result.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LoanCalculator = () => {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculate = () => {
    const p = Number(amount);
    const r = (Number(rate) / 100) / 12;
    const n = Number(years) * 12;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setResult({ emi: emi.toFixed(2), total: (emi * n).toFixed(2), interest: ((emi * n) - p).toFixed(2) });
  };

  return (
    <div className="space-y-6">
      <input type="number" placeholder="Loan Amount" value={amount} onChange={e => setAmount(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <input type="number" placeholder="Interest Rate %" value={rate} onChange={e => setRate(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
        <input type="number" placeholder="Years" value={years} onChange={e => setYears(e.target.value)} className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      </div>
      <button onClick={calculate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Calculate EMI</button>
      {result && (
        <div className="space-y-4">
          <div className="p-6 bg-indigo-500/10 rounded-3xl text-center border border-indigo-500/20">
            <span className="block text-sm text-indigo-400 font-bold uppercase mb-1">Monthly EMI</span>
            <span className="text-5xl font-black text-white">${result.emi}</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl text-center">
              <span className="block text-xs text-gray-500 font-bold uppercase">Total Interest</span>
              <span className="text-xl font-bold">${result.interest}</span>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl text-center">
              <span className="block text-xs text-gray-500 font-bold uppercase">Total Payment</span>
              <span className="text-xl font-bold">${result.total}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AgeCalculator = () => {
  const [dob, setDob] = useState('');
  const [age, setAge] = useState<any>(null);

  const calculate = () => {
    const birthDate = new Date(dob);
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
      years--;
      months += 12;
    }
    setAge({ years, months });
  };

  return (
    <div className="space-y-6">
      <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-[#1A1C1E] p-4 rounded-2xl border border-white/5 text-white" />
      <button onClick={calculate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Calculate Age</button>
      {age && (
        <div className="text-center p-8 bg-white/5 rounded-3xl">
          <div className="text-6xl font-black text-white">{age.years}</div>
          <div className="text-gray-500 font-bold uppercase tracking-widest">Years Old</div>
          <div className="mt-2 text-emerald-500 font-medium">{age.months} months</div>
        </div>
      )}
    </div>
  );
};

const PercentCalculator = () => {
  const [p, setP] = useState('');
  const [v, setV] = useState('');
  const [res, setRes] = useState('');

  const calculate = () => setRes(((Number(p) / 100) * Number(v)).toFixed(2));

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <input type="number" value={p} onChange={e => setP(e.target.value)} className="w-24 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
        <span className="text-gray-500 font-bold">% of</span>
        <input type="number" value={v} onChange={e => setV(e.target.value)} className="flex-1 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      </div>
      <button onClick={calculate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Calculate</button>
      {res && <div className="text-center text-5xl font-black text-white">{res}</div>}
    </div>
  );
};

const NotesTool = () => {
  const [notes, setNotes] = useState<string[]>(() => {
    const saved = localStorage.getItem('smart-ai-notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('smart-ai-notes', JSON.stringify(notes));
  }, [notes]);

  const add = () => {
    if (!input) return;
    setNotes([input, ...notes]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <textarea 
        value={input} 
        onChange={e => setInput(e.target.value)} 
        placeholder="Write a note..." 
        className="w-full h-32 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5 resize-none"
      />
      <button onClick={add} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Save Note</button>
      <div className="space-y-3">
        {notes.map((n, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 relative group">
            <p className="text-gray-300">{n}</p>
            <button onClick={() => setNotes(notes.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-rose-500 transition-opacity">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const TimerTool = () => {
  const [seconds, setSeconds] = useState(0);
  const [active, setActive] = useState(false);
  const [input, setInput] = useState('60');

  useEffect(() => {
    let interval: any;
    if (active && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setActive(false);
    }
    return () => clearInterval(interval);
  }, [active, seconds]);

  const start = () => {
    setSeconds(Number(input));
    setActive(true);
  };

  return (
    <div className="text-center space-y-8 py-8">
      {!active ? (
        <div className="space-y-4">
          <input type="number" value={input} onChange={e => setInput(e.target.value)} className="text-6xl font-black bg-transparent text-center w-full focus:outline-none text-emerald-500" />
          <p className="text-gray-500 uppercase font-bold tracking-widest">Seconds</p>
          <button onClick={start} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Start Timer</button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-8xl font-black text-white tabular-nums">{seconds}</div>
          <button onClick={() => setActive(false)} className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold">Stop</button>
        </div>
      )}
    </div>
  );
};

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any) => {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = calculateWinner(board);
  const status = winner ? `Winner: ${winner}` : board.every(s => s) ? "Draw!" : `Next: ${xIsNext ? 'X' : 'O'}`;

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      <div className="text-2xl font-bold text-emerald-500">{status}</div>
      <div className="grid grid-cols-3 gap-3">
        {board.map((s, i) => (
          <button key={i} onClick={() => handleClick(i)} className="w-20 h-20 bg-[#1A1C1E] rounded-2xl border border-white/5 text-3xl font-black text-white flex items-center justify-center">
            {s}
          </button>
        ))}
      </div>
      <button onClick={() => setBoard(Array(9).fill(null))} className="w-full py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10">Reset Game</button>
    </div>
  );
};

const DiceRoller = () => {
  const [val, setVal] = useState(1);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    setTimeout(() => {
      setVal(Math.floor(Math.random() * 6) + 1);
      setRolling(false);
    }, 600);
  };

  return (
    <div className="text-center space-y-8 py-8">
      <motion.div 
        animate={rolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : {}}
        className="w-32 h-32 mx-auto bg-white rounded-3xl flex items-center justify-center text-6xl font-black text-black shadow-[0_0_30px_rgba(255,255,255,0.2)]"
      >
        {val}
      </motion.div>
      <button onClick={roll} disabled={rolling} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold disabled:opacity-50">Roll Dice</button>
    </div>
  );
};

const JsonFormatter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
    } catch {
      setOutput('Invalid JSON');
    }
  };

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Paste JSON here..." className="w-full h-40 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5 font-mono text-sm" />
      <button onClick={format} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Format JSON</button>
      {output && <pre className="p-4 bg-black/20 rounded-2xl border border-white/5 font-mono text-sm overflow-x-auto text-emerald-400 whitespace-pre-wrap">{output}</pre>}
    </div>
  );
};

const Base64Tool = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(btoa(input));
  const decode = () => {
    try { setOutput(atob(input)); } catch { setOutput('Invalid Base64'); }
  };

  return (
    <div className="space-y-4">
      <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="Text to encode/decode..." className="w-full h-32 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <button onClick={encode} className="py-4 bg-emerald-500 text-black rounded-2xl font-bold">Encode</button>
        <button onClick={decode} className="py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10">Decode</button>
      </div>
      {output && <div className="p-4 bg-black/20 rounded-2xl border border-white/5 break-all font-mono">{output}</div>}
    </div>
  );
};

const LoremIpsum = () => {
  const [count, setCount] = useState(3);
  const [text, setText] = useState('');

  const generate = () => {
    const base = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ";
    setText(base.repeat(count));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
        <span className="text-gray-400">Paragraphs: {count}</span>
        <input type="range" min="1" max="10" value={count} onChange={e => setCount(Number(e.target.value))} className="accent-emerald-500" />
      </div>
      <button onClick={generate} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Generate</button>
      {text && <div className="p-4 bg-black/20 rounded-2xl border border-white/5 text-gray-400 text-sm leading-relaxed">{text}</div>}
    </div>
  );
};

const CompassTool = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const handler = (e: any) => {
      if (e.webkitCompassHeading) setHeading(e.webkitCompassHeading);
      else if (e.alpha) setHeading(360 - e.alpha);
    };
    window.addEventListener('deviceorientation', handler);
    return () => window.removeEventListener('deviceorientation', handler);
  }, []);

  return (
    <div className="text-center space-y-8 py-8">
      <div className="relative w-64 h-64 mx-auto">
        <motion.div 
          animate={{ rotate: -heading }}
          className="w-full h-full border-4 border-white/10 rounded-full flex items-center justify-center relative"
        >
          <div className="absolute top-2 font-black text-rose-500">N</div>
          <div className="absolute bottom-2 font-black text-white">S</div>
          <div className="absolute left-2 font-black text-white">W</div>
          <div className="absolute right-2 font-black text-white">E</div>
          <div className="w-1 h-32 bg-rose-500 rounded-full absolute top-8" />
          <div className="w-1 h-32 bg-white rounded-full absolute bottom-8" />
        </motion.div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-full border-4 border-[#121416]" />
        </div>
      </div>
      <div className="text-5xl font-black text-white">{Math.round(heading)}°</div>
    </div>
  );
};

const MagnifierTool = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; });
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10">
        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" style={{ transform: `scale(${zoom})` }} />
      </div>
      <div className="flex items-center gap-4 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5">
        <span className="text-gray-400">Zoom: {zoom}x</span>
        <input type="range" min="1" max="5" step="0.1" value={zoom} onChange={e => setZoom(Number(e.target.value))} className="flex-1 accent-emerald-500" />
      </div>
    </div>
  );
};

const RulerTool = () => {
  return (
    <div className="relative h-96 bg-[#1A1C1E] rounded-3xl border border-white/5 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-16 flex flex-col justify-between py-4 border-r border-white/10">
        {Array.from({ length: 21 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={cn("h-px bg-gray-500", i % 5 === 0 ? "w-8" : "w-4")} />
            {i % 5 === 0 && <span className="text-[10px] text-gray-500 font-bold">{i / 2} cm</span>}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 flex items-center justify-center text-gray-600 font-bold rotate-90 whitespace-nowrap">
        PLACE OBJECT HERE
      </div>
    </div>
  );
};

const SnakeGame = () => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-24 h-24 mx-auto bg-green-500/10 rounded-full flex items-center justify-center">
        <Zap className="w-12 h-12 text-green-500" />
      </div>
      <h3 className="text-xl font-bold">Snake Game</h3>
      <p className="text-gray-500">Classic snake game is being optimized for touch controls.</p>
      <button className="px-8 py-3 bg-green-500 text-black rounded-full font-bold">Play Beta</button>
    </div>
  );
};

const MemoryGame = () => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="w-24 h-24 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
        <Layout className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-bold">Memory Match</h3>
      <p className="text-gray-500">Train your brain with this card matching game.</p>
      <button className="px-8 py-3 bg-blue-500 text-white rounded-full font-bold">Start Training</button>
    </div>
  );
};

const ColorPickerTool = () => {
  const [color, setColor] = useState('#10b981');
  return (
    <div className="space-y-8 py-4">
      <div className="w-full h-48 rounded-3xl shadow-2xl transition-colors" style={{ backgroundColor: color }} />
      <div className="space-y-4">
        <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-full h-12 bg-transparent border-none cursor-pointer" />
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-[#1A1C1E] rounded-2xl border border-white/5 text-center">
            <span className="block text-xs text-gray-500 uppercase font-bold mb-1">HEX</span>
            <span className="font-mono text-white uppercase">{color}</span>
          </div>
          <button onClick={() => navigator.clipboard.writeText(color)} className="p-4 bg-white/5 rounded-2xl border border-white/10 font-bold">Copy Code</button>
        </div>
      </div>
    </div>
  );
};

const WeatherTool = () => {
  return (
    <div className="space-y-6 py-4">
      <div className="text-center space-y-2">
        <Cloud className="w-20 h-20 text-sky-400 mx-auto" />
        <h2 className="text-6xl font-black">24°</h2>
        <p className="text-xl text-gray-400 font-medium">Partly Cloudy</p>
        <p className="text-gray-500">New York, USA</p>
      </div>
      <div className="grid grid-cols-3 gap-4 pt-8">
        <div className="text-center">
          <span className="block text-xs text-gray-500 font-bold uppercase">Humidity</span>
          <span className="text-white font-bold">64%</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500 font-bold uppercase">Wind</span>
          <span className="text-white font-bold">12km/h</span>
        </div>
        <div className="text-center">
          <span className="block text-xs text-gray-500 font-bold uppercase">UV Index</span>
          <span className="text-white font-bold">Low</span>
        </div>
      </div>
    </div>
  );
};

const WorldClockTool = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  const cities = [
    { name: 'London', offset: 0 },
    { name: 'New York', offset: -5 },
    { name: 'Tokyo', offset: 9 },
    { name: 'Dubai', offset: 4 }
  ];

  return (
    <div className="space-y-4 py-4">
      {cities.map(c => {
        const d = new Date(time.getTime() + (c.offset * 3600000));
        return (
          <div key={c.name} className="flex items-center justify-between p-4 bg-[#1A1C1E] rounded-2xl border border-white/5">
            <span className="text-lg font-bold">{c.name}</span>
            <span className="text-2xl font-mono font-black text-emerald-500">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        );
      })}
    </div>
  );
};

const AlarmTool = () => {
  const [time, setTime] = useState('08:00');
  const [active, setActive] = useState(false);

  return (
    <div className="text-center space-y-8 py-8">
      <div className="space-y-4">
        <input type="time" value={time} onChange={e => setTime(e.target.value)} className="text-6xl font-black bg-transparent text-center w-full focus:outline-none text-rose-500" />
        <p className="text-gray-500 uppercase font-bold tracking-widest">Set Alarm Time</p>
      </div>
      <button 
        onClick={() => setActive(!active)}
        className={cn("w-full py-4 rounded-2xl font-bold", active ? "bg-rose-500 text-white" : "bg-emerald-500 text-black")}
      >
        {active ? 'Alarm Set' : 'Set Alarm'}
      </button>
      {active && <p className="text-emerald-500 animate-pulse font-bold">Alarm will ring at {time}</p>}
    </div>
  );
};

const HabitTracker = () => {
  const [habits, setHabits] = useState<{id: number, name: string, streak: number}[]>([]);
  const [input, setInput] = useState('');

  const add = () => {
    if (!input) return;
    setHabits([...habits, { id: Date.now(), name: input, streak: 0 }]);
    setInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} placeholder="New habit..." className="flex-1 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
        <button onClick={add} className="p-4 bg-emerald-500 text-black rounded-2xl font-bold"><Plus /></button>
      </div>
      <div className="space-y-2">
        {habits.map(h => (
          <div key={h.id} className="flex items-center justify-between p-4 bg-[#1A1C1E] rounded-2xl border border-white/5">
            <span className="font-bold">{h.name}</span>
            <div className="flex items-center gap-4">
              <span className="text-emerald-500 font-mono">{h.streak} days</span>
              <button 
                onClick={() => setHabits(habits.map(hb => hb.id === h.id ? {...hb, streak: hb.streak + 1} : hb))}
                className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center"
              >
                +1
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState<{id: number, desc: string, amount: number}[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  const add = () => {
    if (!desc || !amount) return;
    setExpenses([...expenses, { id: Date.now(), desc, amount: Number(amount) }]);
    setDesc(''); setAmount('');
  };

  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      <div className="p-6 bg-rose-500/10 rounded-3xl text-center border border-rose-500/20">
        <span className="block text-sm text-rose-400 font-bold uppercase mb-1">Total Expenses</span>
        <span className="text-5xl font-black text-white">${total.toFixed(2)}</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
        <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Amount" className="bg-[#1A1C1E] p-4 rounded-2xl border border-white/5" />
      </div>
      <button onClick={add} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Add Expense</button>
      <div className="space-y-2">
        {expenses.map(e => (
          <div key={e.id} className="flex items-center justify-between p-4 bg-[#1A1C1E] rounded-2xl border border-white/5">
            <span className="text-gray-300">{e.desc}</span>
            <span className="font-bold text-white">${e.amount.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WaterReminder = () => {
  const [glasses, setGlasses] = useState(0);
  return (
    <div className="text-center space-y-8 py-8">
      <div className="relative w-48 h-48 mx-auto">
        <div className="absolute inset-0 border-4 border-blue-500/20 rounded-full" />
        <motion.div 
          animate={{ height: `${(glasses / 8) * 100}%` }}
          className="absolute bottom-0 left-0 right-0 bg-blue-500/40 rounded-b-full transition-all duration-500"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-6xl font-black text-white">{glasses}</span>
          <span className="text-xs text-blue-400 font-bold uppercase tracking-widest">Glasses</span>
        </div>
      </div>
      <div className="flex gap-4">
        <button onClick={() => setGlasses(Math.max(0, glasses - 1))} className="flex-1 py-4 bg-white/5 text-white rounded-2xl font-bold border border-white/10">-</button>
        <button onClick={() => setGlasses(glasses + 1)} className="flex-1 py-4 bg-blue-500 text-white rounded-2xl font-bold">+</button>
      </div>
      <p className="text-gray-500 text-sm">Goal: 8 glasses per day</p>
    </div>
  );
};

const MeditationTool = () => {
  const [active, setActive] = useState(false);
  return (
    <div className="text-center space-y-12 py-8">
      <motion.div 
        animate={active ? { scale: [1, 1.5, 1] } : {}}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
        className="w-48 h-48 mx-auto bg-purple-500/20 rounded-full flex items-center justify-center border-4 border-purple-500/30"
      >
        <Moon className="w-16 h-16 text-purple-400" />
      </motion.div>
      <div className="space-y-4">
        <h3 className="text-2xl font-bold text-white">{active ? 'Breathe In... Breathe Out...' : 'Ready to Relax?'}</h3>
        <p className="text-gray-500">Focus on your breath and clear your mind.</p>
      </div>
      <button 
        onClick={() => setActive(!active)}
        className={cn("w-full py-4 rounded-2xl font-bold", active ? "bg-rose-500 text-white" : "bg-purple-500 text-white")}
      >
        {active ? 'End Session' : 'Start Meditation'}
      </button>
    </div>
  );
};

const JournalTool = () => {
  const [entry, setEntry] = useState('');
  const [entries, setEntries] = useState<string[]>([]);
  return (
    <div className="space-y-6">
      <textarea 
        value={entry} 
        onChange={e => setEntry(e.target.value)} 
        placeholder="How was your day?" 
        className="w-full h-40 bg-[#1A1C1E] p-4 rounded-2xl border border-white/5 resize-none"
      />
      <button onClick={() => { if(entry) { setEntries([entry, ...entries]); setEntry(''); } }} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Save Entry</button>
      <div className="space-y-4">
        {entries.map((en, i) => (
          <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-xs text-gray-500 block mb-2">{new Date().toLocaleDateString()}</span>
            <p className="text-gray-300">{en}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsView = ({ 
  layout, setLayout, 
  theme, setTheme, 
  notifications, setNotifications,
  resolvedTheme
}: { 
  layout: string; setLayout: (l: string) => void;
  theme: string; setTheme: (t: string) => void;
  notifications: boolean; setNotifications: (n: boolean) => void;
  resolvedTheme: string;
}) => {
  return (
    <div className="flex flex-col gap-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <section className="space-y-4">
        <h3 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Social</h3>
        <p className="text-gray-500 text-sm">Stay updated with our latest tools</p>
        <a 
          href="https://www.instagram.com/bmw_crush_offical?igsh=MWFqZGI2MDV6eHNpNw==" 
          target="_blank" 
          rel="noopener noreferrer"
          className={cn(
            "flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95",
            resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
          )}
        >
          <div className="p-2 bg-pink-500/10 rounded-xl">
            <Instagram className="w-6 h-6 text-pink-500" />
          </div>
          <div className="flex-1">
            <h4 className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>Follow on Instagram</h4>
            <p className="text-xs text-gray-500">@bmw_crush_offical</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-600" />
        </a>
      </section>

      <section className="space-y-4">
        <h3 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Layout Style</h3>
        <div className="space-y-2">
          <button 
            onClick={() => setLayout('modern')}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95",
              resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
            )}
          >
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <Layout className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex-1 text-left">
              <h4 className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>Modern Layout</h4>
              <p className="text-xs text-gray-500">Material 3 design with cards and collapsing toolbar</p>
            </div>
            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", layout === 'modern' ? "border-emerald-500" : "border-gray-600")}>
              {layout === 'modern' && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
            </div>
          </button>
          <button 
            onClick={() => setLayout('classic')}
            className={cn(
              "w-full flex items-center gap-4 p-4 rounded-2xl border transition-all active:scale-95",
              resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
            )}
          >
            <div className="p-2 bg-gray-500/10 rounded-xl">
              <Grid className="w-6 h-6 text-gray-500" />
            </div>
            <div className="flex-1 text-left">
              <h4 className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>Classic Layout</h4>
              <p className="text-xs text-gray-500">Grid-based layout similar to previous version</p>
            </div>
            <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors", layout === 'classic' ? "border-emerald-500" : "border-gray-600")}>
              {layout === 'classic' && <div className="w-3 h-3 bg-emerald-500 rounded-full" />}
            </div>
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">Appearance</h3>
        <div className="flex items-center gap-4 mb-4">
          <Moon className="w-5 h-5 text-gray-400" />
          <span className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>Theme</span>
        </div>
        <div className="flex items-center justify-between px-2">
          {['Light', 'Dark', 'System'].map((t) => (
            <button 
              key={t}
              onClick={() => setTheme(t.toLowerCase())}
              className="flex items-center gap-2 group"
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", theme === t.toLowerCase() ? "border-emerald-500" : "border-gray-600")}>
                {theme === t.toLowerCase() && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />}
              </div>
              <span className={cn("text-sm transition-colors", theme === t.toLowerCase() ? "text-emerald-500 font-bold" : "text-gray-500")}>{t}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-emerald-500 font-bold text-sm uppercase tracking-wider">General</h3>
        <div className={cn(
          "flex items-center justify-between p-4 rounded-2xl border transition-colors",
          resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
        )}>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>Notifications</span>
          </div>
          <button 
            onClick={() => setNotifications(!notifications)}
            className={cn("w-12 h-6 rounded-full transition-colors relative", notifications ? "bg-emerald-500" : "bg-gray-700")}
          >
            <div className={cn("absolute top-1 w-4 h-4 bg-white rounded-full transition-all", notifications ? "left-7" : "left-1")} />
          </button>
        </div>
      </section>
    </div>
  );
};

const UpdatesView = ({ resolvedTheme }: { resolvedTheme: string }) => {
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={cn(
        "p-6 rounded-3xl border space-y-4 transition-colors",
        resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl">
            <Zap className="w-5 h-5 text-emerald-500" />
          </div>
          <h3 className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>Version 2.0.4 is here!</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          We've added 10+ new AI tools including Resume Builder, Travel Planner, and more. 
          Improved performance and fixed minor bugs in the Metal Detector.
        </p>
        <span className="text-xs text-gray-600 block">February 22, 2026</span>
      </div>
      
      <div className={cn(
        "p-6 rounded-3xl border space-y-4 opacity-60 transition-colors",
        resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
      )}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-xl">
            <Star className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className={cn("font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>New Category: Dev Tools</h3>
        </div>
        <p className="text-gray-400 text-sm leading-relaxed">
          Check out our new Dev Tools category featuring JSON Formatter, Base64 converter, and more.
        </p>
        <span className="text-xs text-gray-600 block">February 15, 2026</span>
      </div>
    </div>
  );
};

const DeviceInfo = ({ resolvedTheme }: { resolvedTheme: string }) => {
  const [info, setInfo] = useState<any>(null);

  useEffect(() => {
    const getDeviceInfo = () => {
      const ua = navigator.userAgent;
      let os = "Unknown";
      let osVersion = "Unknown";
      let deviceModel = "Unknown";
      let manufacturer = "Unknown";

      // Basic OS detection
      if (ua.indexOf("Android") !== -1) {
        os = "Android";
        const match = ua.match(/Android\s([0-9\.]+)/);
        osVersion = match ? match[1] : "Unknown";
        
        // Try to get model
        const modelMatch = ua.match(/Android.*;\s([^;]+)\sBuild/);
        if (modelMatch) {
          deviceModel = modelMatch[1];
          // Try to guess manufacturer
          if (deviceModel.toLowerCase().includes("samsung")) manufacturer = "Samsung";
          else if (deviceModel.toLowerCase().includes("pixel")) manufacturer = "Google";
          else if (deviceModel.toLowerCase().includes("xiaomi") || deviceModel.toLowerCase().includes("mi ")) manufacturer = "Xiaomi";
          else if (deviceModel.toLowerCase().includes("huawei")) manufacturer = "Huawei";
          else if (deviceModel.toLowerCase().includes("oppo")) manufacturer = "Oppo";
          else if (deviceModel.toLowerCase().includes("vivo")) manufacturer = "Vivo";
        }
      } else if (ua.indexOf("iPhone") !== -1 || ua.indexOf("iPad") !== -1) {
        os = "iOS";
        const match = ua.match(/OS\s([0-9_]+)/);
        osVersion = match ? match[1].replace(/_/g, '.') : "Unknown";
        manufacturer = "Apple";
        deviceModel = ua.indexOf("iPhone") !== -1 ? "iPhone" : "iPad";
      } else if (ua.indexOf("Windows") !== -1) {
        os = "Windows";
        const match = ua.match(/Windows\sNT\s([0-9\.]+)/);
        osVersion = match ? match[1] : "Unknown";
        manufacturer = "PC";
      } else if (ua.indexOf("Macintosh") !== -1) {
        os = "macOS";
        manufacturer = "Apple";
      } else if (ua.indexOf("Linux") !== -1) {
        os = "Linux";
      }

      const screen = window.screen;
      const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

      setInfo({
        device: {
          manufacturer,
          model: deviceModel,
          platform: (navigator as any).platform || "Unknown",
          memory: (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : 'Unknown',
          cores: navigator.hardwareConcurrency || "Unknown",
        },
        os: {
          name: os,
          version: osVersion,
          language: navigator.language,
          userAgent: ua,
        },
        display: {
          resolution: `${screen.width * window.devicePixelRatio} x ${screen.height * window.devicePixelRatio} px`,
          viewport: `${window.innerWidth} x ${window.innerHeight} px`,
          density: `${window.devicePixelRatio.toFixed(2)}x`,
          orientation: screen.orientation ? screen.orientation.type : "Unknown",
          colorDepth: `${screen.colorDepth}-bit`,
        },
        network: {
          type: connection ? connection.effectiveType : "Unknown",
          downlink: connection ? `${connection.downlink} Mbps` : "Unknown",
          rtt: connection ? `${connection.rtt} ms` : "Unknown",
        }
      });
    };

    getDeviceInfo();
    window.addEventListener('resize', getDeviceInfo);
    return () => window.removeEventListener('resize', getDeviceInfo);
  }, []);

  const copyToClipboard = () => {
    const text = JSON.stringify(info, null, 2);
    navigator.clipboard.writeText(text);
    alert("Device info copied to clipboard!");
  };

  if (!info) return null;

  const InfoSection = ({ title, icon: Icon, data, color }: any) => (
    <div className={cn(
      "rounded-3xl border overflow-hidden transition-colors",
      resolvedTheme === 'light' ? "bg-white border-slate-200" : "bg-[#1A1C1E] border-white/5"
    )}>
      <div className={cn(
        "p-4 border-b flex items-center gap-3",
        resolvedTheme === 'light' ? "border-slate-100" : "border-white/5"
      )}>
        <div className={cn("p-2 rounded-xl", color)}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className={cn("font-bold text-lg", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        {Object.entries(data).map(([key, value]: any) => (
          <div key={key} className="flex justify-between items-start gap-4">
            <span className="text-gray-500 text-sm capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
            <span className={cn(
              "text-sm font-medium text-right break-all max-w-[70%]",
              resolvedTheme === 'light' ? "text-slate-700" : "text-white"
            )}>{String(value)}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      <div className="flex justify-end">
        <button 
          onClick={copyToClipboard}
          className={cn(
            "p-2 rounded-xl border transition-colors",
            resolvedTheme === 'light' ? "bg-slate-100 border-slate-200 text-slate-600" : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
          )}
        >
          <Copy className="w-5 h-5" />
        </button>
      </div>

      <InfoSection 
        title="Device" 
        icon={Smartphone} 
        color="bg-blue-500/10 text-blue-500"
        data={info.device} 
      />

      <InfoSection 
        title="Operating System" 
        icon={Cpu} 
        color="bg-emerald-500/10 text-emerald-500"
        data={info.os} 
      />

      <InfoSection 
        title="Display" 
        icon={Monitor} 
        color="bg-purple-500/10 text-purple-500"
        data={info.display} 
      />

      <InfoSection 
        title="Network" 
        icon={Wifi} 
        color="bg-orange-500/10 text-orange-500"
        data={info.network} 
      />
    </div>
  );
};

const BatteryInfo = () => {
  const [battery, setBattery] = useState<any>(null);

  useEffect(() => {
    (navigator as any).getBattery?.().then((bat: any) => {
      const update = () => {
        setBattery({
          level: Math.round(bat.level * 100),
          charging: bat.charging,
          chargingTime: bat.chargingTime,
          dischargingTime: bat.dischargingTime,
        });
      };
      update();
      bat.addEventListener('levelchange', update);
      bat.addEventListener('chargingchange', update);
    });
  }, []);

  if (!battery) return <div className="text-center text-gray-500">Battery API not supported in this browser.</div>;

  return (
    <div className="space-y-6 py-4">
      <div className="relative w-48 h-48 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-800" />
          <circle 
            cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="12" fill="transparent" 
            strokeDasharray={552.92} strokeDashoffset={552.92 * (1 - battery.level / 100)}
            className="text-emerald-500 transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-bold text-white">{battery.level}%</span>
          <span className="text-sm text-gray-500 uppercase tracking-widest">{battery.charging ? 'Charging' : 'Discharging'}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-[#1A1C1E] rounded-2xl border border-white/5 text-center">
          <span className="block text-xs text-gray-500 uppercase mb-1">Status</span>
          <span className="text-white font-bold">{battery.charging ? 'Plugged In' : 'On Battery'}</span>
        </div>
        <div className="p-4 bg-[#1A1C1E] rounded-2xl border border-white/5 text-center">
          <span className="block text-xs text-gray-500 uppercase mb-1">Health</span>
          <span className="text-white font-bold">Good</span>
        </div>
      </div>
    </div>
  );
};

const SpeakerCleaner = () => {
  const [active, setActive] = useState(false);
  const audioCtx = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);

  const start = () => {
    audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    oscillator.current = audioCtx.current.createOscillator();
    oscillator.current.type = 'square'; // Harsh wave to vibrate
    oscillator.current.frequency.setValueAtTime(165, audioCtx.current.currentTime);
    oscillator.current.connect(audioCtx.current.destination);
    oscillator.current.start();
    setActive(true);
  };

  const stop = () => {
    oscillator.current?.stop();
    setActive(false);
  };

  return (
    <div className="space-y-8 py-4 text-center">
      <div className={cn("w-32 h-32 mx-auto rounded-full flex items-center justify-center transition-all duration-500", active ? "bg-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.5)] animate-pulse" : "bg-gray-800")}>
        <Wind className={cn("w-16 h-16", active ? "text-black" : "text-gray-600")} />
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">Speaker Dust Cleaner</h3>
        <p className="text-gray-500 text-sm">Plays a high-intensity sound to vibrate water and dust out of your speakers.</p>
      </div>
      <button 
        onClick={active ? stop : start}
        className={cn("w-full py-6 rounded-3xl font-black text-xl uppercase tracking-widest transition-all", active ? "bg-rose-500 text-white" : "bg-emerald-500 text-black")}
      >
        {active ? 'Stop Cleaning' : 'Start Cleaning'}
      </button>
    </div>
  );
};

const AiVideoGenerator = ({ resolvedTheme }: { resolvedTheme: string }) => {
  const [prompt, setPrompt] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [hasKey, setHasKey] = useState<boolean | null>(null);

  useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio) {
        const selected = await window.aistudio.hasSelectedApiKey();
        setHasKey(selected);
      } else {
        setHasKey(true); // Fallback for environments without aistudio global
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      setHasKey(true);
    }
  };

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    setStatus('Initializing generation...');
    try {
      const apiKey = getApiKey();
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      
      let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        config: {
          numberOfVideos: 1,
          resolution: '720p',
          aspectRatio: '16:9'
        }
      });

      setStatus('Generating video... This may take a few minutes.');
      
      while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
      }

      const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
      if (downloadLink) {
        const response = await fetch(downloadLink, {
          method: 'GET',
          headers: {
            'x-goog-api-key': apiKey!,
          },
        });
        const blob = await response.blob();
        setVideoUrl(URL.createObjectURL(blob));
      }
    } catch (e: any) {
      console.error(e);
      const errorMsg = e.message || '';
      if (errorMsg.includes("Requested entity was not found") || errorMsg.includes("403") || errorMsg.includes("permission")) {
        setHasKey(false);
        setStatus('API Key error. Please select a valid paid Google Cloud project API key.');
      } else {
        setStatus('Error generating video. Make sure you have a paid Gemini API key selected.');
      }
    } finally {
      setLoading(false);
      setStatus('');
    }
  };

  if (hasKey === false) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center p-8 text-center space-y-4 rounded-3xl border transition-colors",
        resolvedTheme === 'light' ? "bg-emerald-50 border-emerald-100" : "bg-emerald-500/5 border-emerald-500/10"
      )}>
        <Lock className="w-12 h-12 text-emerald-500 mb-2" />
        <h3 className={cn("text-xl font-bold", resolvedTheme === 'light' ? "text-slate-800" : "text-white")}>API Key Required</h3>
        <p className="text-gray-400 text-sm max-w-xs">
          Video generation requires a paid Gemini API key. Please select one to continue.
        </p>
        <button 
          onClick={handleSelectKey}
          className="px-8 py-3 bg-emerald-500 text-black rounded-xl font-bold hover:bg-emerald-400 transition-colors"
        >
          Select API Key
        </button>
        <a 
          href="https://ai.google.dev/gemini-api/docs/billing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-xs text-emerald-500/60 hover:text-emerald-500 underline"
        >
          Learn about billing
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the video you want to create (e.g., 'A sunset over a futuristic city')..."
        className={cn(
          "w-full h-32 border rounded-2xl p-4 transition-all focus:outline-none focus:border-emerald-500/50",
          resolvedTheme === 'light'
            ? "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            : "bg-[#1A1C1E] border-white/5 text-white placeholder:text-gray-600"
        )}
      />
      <button 
        onClick={generate}
        disabled={loading}
        className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
        {loading ? 'Generating...' : 'Create Video'}
      </button>
      
      {status && (
        <div className="text-center p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
          <p className="text-emerald-500 text-sm font-medium">{status}</p>
        </div>
      )}

      {videoUrl && (
        <div className="space-y-4">
          <video src={videoUrl} controls className="w-full rounded-2xl shadow-2xl" />
          <a 
            href={videoUrl} 
            download="ai-video.mp4" 
            className={cn(
              "flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold border transition-colors",
              resolvedTheme === 'light' ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/5 border-white/10 text-white"
            )}
          >
            <Download className="w-5 h-5" />
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

const TextToImage = ({ resolvedTheme }: { resolvedTheme: string }) => {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!prompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: getApiKey()! });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: [{ text: prompt }],
        config: { imageConfig: { aspectRatio: "1:1" } }
      });
      
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          setImage(`data:image/png;base64,${part.inlineData.data}`);
          break;
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe the image you want to create..."
        className={cn(
          "w-full h-32 border rounded-2xl p-4 transition-all focus:outline-none focus:border-emerald-500/50",
          resolvedTheme === 'light'
            ? "bg-white border-slate-200 text-slate-900 placeholder:text-slate-400"
            : "bg-[#1A1C1E] border-white/5 text-white placeholder:text-gray-600"
        )}
      />
      <button 
        onClick={generate}
        disabled={loading}
        className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Image'}
      </button>
      {image && (
        <div className="space-y-4">
          <div className="relative group">
            <img src={image} alt="Generated" className="w-full rounded-2xl shadow-2xl" />
          </div>
          <a 
            href={image} 
            download="ai-image.png" 
            className={cn(
              "flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold border transition-colors",
              resolvedTheme === 'light' ? "bg-slate-100 border-slate-200 text-slate-700" : "bg-white/5 border-white/10 text-white"
            )}
          >
            <Download className="w-5 h-5" />
            Download Image
          </a>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTool, setActiveTool] = useState<Tool | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Settings State
  const [layout, setLayout] = useState(() => localStorage.getItem('smart-ai-layout') || 'modern');
  const [theme, setTheme] = useState(() => localStorage.getItem('smart-ai-theme') || 'system');
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('smart-ai-notifications');
    return saved ? JSON.parse(saved) : true;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('smart-ai-favorites');
    return saved ? JSON.parse(saved) : TOOLS.slice(0, 5).map(t => t.id);
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const updateTheme = () => {
      const root = window.document.documentElement;
      let current: 'light' | 'dark' = 'dark';

      if (theme === 'dark') {
        current = 'dark';
      } else if (theme === 'light') {
        current = 'light';
      } else {
        current = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      setResolvedTheme(current);
      
      if (current === 'dark') {
        root.classList.add('dark');
        root.style.backgroundColor = '#0A0C0E';
      } else {
        root.classList.remove('dark');
        root.style.backgroundColor = '#F8FAFC';
      }
    };

    updateTheme();
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', updateTheme);
    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('smart-ai-favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('smart-ai-layout', layout);
  }, [layout]);

  useEffect(() => {
    localStorage.setItem('smart-ai-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('smart-ai-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const toggleFavorite = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const categories: (Category | 'All')[] = ['All', 'AI', 'Utility', 'Math', 'Games', 'Dev', 'Lifestyle'];

  const displayedTools = activeTab === 'favorites' 
    ? TOOLS.filter(t => favorites.includes(t.id))
    : TOOLS.filter(t => {
        const query = searchQuery.toLowerCase().trim();
        const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
        
        // Improved search: check title, category, and "ai" keyword
        const matchesSearch = 
          t.title.toLowerCase().includes(query) || 
          t.category.toLowerCase().includes(query) ||
          (query.includes('ai') && t.isAi) ||
          (query === 'tool' && true); // just an example
          
        return matchesCategory && matchesSearch;
      });

  const renderToolContent = () => {
    if (!activeTool) return null;

    switch (activeTool.id) {
      case 'frequency-generator': return <FrequencyGenerator />;
      case 'text-art': return <AiTool prompt="Generate creative text art for" systemInstruction="You are a text art generator. Use ASCII characters and creative formatting to represent the user's input." placeholder="Enter text to stylize..." resolvedTheme={resolvedTheme} />;
      case 'light-meter': return <LightMeter />;
      case 'sound-meter': return <SoundMeter />;
      case 'qr-generator': return <QrGenerator />;
      case 'video-to-audio': return <VideoToAudio />;
      case 'device-info': return <DeviceInfo resolvedTheme={resolvedTheme} />;
      case 'battery-info': return <BatteryInfo />;
      case 'speaker-cleaner': return <SpeakerCleaner />;
      case 'background-remover': return <BackgroundRemover />;
      case 'text-to-image': return <TextToImage resolvedTheme={resolvedTheme} />;
      case 'ai-assistant': return <AiTool prompt="You are a helpful AI assistant. Answer the following query" systemInstruction="You are a versatile and intelligent AI assistant. Provide helpful, accurate, and concise answers to any user query. Maintain a friendly and professional tone." placeholder="How can I help you today?" resolvedTheme={resolvedTheme} />;
      case 'ai-video-gen': return <AiVideoGenerator resolvedTheme={resolvedTheme} />;
      case 'ai-presentation': return <AiTool prompt="Generate a detailed outline and content for a presentation about" systemInstruction="You are a presentation expert. Create a structured outline with slide titles and key bullet points for a professional presentation based on the user's topic." placeholder="What is your presentation about?" resolvedTheme={resolvedTheme} />;
      case 'yt-description': return <AiTool prompt="Generate a SEO-optimized YouTube description for a video about" systemInstruction="You are a YouTube SEO expert. Generate engaging descriptions with timestamps, keywords, and call-to-actions." placeholder="What is your video about?" resolvedTheme={resolvedTheme} />;
      case 'caption-generator': return <AiTool prompt="Generate catchy social media captions for" systemInstruction="You are a social media manager. Generate 5 different styles of captions (funny, serious, short, emoji-rich, professional) for the given topic." placeholder="Enter topic or describe your post..." resolvedTheme={resolvedTheme} />;
      case 'paraphraser': return <AiTool prompt="Paraphrase the following text while maintaining its meaning" systemInstruction="You are a writing assistant. Rewrite the input text to be more professional and clear while keeping the original intent." placeholder="Paste text here..." resolvedTheme={resolvedTheme} />;
      case 'pdf-maker': return <PdfMaker />;
      case 'metal-detector': return <MetalDetector />;
      case 'text-summarizer': return <AiTool prompt="Summarize the following text in a concise way" systemInstruction="You are a text summarization expert. Provide a clear, bulleted summary of the key points from the input text." placeholder="Paste long text here..." resolvedTheme={resolvedTheme} />;
      case 'code-generator': return <AiTool prompt="Generate code for" systemInstruction="You are an expert software engineer. Generate clean, efficient, and well-documented code based on the user's request. Include explanations if necessary." placeholder="Describe the code you need..." resolvedTheme={resolvedTheme} />;
      case 'sentiment-analyzer': return <AiTool prompt="Analyze the sentiment of the following text" systemInstruction="You are a sentiment analysis expert. Analyze the emotional tone of the input text and provide a breakdown (e.g., Positive, Negative, Neutral) with brief reasoning." placeholder="Enter text to analyze sentiment..." resolvedTheme={resolvedTheme} />;
      case 'ai-story': return <AiTool prompt="Write a creative story about" systemInstruction="You are a master storyteller. Write an engaging, imaginative story based on the user's prompt. Use vivid descriptions and compelling characters." placeholder="What should the story be about?" resolvedTheme={resolvedTheme} />;
      case 'ai-translator': return <AiTool prompt="Translate the following text" systemInstruction="You are a professional translator. Translate the input text into the requested language accurately while maintaining tone and context." placeholder="Text to translate and target language..." resolvedTheme={resolvedTheme} />;
      case 'ai-grammar': return <AiTool prompt="Check and fix the grammar of" systemInstruction="You are an expert editor. Identify and correct grammar, spelling, and punctuation errors in the input text. Provide a brief explanation of the changes." placeholder="Paste text to check..." resolvedTheme={resolvedTheme} />;
      case 'ai-email': return <AiTool prompt="Write a professional email about" systemInstruction="You are a business communication expert. Write a clear, professional, and effective email based on the provided context." placeholder="Subject and key points..." resolvedTheme={resolvedTheme} />;
      case 'ai-recipe': return <AiTool prompt="Find a recipe for" systemInstruction="You are a world-class chef. Provide a detailed recipe including ingredients and step-by-step instructions based on the user's request." placeholder="Ingredients or dish name..." resolvedTheme={resolvedTheme} />;
      case 'ai-fitness': return <AiTool prompt="Create a workout plan for" systemInstruction="You are a certified personal trainer. Create a customized workout plan based on the user's goals, fitness level, and available equipment." placeholder="Your goals and fitness level..." resolvedTheme={resolvedTheme} />;
      case 'calculator': return <CalculatorTool />;
      case 'stopwatch': return <StopwatchTool />;
      case 'quote-gen': return <AiTool prompt="Give me an inspiring quote about" systemInstruction="You are a motivational speaker. Provide a powerful, inspiring quote based on the user's topic. Include the author if possible." placeholder="Topic (e.g., success, love, life)..." resolvedTheme={resolvedTheme} />;
      case 'unit-converter-ai': return <AiTool prompt="Convert the following value" systemInstruction="You are a smart unit converter. Convert the user's input to the requested unit or provide common conversions if not specified." placeholder="e.g., 50 miles to km..." resolvedTheme={resolvedTheme} />;
      case 'math-solver': return <AiTool prompt="Solve this math problem" systemInstruction="You are an expert mathematician. Solve the math problem provided and explain the steps clearly." placeholder="Enter math problem..." resolvedTheme={resolvedTheme} />;
      case 'code-explainer': return <AiTool prompt="Explain this code" systemInstruction="You are a senior developer. Explain the provided code snippet in simple terms, highlighting what it does and how it works." placeholder="Paste code here..." resolvedTheme={resolvedTheme} />;
      case 'resume-builder': return <AiTool prompt="Help me write a resume section for" systemInstruction="You are a professional resume writer. Help the user draft a compelling resume section based on their experience and the job they are targeting." placeholder="Your experience and target job..." resolvedTheme={resolvedTheme} />;
      case 'travel-planner': return <AiTool prompt="Plan a trip to" systemInstruction="You are a travel expert. Create a detailed travel itinerary including places to visit, things to do, and travel tips." placeholder="Destination and duration..." resolvedTheme={resolvedTheme} />;
      case 'gift-ideas': return <AiTool prompt="Suggest gift ideas for" systemInstruction="You are a gift-giving expert. Suggest creative and thoughtful gift ideas based on the recipient's interests and the occasion." placeholder="Who is it for and what's the occasion?" resolvedTheme={resolvedTheme} />;
      case 'joke-gen': return <AiTool prompt="Tell me a joke about" systemInstruction="You are a stand-up comedian. Tell a funny, clean joke based on the user's topic." placeholder="Topic for the joke..." resolvedTheme={resolvedTheme} />;
      case 'lyrics-gen': return <AiTool prompt="Write song lyrics about" systemInstruction="You are a talented songwriter. Write creative and emotional song lyrics based on the user's theme or story." placeholder="Theme or story for the song..." resolvedTheme={resolvedTheme} />;
      case 'name-gen': return <AiTool prompt="Generate names for" systemInstruction="You are a naming expert. Generate a list of creative and meaningful names based on the user's criteria (e.g., baby names, business names, pet names)." placeholder="What are you naming?" resolvedTheme={resolvedTheme} />;
      case 'slogan-gen': return <AiTool prompt="Generate a slogan for" systemInstruction="You are a branding expert. Create catchy and memorable slogans for the user's business or project." placeholder="Describe your business or project..." resolvedTheme={resolvedTheme} />;
      case 'hashtag-gen': return <AiTool prompt="Generate hashtags for" systemInstruction="You are a social media expert. Generate a list of trending and relevant hashtags for the user's post." placeholder="What is your post about?" resolvedTheme={resolvedTheme} />;
      case 'domain-gen': return <AiTool prompt="Suggest domain names for" systemInstruction="You are a domain name expert. Suggest creative and available-sounding domain names based on the user's business or idea." placeholder="Your business or idea..." resolvedTheme={resolvedTheme} />;
      case 'color-palette-ai': return <AiTool prompt="Generate a color palette for" systemInstruction="You are a professional designer. Generate a beautiful and cohesive color palette based on the user's theme or mood." placeholder="Theme or mood (e.g., ocean, sunset)..." resolvedTheme={resolvedTheme} />;
      case 'interview-prep': return <AiTool prompt="Help me prepare for an interview for" systemInstruction="You are a career coach. Provide common interview questions and tips for the specific job role the user is applying for." placeholder="Job role you are interviewing for..." resolvedTheme={resolvedTheme} />;
      case 'learning-path': return <AiTool prompt="Create a learning path for" systemInstruction="You are an educational consultant. Create a step-by-step learning path for the user to master a new skill or topic." placeholder="What do you want to learn?" resolvedTheme={resolvedTheme} />;
      case 'unit-converter': return <UnitConverter />;
      case 'currency-converter': return <CurrencyConverter />;
      case 'bmi-calculator': return <BmiCalculator />;
      case 'discount-calc': return <DiscountCalculator />;
      case 'tip-calc': return <TipCalculator />;
      case 'loan-calc': return <LoanCalculator />;
      case 'age-calculator': return <AgeCalculator />;
      case 'percent-calc': return <PercentCalculator />;
      case 'notes': return <NotesTool />;
      case 'timer': return <TimerTool />;
      case 'tic-tac-toe': return <TicTacToe />;
      case 'dice-roller': return <DiceRoller />;
      case 'json-formatter': return <JsonFormatter />;
      case 'base64': return <Base64Tool />;
      case 'lorem-ipsum': return <LoremIpsum />;
      case 'password-gen': return <PasswordGen />;
      case 'todo-list': return <TodoList />;
      case 'compass': return <CompassTool />;
      case 'magnifier': return <MagnifierTool />;
      case 'ruler': return <RulerTool />;
      case 'snake-game': return <SnakeGame />;
      case 'memory-game': return <MemoryGame />;
      case 'color-picker': return <ColorPickerTool />;
      case 'weather': return <WeatherTool />;
      case 'world-clock': return <WorldClockTool />;
      case 'alarm': return <AlarmTool />;
      case 'habit-tracker': return <HabitTracker />;
      case 'expense-tracker': return <ExpenseTracker />;
      case 'water-reminder': return <WaterReminder />;
      case 'meditation': return <MeditationTool />;
      case 'journal': return <JournalTool />;
      case 'random-number': return (
        <div className="space-y-6 text-center">
          <div className="text-7xl font-bold text-emerald-500">{Math.floor(Math.random() * 100)}</div>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Roll Again</button>
        </div>
      );
      case 'coin-flip': return (
        <div className="space-y-8 text-center py-8">
          <motion.div 
            animate={{ rotateY: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-32 h-32 mx-auto bg-yellow-500 rounded-full border-8 border-yellow-600 flex items-center justify-center text-4xl font-black text-yellow-800"
          >
            $
          </motion.div>
          <div className="text-3xl font-bold">{Math.random() > 0.5 ? 'HEADS' : 'TAILS'}</div>
          <button onClick={() => window.location.reload()} className="w-full py-4 bg-emerald-500 text-black rounded-2xl font-bold">Flip Again</button>
        </div>
      );
      default: return <div className="text-center text-gray-500 py-8">This tool ({activeTool.title}) is coming soon!</div>;
    }
  };

  return (
    <div className={cn(
      "min-h-screen font-sans pb-24 transition-colors duration-300",
      resolvedTheme === 'light' ? "bg-slate-50 text-slate-900" : "bg-[#0A0C0E] text-white"
    )}>
      {/* Header */}
      <header className="p-6 pt-12 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className={cn(
            "text-4xl font-bold tracking-tight capitalize",
            resolvedTheme === 'light' ? "text-slate-900" : "text-white"
          )}>{activeTab}</h1>
          {(activeTab === 'home' || activeTab === 'favorites') && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search tools..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "pl-9 pr-4 py-2 border rounded-full text-sm focus:outline-none focus:border-emerald-500/50 w-40 sm:w-64 transition-all",
                  resolvedTheme === 'light' 
                    ? "bg-white border-slate-200 text-slate-900" 
                    : "bg-[#1A1C1E] border-white/5 text-white"
                )}
              />
            </div>
          )}
        </div>

        {activeTab === 'home' && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-6 px-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all border",
                  selectedCategory === cat 
                    ? "bg-emerald-500 text-black border-emerald-500" 
                    : resolvedTheme === 'light'
                      ? "bg-white text-slate-600 border-slate-200"
                      : "bg-[#1A1C1E] text-gray-400 border-white/5"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="px-6">
        {activeTab === 'home' || activeTab === 'favorites' ? (
          <div className={cn(
            "grid gap-4",
            layout === 'modern' ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"
          )}>
            {displayedTools.map((tool) => (
              layout === 'modern' ? (
                <ToolCard 
                  key={tool.id} 
                  tool={tool} 
                  onClick={() => setActiveTool(tool)} 
                  isFavorite={favorites.includes(tool.id)}
                  onToggleFavorite={(e) => toggleFavorite(e, tool.id)}
                  resolvedTheme={resolvedTheme}
                />
              ) : (
                <motion.div
                  key={tool.id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveTool(tool)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border cursor-pointer group transition-all",
                    resolvedTheme === 'light' 
                      ? "bg-white border-slate-200 hover:border-emerald-500/30" 
                      : "bg-[#1A1C1E] border-white/5 hover:border-emerald-500/30"
                  )}
                >
                  <div className={cn("p-3 rounded-xl", tool.color)}>
                    <tool.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className={cn(
                      "font-bold",
                      resolvedTheme === 'light' ? "text-slate-800" : "text-gray-200"
                    )}>{tool.title}</h3>
                    <p className="text-xs text-gray-500">{tool.category}</p>
                  </div>
                  <button 
                    onClick={(e) => toggleFavorite(e, tool.id)}
                    className="p-2"
                  >
                    <Heart className={cn("w-5 h-5 transition-colors", favorites.includes(tool.id) ? "text-rose-500 fill-rose-500" : "text-gray-600")} />
                  </button>
                  <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-emerald-500 transition-colors" />
                </motion.div>
              )
            ))}
          </div>
        ) : activeTab === 'settings' ? (
          <SettingsView 
            layout={layout} setLayout={setLayout}
            theme={theme} setTheme={setTheme}
            notifications={notifications} setNotifications={setNotifications}
            resolvedTheme={resolvedTheme}
          />
        ) : (
          <UpdatesView resolvedTheme={resolvedTheme} />
        )}
      </main>

      {/* Bottom Nav */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 backdrop-blur-xl border-t px-4 py-3 flex items-center justify-around z-40 transition-colors",
        resolvedTheme === 'light' 
          ? "bg-white/90 border-slate-200" 
          : "bg-[#0A0C0E]/90 border-white/5"
      )}>
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'favorites', icon: Heart, label: 'Favorites' },
          { id: 'updates', icon: Megaphone, label: 'Updates' },
          { id: 'settings', icon: Settings, label: 'Settings' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveTab(item.id as any)} 
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              activeTab === item.id ? "text-emerald-500" : "text-gray-500"
            )}
          >
            <div className={cn(
              "p-2 px-6 rounded-full transition-all",
              activeTab === item.id && "bg-emerald-500/10"
            )}>
              <item.icon className={cn("w-6 h-6", activeTab === item.id && "fill-emerald-500")} />
            </div>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Modal */}
      <Modal 
        isOpen={!!activeTool} 
        onClose={() => setActiveTool(null)} 
        title={activeTool?.title || ''}
        resolvedTheme={resolvedTheme}
      >
        {renderToolContent()}
      </Modal>
    </div>
  );
}
