import React, { useState } from 'react';
import { VerseData } from '../types/bible';
import { X, Save, Tag } from 'lucide-react';

interface NoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  verse: VerseData | null;
  onSaveNote: (title: string, content: string, tags: string[]) => void;
  initialTitle?: string;
  initialContent?: string;
  initialTags?: string[];
  activeLanguage: 'en' | 'sw';
}

export const NoteDialog: React.FC<NoteDialogProps> = ({
  isOpen,
  onClose,
  verse,
  onSaveNote,
  initialTitle = '',
  initialContent = '',
  initialTags = [],
  activeLanguage,
}) => {
  const [title, setTitle] = useState(initialTitle || (verse ? `${verse.book} ${verse.chapter}:${verse.verse} Study Note` : ''));
  const [content, setContent] = useState(initialContent);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initialTags);

  if (!isOpen || !verse) return null;

  const isEn = activeLanguage === 'en';

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = () => {
    if (!content.trim()) return;
    onSaveNote(title || `${verse.book} ${verse.chapter}:${verse.verse}`, content, tags);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-blue-950 text-white">
          <div>
            <h3 className="font-serif font-bold text-base">
              {isEn ? 'Add Personal Study Note' : 'Ongeza Dokezo la Somo'}
            </h3>
            <p className="text-xs text-blue-200/80">
              {verse.book} {verse.chapter}:{verse.verse}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Title / Theme' : 'Kichwa cha Dokezo'}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isEn ? 'e.g. God\'s unmerited favor' : 'mf. Neema isiyostahiliwa ya Mungu'}
              className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Note Content & Personal Reflection' : 'Maelezo na Tafakari Binafsi'}
            </label>
            <textarea
              rows={5}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={isEn ? 'Write what the Holy Spirit is ministering to your heart through this passage...' : 'Andika kile Roho Mtakatifu anachokufundisha kupitia kifungu hiki...'}
              className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {isEn ? 'Tags / Topics' : 'Lebo / Mada'}
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder={isEn ? 'Add tag (e.g. Grace, Prayer)...' : 'Ongeza lebo (mf. Neema, Maombi)...'}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium"
              >
                +
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900"
                  >
                    #{t}
                    <button
                      onClick={() => handleRemoveTag(t)}
                      className="text-blue-600 dark:text-blue-400 hover:text-red-500 ml-1"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
          >
            {isEn ? 'Cancel' : 'Ghairi'}
          </button>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isEn ? 'Save Note' : 'Hifadhi Dokezo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
