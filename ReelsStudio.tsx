/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { VerseData, Language } from '../types/bible';
import { findBook, BIBLE_BOOKS } from '../data/bibleBooks';
import { VERIFIED_SCRIPTURES } from '../data/bibleData';
import { loadChapterVerses } from '../utils/bibleEngine';
import { ambientAudio, bibleSpeech } from '../utils/audioEngine';
import {
  Download,
  Share2,
  Video,
  Image as ImageIcon,
  Sparkles,
  Volume2,
  VolumeX,
  Type,
  Palette,
  Layout,
  Play,
  RotateCcw,
  Check,
  X,
  BookOpen,
  ChevronDown,
  AlertCircle,
  Eye,
  Upload,
  Crop,
  Maximize2,
  ShieldCheck,
  Layers,
  FileImage,
  Sliders,
} from 'lucide-react';

interface ReelsStudioProps {
  initialVerse?: VerseData | null;
  activeLanguage: Language;
  onNavigateToBible?: (book: string, chapter: number, verse: number) => void;
}

export type AspectRatio = '9:16' | '16:9' | '1:1' | '4:5' | '3:4' | 'original';

interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  bgType: 'image' | 'gradient' | 'color';
  bgValue: string;
  bgGradient: string;
  fontFamily: 'cinzel' | 'serif' | 'sans';
  textColor: string;
  textAlign: 'center' | 'left';
  aspectRatio: AspectRatio;
}

// Curated popular verses for instant one-click selection
const POPULAR_REEL_VERSES = [
  { ref: 'John 3:16', book: 'John', chapter: 3, verse: 16, theme: 'Salvation' },
  { ref: 'Psalms 23:1', book: 'Psalms', chapter: 23, verse: 1, theme: 'Comfort' },
  { ref: 'Matthew 28:19', book: 'Matthew', chapter: 28, verse: 19, theme: 'Great Commission' },
  { ref: 'Romans 8:28', book: 'Romans', chapter: 8, verse: 28, theme: 'Hope' },
  { ref: 'Philippians 4:13', book: 'Philippians', chapter: 4, verse: 13, theme: 'Strength' },
  { ref: 'Jeremiah 29:11', book: 'Jeremiah', chapter: 29, verse: 11, theme: 'Promise' },
  { ref: 'Proverbs 3:5', book: 'Proverbs', chapter: 3, verse: 5, theme: 'Trust' },
  { ref: 'Matthew 1:21', book: 'Matthew', chapter: 1, verse: 21, theme: 'Nativity' },
  { ref: 'Matthew 4:4', book: 'Matthew', chapter: 4, verse: 4, theme: 'Spiritual Life' },
  { ref: 'Matthew 7:7', book: 'Matthew', chapter: 7, verse: 7, theme: 'Prayer' },
  { ref: '1 Corinthians 13:4', book: '1 Corinthians', chapter: 13, verse: 4, theme: 'Love' },
  { ref: 'Revelation 21:4', book: 'Revelation', chapter: 21, verse: 4, theme: 'Eternity' },
];

