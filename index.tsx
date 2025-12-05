
import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  MapPin, 
  Palette, 
  Sparkles, 
  ScrollText, 
  CheckCircle2,
  XCircle,
  ArrowRight,
  RefreshCw,
  Play,
  Scissors,
  Volume2,
  VolumeX
} from 'lucide-react';

// --- Types & Constants ---

type Stage = 
  | 'MENU' 
  | 'INTRO' 
  | 'CH1_MAP' 
  | 'CH2_1_QUIZ' | 'CH2_1_GAME' 
  | 'CH2_2_QUIZ' | 'CH2_2_GAME' 
  | 'CH2_3_QUIZ' | 'CH2_3_GAME' 
  | 'CH3_ASSEMBLY' 
  | 'CH4_RHYTHM' 
  | 'ENDING';

interface QuizData {
  question: string;
  options: { id: string; text: string; correct: boolean }[];
  explanation: string;
}

const QUIZZES: Record<string, QuizData> = {
  material: {
    question: "制作马王皮影最好的原材料是什么？",
    options: [
      { id: 'A', text: "晒干的猪皮", correct: false },
      { id: 'B', text: "新宰杀的青壮年公牛皮", correct: true },
      { id: 'C', text: "陈年羊皮", correct: false },
    ],
    explanation: "正确！需选公牛皮，质地坚韧，透光性好。"
  },
  style: {
    question: "马王皮影的造型风格主要吸收了哪种戏曲脸谱的特点？",
    options: [
      { id: 'A', text: "京剧脸谱", correct: true },
      { id: 'B', text: "越剧脸谱", correct: false },
      { id: 'C', text: "黄梅戏脸谱", correct: false },
    ],
    explanation: "正确！吸取了京剧和川剧精华，额头圆、鼻尖挺。"
  },
  finish: {
    question: "为了让皮影色彩鲜亮且防潮，最后要涂刷什么？",
    options: [
      { id: 'A', text: "胶水", correct: false },
      { id: 'B', text: "蜂蜜", correct: false },
      { id: 'C', text: "明油/清漆", correct: true },
    ],
    explanation: "正确！推光发汗后涂上明油，皮影才能历久弥新。"
  }
};

// --- SVG Puppet Components (Strict Reference Implementation) ---

// Colors extracted from the image
const PuppetColors = {
  gold: '#d4af37',      // Robe base
  blue: '#1e40af',      // Floral patterns
  red: '#dc2626',       // Accents/Flowers
  black: '#171717',     // Hair/Outlines
  face: '#fffbeb',      // Pale skin
  white: '#ffffff',
  leather: '#e6d5b8',   // Uncarved leather color
};

type ColorMap = { [key: string]: string };

// 1. Head: Profile with Phoenix Headdress
const PuppetHead = ({ colors = {} }: { colors?: ColorMap }) => (
  <svg viewBox="0 0 100 130" className="w-full h-full drop-shadow-md">
    {/* Hair/Bun */}
    <path d="M45 40 Q35 30 40 20 Q50 10 60 20 Q70 15 75 25 Q80 40 70 50 L65 45 Z" fill={colors.hair || PuppetColors.black} />
    
    {/* Face Profile */}
    <path d="M45 40 Q40 40 40 50 Q38 55 35 55 Q30 58 35 62 L33 65 Q38 68 45 65 L45 80 Q55 85 60 70 L60 40 Z" 
          fill={colors.face || PuppetColors.face} stroke={PuppetColors.black} strokeWidth="0.5"/>
    
    {/* Facial Features */}
    <path d="M38 48 Q45 42 52 48" fill="none" stroke={PuppetColors.black} strokeWidth="1" /> {/* Eyebrow */}
    <path d="M40 52 Q48 50 50 54" fill="none" stroke={PuppetColors.black} strokeWidth="1" /> {/* Eye */}
    <path d="M34 62 L38 62" stroke={PuppetColors.red} strokeWidth="1" /> {/* Lips */}
    
    {/* Phoenix Headdress (Intricate) */}
    <g transform="translate(30, 0)">
      {/* Bird Body */}
      <path d="M20 30 Q10 20 20 10 Q30 0 40 10 L35 30 Z" fill={colors.headdress || PuppetColors.gold} stroke={PuppetColors.black} strokeWidth="0.5"/>
      {/* Red Pom-poms/Flowers */}
      <circle cx="15" cy="25" r="3" fill={PuppetColors.red} />
      <circle cx="25" cy="15" r="3" fill={PuppetColors.red} />
      {/* Tassels */}
      <path d="M40 10 L45 10 L45 30 L40 30 Z" fill={PuppetColors.red} />
      <path d="M47 10 L52 10 L52 30 L47 30 Z" fill={PuppetColors.gold} />
    </g>
  </svg>
);

