import React, { useState } from 'react';
import {
  HighlightRecord,
  BookmarkRecord,
  NoteRecord,
  ReadingPlan,
  PrayerRecord,
  ReadingHistoryItem,
  Language,
} from '../types/bible';
import { findBook } from '../data/bibleBooks';
import {
  Highlighter,
  Bookmark,
  FileText,
  Calendar,
  HeartHandshake,
  History,
  Trash2,
  CheckCircle2,
  Plus,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface LibraryScreenProps {
  activeLanguage: Language;
  highlights: HighlightRecord[];
  onDeleteHighlight: (id: string) => void;
  bookmarks: BookmarkRecord[];
  onDeleteBookmark: (id: string) => void;
  notes: NoteRecord[];
  onDeleteNote: (id: string) => void;
  readingPlans: ReadingPlan[];
  onTogglePlanDay: (planId: string, dayNum: number) => void;
  prayers: PrayerRecord[];
  onSavePrayer: (prayer: PrayerRecord) => void;
  onDeletePrayer: (id: string) => void;
  readingHistory: ReadingHistoryItem[];
  onSelectPassage: (book: string, chapter: number, verse?: number) => void;
}

export const LibraryScreen: React.FC<LibraryScreenProps> = ({
  activeLanguage,
  highlights,
  onDeleteHighlight,
  bookmarks,
  onDeleteBookmark,
  notes,
  onDeleteNote,
  readingPlans,
  onTogglePlanDay,
  prayers,
  onSavePrayer,
  onDeletePrayer,
  readingHistory,
  onSelectPassage,
}) => {
  const [activeTab, setActiveTab] = useState<'highlights' | 'notes' | 'bookmarks' | 'plans' | 'prayers' | 'history'>('highlights');
  const [colorFilter, setColorFilter] = useState<string>('ALL');

  // Prayer form modal state
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [newPrayerTitle, setNewPrayerTitle] = useState('');
  const [newPrayerRequest, setNewPrayerRequest] = useState('');
  const [newPrayerScripture, setNewPrayerScripture] = useState('');

  // Praise report modal
  const [answeringPrayerId, setAnsweringPrayerId] = useState<string | null>(null);
  const [praiseText, setPraiseText] = useState('');

  const isEn = activeLanguage === 'en';

  const filteredHighlights = colorFilter === 'ALL'
    ? highlights
    : highlights.filter((h) => h.color === colorFilter);

  const handleAddPrayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayerTitle.trim()) return;

    const newPrayer: PrayerRecord = {
      id: `prayer_${Date.now()}`,
      title: newPrayerTitle.trim(),
      request: newPrayerRequest.trim(),
      scriptureRef: newPrayerScripture.trim() || undefined,
      dateCreated: new Date().toISOString(),
      status: 'praying',
    };

    onSavePrayer(newPrayer);
    setNewPrayerTitle('');
    setNewPrayerRequest('');
    setNewPrayerScripture('');
    setIsPrayerModalOpen(false);
  };

  const handleMarkPrayerAnswered = (prayer: PrayerRecord) => {
    const updated: PrayerRecord = {
      ...prayer,
      status: 'answered',
      answeredDate: new Date().toISOString(),
      praiseReport: praiseText.trim() || 'Praise God! The Lord answered this prayer faithfully.',
    };
    onSavePrayer(updated);
    setAnsweringPrayerId(null);
    setPraiseText('');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Title */}
      <div>
        <h1 className="font-serif font-bold text-xl sm:text-2xl text-blue-950 dark:text-amber-400">
          {isEn ? 'Personal Bible Library' : 'Maktaba ya Kibinafsi'}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {isEn
            ? 'Highlights, study notes, prayer journal, reading plans, and history'
            : 'Mstari iliyotiwa alama, madokezo, shajara ya maombi, na ratiba za kusoma'}
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 gap-1">
        {[
          { id: 'highlights', label: isEn ? 'Highlights' : 'Mstari ya Rangi', icon: Highlighter },
          { id: 'notes', label: isEn ? 'Notes' : 'Madokezo', icon: FileText },
          { id: 'bookmarks', label: isEn ? 'Bookmarks' : 'Alamisho', icon: Bookmark },
          { id: 'plans', label: isEn ? 'Reading Plans' : 'Ratiba', icon: Calendar },
          { id: 'prayers', label: isEn ? 'Prayer Journal' : 'Maombi', icon: HeartHandshake },
          { id: 'history', label: isEn ? 'History' : 'Historia', icon: History },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: HIGHLIGHTS */}
      {activeTab === 'highlights' && (
        <div className="space-y-4">
          {/* Color filter pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setColorFilter('ALL')}
              className={`px-3 py-1 rounded-xl font-medium transition-colors ${
                colorFilter === 'ALL' ? 'bg-blue-900 text-white' : 'bg-slate-100 dark:bg-slate-800'
              }`}
            >
              All Colors ({highlights.length})
            </button>
            {['yellow', 'green', 'blue', 'pink', 'purple', 'orange'].map((col) => (
              <button
                key={col}
                onClick={() => setColorFilter(col)}
                className={`px-2.5 py-1 rounded-xl capitalize font-medium transition-colors ${
                  colorFilter === col ? 'ring-2 ring-blue-900 font-bold' : ''
                } ${
                  col === 'yellow' ? 'bg-amber-200 text-amber-900' :
                  col === 'green' ? 'bg-emerald-200 text-emerald-900' :
                  col === 'blue' ? 'bg-sky-200 text-sky-900' :
                  col === 'pink' ? 'bg-pink-200 text-pink-900' :
                  col === 'purple' ? 'bg-purple-200 text-purple-900' : 'bg-orange-200 text-orange-900'
                }`}
              >
                {col}
              </button>
            ))}
          </div>

          {filteredHighlights.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Highlighter className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isEn ? 'No highlights found' : 'Hakuna mistari iliyowekwa alama'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'Tap any verse in the Bible reader to choose a highlight color.' : 'Gusa mstari wowote kwenye Biblia kuchagua rangi.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {filteredHighlights.map((hl) => (
                <div
                  key={hl.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-serif font-bold text-sm text-blue-950 dark:text-amber-400">
                        {hl.book} {hl.chapter}:{hl.verse}
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-3 h-3 rounded-full ${
                            hl.color === 'yellow' ? 'bg-amber-400' :
                            hl.color === 'green' ? 'bg-emerald-500' :
                            hl.color === 'blue' ? 'bg-sky-400' :
                            hl.color === 'pink' ? 'bg-pink-400' :
                            hl.color === 'purple' ? 'bg-purple-400' : 'bg-orange-400'
                          }`}
                        />
                        <button
                          onClick={() => onDeleteHighlight(hl.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {hl.note && (
                      <p className="text-xs italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-2 rounded-xl mb-2">
                        "{hl.note}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectPassage(hl.book, hl.chapter, hl.verse)}
                    className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-end"
                  >
                    <span>Read Verse</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: NOTES */}
      {activeTab === 'notes' && (
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isEn ? 'No study notes yet' : 'Hakuna madokezo ya somo bado'}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                {isEn ? 'Tap any verse and select "Add Study Note" to record your reflections.' : 'Gusa mstari na uchague "Ongeza Dokezo" kurekodi tafakari yako.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-serif font-bold text-sm text-blue-900 dark:text-amber-400">
                        {n.book} {n.chapter}:{n.verse}
                      </span>
                      <button
                        onClick={() => onDeleteNote(n.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-semibold text-xs text-slate-800 dark:text-slate-200 mb-1">
                      {n.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line mb-3">
                      {n.content}
                    </p>

                    {n.tags && n.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {n.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-medium"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => onSelectPassage(n.book, n.chapter, n.verse)}
                    className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-end"
                  >
                    <span>Open in Bible</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: BOOKMARKS */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-4">
          {bookmarks.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <Bookmark className="w-8 h-8 text-slate-400 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                {isEn ? 'No bookmarks saved' : 'Hakuna alamisho zilizohifadhiwa'}
              </p>
            </div>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {bookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between"
                >
                  <div
                    onClick={() => onSelectPassage(bm.book, bm.chapter, bm.verse)}
                    className="flex-1 cursor-pointer"
                  >
                    <span className="font-serif font-bold text-sm text-blue-900 dark:text-amber-400 block">
                      {bm.book} {bm.chapter}:{bm.verse}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {bm.label || 'Saved Bookmarked Verse'}
                    </span>
                  </div>

                  <button
                    onClick={() => onDeleteBookmark(bm.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: READING PLANS */}
      {activeTab === 'plans' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {readingPlans.map((plan) => {
              const progressPct = Math.round(
                (plan.completedDays.length / plan.totalDays) * 100
              );
              return (
                <div
                  key={plan.id}
                  className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
                >
                  <div>
                    <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                      {isEn ? plan.title : plan.titleSw}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {isEn ? plan.description : plan.descriptionSw}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span>Progress</span>
                      <span className="font-semibold text-blue-900 dark:text-blue-300">
                        {plan.completedDays.length}/{plan.totalDays} Days ({progressPct}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-900 to-amber-400 transition-all duration-500"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Days list snippet */}
                  <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto">
                    {plan.days.map((day) => {
                      const isDone = plan.completedDays.includes(day.day);
                      return (
                        <div
                          key={day.day}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                        >
                          <div
                            onClick={() => onSelectPassage(day.book, day.chapter)}
                            className="cursor-pointer truncate pr-2 hover:text-blue-600"
                          >
                            <span className="font-semibold text-slate-800 dark:text-slate-200">
                              Day {day.day}: {day.title}
                            </span>
                            <span className="block text-[10px] text-slate-500">
                              {day.scriptureRef}
                            </span>
                          </div>

                          <button
                            onClick={() => onTogglePlanDay(plan.id, day.day)}
                            className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'border border-slate-300 dark:border-slate-600 text-slate-300'
                            }`}
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: PRAYER JOURNAL */}
      {activeTab === 'prayers' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {prayers.filter((p) => p.status === 'praying').length} Active Petitions •{' '}
              {prayers.filter((p) => p.status === 'answered').length} Answered Prayers
            </span>
            <button
              onClick={() => setIsPrayerModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isEn ? 'New Prayer' : 'Ombi Jipya'}</span>
            </button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {prayers.map((prayer) => {
              const isAnswered = prayer.status === 'answered';
              return (
                <div
                  key={prayer.id}
                  className={`p-4 rounded-2xl border shadow-sm flex flex-col justify-between transition-all ${
                    isAnswered
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          isAnswered
                            ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                            : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {isAnswered ? 'Answered' : 'Praying'}
                      </span>
                      <button
                        onClick={() => onDeletePrayer(prayer.id)}
                        className="text-slate-400 hover:text-red-500"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">
                      {prayer.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                      {prayer.request}
                    </p>

                    {prayer.scriptureRef && (
                      <span className="inline-block text-[10px] font-semibold text-blue-700 dark:text-blue-300 mb-2">
                        📖 {prayer.scriptureRef}
                      </span>
                    )}

                    {isAnswered && prayer.praiseReport && (
                      <div className="mt-2 p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-800 text-xs">
                        <span className="font-bold text-emerald-700 dark:text-emerald-400 block mb-0.5">
                          Praise Report & Testimony:
                        </span>
                        <p className="text-slate-700 dark:text-slate-300 italic">
                          "{prayer.praiseReport}"
                        </p>
                      </div>
                    )}
                  </div>

                  {!isAnswered && (
                    <button
                      onClick={() => setAnsweringPrayerId(prayer.id)}
                      className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1 hover:underline"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Mark Answered & Add Praise Report</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB CONTENT: READING HISTORY */}
      {activeTab === 'history' && (
        <div className="space-y-2">
          {readingHistory.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectPassage(item.book, item.chapter)}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs cursor-pointer hover:border-blue-500 transition-colors"
            >
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {item.book} Chapter {item.chapter}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {new Date(item.timestamp).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* New Prayer Modal */}
      {isPrayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white">
              Add New Prayer Request
            </h3>
            <form onSubmit={handleAddPrayerSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newPrayerTitle}
                  onChange={(e) => setNewPrayerTitle(e.target.value)}
                  placeholder="e.g. Healing for Mom, Guidance in College"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Prayer Petition Details
                </label>
                <textarea
                  rows={3}
                  required
                  value={newPrayerRequest}
                  onChange={(e) => setNewPrayerRequest(e.target.value)}
                  placeholder="Pour out your heart before the Lord..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Anchoring Scripture (Optional)
                </label>
                <input
                  type="text"
                  value={newPrayerScripture}
                  onChange={(e) => setNewPrayerScripture(e.target.value)}
                  placeholder="e.g. Philippians 4:6-7"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPrayerModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-semibold shadow-sm"
                >
                  Save Petition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Answered Prayer Testimony Modal */}
      {answeringPrayerId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="font-serif font-bold text-base text-emerald-800 dark:text-emerald-400">
              Record Testimony & Praise Report!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Give glory to God for how He answered this prayer:
            </p>
            <textarea
              rows={3}
              value={praiseText}
              onChange={(e) => setPraiseText(e.target.value)}
              placeholder="Write your praise report here..."
              className="w-full text-xs p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white resize-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAnsweringPrayerId(null)}
                className="px-4 py-2 text-slate-600 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  const p = prayers.find((x) => x.id === answeringPrayerId);
                  if (p) handleMarkPrayerAnswered(p);
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-sm"
              >
                Save Praise Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
