import React, { useState } from 'react';
import { VerseData, Language } from '../types/bible';
import { VERIFIED_SCRIPTURES } from '../data/bibleData';
import { findBook } from '../data/bibleBooks';
import {
  Sparkles,
  ExternalLink,
  Search,
  BookOpen,
  Send,
  Copy,
  Check,
  Video,
  Globe,
  HelpCircle,
  Shield,
  Layers,
} from 'lucide-react';

interface OnlineResearchScreenProps {
  initialVerse?: VerseData | null;
  activeLanguage: Language;
}

export const OnlineResearchScreen: React.FC<OnlineResearchScreenProps> = ({
  initialVerse,
  activeLanguage,
}) => {
  const [selectedVerse, setSelectedVerse] = useState<VerseData>(() => {
    return initialVerse || VERIFIED_SCRIPTURES[0];
  });

  const [question, setQuestion] = useState('What does this verse mean in its biblical context?');
  const [isLoading, setIsLoading] = useState(false);
  const [studyResponse, setStudyResponse] = useState<string | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [searchWebQuery, setSearchWebQuery] = useState('');

  const isEn = activeLanguage === 'en';
  const bookInfo = findBook(selectedVerse.book);
  const refText = isEn
    ? `${selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse} (NKJV)`
    : `${bookInfo?.swName || selectedVerse.book} ${selectedVerse.chapter}:${selectedVerse.verse} (SUV)`;
  const verseText = isEn ? selectedVerse.enText : selectedVerse.swText;

  // Preset Questions from User Request Section 9
  const SUGGESTED_QUESTIONS = [
    'What does this verse mean?',
    'Explain this passage in its biblical context.',
    'What other Bible verses discuss this topic?',
    'What lessons can Christians learn from this passage?',
    'Prepare a Bible study outline based on this chapter.',
    isEn ? 'Explain this verse in simple English.' : 'Eleza aya hii kwa Kiswahili rahisi.',
  ];

  const handleAskAssistant = async () => {
    if (!question.trim()) return;
    setIsLoading(true);
    setStudyResponse(null);

    try {
      const res = await fetch('/api/ai-study', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          verseRef: refText,
          verseText,
          language: activeLanguage,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setStudyResponse(data.content);
      } else {
        setStudyResponse(
          'Unable to reach AI assistant at this moment. You can still use the "Open in ChatGPT" button below with your prepared passage!'
        );
      }
    } catch (err) {
      console.warn('AI study fetch error:', err);
      setStudyResponse(
        'Offline or network error. Please check your internet connection or use the offline study notes.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChatGPT = () => {
    const promptForChatGPT = `Please provide a reverent, biblically grounded Christian study analysis on the following Scripture:

Passage: ${refText}
Text: "${verseText}"

Question: ${question}

Please explain the original language context, key theological themes, and practical Christian application.`;

    navigator.clipboard.writeText(promptForChatGPT);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 3000);

    // Open ChatGPT in a new tab with query encoded
    const encoded = encodeURIComponent(promptForChatGPT);
    window.open(`https://chatgpt.com/?q=${encoded}`, '_blank');
  };

  const handleSearchWeb = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchWebQuery.trim()) return;
    const query = encodeURIComponent(`Christian Bible commentary study ${searchWebQuery}`);
    window.open(`https://www.google.com/search?q=${query}`, '_blank');
  };

  const handleOpenYouTubeTeachings = () => {
    const q = encodeURIComponent(`Sermon exposition ${selectedVerse.book} ${selectedVerse.chapter}`);
    window.open(`https://www.youtube.com/results?search_query=${q}`, '_blank');
  };

  const TRUSTED_CHRISTIAN_RESOURCES = [
    {
      name: 'Blue Letter Bible',
      desc: 'Interlinear Hebrew & Greek texts, Strong\'s Concordance, and audio pronunciations.',
      url: `https://www.blueletterbible.org/search/search.cfm?Criteria=${encodeURIComponent(
        selectedVerse.book + ' ' + selectedVerse.chapter
      )}`,
      badge: 'Original Languages',
    },
    {
      name: 'BibleHub Commentaries',
      desc: 'Verse-by-verse classic commentaries by Matthew Henry, Albert Barnes, and John Gill.',
      url: `https://biblehub.com/commentaries/${selectedVerse.book.toLowerCase()}/${selectedVerse.chapter}-${selectedVerse.verse}.htm`,
      badge: 'Commentaries',
    },
    {
      name: 'BibleGateway Parallel',
      desc: 'Compare multiple Bible translations side-by-side (NKJV, NIV, ESV, KJV).',
      url: `https://www.biblegateway.com/passage/?search=${encodeURIComponent(
        selectedVerse.book + ' ' + selectedVerse.chapter + ':' + selectedVerse.verse
      )}&version=NKJV`,
      badge: 'Translations',
    },
    {
      name: 'GotQuestions.org',
      desc: 'Biblically answered answers to over 700,000 theological and life questions.',
      url: `https://www.gotquestions.org/search.php?zoom_query=${encodeURIComponent(
        selectedVerse.book + ' ' + selectedVerse.chapter
      )}`,
      badge: 'Q&A Answers',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-blue-900 text-amber-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="font-serif font-bold text-xl sm:text-2xl text-blue-950 dark:text-amber-400">
              Online Bible Research & AI Study
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Grounded theological analysis, commentary resources, Greek/Hebrew concordances, and ChatGPT study integration
          </p>
        </div>

        {/* Selected passage indicator */}
        <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs">
          <span className="text-[10px] text-amber-800 dark:text-amber-300 font-semibold block uppercase">
            Active Study Passage:
          </span>
          <span className="font-serif font-bold text-slate-900 dark:text-white">
            {refText}
          </span>
        </div>
      </div>

      {/* Theological Disclaimer Notice (Mandatory Section 9) */}
      <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-700 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-900 dark:text-blue-200 leading-relaxed">
          <strong>Theological Integrity Notice:</strong> Bible text is the inspired, authoritative Word of God. All commentaries, articles, and AI-generated insights are educational research aids and must always be examined against the clear light of Scripture.
        </p>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: AI Bible Study Assistant */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-900 dark:text-amber-400" />
                <span>Scripture Study Assistant</span>
              </h3>
              <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                Bilingual
              </span>
            </div>

            {/* Selected Verse Preview Card */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="font-semibold text-blue-900 dark:text-amber-400 mr-1.5">
                {refText}:
              </span>
              <span className="font-serif italic text-slate-700 dark:text-slate-300">
                "{verseText}"
              </span>
            </div>

            {/* Suggested Question Chips */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
                Suggested Study Questions:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTED_QUESTIONS.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => setQuestion(q)}
                    className={`text-xs px-2.5 py-1.5 rounded-xl border transition-colors text-left ${
                      question === q
                        ? 'bg-blue-900 text-white border-blue-900 font-medium'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Input Field */}
            <div className="space-y-2">
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask any question about this passage..."
                className="w-full text-xs p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none leading-relaxed"
              />

              <div className="flex items-center justify-between gap-2 pt-1">
                {/* Open in ChatGPT Button */}
                <button
                  type="button"
                  onClick={handleOpenChatGPT}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                  title="Copy question and open ChatGPT in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{copiedPrompt ? 'Copied & Opening...' : 'Open ChatGPT'}</span>
                </button>

                {/* Submit to in-app Assistant */}
                <button
                  type="button"
                  onClick={handleAskAssistant}
                  disabled={isLoading || !question.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-blue-900/20 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isLoading ? 'Studying...' : 'Study Passage'}</span>
                </button>
              </div>
            </div>

            {/* Study Results Area */}
            {isLoading && (
              <div className="p-6 text-center space-y-2">
                <div className="w-6 h-6 border-2 border-blue-900 border-t-amber-400 rounded-full animate-spin mx-auto" />
                <p className="text-xs text-slate-500">
                  Synthesizing biblical context and cross-references...
                </p>
              </div>
            )}

            {studyResponse && !isLoading && (
              <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line animate-fade-in">
                {studyResponse}
              </div>
            )}
          </div>
        </div>

        {/* Right: Trusted Online Bible Research Links */}
        <div className="lg:col-span-5 space-y-5">
          {/* Web Bible Search */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <span>Search Online Bible Resources</span>
            </h3>

            <form onSubmit={handleSearchWeb} className="flex gap-2">
              <input
                type="text"
                value={searchWebQuery}
                onChange={(e) => setSearchWebQuery(e.target.value)}
                placeholder="Search topic or Greek/Hebrew term..."
                className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>

            <button
              onClick={handleOpenYouTubeTeachings}
              className="w-full py-2 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Video className="w-4 h-4 text-red-600" />
              <span>Watch YouTube Sermons for {selectedVerse.book} {selectedVerse.chapter}</span>
            </button>
          </div>

          {/* Directory of Trusted Christian Research Sites */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
              Trusted Study Libraries
            </h3>

            <div className="space-y-2.5">
              {TRUSTED_CHRISTIAN_RESOURCES.map((res, i) => (
                <a
                  key={i}
                  href={res.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/30 border border-slate-200/80 dark:border-slate-800 transition-colors group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-xs text-blue-950 dark:text-white group-hover:text-blue-600 transition-colors">
                      {res.name}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-white dark:bg-slate-800 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                      {res.badge}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {res.desc}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