// 2. Torso: Robe with Floral Medallions
const PuppetTorso = ({ colors = {}, carved = true }: { colors?: ColorMap, carved?: boolean }) => (
  <svg viewBox="0 0 100 140" className="w-full h-full drop-shadow-md">
    {/* Base Robe Shape */}
    <path d="M30 10 L70 10 L85 130 L15 130 Z" fill={colors.robe || (carved ? PuppetColors.gold : PuppetColors.leather)} stroke={PuppetColors.black} strokeWidth="1" />
    
    {/* Collar */}
    <path d="M40 10 L40 40 L60 40 L60 10 Z" fill={colors.collar || (carved ? PuppetColors.black : PuppetColors.leather)} />
    
    {/* Central Pattern - Floral Medallions (Only visible if carved) */}
    {carved && (
      <g opacity={colors.patternOpacity || 1}>
        {/* Top Medallion */}
        <circle cx="50" cy="40" r="12" fill="none" stroke={PuppetColors.black} strokeWidth="1" />
        <circle cx="50" cy="40" r="10" fill={colors.patternBlue || PuppetColors.blue} />
        <circle cx="50" cy="40" r="5" fill={colors.patternRed || PuppetColors.red} />
        
        {/* Middle Medallion */}
        <circle cx="50" cy="70" r="14" fill="none" stroke={PuppetColors.black} strokeWidth="1" />
        <circle cx="50" cy="70" r="12" fill={colors.patternBlue || PuppetColors.blue} />
        <circle cx="50" cy="70" r="6" fill={colors.patternRed || PuppetColors.red} />

        {/* Bottom Medallion */}
        <circle cx="50" cy="105" r="14" fill="none" stroke={PuppetColors.black} strokeWidth="1" />
        <circle cx="50" cy="105" r="12" fill={colors.patternBlue || PuppetColors.blue} />
        <circle cx="50" cy="105" r="6" fill={colors.patternRed || PuppetColors.red} />

        {/* Decorative Vines */}
        <path d="M35 50 Q30 60 35 70 T35 90" fill="none" stroke={PuppetColors.blue} strokeWidth="2" />
        <path d="M65 50 Q70 60 65 70 T65 90" fill="none" stroke={PuppetColors.blue} strokeWidth="2" />
        
        {/* Bottom Hem Waves */}
        <path d="M15 120 L25 120 L25 130 L15 130 Z" fill={PuppetColors.red} />
        <path d="M35 120 L45 120 L45 130 L35 130 Z" fill={PuppetColors.red} />
        <path d="M55 120 L65 120 L65 130 L55 130 Z" fill={PuppetColors.red} />
        <path d="M75 120 L85 120 L85 130 L75 130 Z" fill={PuppetColors.red} />
      </g>
    )}
    
    {/* Uncarved lines (guides) */}
    {!carved && (
      <g stroke={PuppetColors.black} strokeWidth="0.5" strokeDasharray="2 2" fill="none">
        <circle cx="50" cy="40" r="12" />
        <circle cx="50" cy="70" r="14" />
        <circle cx="50" cy="105" r="14" />
      </g>
    )}
  </svg>
);

// 3. Arms: Wide Sleeves with Matching Pattern
const PuppetArm = ({ colors = {}, rotation = 0 }: { colors?: ColorMap, rotation?: number }) => (
  <svg viewBox="0 0 80 120" className="w-full h-full drop-shadow-md overflow-visible" style={{ transform: `rotate(${rotation}deg)` }}>
    {/* Upper Arm (Sleeve) */}
    <path d="M30 10 L50 10 L70 60 L10 60 Z" fill={colors.sleeve || PuppetColors.gold} stroke={PuppetColors.black} />
    
    {/* Sleeve Pattern */}
    <g transform="translate(40, 35)">
      <circle r="10" fill={colors.patternBlue || PuppetColors.blue} stroke={PuppetColors.black} strokeWidth="0.5"/>
      <circle r="4" fill={colors.patternRed || PuppetColors.red} />
    </g>

    {/* Forearm & Hand */}
    <g transform="translate(10, 55)">
       {/* Inner Sleeve Cuff */}
       <path d="M10 5 L50 5 L45 20 L15 20 Z" fill={PuppetColors.black} /> 
       {/* Hand */}
       <path d="M20 20 L35 20 L30 45 Q25 50 20 45 Z" fill={colors.hand || PuppetColors.face} stroke={PuppetColors.black} />
       {/* Fingers */}
       <line x1="25" y1="45" x2="25" y2="55" stroke={colors.hand || PuppetColors.face} strokeWidth="3" strokeLinecap="round"/>
       <line x1="30" y1="45" x2="32" y2="52" stroke={colors.hand || PuppetColors.face} strokeWidth="3" strokeLinecap="round"/>
    </g>
  </svg>
);

// 4. Legs: Wide Patterned Skirt/Pants
const PuppetLeg = ({ colors = {} }: { colors?: ColorMap }) => (
  <svg viewBox="0 0 60 120" className="w-full h-full drop-shadow-md">
    {/* Main Pant Leg */}
    <path d="M10 0 L50 0 L60 90 L0 90 Z" fill={colors.pants || PuppetColors.gold} stroke={PuppetColors.black} />
    
    {/* Pant Pattern */}
    <g transform="translate(30, 50)">
      <circle r="12" fill={colors.patternBlue || PuppetColors.blue} stroke={PuppetColors.black} strokeWidth="0.5"/>
      <circle r="6" fill={colors.patternRed || PuppetColors.red} />
    </g>
    
    {/* Bottom Hem (Waves) */}
    <path d="M0 80 L60 80 L60 90 L0 90 Z" fill={PuppetColors.red} />
    <path d="M0 80 L10 80 L10 90 L0 90 Z" fill={PuppetColors.black} />
    <path d="M20 80 L30 80 L30 90 L20 90 Z" fill={PuppetColors.black} />
    <path d="M40 80 L50 80 L50 90 L40 90 Z" fill={PuppetColors.black} />

    {/* Boot */}
    <path d="M10 90 L50 90 L55 110 L5 110 Q0 100 10 90" fill={colors.boots || PuppetColors.black} stroke={PuppetColors.black} />
    <path d="M5 110 L55 110 L55 115 L5 115 Z" fill={PuppetColors.white} />
  </svg>
);


// --- Main Component ---

