import React, { useState } from 'react';
import { VerseData, HighlightColor, Language } from '../types/bible';
import { findBook } from '../data/bibleBooks';
import { formatVerseForShare, formatSocialQuote } from '../utils/bibleEngine';
import {
  X,
  Highlighter,
  Copy,
  Share2,
  Bookmark,
  FileText,
  Video,
  Sparkles,
  Volume2,
  Check,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';

interface VerseActionModalProps {
  verse: VerseData | null;
  onClose: () => void;
  activeLanguage: Language;
  onSetHighlight: (color: HighlightColor) => void;
  onRemoveHighlight: () => void;
  currentHighlightColor?: HighlightColor;
  onBookmark: () => void;
  isBookmarked: boolean;
  onOpenNoteDialog: () => void;
  onCreateReel: () => void;
  onAskAI: () => void;
  onSpeakVerse: () => void;
  translationEn: string;
  translationSw: string;
}

const HIGHLIGHT_COLORS: { id: HighlightColor; label: string; bgClass: string; borderClass: string }[] = [
  { id: 'yellow', label: 'Yellow', bgClass: 'bg-amber-300', borderClass: 'border-amber-400' },
  { id: 'green', label: 'Green', bgClass: 'bg-emerald-400', borderClass: 'border-emerald-500' },
  { id: 'blue', label: 'Blue', bgClass: 'bg-sky-400', borderClass: 'border-sky-500' },
  { id: 'pink', label: 'Pink', bgClass: 'bg-pink-400', borderClass: 'border-pink-500' },
  { id: 'purple', label: 'Purple', bgClass: 'bg-purple-400', borderClass: 'border-purple-500' },
  { id: 'orange', label: 'Orange', bgClass: 'bg-orange-400', borderClass: 'border-orange-500' },
];

export const VerseActionModal: React.FC<VerseActionModalProps> = ({
  verse,
  onClose,
  activeLanguage,
  onSetHighlight,
  onRemoveHighlight,
  currentHighlightColor,
  onBookmark,
  isBookmarked,
  onOpenNoteDialog,
  onCreateReel,
  onAskAI,
  onSpeakVerse,
  translationEn,
  translationSw,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!verse) return null;

  const bookInfo = findBook(verse.book);
  const refEn = `${verse.book} ${verse.chapter}:${verse.verse}`;
  const refSw = `${bookInfo?.swName || verse.book} ${verse.chapter}:${verse.verse}`;
  const isEn = activeLanguage === 'en';

  const handleCopy = (mode: 'en' | 'sw' | 'both') => {
    const text = formatVerseForShare(verse, mode, translationEn, translationSw);
    navigator.clipboard.writeText(text);
    setCopiedType(mode);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleNativeShare = async () => {
    const text = formatVerseForShare(verse, 'both', translationEn, translationSw);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NKJV Bible — ${refEn}`,
          text,
        });
      } catch (e) {
        console.warn('Share dismissed:', e);
      }
    } else {
      handleCopy('both');
    }
  };

  const handleWhatsAppShare = () => {
    const text = formatVerseForShare(verse, isEn ? 'en' : 'sw', translationEn, translationSw);
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleCopySocialTemplate = () => {
    const quote = formatSocialQuote(verse, activeLanguage);
    navigator.clipboard.writeText(quote);
    setCopiedType('social');
    setTimeout(() => setCopiedType(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        {/* Drag handle on mobile */}
        <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Header */}
        <div className="px-5 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-blue-950 dark:text-amber-400">
              {refEn}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({refSw})
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Verse preview in modal */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 space-y-1.5 max-h-36 overflow-y-auto">
          <p className="font-serif italic leading-relaxed">
            <span className="font-semibold text-blue-900 dark:text-blue-300 mr-1">[EN - {translationEn}]</span>
            "{verse.enText}"
          </p>
          <p className="font-serif italic text-slate-600 dark:text-slate-400 leading-relaxed">
            <span className="font-semibold text-emerald-800 dark:text-emerald-400 mr-1">[SW - {translationSw}]</span>
            "{verse.swText}"
          </p>
        </div>

        {/* Action Body */}
        <div className="p-5 overflow-y-auto space-y-5">
          {/* Section: Multicolour Highlighting */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Highlighter className="w-3.5 h-3.5" />
                {isEn ? 'Highlight Verse' : 'Weka Alama (Rangi)'}
              </span>
              {currentHighlightColor && (
                <button
                  onClick={onRemoveHighlight}
                  className="text-[11px] text-red-600 dark:text-red-400 font-medium hover:underline"
                >
                  {isEn ? 'Remove Highlight' : 'Ondoa Rangi'}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2.5">
              {HIGHLIGHT_COLORS.map((col) => {
                const isSelected = currentHighlightColor === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => onSetHighlight(col.id)}
                    className={`flex-1 h-9 rounded-xl ${col.bgClass} border ${col.borderClass} flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-sm relative`}
                    title={col.label}
                  >
                    {isSelected && (
                      <Check className="w-4 h-4 text-slate-900 stroke-[3px]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Quick Interactive Primary Buttons */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Create Reel / Graphic */}
            <button
              onClick={() => {
                onClose();
                onCreateReel();
              }}
              className="p-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-xs flex items-center gap-2 justify-center shadow-md shadow-amber-500/20 active:scale-[0.98] transition-transform"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>{isEn ? 'Create Reel / Image' : 'Tengeneza Reel / Picha'}</span>
            </button>

            {/* AI Bible Study Assistant */}
            <button
              onClick={() => {
                onClose();
                onAskAI();
              }}
              className="p-3 rounded-2xl bg-blue-900 hover:bg-blue-800 text-white font-semibold text-xs flex items-center gap-2 justify-center shadow-md shadow-blue-900/20 active:scale-[0.98] transition-transform"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>{isEn ? 'Study with AI' : 'Jifunze na AI'}</span>
            </button>
          </div>

          {/* Section: Verse Actions List */}
          <div className="space-y-1.5">
            {/* Read Aloud */}
            <button
              onClick={() => {
                onClose();
                onSpeakVerse();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{isEn ? 'Listen (Read Aloud)' : 'Sikiliza (Soma kwa Sauti)'}</span>
              </div>
            </button>

            {/* Add Note */}
            <button
              onClick={() => {
                onClose();
                onOpenNoteDialog();
              }}
              className="w-full px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span>{isEn ? 'Add Personal Study Note' : 'Ongeza Dokezo Binafsi'}</span>
              </div>
            </button>

            {/* Bookmark */}
            <button
              onClick={onBookmark}
              className="w-full px-3.5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-medium flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : 'text-slate-500'}`} />
                <span>{isBookmarked ? (isEn ? 'Bookmarked' : 'Imehifadhiwa') : (isEn ? 'Bookmark Verse' : 'Weka Alamisho')}</span>
              </div>
              {isBookmarked && <span className="text-[10px] text-amber-600 font-semibold">Active</span>}
            </button>
          </div>

          {/* Section: Copy & Share Options */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              {isEn ? 'Copy & Share' : 'Nakili na Shiriki'}
            </span>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <button
                onClick={() => handleCopy('en')}
                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center transition-colors truncate"
              >
                {copiedType === 'en' ? 'Copied!' : 'Copy English'}
              </button>
              <button
                onClick={() => handleCopy('sw')}
                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center transition-colors truncate"
              >
                {copiedType === 'sw' ? 'Copied!' : 'Copy Swahili'}
              </button>
              <button
                onClick={() => handleCopy('both')}
                className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium text-center transition-colors truncate"
              >
                {copiedType === 'both' ? 'Copied!' : 'Copy Both'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleNativeShare}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isEn ? 'Share...' : 'Shiriki...'}</span>
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Share to WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                onClick={handleCopySocialTemplate}
                className="py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                title="Copy ready-to-post Social template"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedType === 'social' ? 'Copied' : 'Post'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