export const ReelsStudio: React.FC<ReelsStudioProps> = ({
  initialVerse,
  activeLanguage,
  onNavigateToBible,
}) => {
  // Current selected verse
  const [selectedVerse, setSelectedVerse] = useState<VerseData>(() => {
    if (initialVerse) return initialVerse;
    return (
      VERIFIED_SCRIPTURES.find((v) => v.book === 'John' && v.chapter === 3 && v.verse === 16) ||
      VERIFIED_SCRIPTURES[0]
    );
  });

  // Keep selected verse updated if navigated from Bible reader with a new verse
  useEffect(() => {
    if (initialVerse) {
      setSelectedVerse(initialVerse);
    }
  }, [initialVerse]);

  const [activeLang, setActiveLang] = useState<Language>(activeLanguage);
  
  // Aspect Ratio & Layout Controls
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
  const [fitMode, setFitMode] = useState<'autofit' | 'cover'>('autofit');
  const [extendBackground, setExtendBackground] = useState<boolean>(true);
  
  // Watermark & Branding Controls - DEFAULT TO FALSE (REMOVED)
  const [showWatermark, setShowWatermark] = useState<boolean>(false);
  const [showBrandingFooter, setShowBrandingFooter] = useState<boolean>(false);
  
  // Export Format
  const [exportFormat, setExportFormat] = useState<'png' | 'jpeg'>('png');

  // Background Options
  const [bgType, setBgType] = useState<'image' | 'gradient' | 'color'>('image');
  const [bgImage, setBgImage] = useState<string>(
    '/images/mountains_sunrise_christian_1792846234394.jpg'
  );
  const [bgGradient, setBgGradient] = useState<string>('from-blue-950 via-indigo-950 to-slate-950');
  const [fontFamily, setFontFamily] = useState<'cinzel' | 'serif' | 'sans'>('cinzel');
  const [fontSize, setFontSize] = useState<number>(24);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [textAlign, setTextAlign] = useState<'center' | 'left'>('center');
  const [customExcerpt, setCustomExcerpt] = useState<string>('');
  const [isExcerptEdited, setIsExcerptEdited] = useState<boolean>(false);

  // Custom Image Upload & Source Dimensions
  const [sourceDimensions, setSourceDimensions] = useState<{ width: number; height: number }>({
    width: 1920,
    height: 1080,
  });
  const [uploadedImageName, setUploadedImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Audio ambient player
  const [isAmbientPlaying, setIsAmbientPlaying] = useState<boolean>(false);

  // Export progress & feedback
  const [isExportingImage, setIsExportingImage] = useState<boolean>(false);
  const [isExportingVideo, setIsExportingVideo] = useState<boolean>(false);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [exportSuccessMsg, setExportSuccessMsg] = useState<string | null>(null);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // High-Resolution Preview Before Saving Modal
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState<boolean>(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [previewDims, setPreviewDims] = useState<{ width: number; height: number; label: string }>({
    width: 1080,
    height: 1920,
    label: '9:16',
  });
  const [isGeneratingPreview, setIsGeneratingPreview] = useState<boolean>(false);

  // Video preview modal
  const [renderedVideoUrl, setRenderedVideoUrl] = useState<string | null>(null);
  const [renderedVideoBlob, setRenderedVideoBlob] = useState<Blob | null>(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // Full Scripture Picker Modal
  const [isVersePickerOpen, setIsVersePickerOpen] = useState<boolean>(false);
  const [pickerBook, setPickerBook] = useState<string>('John');
  const [pickerChapter, setPickerChapter] = useState<number>(3);
  const [pickerVerses, setPickerVerses] = useState<VerseData[]>([]);
  const [isLoadingPickerVerses, setIsLoadingPickerVerses] = useState<boolean>(false);

  // Image cache map to prevent re-instantiating during animation
  const preloadedImages = useRef<Map<string, HTMLImageElement>>(new Map());

  // Background Options (served from public folder for 100% build & native webview reliability)
  const BACKGROUND_IMAGES = [
    {
      id: 'mountains',
      name: 'Mountains Sunrise',
      url: '/images/mountains_sunrise_christian_1792846234394.jpg',
      aspect: '16:9',
    },
    {
      id: 'ocean',
      name: 'Peaceful Ocean',
      url: '/images/peaceful_ocean_sky_1792846248493.jpg',
      aspect: '16:9',
    },
    {
      id: 'bible',
      name: 'Open Bible Candlelight',
      url: '/images/open_bible_golden_light_1792846262519.jpg',
      aspect: '16:9',
    },
  ];

  const GRADIENTS = [
    { id: 'royal_blue', name: 'Royal Blue & Gold', class: 'from-blue-950 via-blue-900 to-amber-950', hex: ['#090d16', '#1e3a8a', '#451a03'] },
    { id: 'midnight', name: 'Midnight Navy', class: 'from-slate-950 via-blue-950 to-slate-900', hex: ['#020617', '#0f172a', '#172554'] },
    { id: 'golden_dawn', name: 'Golden Dawn', class: 'from-amber-950 via-stone-900 to-amber-900', hex: ['#451a03', '#1c1917', '#78350f'] },
    { id: 'emerald', name: 'Deep Emerald', class: 'from-emerald-950 via-teal-950 to-slate-950', hex: ['#022c22', '#042f2e', '#0f172a'] },
  ];

  // Templates
  const TEMPLATES: TemplatePreset[] = [
    {
      id: 'tpl_prayer',
      name: 'Sunrise Prayer',
      category: 'Inspiration',
      bgType: 'image',
      bgValue: '/images/mountains_sunrise_christian_1792846234394.jpg',
      bgGradient: '',
      fontFamily: 'cinzel',
      textColor: '#ffffff',
      textAlign: 'center',
      aspectRatio: '9:16',
    },
    {
      id: 'tpl_psalm',
      name: 'Ocean Stillness',
      category: 'Meditation',
      bgType: 'image',
      bgValue: '/images/peaceful_ocean_sky_1792846248493.jpg',
      bgGradient: '',
      fontFamily: 'serif',
      textColor: '#ffffff',
      textAlign: 'center',
      aspectRatio: '9:16',
    },
    {
      id: 'tpl_scripture',
      name: 'Holy Scripture',
      category: 'Bible Study',
      bgType: 'image',
      bgValue: '/images/open_bible_golden_light_1792846262519.jpg',
      bgGradient: '',
      fontFamily: 'cinzel',
      textColor: '#ffffff',
      textAlign: 'center',
      aspectRatio: '1:1',
    },
    {
      id: 'tpl_royal',
      name: 'Royal Sanctuary',
      category: 'Theological',
      bgType: 'gradient',
      bgValue: '',
      bgGradient: 'from-blue-950 via-blue-900 to-amber-950',
      fontFamily: 'cinzel',
      textColor: '#ffffff',
      textAlign: 'center',
      aspectRatio: '4:5',
    },
    {
      id: 'tpl_modern',
      name: 'Midnight Proclamation',
      category: 'Bold Share',
      bgType: 'gradient',
      bgValue: '',
      bgGradient: 'from-slate-950 via-blue-950 to-slate-900',
      fontFamily: 'sans',
      textColor: '#ffffff',
      textAlign: 'left',
      aspectRatio: '16:9',
    },
  ];

  // Sync excerpt text with language
  useEffect(() => {
    if (!isExcerptEdited) {
      const text = activeLang === 'en' ? selectedVerse.enText : (selectedVerse.swText || selectedVerse.enText);
      setCustomExcerpt(text);
    }
  }, [selectedVerse, activeLang, isExcerptEdited]);

  // Load natural dimensions for active background image
  useEffect(() => {
    if (bgType === 'image' && bgImage) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        setSourceDimensions({
          width: img.naturalWidth || 1920,
          height: img.naturalHeight || 1080,
        });
        preloadedImages.current.set(bgImage, img);
      };
      img.src = bgImage;
    }
  }, [bgImage, bgType]);

  // Handle local user image file upload (PNG or JPG)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setWarningMessage('Please select a valid image file (PNG, JPG, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        const img = new Image();
        img.onload = () => {
          setSourceDimensions({
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          preloadedImages.current.set(result, img);
          setBgType('image');
          setBgImage(result);
          setUploadedImageName(file.name);
          setExportSuccessMsg(`Loaded custom photo "${file.name}" (${img.naturalWidth}×${img.naturalHeight}px)`);
          setTimeout(() => setExportSuccessMsg(null), 3500);
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  // Dimensions computation for target aspect ratio
  const getTargetDimensions = (
    ratio: AspectRatio
  ): { width: number; height: number; label: string; ratioNum: number } => {
    switch (ratio) {
      case '9:16':
        return { width: 1080, height: 1920, label: '9:16 • TikTok, Shorts & Reels', ratioNum: 9 / 16 };
      case '16:9':
        return { width: 1920, height: 1080, label: '16:9 • YouTube & Landscape', ratioNum: 16 / 9 };
      case '1:1':
        return { width: 1080, height: 1080, label: '1:1 • Square Post', ratioNum: 1 };
      case '4:5':
        return { width: 1080, height: 1350, label: '4:5 • Instagram Portrait', ratioNum: 4 / 5 };
      case '3:4':
        return { width: 1080, height: 1440, label: '3:4 • Portrait Graphics', ratioNum: 3 / 4 };
      case 'original':
      default: {
        const natW = sourceDimensions.width || 1920;
        const natH = sourceDimensions.height || 1080;
        // Normalize min dimension to at least 1080 for crisp output
        const maxDim = Math.max(natW, natH);
        const scale = maxDim < 1080 ? 1080 / maxDim : 1;
        const w = Math.round(natW * scale);
        const h = Math.round(natH * scale);
        return { width: w, height: h, label: `Original • ${w}×${h}px`, ratioNum: w / h };
      }
    }
  };

  // Toggle audio ambient sound
  const toggleAmbientSound = () => {
    if (isAmbientPlaying) {
      ambientAudio.stopAmbient();
      setIsAmbientPlaying(false);
    } else {
      ambientAudio.startAmbient('sanctuary');
      setIsAmbientPlaying(true);
    }
  };

  // Stop audio on unmount
  useEffect(() => {
    return () => {
      ambientAudio.stopAmbient();
    };
  }, []);

  // Voice-over text-to-speech preview
  const handleVoiceover = () => {
    const textToRead = customExcerpt || (activeLang === 'en' ? selectedVerse.enText : (selectedVerse.swText || selectedVerse.enText));
    bibleSpeech.speakVerses([{ verse: selectedVerse.verse, text: textToRead }], {
      lang: activeLang,
    });
  };

  // Canonical reference string with version tag
  const bookInfo = findBook(selectedVerse.book);
  const verseReference =
    activeLang === 'en'
      ? `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse} (NKJV)`
      : `${bookInfo?.swName || selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse} (SUV)`;

  // High-fidelity Canvas Renderer with Smart Auto-Fit & Extended Background
  const renderToCanvas = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    animationScale = 1.0,
    particleGlow = 0
  ): Promise<void> => {
    return new Promise((resolve) => {
      ctx.clearRect(0, 0, width, height);

      const drawOverlayAndText = () => {
        // Scrim overlay for high readability & reverent depth
        const scrim = ctx.createLinearGradient(0, 0, 0, height);
        scrim.addColorStop(0, 'rgba(0, 0, 0, 0.40)');
        scrim.addColorStop(0.5, 'rgba(0, 0, 0, 0.48)');
        scrim.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
        ctx.fillStyle = scrim;
        ctx.fillRect(0, 0, width, height);

        // Responsive base scaling
        const baseDim = Math.min(width, height);

        // Radiant Golden Cross Emblem at safe top zone
        const crossX = width / 2;
        const crossY = Math.max(height * 0.13, 65);

        // Glowing halo behind cross
        ctx.save();
        const halo = ctx.createRadialGradient(crossX, crossY, 4, crossX, crossY, 55 + particleGlow * 8);
        halo.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
        halo.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(crossX, crossY, 55 + particleGlow * 8, 0, Math.PI * 2);
        ctx.fill();

        // Golden Cross with shadow
        ctx.fillStyle = '#fbbf24';
        ctx.shadowColor = 'rgba(251, 191, 36, 0.75)';
        ctx.shadowBlur = 12 + particleGlow * 4;
        ctx.fillRect(crossX - 3, crossY - 20, 6, 40);
        ctx.fillRect(crossX - 16, crossY - 9, 32, 6);
        ctx.restore();

        // Safe Zone Scripture Typography
        ctx.save();
        ctx.fillStyle = textColor;
        ctx.textAlign = textAlign;

        // Proportional responsive font size
        const responsiveFontSize = Math.round((fontSize / 24) * (baseDim * 0.046));
        const lineHeight = responsiveFontSize * 1.55;
        const maxWidth = width * 0.82;

        const fontString =
          fontFamily === 'cinzel'
            ? `bold ${responsiveFontSize}px "Cinzel", Georgia, serif`
            : fontFamily === 'serif'
            ? `italic 500 ${Math.round(responsiveFontSize * 1.05)}px "Source Serif 4", Georgia, serif`
            : `600 ${responsiveFontSize}px "Plus Jakarta Sans", sans-serif`;

        ctx.font = fontString;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 14;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const textToDraw = `"${customExcerpt}"`;
        const words = textToDraw.split(' ');
        const lines: string[] = [];
        let currentLine = words[0] || '';

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxWidth) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        // Center vertically within safe reading zone
        const totalTextHeight = lines.length * lineHeight;
        let startY = (height - totalTextHeight) / 2;
        if (startY < crossY + 45) {
          startY = crossY + 45;
        }

        const drawX = textAlign === 'center' ? width / 2 : width * 0.09;
        lines.forEach((line) => {
          ctx.fillText(line, drawX, startY);
          startY += lineHeight;
        });

        // Golden Verse Reference (#fbbf24)
        const refFontSize = Math.round(responsiveFontSize * 0.65);
        ctx.font = `600 ${refFontSize}px "Plus Jakarta Sans", sans-serif`;
        ctx.fillStyle = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.fillText(`— ${verseReference}`, drawX, startY + refFontSize * 1.35);
        ctx.restore();

        // 1. Watermark: ONLY if explicitly toggled on (defaults to FALSE / REMOVED)
        if (showWatermark) {
          ctx.save();
          ctx.font = `700 ${Math.max(12, Math.round(baseDim * 0.016))}px "Cinzel", Georgia, serif`;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.fillText('NKJV BIBLE', width / 2, height - Math.max(32, height * 0.035));
          ctx.restore();
        }

        // 2. Footer Branding: ONLY if explicitly toggled on (defaults to FALSE / REMOVED)
        if (showBrandingFooter) {
          ctx.save();
          ctx.font = `600 ${Math.max(11, Math.round(baseDim * 0.014))}px "Plus Jakarta Sans", sans-serif`;
          ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
          ctx.textAlign = 'center';
          ctx.shadowBlur = 6;
          ctx.shadowColor = 'rgba(0,0,0,0.8)';
          ctx.fillText('NKJV BIBLE • READ • STUDY • SHARE • LIVE THE WORD', width / 2, height - Math.max(16, height * 0.018));
          ctx.restore();
        }

        resolve();
      };

      if (bgType === 'image') {
        const drawImageLayers = (img: HTMLImageElement) => {
          const canvasRatio = width / height;
          const imgRatio = (img.naturalWidth || img.width) / (img.naturalHeight || img.height);
          const hasSignificantMismatch = Math.abs(canvasRatio - imgRatio) > 0.05;

          if (fitMode === 'autofit' && extendBackground && hasSignificantMismatch) {
            // SMART BACKGROUND EXTENSION (AI-style ambient outpainting)
            // 1. Draw diffused ambient cover layer extending edge colors, light, and palette
            ctx.save();
            try {
              if ('filter' in ctx) {
                ctx.filter = 'blur(45px) brightness(0.68) saturate(1.25)';
              }
            } catch (e) {
              // Ignore unsupported filter environments
            }

            const coverScale = Math.max(width / img.width, height / img.height) * 1.15;
            const coverW = img.width * coverScale;
            const coverH = img.height * coverScale;
            const coverX = (width - coverW) / 2;
            const coverY = (height - coverH) / 2;
            ctx.drawImage(img, coverX, coverY, coverW, coverH);

            try {
              if ('filter' in ctx) {
                ctx.filter = 'none';
              }
            } catch (e) {}
            ctx.restore();

            // 2. Apply smooth directional vignette to blend extended margins seamlessly
            const ambientVignette = ctx.createRadialGradient(
              width / 2,
              height / 2,
              Math.min(width, height) * 0.28,
              width / 2,
              height / 2,
              Math.max(width, height) * 0.72
            );
            ambientVignette.addColorStop(0, 'rgba(0, 0, 0, 0.12)');
            ambientVignette.addColorStop(0.6, 'rgba(0, 0, 0, 0.42)');
            ambientVignette.addColorStop(1, 'rgba(0, 0, 0, 0.85)');
            ctx.fillStyle = ambientVignette;
            ctx.fillRect(0, 0, width, height);

            // 3. Draw core un-distorted subject image centered with soft depth shadow
            const fitScale = Math.min(width / img.width, height / img.height) * animationScale;
            const fitW = img.width * fitScale;
            const fitH = img.height * fitScale;
            const fitX = (width - fitW) / 2;
            const fitY = (height - fitH) / 2;

            ctx.save();
            ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
            ctx.shadowBlur = 32;
            ctx.drawImage(img, fitX, fitY, fitW, fitH);
            ctx.restore();
          } else if (fitMode === 'autofit' && !extendBackground) {
            // Auto fit with clean solid gradient background
            const bgFill = ctx.createLinearGradient(0, 0, width, height);
            bgFill.addColorStop(0, '#090d16');
            bgFill.addColorStop(0.5, '#1e293b');
            bgFill.addColorStop(1, '#020617');
            ctx.fillStyle = bgFill;
            ctx.fillRect(0, 0, width, height);

            const fitScale = Math.min(width / img.width, height / img.height) * animationScale;
            const fitW = img.width * fitScale;
            const fitH = img.height * fitScale;
            const fitX = (width - fitW) / 2;
            const fitY = (height - fitH) / 2;
            ctx.drawImage(img, fitX, fitY, fitW, fitH);
          } else {
            // Cover mode: proportional zoom-fill without stretching or distortion
            ctx.save();
            const scale = Math.max(width / img.width, height / img.height) * animationScale;
            const x = width / 2 - (img.width / 2) * scale;
            const y = height / 2 - (img.height / 2) * scale;
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            ctx.restore();
          }

          drawOverlayAndText();
        };

        const cachedImg = preloadedImages.current.get(bgImage);
        if (cachedImg && cachedImg.complete && cachedImg.naturalWidth > 0) {
          drawImageLayers(cachedImg);
        } else {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.src = bgImage;
          img.onload = () => {
            preloadedImages.current.set(bgImage, img);
            drawImageLayers(img);
          };
          img.onerror = () => {
            // Graceful fallback to deep royal blue gradient
            const fbGrad = ctx.createLinearGradient(0, 0, width, height);
            fbGrad.addColorStop(0, '#020617');
            fbGrad.addColorStop(0.5, '#1e3a8a');
            fbGrad.addColorStop(1, '#0f172a');
            ctx.fillStyle = fbGrad;
            ctx.fillRect(0, 0, width, height);
            drawOverlayAndText();
          };
        }
      } else if (bgType === 'gradient') {
        const activeG = GRADIENTS.find((g) => g.class === bgGradient) || GRADIENTS[0];
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, activeG.hex[0]);
        grad.addColorStop(0.5, activeG.hex[1]);
        grad.addColorStop(1, activeG.hex[2]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
        drawOverlayAndText();
      } else {
        ctx.fillStyle = '#090d16';
        ctx.fillRect(0, 0, width, height);
        drawOverlayAndText();
      }
    });
  };

  // Preview Before Saving: Full-Resolution Inspection Modal
  const handleOpenPreview = async () => {
    setIsGeneratingPreview(true);
    setWarningMessage(null);
    try {
      const targetDims = getTargetDimensions(aspectRatio);
      const canvas = document.createElement('canvas');
      canvas.width = targetDims.width;
      canvas.height = targetDims.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context unavailable');

      await renderToCanvas(ctx, targetDims.width, targetDims.height);

      const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, 0.95);
      setPreviewDataUrl(dataUrl);
      setPreviewDims(targetDims);
      setIsPreviewModalOpen(true);
      setIsGeneratingPreview(false);
    } catch (err: any) {
      console.error('Preview generation error:', err);
      setIsGeneratingPreview(false);
      setWarningMessage('Could not render image preview: ' + (err?.message || 'Check browser canvas memory.'));
    }
  };

  // High Quality PNG / JPG Image Download
  const handleExportImage = async (format: 'png' | 'jpeg' = exportFormat) => {
    setIsExportingImage(true);
    setWarningMessage(null);
    try {
      const targetDims = getTargetDimensions(aspectRatio);
      const canvas = document.createElement('canvas');
      canvas.width = targetDims.width;
      canvas.height = targetDims.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas 2D context unavailable');

      await renderToCanvas(ctx, targetDims.width, targetDims.height);

      const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
      const dataUrl = canvas.toDataURL(mimeType, format === 'jpeg' ? 0.94 : undefined);
      const extension = format === 'png' ? 'png' : 'jpg';
      const ratioTag = aspectRatio === 'original' ? 'orig' : aspectRatio.replace(':', 'x');
      const filename = `nkjv_${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}_${ratioTag}.${extension}`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExportingImage(false);
      setExportSuccessMsg(`Saved clean ${targetDims.width}×${targetDims.height}px ${format.toUpperCase()} image (zero watermarks)!`);
      setTimeout(() => setExportSuccessMsg(null), 4000);
    } catch (err: any) {
      console.error('Image export error:', err);
      setIsExportingImage(false);
      setWarningMessage('Unable to render image: ' + (err?.message || 'Check storage permissions.'));
    }
  };

  // Direct Social Share via Web Share API
  const handleShareImage = async () => {
    try {
      const targetDims = getTargetDimensions(aspectRatio);
      const canvas = document.createElement('canvas');
      canvas.width = targetDims.width;
      canvas.height = targetDims.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      await renderToCanvas(ctx, targetDims.width, targetDims.height);

      const mimeType = exportFormat === 'png' ? 'image/png' : 'image/jpeg';
      const ext = exportFormat === 'png' ? 'png' : 'jpg';

      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `nkjv_${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}.${ext}`, {
          type: mimeType,
        });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `NKJV Bible — ${verseReference}`,
            text: `"${customExcerpt}" — ${verseReference}`,
            files: [file],
          });
        } else if (navigator.share) {
          await navigator.share({
            title: `NKJV Bible — ${verseReference}`,
            text: `"${customExcerpt}" — ${verseReference}\n\nShared via NKJV Bible App`,
          });
        } else {
          // Direct fallback to clean download
          handleExportImage();
        }
      }, mimeType, 0.94);
    } catch (e) {
      handleExportImage();
    }
  };

  // Video Reel Export with MediaRecorder & in-app Video Preview
  const handleExportVideoReel = async () => {
    setIsExportingVideo(true);
    setVideoProgress(5);
    setWarningMessage(null);

    const hasMediaRecorder = typeof window !== 'undefined' && typeof (window as any).MediaRecorder !== 'undefined';
    const hasCaptureStream = typeof HTMLCanvasElement !== 'undefined' && 'captureStream' in HTMLCanvasElement.prototype;

    if (!hasMediaRecorder || !hasCaptureStream) {
      setIsExportingVideo(false);
      setWarningMessage(
        'Video recording is not supported in this browser or Android WebView environment. A high-resolution graphic has been prepared for you instead.'
      );
      handleExportImage();
      return;
    }

    const candidateMimes = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
      'video/mp4',
    ];
    let selectedMime = candidateMimes.find((m) => (window as any).MediaRecorder.isTypeSupported(m)) || '';

    const targetDims = getTargetDimensions(aspectRatio);
    const width = targetDims.width;
    const height = targetDims.height;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setIsExportingVideo(false);
      setWarningMessage('Could not initialize canvas context for video encoding.');
      handleExportImage();
      return;
    }

    try {
      const stream = (canvas as any).captureStream(30);

      const recorder = new (window as any).MediaRecorder(stream, {
        mimeType: selectedMime || undefined,
        videoBitsPerSecond: 4_500_000,
      });

      const chunks: Blob[] = [];
      recorder.ondataavailable = (e: any) => {
        if (e.data && e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: selectedMime || 'video/webm' });
        const videoUrl = URL.createObjectURL(videoBlob);
        setRenderedVideoUrl(videoUrl);
        setRenderedVideoBlob(videoBlob);
        setIsExportingVideo(false);
        setVideoProgress(100);
        setIsVideoModalOpen(true);
      };

      recorder.start();

      const totalFrames = 150; // 5 seconds at 30 fps
      let currentFrame = 0;

      const renderFrame = async () => {
        if (currentFrame >= totalFrames) {
          recorder.stop();
          return;
        }

        const progress = currentFrame / totalFrames;
        const animationScale = 1.0 + progress * 0.08;
        const particleGlow = Math.sin(progress * Math.PI * 3);

        await renderToCanvas(ctx, width, height, animationScale, particleGlow);

        currentFrame++;
        setVideoProgress(Math.round((currentFrame / totalFrames) * 95));
        requestAnimationFrame(renderFrame);
      };

      renderFrame();
    } catch (err: any) {
      console.error('Video recording failed:', err);
      setIsExportingVideo(false);
      setWarningMessage('Video recording encountered a codec error. A high-resolution graphic was saved instead.');
      handleExportImage();
    }
  };

  // Save rendered video
  const handleSaveRenderedVideo = () => {
    if (!renderedVideoUrl) return;
    const link = document.createElement('a');
    link.href = renderedVideoUrl;
    link.download = `nkjv_reel_${selectedVerse.book}_${selectedVerse.chapter}_${selectedVerse.verse}.webm`;
    link.click();
  };

  // Share rendered video
  const handleShareRenderedVideo = async () => {
    if (!renderedVideoBlob) return;
    try {
      const file = new File([renderedVideoBlob], `nkjv_reel_${selectedVerse.book}.webm`, { type: 'video/webm' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `NKJV Scripture Reel — ${verseReference}`,
          text: `"${customExcerpt}" — ${verseReference}`,
          files: [file],
        });
      } else if (navigator.share) {
        await navigator.share({
          title: `NKJV Scripture Reel — ${verseReference}`,
          text: `"${customExcerpt}" — ${verseReference}`,
        });
      } else {
        handleSaveRenderedVideo();
      }
    } catch (e) {
      handleSaveRenderedVideo();
    }
  };

  // Apply Template Preset
  const handleApplyTemplate = (tpl: TemplatePreset) => {
    setBgType(tpl.bgType);
    if (tpl.bgType === 'image') setBgImage(tpl.bgValue);
    if (tpl.bgType === 'gradient') setBgGradient(tpl.bgGradient);
    setFontFamily(tpl.fontFamily);
    setTextColor(tpl.textColor);
    setTextAlign(tpl.textAlign);
    setAspectRatio(tpl.aspectRatio);
  };

  // Load verses for book & chapter picker
  useEffect(() => {
    if (isVersePickerOpen) {
      setIsLoadingPickerVerses(true);
      loadChapterVerses(pickerBook, pickerChapter).then((verses) => {
        setPickerVerses(verses);
        setIsLoadingPickerVerses(false);
      });
    }
  }, [pickerBook, pickerChapter, isVersePickerOpen]);

  // Dynamic preview container aspect class
  const getAspectClass = () => {
    switch (aspectRatio) {
      case '9:16':
        return 'aspect-[9/16] max-w-[280px] sm:max-w-[320px]';
      case '1:1':
        return 'aspect-square max-w-[340px]';
      case '4:5':
        return 'aspect-[4/5] max-w-[320px]';
      case '3:4':
        return 'aspect-[3/4] max-w-[330px]';
      case '16:9':
        return 'aspect-[16/9] max-w-[460px]';
      case 'original':
      default: {
        const r = (sourceDimensions.width || 16) / (sourceDimensions.height || 9);
        if (r > 1.3) return 'aspect-[16/9] max-w-[460px]';
        if (r < 0.7) return 'aspect-[9/16] max-w-[300px]';
        return 'aspect-square max-w-[340px]';
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-fade-in">
      {/* Top Banner & Primary Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-400/20 text-amber-500">
              <FileImage className="w-5 h-5" />
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-blue-950 dark:text-amber-400">
              Verse Image & Reels Studio
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create clean, high-impact Scripture graphics & Reels with smart aspect ratio extension, zero watermarks, and ambient worship sound
          </p>
        </div>

        {/* Action Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Ambient Music Toggle */}
          <button
            onClick={toggleAmbientSound}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
              isAmbientPlaying
                ? 'bg-amber-400 text-blue-950 font-bold ring-2 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
            }`}
          >
            {isAmbientPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-600" />}
            <span>{isAmbientPlaying ? 'Mute Music' : 'Ambient Music'}</span>
          </button>

          {/* Preview Before Saving */}
          <button
            onClick={handleOpenPreview}
            disabled={isGeneratingPreview}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Preview Full Resolution Before Saving"
          >
            <Eye className="w-4 h-4 text-amber-500" />
            <span>{isGeneratingPreview ? 'Rendering...' : 'Preview Image'}</span>
          </button>

          {/* Direct Share */}
          <button
            onClick={handleShareImage}
            disabled={isExportingImage}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            title="Share Graphic"
          >
            <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Share</span>
          </button>

          {/* Download Image (Clean, No Watermark) */}
          <button
            onClick={() => handleExportImage(exportFormat)}
            disabled={isExportingImage}
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/20 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isExportingImage ? 'Exporting...' : `Download ${exportFormat.toUpperCase()}`}</span>
          </button>

          {/* Export Video Reel */}
          <button
            onClick={handleExportVideoReel}
            disabled={isExportingVideo}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all disabled:opacity-60 cursor-pointer"
          >
            <Video className="w-4 h-4" />
            <span>
              {isExportingVideo ? `Rendering (${videoProgress}%)...` : 'Export Video Reel'}
            </span>
          </button>
        </div>
      </div>

      {/* Progress or Notification Banners */}
      {isExportingVideo && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl space-y-2 animate-fade-in">
          <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 font-semibold">
            <span>Rendering Animated Christian Video Reel...</span>
            <span>{videoProgress}%</span>
          </div>
          <div className="w-full h-2 bg-amber-200 dark:bg-amber-900/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-150"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-amber-700 dark:text-amber-400">
            Applying camera zoom, golden particle glow, and high-bitrate encoding...
          </p>
        </div>
      )}

      {exportSuccessMsg && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {warningMessage && (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-xs text-amber-900 dark:text-amber-300 flex items-center gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{warningMessage}</span>
        </div>
      )}

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Live Frame Preview & Fast Toolbar */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-100 dark:bg-slate-900/40 rounded-3xl border border-slate-200 dark:border-slate-800 relative">
          <div className="w-full flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>Live Frame Canvas</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold text-[10px]">
                {getTargetDimensions(aspectRatio).label}
              </span>
            </span>

            {/* Clean Status Badge */}
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{!showWatermark && !showBrandingFooter ? 'Clean (No Watermark)' : 'Branding Active'}</span>
            </span>
          </div>

          {/* Canvas Preview Container */}
          <div
            className={`w-full ${getAspectClass()} rounded-2xl overflow-hidden relative shadow-2xl flex flex-col justify-between p-6 select-none transition-all ${
              bgType === 'gradient' ? `bg-gradient-to-br ${bgGradient}` : ''
            }`}
            style={{
              backgroundColor: bgType === 'color' ? '#090d16' : undefined,
              backgroundImage:
                bgType === 'image' && (!extendBackground || fitMode === 'cover')
                  ? `url(${bgImage})`
                  : undefined,
              backgroundSize: fitMode === 'cover' ? 'cover' : 'contain',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Extended Background Ambient Diffusion in preview */}
            {bgType === 'image' && extendBackground && fitMode === 'autofit' && (
              <div
                className="absolute inset-0 pointer-events-none scale-125 filter blur-xl opacity-75"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}

            {/* Core Image Layer if Autofit with Extended Background */}
            {bgType === 'image' && extendBackground && fitMode === 'autofit' && (
              <div
                className="absolute inset-0 pointer-events-none shadow-2xl"
                style={{
                  backgroundImage: `url(${bgImage})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            )}

            {/* Scrim overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/45 to-black/80 pointer-events-none z-1" />

            {/* Top Bar inside Reel */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                  ✝
                </div>
                <span className="text-[11px] font-serif font-bold text-amber-300 tracking-wider">
                  HOLY SCRIPTURE
                </span>
              </div>
              <span className="text-[10px] font-sans text-white/70 uppercase">
                {aspectRatio}
              </span>
            </div>

            {/* Central Verse Text */}
            <div className="relative z-10 my-auto text-center py-4">
              <p
                className={`leading-relaxed drop-shadow-md ${
                  fontFamily === 'cinzel'
                    ? 'font-serif font-bold'
                    : fontFamily === 'serif'
                    ? 'font-serif italic font-medium'
                    : 'font-sans font-semibold'
                }`}
                style={{
                  fontSize: `${fontSize}px`,
                  color: textColor,
                  textAlign,
                }}
              >
                "{customExcerpt}"
              </p>
              <p className="mt-3 text-amber-400 font-sans font-semibold text-xs sm:text-sm drop-shadow">
                — {verseReference}
              </p>
              {isExcerptEdited && (
                <span className="inline-block mt-1 text-[9px] text-amber-200/70 italic">
                  (Custom edited excerpt • Scripture intact)
                </span>
              )}
            </div>

            {/* Bottom Watermark / Footer: REMOVED by default */}
            {showWatermark && (
              <div className="relative z-10 text-center">
                <span className="text-[11px] font-serif font-bold tracking-widest text-white/80 drop-shadow">
                  NKJV BIBLE
                </span>
              </div>
            )}
            {showBrandingFooter && (
              <div className="relative z-10 text-center pt-0.5">
                <span className="text-[10px] font-sans font-semibold tracking-wider text-amber-300/80 drop-shadow">
                  READ • STUDY • SHARE • LIVE THE WORD
                </span>
              </div>
            )}
          </div>

          {/* Quick Preview Toolbar */}
          <div className="mt-3 flex items-center justify-between w-full max-w-md text-xs text-slate-500">
            <button
              onClick={handleVoiceover}
              className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 text-blue-600" />
              <span>Preview Voice-Over</span>
            </button>

            <button
              onClick={handleOpenPreview}
              className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full Screen Inspection</span>
            </button>

            {onNavigateToBible && (
              <button
                onClick={() => onNavigateToBible(selectedVerse.book, selectedVerse.chapter, selectedVerse.verse)}
                className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-amber-400 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                <span>Read Chapter</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Customization & Image Editing Controls */}
        <div className="lg:col-span-6 space-y-5">
          {/* 1. SECTION: ASPECT RATIO SELECTOR (Required: 9:16, 16:9, 1:1, 4:5, 3:4, Original) */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Crop className="w-4 h-4 text-amber-500" />
                <span>Aspect Ratio Selector</span>
              </span>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-bold">
                {getTargetDimensions(aspectRatio).label}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { id: '9:16', title: '9:16', subtitle: 'Reels, Shorts, Status' },
                { id: '16:9', title: '16:9', subtitle: 'YouTube, Landscape' },
                { id: '1:1', title: '1:1', subtitle: 'Instagram Square' },
                { id: '4:5', title: '4:5', subtitle: 'Instagram Portrait' },
                { id: '3:4', title: '3:4', subtitle: 'Portrait Graphics' },
                { id: 'original', title: 'Original', subtitle: `${sourceDimensions.width}×${sourceDimensions.height}px` },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setAspectRatio(opt.id as AspectRatio)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    aspectRatio === opt.id
                      ? 'bg-blue-900 text-white border-blue-900 ring-2 ring-amber-400 shadow-md'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{opt.title}</span>
                    {aspectRatio === opt.id && <Check className="w-3.5 h-3.5 text-amber-300" />}
                  </div>
                  <span
                    className={`block text-[10px] mt-0.5 truncate ${
                      aspectRatio === opt.id ? 'text-blue-200' : 'text-slate-500'
                    }`}
                  >
                    {opt.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. SECTION: SMART RESIZING, AUTO-FIT & EXTEND BACKGROUND */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-blue-600 dark:text-amber-400" />
              <span>Smart Image Resizing & Background Extension</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Auto Fit Mode Selector */}
              <button
                onClick={() => setFitMode(fitMode === 'autofit' ? 'cover' : 'autofit')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  fitMode === 'autofit'
                    ? 'border-amber-400 bg-amber-500/10 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Maximize2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-xs">
                    {fitMode === 'autofit' ? 'Auto Fit (No Distort / No Crop)' : 'Cover / Crop to Fill'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {fitMode === 'autofit'
                      ? 'Preserves 100% of the image without cutting verses'
                      : 'Fills canvas symmetrically without stretching'}
                  </span>
                </div>
              </button>

              {/* Extend Background Toggle */}
              <button
                onClick={() => setExtendBackground(!extendBackground)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-start gap-2.5 ${
                  extendBackground
                    ? 'border-emerald-500 bg-emerald-500/10 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <span className="block font-bold text-xs">
                    {extendBackground ? 'Extend Background: ON' : 'Extend Background: OFF'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {extendBackground
                      ? 'AI-style seamless ambient outpainting & color blend'
                      : 'Solid dark margins on aspect mismatch'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* 3. SECTION: WATERMARK & FOOTER REMOVAL CONTROLS */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Watermark & Branding Controls</span>
              </span>
              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                {!showWatermark && !showBrandingFooter ? 'Clean Image Mode' : 'Custom'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Remove Watermark Button / Toggle */}
              <button
                onClick={() => setShowWatermark(!showWatermark)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  !showWatermark
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold text-xs">
                    {!showWatermark ? 'Watermark: Removed ✓' : 'Watermark: Showing'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {!showWatermark ? 'No NKJV app watermark' : 'Shows top/bottom app watermark'}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                    !showWatermark ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </button>

              {/* Remove Branding/Footer Button / Toggle */}
              <button
                onClick={() => setShowBrandingFooter(!showBrandingFooter)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  !showBrandingFooter
                    ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-300'
                    : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div>
                  <span className="block font-bold text-xs">
                    {!showBrandingFooter ? 'Footer Branding: Removed ✓' : 'Footer Branding: Showing'}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {!showBrandingFooter ? 'No bottom tagline footer' : 'Shows "READ • STUDY • SHARE"'}
                  </span>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-xs font-bold ${
                    !showBrandingFooter ? 'bg-emerald-500 text-white' : 'bg-slate-300 dark:bg-slate-700 text-transparent'
                  }`}
                >
                  ✓
                </div>
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Generated verse images are 100% clean and ready for social media posting without unwanted watermarks, signatures, or branding bars.
            </p>
          </div>

          {/* 4. SECTION: SELECT SCRIPTURE & TRANSLATION */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Scripture Passage
              </span>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setActiveLang('en')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeLang === 'en' ? 'bg-blue-900 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  English (NKJV)
                </button>
                <button
                  onClick={() => setActiveLang('sw')}
                  className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                    activeLang === 'sw' ? 'bg-blue-900 text-white font-bold' : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Kiswahili (SUV)
                </button>
              </div>
            </div>

            {/* Quick Picker & Full Selector Button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setPickerBook(selectedVerse.book);
                  setPickerChapter(selectedVerse.chapter);
                  setIsVersePickerOpen(true);
                }}
                className="flex-1 p-2.5 rounded-xl border border-blue-900/30 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-amber-400 text-xs font-semibold flex items-center justify-between hover:bg-blue-100/50 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-500" />
                  <span>{selectedVerse.book} {selectedVerse.chapter}:{selectedVerse.verse}</span>
                </span>
                <span className="text-[11px] underline">Choose Any Verse</span>
              </button>
            </div>

            {/* Popular Verse Chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-500 font-medium">Quick Scripture Presets:</span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {POPULAR_REEL_VERSES.map((pv) => (
                  <button
                    key={pv.ref}
                    onClick={() => {
                      const match = VERIFIED_SCRIPTURES.find(
                        (v) => v.book === pv.book && v.chapter === pv.chapter && v.verse === pv.verse
                      );
                      if (match) {
                        setSelectedVerse(match);
                      } else {
                        loadChapterVerses(pv.book, pv.chapter).then((verses) => {
                          const f = verses.find((v) => v.verse === pv.verse) || verses[0];
                          if (f) setSelectedVerse(f);
                        });
                      }
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                      selectedVerse.book === pv.book &&
                      selectedVerse.chapter === pv.chapter &&
                      selectedVerse.verse === pv.verse
                        ? 'bg-amber-400 text-blue-950 border-amber-400 font-bold'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-400'
                    }`}
                  >
                    {pv.ref}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Excerpt Editing */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                  Scripture Text on Card (Editable)
                </label>
                {isExcerptEdited && (
                  <button
                    onClick={() => {
                      const raw = activeLang === 'en' ? selectedVerse.enText : (selectedVerse.swText || selectedVerse.enText);
                      setCustomExcerpt(raw);
                      setIsExcerptEdited(false);
                    }}
                    className="text-[10px] text-amber-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset to original</span>
                  </button>
                )}
              </div>
              <textarea
                rows={2}
                value={customExcerpt}
                onChange={(e) => {
                  setCustomExcerpt(e.target.value);
                  setIsExcerptEdited(true);
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none focus:ring-1 focus:ring-blue-900"
              />
            </div>
          </div>

          {/* 5. SECTION: BACKGROUND IMAGES, UPLOAD & GRADIENTS */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Background & Imagery
              </span>

              {/* Custom Image Upload Button */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-blue-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                </button>
              </div>
            </div>

            {uploadedImageName && (
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl text-xs flex items-center justify-between">
                <span className="truncate text-blue-900 dark:text-blue-300 font-medium">
                  Custom: {uploadedImageName} ({sourceDimensions.width}×{sourceDimensions.height})
                </span>
                <button
                  onClick={() => {
                    setUploadedImageName(null);
                    setBgImage(BACKGROUND_IMAGES[0].url);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Curated Backgrounds */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Reverent Christian Nature & Scriptures:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {BACKGROUND_IMAGES.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => {
                      setBgType('image');
                      setBgImage(img.url);
                    }}
                    className={`h-16 rounded-xl overflow-hidden relative border-2 transition-all cursor-pointer ${
                      bgType === 'image' && bgImage === img.url
                        ? 'border-amber-400 ring-2 ring-amber-300'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white p-0.5 truncate text-center">
                      {img.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sacred Color Gradients */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                Sacred Color Gradients:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {GRADIENTS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => {
                      setBgType('gradient');
                      setBgGradient(g.class);
                    }}
                    className={`p-2 rounded-xl text-xs font-medium border text-center transition-all bg-gradient-to-br ${g.class} text-white cursor-pointer ${
                      bgType === 'gradient' && bgGradient === g.class
                        ? 'border-amber-400 ring-2 ring-amber-300 font-bold'
                        : 'border-slate-700 opacity-80 hover:opacity-100'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 6. SECTION: TYPOGRAPHY & EXPORT FORMAT */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Typography & Export Format
              </span>

              {/* Format Switcher (PNG / JPG) */}
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                <button
                  onClick={() => setExportFormat('png')}
                  className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    exportFormat === 'png' ? 'bg-amber-400 text-blue-950' : 'text-slate-500'
                  }`}
                >
                  PNG
                </button>
                <button
                  onClick={() => setExportFormat('jpeg')}
                  className={`px-2.5 py-0.5 rounded font-bold transition-colors cursor-pointer ${
                    exportFormat === 'jpeg' ? 'bg-amber-400 text-blue-950' : 'text-slate-500'
                  }`}
                >
                  JPG
                </button>
              </div>
            </div>

            {/* Font Family Selection */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setFontFamily('cinzel')}
                className={`py-1.5 rounded-xl text-xs font-serif font-bold border transition-colors cursor-pointer ${
                  fontFamily === 'cinzel' ? 'bg-blue-900 text-white' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Cinzel
              </button>
              <button
                onClick={() => setFontFamily('serif')}
                className={`py-1.5 rounded-xl text-xs font-serif italic border transition-colors cursor-pointer ${
                  fontFamily === 'serif' ? 'bg-blue-900 text-white' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Classic Serif
              </button>
              <button
                onClick={() => setFontFamily('sans')}
                className={`py-1.5 rounded-xl text-xs font-sans font-semibold border transition-colors cursor-pointer ${
                  fontFamily === 'sans' ? 'bg-blue-900 text-white' : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                Modern Sans
              </button>
            </div>

            {/* Font Size & Alignment */}
            <div className="flex items-center gap-4 text-xs">
              <div className="flex-1 flex items-center gap-2">
                <span className="text-slate-500 font-semibold">Size:</span>
                <input
                  type="range"
                  min="16"
                  max="38"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="flex-1 accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-slate-600 dark:text-slate-300">{fontSize}px</span>
              </div>

              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <button
                  onClick={() => setTextAlign('center')}
                  className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                    textAlign === 'center' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Center
                </button>
                <button
                  onClick={() => setTextAlign('left')}
                  className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                    textAlign === 'left' ? 'bg-white dark:bg-slate-700 shadow-sm' : 'text-slate-500'
                  }`}
                >
                  Left
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: HIGH RESOLUTION PREVIEW BEFORE SAVING */}
      {isPreviewModalOpen && previewDataUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
                  <Eye className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    Full Resolution Image Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {previewDims.label} • {previewDims.width} × {previewDims.height} px • {!showWatermark && !showBrandingFooter ? 'Clean (No Watermark)' : 'Branding Active'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsPreviewModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Preview Canvas Render */}
            <div className="flex-1 min-h-[300px] overflow-auto flex items-center justify-center p-3 bg-slate-950/90 rounded-2xl border border-slate-800 shadow-inner">
              <img
                src={previewDataUrl}
                alt="Scripture Graphic Preview"
                className="max-h-[55vh] max-w-full rounded-xl object-contain shadow-2xl"
              />
            </div>

            {/* Preview Action Bar */}
            <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>Zero Watermarks • Ready for Social Media</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleShareImage}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-blue-600" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => {
                    handleExportImage(exportFormat);
                    setIsPreviewModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-900/25 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-amber-400" />
                  <span>Download {exportFormat.toUpperCase()} ({previewDims.width}×{previewDims.height})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: VIDEO REEL PREVIEW */}
      {isVideoModalOpen && renderedVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-500 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                    Video Reel Preview
                  </h3>
                  <p className="text-[11px] text-slate-500">{verseReference}</p>
                </div>
              </div>
              <button
                onClick={() => setIsVideoModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative rounded-2xl overflow-hidden bg-black aspect-[9/16] max-h-[50vh] mx-auto shadow-inner flex items-center justify-center">
              <video
                src={renderedVideoUrl}
                controls
                autoPlay
                loop
                playsInline
                className="w-full h-full object-contain"
              />
            </div>

            {/* Video Modal Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleShareRenderedVideo}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-blue-600" />
                <span>Share Reel</span>
              </button>

              <button
                onClick={handleSaveRenderedVideo}
                className="flex-1 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-900/20 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Save Video</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: FULL SCRIPTURE PASSAGE PICKER */}
      {isVersePickerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[85vh] flex flex-col border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-900 text-white">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif font-bold text-base">Select Bible Passage for Graphic</h3>
              </div>
              <button
                onClick={() => setIsVersePickerOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Book & Chapter Selectors */}
            <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200 dark:border-slate-800">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Book</label>
                <select
                  value={pickerBook}
                  onChange={(e) => {
                    setPickerBook(e.target.value);
                    setPickerChapter(1);
                  }}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {BIBLE_BOOKS.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name} ({b.swName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Chapter</label>
                <select
                  value={pickerChapter}
                  onChange={(e) => setPickerChapter(parseInt(e.target.value, 10))}
                  className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {Array.from(
                    { length: findBook(pickerBook)?.chaptersCount || 28 },
                    (_, i) => i + 1
                  ).map((ch) => (
                    <option key={ch} value={ch}>
                      Chapter {ch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Verses List */}
            <div className="p-4 flex-1 overflow-y-auto space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Select Verse ({pickerBook} Chapter {pickerChapter}):
              </span>
              {isLoadingPickerVerses ? (
                <div className="py-12 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-900 border-t-amber-400 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Loading verses...</p>
                </div>
              ) : pickerVerses.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-500">
                  No verses available for this chapter.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {pickerVerses.map((v) => (
                    <button
                      key={v.verse}
                      onClick={() => {
                        setSelectedVerse(v);
                        setIsVersePickerOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-xl text-left border text-xs transition-colors flex items-start gap-2.5 cursor-pointer ${
                        selectedVerse.book === v.book &&
                        selectedVerse.chapter === v.chapter &&
                        selectedVerse.verse === v.verse
                          ? 'border-amber-400 bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="font-bold text-blue-900 dark:text-amber-400 shrink-0">
                        {v.verse}
                      </span>
                      <p className="line-clamp-2 text-slate-800 dark:text-slate-200">
                        {activeLang === 'en' ? v.enText : (v.swText || v.enText)}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