const App = () => {
  const [stage, setStage] = useState<Stage>('MENU');
  const [inventory, setInventory] = useState<string[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const addToInventory = (item: string) => {
    if (!inventory.includes(item)) {
      setInventory(prev => [...prev, item]);
    }
  };

  useEffect(() => {
    if(audioRef.current) {
      audioRef.current.volume = 0.5;
    }
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Play failed:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const renderStage = () => {
    switch(stage) {
      case 'MENU': return <MenuScreen onStart={() => { 
        setStage('INTRO');
        if (audioRef.current && !isPlaying) {
          const playPromise = audioRef.current.play();
          if (playPromise !== undefined) {
             playPromise
               .then(() => setIsPlaying(true))
               .catch(e => console.log("Autoplay blocked", e));
          }
        }
      }} />;
      case 'INTRO': return <IntroScreen onNext={() => setStage('CH1_MAP')} />;
      case 'CH1_MAP': 
        return <Chapter1Map onComplete={() => {
          addToInventory('泛黄的图纸');
          setStage('CH2_1_QUIZ');
        }} />;
      case 'CH2_1_QUIZ': 
        return <QuizScreen data={QUIZZES.material} onComplete={() => setStage('CH2_1_GAME')} title="第二章：选皮知识" />;
      case 'CH2_1_GAME': 
        return <ScrapingGame onComplete={() => {
          addToInventory('透明皮胚');
          setStage('CH2_2_QUIZ');
        }} />;
      case 'CH2_2_QUIZ':
        return <QuizScreen data={QUIZZES.style} onComplete={() => setStage('CH2_2_GAME')} title="第二章：造型知识" />;
      case 'CH2_2_GAME':
        return <CarvingGame onComplete={() => {
          addToInventory('刻刀');
          setStage('CH2_3_QUIZ');
        }} />;
      case 'CH2_3_QUIZ':
        return <QuizScreen data={QUIZZES.finish} onComplete={() => setStage('CH2_3_GAME')} title="第二章：上色知识" />;
      case 'CH2_3_GAME':
        return <ColoringGame onComplete={() => {
          addToInventory('彩绘皮影');
          setStage('CH3_ASSEMBLY');
        }} />;
      case 'CH3_ASSEMBLY':
        return <AssemblyGame onComplete={() => setStage('CH4_RHYTHM')} />;
      case 'CH4_RHYTHM':
        return <RhythmGame onComplete={() => setStage('ENDING')} />;
      case 'ENDING':
        return <EndingScreen onRestart={() => {
          setInventory([]);
          setStage('MENU');
        }} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-amber-900 font-serif select-none overflow-hidden relative">
      {/* Background Music: Guzheng - Fisherman's Song at Dusk */}
      <audio ref={audioRef} loop src="https://upload.wikimedia.org/wikipedia/commons/5/5b/Guzheng_-_Fisherman%27s_Song_at_Dusk.ogg" crossOrigin="anonymous" />

      {/* Background Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] z-0"></div>
      
      {/* Global UI Header */}
      <div className="relative z-10 p-4 flex justify-between items-center border-b border-amber-200 bg-amber-100/80 backdrop-blur-sm">
        <h1 className="text-lg font-bold flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          马王皮影工坊
        </h1>
        <div className="flex gap-2 items-center">
          <button 
            onClick={toggleMusic} 
            className="p-1.5 bg-amber-200 rounded-full hover:bg-amber-300 transition-colors mr-2 border border-amber-300"
            title={isPlaying ? "关闭音乐" : "开启音乐"}
          >
             {isPlaying ? <Volume2 className="w-4 h-4 text-amber-900" /> : <VolumeX className="w-4 h-4 text-amber-900" />}
          </button>

          {inventory.map((item, idx) => (
            <span key={idx} className="text-xs bg-amber-200 px-2 py-1 rounded-full border border-amber-300 animate-pulse">
              {item}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-4 h-[calc(100vh-64px)] flex flex-col items-center justify-center">
        <AnimatePresence mode='wait'>
          <motion.div 
            key={stage}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-4xl h-full flex flex-col"
          >
            {renderStage()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// --- Stage Components ---

const MenuScreen = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
    <div className="space-y-4">
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }} 
        transition={{ duration: 3, repeat: Infinity }}
        className="w-64 h-64 mx-auto flex items-center justify-center filter drop-shadow-2xl"
      >
        {/* Animated full puppet for menu */}
        <div className="relative w-full h-full">
            <div className="absolute top-0 left-[35%] w-[40%] h-[25%] animate-bounce"><PuppetHead /></div>
            <div className="absolute top-[20%] left-[25%] w-[50%] h-[45%]"><PuppetTorso colors={{robe: PuppetColors.gold}} /></div>
            <div className="absolute top-[25%] left-[-5%] w-[35%] h-[40%] origin-top-right rotate-12"><PuppetArm colors={{sleeve: PuppetColors.gold}}/></div>
            <div className="absolute top-[25%] right-[-5%] w-[35%] h-[40%] origin-top-left -rotate-12"><PuppetArm colors={{sleeve: PuppetColors.gold}}/></div>
            <div className="absolute top-[60%] left-[20%] w-[30%] h-[40%]"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
            <div className="absolute top-[60%] right-[20%] w-[30%] h-[40%]"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
        </div>
      </motion.div>
      <h1 className="text-4xl md:text-6xl font-black text-amber-900 drop-shadow-md tracking-widest">马王皮影工坊</h1>
      <h2 className="text-xl md:text-2xl text-amber-700 font-bold border-t border-amber-300 pt-4 inline-block">光影复活计划</h2>
    </div>
    <button 
      onClick={onStart}
      className="group relative px-10 py-4 bg-red-800 text-amber-50 text-xl font-bold rounded-lg shadow-xl hover:bg-red-700 transition-all active:scale-95 border-2 border-red-900"
    >
      <span className="flex items-center gap-3">
        <BookOpen className="w-6 h-6" />
        开启光影之旅
      </span>
    </button>
  </div>
);

const IntroScreen = ({ onNext }: { onNext: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-6 max-w-2xl mx-auto">
    <p className="text-lg leading-loose text-amber-800 bg-white/60 p-8 rounded-xl border border-amber-300 shadow-lg font-medium">
      你在老家阁楼翻开一本名为《见影》的旧书。
      <br/><br/>
      尘封的皮影箱里，皮影们因为太久没人演出，失去了色彩和灵气。
      <br/>
      突然，书页翻动，一位青衣书生从光影中走出...
    </p>
    <div className="flex items-center gap-6 bg-amber-100 p-6 rounded-lg border-2 border-amber-400 shadow-inner w-full">
      <div className="w-24 h-24 bg-amber-200 rounded-full flex items-center justify-center border-4 border-amber-500 overflow-hidden">
        <div className="w-full h-full scale-125 translate-y-2">
            <PuppetHead />
        </div>
      </div>
      <div className="text-left flex-1">
        <div className="font-bold text-amber-900 text-xl mb-2">阿贵 (青年)</div>
        <div className="text-amber-800 italic">"我是何应贵。三百年前，我为了让家乡热闹起来，决定北上学艺。"</div>
      </div>
    </div>
    <button onClick={onNext} className="mt-8 px-8 py-3 bg-amber-700 text-white rounded font-bold hover:bg-amber-600 flex items-center gap-2 shadow-lg">
      进入第一章 <ArrowRight className="w-5 h-5" />
    </button>
  </div>
);

// --- Chapter 1: Map (Unchanged) ---
const Chapter1Map = ({ onComplete }: { onComplete: () => void }) => {
  const [connected, setConnected] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h3 className="text-2xl font-bold mb-6 text-amber-900">第一章：寻根·北上取经</h3>
      <div className="relative w-full max-w-md aspect-square bg-[#e6d5b8] rounded-xl border-8 border-double border-amber-800 shadow-2xl p-4 overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
        <div className="absolute bottom-10 left-10 flex flex-col items-center z-20">
          <MapPin className="text-red-700 w-10 h-10 animate-bounce drop-shadow-md" fill="currentColor" />
          <span className="font-bold bg-amber-50/90 px-2 py-1 rounded border border-amber-700 shadow mt-1">四川南部县</span>
        </div>
        <div className="absolute top-10 right-10 flex flex-col items-center z-20">
          <MapPin className="text-red-700 w-10 h-10 drop-shadow-md" fill="currentColor" />
          <span className="font-bold bg-amber-50/90 px-2 py-1 rounded border border-amber-700 shadow mt-1">陕西渭南</span>
        </div>
        {!connected ? (
           <button 
             onClick={() => { setConnected(true); setTimeout(() => setShowDialog(true), 1000); }}
             className="absolute inset-0 flex items-center justify-center z-10 hover:bg-amber-900/5 transition-colors cursor-pointer group"
           >
             <div className="bg-white/90 px-6 py-3 rounded-full shadow-xl text-amber-900 font-bold border-2 border-amber-600 group-hover:scale-110 transition-transform flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600"/> 点击连接两地文化
             </div>
           </button>
        ) : (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <motion.path 
              d="M 60 300 Q 150 150 300 60" 
              fill="none" 
              stroke="#b45309" 
              strokeWidth="4" 
              strokeDasharray="8 4"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5 }}
            />
          </svg>
        )}
      </div>
      {showDialog && (
        <div className="mt-6 p-6 bg-white/95 rounded-xl shadow-2xl border-2 border-amber-600 max-w-md w-full animate-in fade-in slide-in-from-bottom-4">
          <p className="mb-6 text-amber-900 font-medium">"这便是文化传播之路。我也因此创办了兴隆皮影班。"</p>
          <button onClick={onComplete} className="w-full py-3 bg-red-800 text-white rounded-lg font-bold hover:bg-red-700 shadow-md">
            获得 [泛黄的图纸] 并继续
          </button>
        </div>
      )}
    </div>
  );
};

// --- Reusable Quiz (Unchanged) ---
const QuizScreen = ({ data, onComplete, title }: { data: QuizData, onComplete: () => void, title: string }) => {
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const handleSelect = (id: string, correct: boolean) => {
    setSelected(id);
    setIsCorrect(correct);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center max-w-2xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-4 bg-amber-100 px-6 py-3 rounded-full border border-amber-300">
        <div className="w-12 h-12 bg-amber-700 rounded-full flex items-center justify-center text-3xl border-2 border-white shadow-sm">👴</div>
        <div>
          <div className="font-bold text-amber-900">何爷爷</div>
          <div className="text-xs text-amber-700 font-medium">马王皮影第七代传承人</div>
        </div>
      </div>
      
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-amber-200 w-full relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-700 via-amber-500 to-green-700"></div>
        <h3 className="text-amber-600 font-bold mb-3 uppercase tracking-widest text-sm">{title}</h3>
        <h2 className="text-2xl font-bold text-amber-900 mb-8 leading-relaxed">{data.question}</h2>
        
        <div className="space-y-4">
          {data.options.map(opt => (
            <button
              key={opt.id}
              onClick={() => !selected && handleSelect(opt.id, opt.correct)}
              disabled={!!selected}
              className={`w-full p-5 text-left rounded-xl border-2 transition-all flex justify-between items-center group
                ${selected === opt.id 
                  ? (opt.correct ? 'bg-green-50 border-green-600 text-green-800 shadow-md' : 'bg-red-50 border-red-500 text-red-800 shadow-md')
                  : 'bg-amber-50/50 border-amber-200 hover:border-amber-500 hover:bg-amber-50 text-amber-900'
                }
              `}
            >
              <span className="font-medium text-lg"><span className="font-bold opacity-60 mr-2">{opt.id}.</span> {opt.text}</span>
              {selected === opt.id && (opt.correct ? <CheckCircle2 className="w-6 h-6"/> : <XCircle className="w-6 h-6"/>)}
            </button>
          ))}
        </div>

        {isCorrect !== null && (
          <div className="mt-8 pt-6 border-t border-amber-100 animate-in fade-in slide-in-from-bottom-2">
            <p className={`font-bold text-lg ${isCorrect ? 'text-green-700' : 'text-red-700'} mb-2 flex items-center gap-2`}>
              {isCorrect ? <CheckCircle2 className="w-5 h-5"/> : <XCircle className="w-5 h-5"/>}
              {isCorrect ? '回答正确！' : '哎呀，不对哦。'}
            </p>
            <p className="text-amber-800 mb-6 leading-relaxed">{data.explanation}</p>
            {isCorrect && (
              <button onClick={onComplete} className="w-full py-3 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-600 shadow-md transition-transform active:scale-95">
                开始工序
              </button>
            )}
            {!isCorrect && (
              <button onClick={() => { setSelected(null); setIsCorrect(null); }} className="w-full py-3 bg-amber-200 text-amber-900 rounded-lg hover:bg-amber-300 font-bold">
                再试一次
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Chapter 2.1: Scraping Game (Updated Puppet) ---
const ScrapingGame = ({ onComplete }: { onComplete: () => void }) => {
  const [cells, setCells] = useState(Array(64).fill(true));
  const remaining = cells.filter(c => c).length;
  const progress = ((64 - remaining) / 64) * 100;

  const handleHover = (index: number) => {
    const newCells = [...cells];
    newCells[index] = false;
    setCells(newCells);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-2xl font-bold mb-2 text-amber-900">制皮：推板刮皮</h3>
      <p className="mb-6 text-amber-700">用手指/鼠标快速滑动，去除杂质，显露皮影真身。</p>
      
      <div className="relative w-72 h-96 bg-amber-100 rounded-lg shadow-2xl overflow-hidden cursor-crosshair border-8 border-amber-800">
        <div className="absolute inset-0 flex items-center justify-center bg-[#fdf5e6]">
          <div className="w-full h-full p-4 opacity-50 grayscale">
            {/* Show the uncarved torso shape */}
            <PuppetTorso carved={false} />
          </div>
          <span className="absolute text-4xl font-bold text-amber-400 opacity-60 rotate-[-15deg] border-4 border-amber-400 p-2 rounded">薄如蝉翼</span>
        </div>

        <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 z-10">
          {cells.map((isDirty, idx) => (
            <div
              key={idx}
              onMouseEnter={() => handleHover(idx)}
              onTouchMove={() => handleHover(idx)}
              className={`transition-all duration-500 ease-out border border-amber-900/10 ${isDirty ? 'bg-[url("https://www.transparenttextures.com/patterns/leather.png")] bg-amber-800 opacity-100 scale-100' : 'opacity-0 scale-50'}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="w-72 mt-6 bg-amber-200 rounded-full h-6 overflow-hidden border border-amber-300 shadow-inner">
        <div className="bg-gradient-to-r from-green-500 to-green-600 h-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
      </div>

      {progress === 100 && (
        <button onClick={onComplete} className="mt-8 px-8 py-3 bg-amber-700 text-white font-bold rounded shadow-lg animate-bounce">
          完成制皮
        </button>
      )}
    </div>
  );
};

// --- Chapter 2.2: Carving Game (Major Update) ---
const CarvingGame = ({ onComplete }: { onComplete: () => void }) => {
  const [carvedSteps, setCarvedSteps] = useState([false, false, false]); // Top, Middle, Bottom medallions
  const allCarved = carvedSteps.every(Boolean);

  const handleCarve = (index: number) => {
    const newSteps = [...carvedSteps];
    newSteps[index] = true;
    setCarvedSteps(newSteps);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-2xl font-bold mb-2 text-amber-900">雕刻：精雕细琢</h3>
      <p className="mb-6 text-amber-700">点击皮影上的花纹区域，使用刻刀镂空出精美的【团花】图案。</p>
      
      <div className="flex gap-12 items-center">
        {/* Puppet Target */}
        <div className="relative w-80 h-[400px] bg-white/50 border-4 border-dashed border-amber-900/30 rounded-xl flex items-center justify-center p-4">
          <div className="w-full h-full relative">
            {/* Base (Uncarved or Partially Carved) */}
            <PuppetTorso 
              carved={false} // Background guides
            />
            
            {/* Overlay interactive areas */}
            <div className="absolute inset-0 z-10">
               {/* Top Medallion */}
               <button 
                 onClick={() => handleCarve(0)}
                 className={`absolute top-[25%] left-[50%] -translate-x-1/2 w-16 h-16 rounded-full border-2 border-dashed border-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all ${carvedSteps[0] ? 'opacity-0 pointer-events-none' : 'animate-pulse'}`}
               >
                 <Scissors className="w-6 h-6 text-red-600" />
               </button>
               {carvedSteps[0] && (
                 <div className="absolute top-[22%] left-[50%] -translate-x-1/2 w-24 h-24 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="12" fill={PuppetColors.blue} />
                      <circle cx="50" cy="50" r="6" fill={PuppetColors.red} />
                    </svg>
                 </div>
               )}

               {/* Middle Medallion */}
               <button 
                 onClick={() => handleCarve(1)}
                 disabled={!carvedSteps[0]}
                 className={`absolute top-[45%] left-[50%] -translate-x-1/2 w-20 h-20 rounded-full border-2 border-dashed border-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all ${carvedSteps[1] ? 'opacity-0 pointer-events-none' : (carvedSteps[0] ? 'animate-pulse' : 'opacity-30 cursor-not-allowed')}`}
               >
                 <Scissors className="w-6 h-6 text-red-600" />
               </button>
               {carvedSteps[1] && (
                 <div className="absolute top-[42%] left-[50%] -translate-x-1/2 w-28 h-28 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="14" fill={PuppetColors.blue} />
                      <circle cx="50" cy="50" r="7" fill={PuppetColors.red} />
                    </svg>
                 </div>
               )}

               {/* Bottom Medallion */}
               <button 
                 onClick={() => handleCarve(2)}
                 disabled={!carvedSteps[1]}
                 className={`absolute top-[70%] left-[50%] -translate-x-1/2 w-20 h-20 rounded-full border-2 border-dashed border-red-400 flex items-center justify-center hover:bg-red-500/10 transition-all ${carvedSteps[2] ? 'opacity-0 pointer-events-none' : (carvedSteps[1] ? 'animate-pulse' : 'opacity-30 cursor-not-allowed')}`}
               >
                 <Scissors className="w-6 h-6 text-red-600" />
               </button>
               {carvedSteps[2] && (
                 <div className="absolute top-[67%] left-[50%] -translate-x-1/2 w-28 h-28 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle cx="50" cy="50" r="14" fill={PuppetColors.blue} />
                      <circle cx="50" cy="50" r="7" fill={PuppetColors.red} />
                    </svg>
                 </div>
               )}
            </div>
          </div>
        </div>

        {/* Tools Visualization */}
        <div className="flex flex-col gap-6 bg-amber-100 p-6 rounded-xl border border-amber-300 shadow-lg items-center">
            <div className="text-center font-bold text-amber-800 mb-2">雕刻工具</div>
            <div className="w-20 h-40 bg-amber-800 rounded flex items-center justify-center shadow-inner">
               <div className="w-2 h-32 bg-gray-300 rounded-full shadow-lg"></div>
               <div className="absolute w-4 h-12 bg-red-900 rounded mt-20"></div>
            </div>
            <div className="text-xs text-amber-800 font-bold">何家刻刀</div>
        </div>
      </div>

      {allCarved && (
        <div className="mt-8 text-center animate-in fade-in zoom-in">
           <p className="text-green-700 font-bold mb-4 text-xl">刀法利落，花纹精美！</p>
           <button onClick={onComplete} className="px-10 py-3 bg-amber-700 text-white font-bold rounded shadow-lg text-lg hover:bg-amber-600">
            完成雕刻
          </button>
        </div>
      )}
    </div>
  );
};

// --- Chapter 2.3: Coloring Game (Updated Colors) ---
const ColoringGame = ({ onComplete }: { onComplete: () => void }) => {
  const [colors, setColors] = useState({ head: false, body: false, arm: false, leg: false });
  const [polished, setPolished] = useState(0);
  const isColored = colors.head && colors.body && colors.arm && colors.leg;

  const handlePolish = () => {
    if (isColored && polished < 100) {
      setPolished(p => Math.min(p + 10, 100));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-2xl font-bold mb-2 text-amber-900">上色与发汗</h3>
      <p className="mb-6 text-amber-700 font-medium">
        {!isColored ? "点击各个部件，还原皮影本色【红、绿、黑、黄】。" : "快速点击按钮摩擦生热“发汗”，让皮影透亮！"}
      </p>

      {/* Exploded View of Puppet for Coloring */}
      <div className="relative w-80 h-96 mb-6 transition-all duration-500" style={{ filter: `brightness(${1 + polished/100}) saturate(${1 + polished/100}) contrast(${1 + polished/50})` }}>
        
        {/* Head */}
        <div 
          onClick={() => setColors(p => ({...p, head: true}))}
          className={`absolute top-0 left-[35%] w-24 h-24 cursor-pointer transition-transform hover:scale-105 ${!colors.head && 'filter grayscale opacity-70'}`}
        >
          <PuppetHead colors={colors.head ? {} : {face: '#eee', headdress: '#ccc', hair: '#999'}} />
          {!colors.head && <div className="absolute inset-0 flex items-center justify-center"><Palette className="text-red-500 animate-bounce bg-white rounded-full p-1"/></div>}
        </div>

        {/* Body */}
        <div 
          onClick={() => setColors(p => ({...p, body: true}))}
          className={`absolute top-[20%] left-[25%] w-40 h-48 z-10 cursor-pointer transition-transform hover:scale-105 ${!colors.body && 'filter grayscale opacity-70'}`}
        >
           <PuppetTorso colors={colors.body ? {robe: PuppetColors.gold} : {robe: '#eee'}} carved={true}/>
           {!colors.body && <div className="absolute inset-0 flex items-center justify-center"><Palette className="text-green-500 animate-bounce bg-white rounded-full p-1"/></div>}
        </div>

        {/* Arm */}
        <div 
          onClick={() => setColors(p => ({...p, arm: true}))}
          className={`absolute top-[20%] left-[5%] w-20 h-40 cursor-pointer transition-transform hover:scale-105 origin-top-right rotate-12 ${!colors.arm && 'filter grayscale opacity-70'}`}
        >
          <PuppetArm colors={colors.arm ? {sleeve: PuppetColors.gold} : {sleeve: '#ccc'}} />
          {!colors.arm && <div className="absolute top-10 left-5"><Palette className="text-yellow-500 animate-bounce bg-white rounded-full p-1"/></div>}
        </div>

         {/* Leg */}
         <div 
          onClick={() => setColors(p => ({...p, leg: true}))}
          className={`absolute top-[65%] left-[30%] w-20 h-32 cursor-pointer transition-transform hover:scale-105 ${!colors.leg && 'filter grayscale opacity-70'}`}
        >
          <PuppetLeg colors={colors.leg ? {pants: PuppetColors.gold} : {pants: '#ccc'}} />
          {!colors.leg && <div className="absolute top-5 left-5"><Palette className="text-blue-500 animate-bounce bg-white rounded-full p-1"/></div>}
        </div>
      </div>

      {!isColored ? (
        <div className="flex gap-2 text-sm text-amber-600 bg-amber-100 px-4 py-2 rounded-full border border-amber-300">
          <Palette className="w-4 h-4" /> 还有部位没上色哦
        </div>
      ) : polished < 100 ? (
        <button 
          onClick={handlePolish}
          className="w-56 py-4 bg-orange-500 text-white font-bold rounded-xl shadow-lg active:scale-95 active:bg-orange-600 select-none border-b-4 border-orange-700 text-xl flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5"/> 摩擦发汗 ({polished}%)
        </button>
      ) : (
        <button onClick={onComplete} className="px-10 py-3 bg-amber-700 text-white font-bold rounded shadow-lg animate-bounce text-lg">
          获得 [彩绘皮影]
        </button>
      )}
    </div>
  );
};

// --- Chapter 3: Assembly (Updated Puppet) ---
const AssemblyGame = ({ onComplete }: { onComplete: () => void }) => {
  const [stickPos, setStickPos] = useState<'NONE' | 'NECK' | 'CHEST'>('NONE');
  const [showFeedback, setShowFeedback] = useState(false);

  const checkAssembly = (pos: 'NECK' | 'CHEST') => {
    setStickPos(pos);
    if (pos === 'NECK') {
      // Wrong
      setTimeout(() => setStickPos('NONE'), 1000);
    } else {
      // Right
      setTimeout(() => setShowFeedback(true), 500);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-2xl font-bold mb-2 text-amber-900">第三章：连接·赋予生命</h3>
      <p className="mb-6 text-amber-700 text-center max-w-md">
        马王皮影个头大，最关键的“命棍”应该安在哪里？<br/>
        <span className="text-xs text-amber-600 bg-amber-100 px-2 rounded mt-1 inline-block">(点击正确的位置安装命棍)</span>
      </p>

      <div className="relative h-[400px] w-80">
        {stickPos === 'NONE' && (
          <div className="absolute -left-20 top-32 flex flex-col items-center animate-pulse z-30">
             <div className="h-40 w-1 bg-amber-900 rounded-full shadow-lg"></div>
             <span className="text-xs bg-white px-2 py-1 rounded shadow text-amber-900 font-bold border border-amber-500 mt-2">命棍</span>
          </div>
        )}

        {/* Puppet Body Assembly */}
        <div className="absolute inset-0 flex flex-col items-center">
          {/* Head */}
          <div className="w-24 h-24 z-20 -mb-4">
             <PuppetHead />
          </div>
          
          <div className="relative w-40 h-48 z-10 flex flex-col items-center">
            <PuppetTorso colors={{robe: PuppetColors.gold}} carved={true} />
            
            {/* Neck Zone */}
            <button 
              onClick={() => checkAssembly('NECK')}
              className="absolute top-2 w-10 h-10 rounded-full bg-white/30 border-2 border-dashed border-red-400 hover:bg-red-500/50 flex items-center justify-center transition-colors"
            >
              {stickPos === 'NECK' && <div className="h-40 w-1 bg-amber-900 absolute top-0 origin-top rotate-12 shadow-xl"></div>}
            </button>
            
            {/* Chest Zone - Specific to Sichuan Style */}
            <button 
              onClick={() => checkAssembly('CHEST')}
              className="absolute top-20 w-10 h-10 rounded-full bg-white/30 border-2 border-dashed border-green-500 hover:bg-green-500/50 flex items-center justify-center transition-colors"
            >
              {stickPos === 'CHEST' && <div className="h-48 w-1 bg-amber-900 absolute top-0 shadow-xl"></div>}
            </button>
          </div>

          {/* Legs */}
          <div className="flex gap-2 -mt-4 w-40 justify-center">
             <div className="w-16 h-32"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
             <div className="w-16 h-32"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
          </div>
        </div>

        {/* Feedback Messages */}
        {stickPos === 'NECK' && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-100 text-red-800 p-3 text-center rounded-lg text-sm font-bold border border-red-300 shadow-lg z-40 animate-in fade-in slide-in-from-bottom-2">
            ❌ 北方皮影才安脖子，咱们川北皮影安胸口！
          </div>
        )}
      </div>

      {showFeedback && (
        <div className="absolute inset-0 bg-white/90 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-2xl shadow-2xl border-4 border-amber-500 text-center animate-in zoom-in max-w-sm">
            <h4 className="text-2xl font-bold text-amber-900 mb-3">安装正确！</h4>
            <p className="mb-6 text-amber-800 text-lg">命棍安胸口，皮影能点头哈腰，活灵活现。</p>
            <div className="mb-6 h-32 w-32 mx-auto animate-bounce">
                <PuppetHead />
            </div>
            <button onClick={onComplete} className="px-8 py-3 bg-amber-700 text-white rounded-lg font-bold hover:bg-amber-600 shadow-md">
              前往大戏台
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Chapter 4: Rhythm Game (Updated Puppet) ---
const RhythmGame = ({ onComplete }: { onComplete: () => void }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameActive, setGameActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  
  useEffect(() => {
    if (gameActive && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
  }, [gameActive, timeLeft]);

  const hit = () => {
    if (!gameActive) return;
    setScore(s => s + 100);
    setCombo(c => c + 1);
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-black rounded-xl border-4 border-amber-900">
      <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596728328109-c167b0eb3809?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center"></div>
      
      <div className="relative flex-1 flex items-center justify-center">
        {/* Animated Puppet */}
        <div className={`relative w-64 h-80 transition-transform duration-100 ${combo > 5 ? 'scale-110 drop-shadow-[0_0_25px_rgba(255,200,0,0.6)]' : ''}`}>
             <div className={`absolute top-0 left-[35%] w-[40%] h-[25%] origin-bottom transition-transform ${combo % 2 === 0 ? 'rotate-6' : '-rotate-6'}`}>
                <PuppetHead />
             </div>
             <div className="absolute top-[20%] left-[25%] w-[50%] h-[45%]"><PuppetTorso colors={{robe: PuppetColors.gold}} carved={true} /></div>
             <div className={`absolute top-[25%] left-[-5%] w-[35%] h-[40%] origin-top-right transition-transform ${combo % 2 === 0 ? '-rotate-45' : 'rotate-12'}`}>
                <PuppetArm colors={{sleeve: PuppetColors.gold}}/>
             </div>
             <div className={`absolute top-[25%] right-[-5%] w-[35%] h-[40%] origin-top-left transition-transform ${combo % 2 === 0 ? 'rotate-45' : '-rotate-12'}`}>
                <PuppetArm colors={{sleeve: PuppetColors.gold}}/>
             </div>
             <div className="absolute top-[60%] left-[20%] w-[30%] h-[40%]"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
             <div className="absolute top-[60%] right-[20%] w-[30%] h-[40%]"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
        </div>
      </div>

      <div className="relative z-10 bg-gradient-to-t from-black via-black/80 to-transparent p-4">
        <div className="flex justify-between text-white mb-4 font-mono text-xl border-b border-white/20 pb-2">
          <div>得分: <span className="text-yellow-400">{score}</span></div>
          <div>连击: <span className="text-red-400">{combo}</span></div>
          <div>时间: {timeLeft}s</div>
        </div>

        {!gameActive && timeLeft === 30 && (
          <button 
            onClick={() => setGameActive(true)}
            className="absolute inset-0 m-auto w-56 h-20 bg-red-700 text-white font-bold rounded-full text-2xl shadow-[0_0_30px_rgba(220,38,38,0.6)] animate-pulse flex items-center justify-center gap-2 z-20 border-4 border-red-500"
          >
            开始演出 <Play className="w-8 h-8 fill-current"/>
          </button>
        )}

        {!gameActive && timeLeft === 0 && (
           <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center z-20">
             <h2 className="text-4xl text-yellow-500 font-bold mb-6">演出成功！</h2>
             <button onClick={onComplete} className="px-10 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 text-xl shadow-lg">
               谢幕
             </button>
           </div>
        )}

        <div className="grid grid-cols-4 gap-4 h-36">
          {['锣', '鼓', '二胡', '唢呐'].map((inst, idx) => (
            <div key={idx} className="relative bg-white/5 border-2 border-white/10 rounded-lg flex flex-col justify-end pb-4 items-center group overflow-hidden">
               {gameActive && (
                 <motion.div 
                   className="absolute w-10 h-10 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_10px_rgba(255,200,0,0.8)]"
                   initial={{ top: '-40px', opacity: 1 }}
                   animate={{ top: '100%', opacity: 0 }}
                   transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.4, ease: 'linear' }}
                 />
               )}
               
               <button 
                 onMouseDown={hit}
                 className="w-20 h-20 rounded-full border-4 border-white/30 bg-white/10 active:bg-yellow-500 active:border-yellow-200 transition-all flex items-center justify-center text-white font-bold text-lg shadow-lg active:scale-95"
               >
                 {inst}
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Ending Screen (Updated Puppet) ---
const EndingScreen = ({ onRestart }: { onRestart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-full text-center space-y-8 animate-in fade-in duration-1000">
    <Sparkles className="w-20 h-20 text-yellow-500 animate-spin-slow" />
    <h2 className="text-4xl font-bold text-amber-900 tracking-wide">薪火相传</h2>
    <p className="max-w-md text-xl text-amber-800 leading-relaxed italic font-serif">
      "皮影不只是牛皮上的画，它是光与影的魔术，是南部县几百年来的故事。
      只要还有像你这样的‘守艺人’，这盏灯就永远不会灭。"
    </p>
    <div className="p-8 bg-white rounded-xl shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border border-amber-200">
       <div className="w-64 h-80 border-4 border-double border-amber-900 bg-amber-50 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')] opacity-50"></div>
          {/* Final Frozen Pose */}
          <div className="w-full h-full p-4 scale-90">
             <div className="relative w-full h-full">
                <div className="absolute top-0 left-[35%] w-[40%] h-[25%]"><PuppetHead /></div>
                <div className="absolute top-[20%] left-[25%] w-[50%] h-[45%]"><PuppetTorso colors={{robe: PuppetColors.gold}} carved={true}/></div>
                <div className="absolute top-[25%] left-[-5%] w-[35%] h-[40%] rotate-45"><PuppetArm colors={{sleeve: PuppetColors.gold}}/></div>
                <div className="absolute top-[25%] right-[-5%] w-[35%] h-[40%] -rotate-45"><PuppetArm colors={{sleeve: PuppetColors.gold}}/></div>
                <div className="absolute top-[60%] left-[20%] w-[30%] h-[40%]"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
                <div className="absolute top-[60%] right-[20%] w-[30%] h-[40%]"><PuppetLeg colors={{pants: PuppetColors.gold}}/></div>
             </div>
          </div>
          <div className="absolute bottom-2 right-4 text-xs font-serif text-amber-900 font-bold bg-white/80 px-2 rounded">马王皮影</div>
       </div>
    </div>
    <button 
      onClick={onRestart}
      className="flex items-center gap-2 px-8 py-3 bg-amber-800 text-white rounded-full hover:bg-amber-700 transition-colors shadow-lg font-bold"
    >
      <RefreshCw className="w-5 h-5" /> 重玩《马王皮影工坊：光影复活计划》
    </button>
  </div>
);

// --- Entry Point ---
const root = createRoot(document.getElementById('root')!);
root.render(<App />);
