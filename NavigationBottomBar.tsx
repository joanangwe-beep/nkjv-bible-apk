import React from 'react';
import { Home, BookOpen, Search, Video, Sparkles, Bookmark, Settings } from 'lucide-react';

export type NavTab = 'home' | 'bible' | 'search' | 'reels' | 'research' | 'library' | 'settings';

interface NavigationBottomBarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  activeLanguage: 'en' | 'sw';
}

export const NavigationBottomBar: React.FC<NavigationBottomBarProps> = ({
  currentTab,
  onSelectTab,
  activeLanguage,
}) => {
  const isEn = activeLanguage === 'en';

  const tabs: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: isEn ? 'Home' : 'Nyumbani', icon: Home },
    { id: 'bible', label: isEn ? 'Bible' : 'Biblia', icon: BookOpen },
    { id: 'search', label: isEn ? 'Search' : 'Tafuta', icon: Search },
    { id: 'reels', label: isEn ? 'Studio' : 'Studio', icon: Video },
    { id: 'research', label: isEn ? 'Research' : 'Utafiti', icon: Sparkles },
    { id: 'library', label: isEn ? 'Library' : 'Maktaba', icon: Bookmark },
    { id: 'settings', label: isEn ? 'Settings' : 'Mipangilio', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-lg">
      <div className="max-w-lg mx-auto grid grid-cols-7 h-16 items-center px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] relative group transition-colors"
            >
              <div
                className={`p-1.5 rounded-xl transition-all ${
                  isActive
                    ? 'text-blue-900 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.4px]' : 'stroke-[1.8px]'}`} />
              </div>
              <span
                className={`text-[10px] font-medium tracking-tight mt-0.5 whitespace-nowrap truncate max-w-full px-1 ${
                  isActive
                    ? 'text-blue-950 dark:text-blue-400 font-semibold'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-1 w-6 h-0.5 rounded-full bg-blue-900 dark:bg-blue-400" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
