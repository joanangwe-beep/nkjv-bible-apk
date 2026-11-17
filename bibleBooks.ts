import { BookInfo } from '../types/bible';

export const BIBLE_BOOKS: BookInfo[] = [
  // OLD TESTAMENT (Agano la Kale) - 39 Books
  { id: 'GEN', name: 'Genesis', swName: 'Mwanzo', abbrev: 'Gen', swAbbrev: 'Mwa', testament: 'OT', chaptersCount: 50, category: 'Law' },
  { id: 'EXO', name: 'Exodus', swName: 'Kutoka', abbrev: 'Exo', swAbbrev: 'Kut', testament: 'OT', chaptersCount: 40, category: 'Law' },
  { id: 'LEV', name: 'Leviticus', swName: 'Mambo ya Walawi', abbrev: 'Lev', swAbbrev: 'Law', testament: 'OT', chaptersCount: 27, category: 'Law' },
  { id: 'NUM', name: 'Numbers', swName: 'Hesabu', abbrev: 'Num', swAbbrev: 'Hes', testament: 'OT', chaptersCount: 36, category: 'Law' },
  { id: 'DEU', name: 'Deuteronomy', swName: 'Kumbukumbu la Torati', abbrev: 'Deu', swAbbrev: 'Kum', testament: 'OT', chaptersCount: 34, category: 'Law' },
  { id: 'JOS', name: 'Joshua', swName: 'Yoshua', abbrev: 'Jos', swAbbrev: 'Yos', testament: 'OT', chaptersCount: 24, category: 'History' },
  { id: 'JDG', name: 'Judges', swName: 'Waamuzi', abbrev: 'Jdg', swAbbrev: 'Waa', testament: 'OT', chaptersCount: 21, category: 'History' },
  { id: 'RUT', name: 'Ruth', swName: 'Ruthi', abbrev: 'Rut', swAbbrev: 'Rut', testament: 'OT', chaptersCount: 4, category: 'History' },
  { id: '1SA', name: '1 Samuel', swName: '1 Samweli', abbrev: '1Sa', swAbbrev: '1Sam', testament: 'OT', chaptersCount: 31, category: 'History' },
  { id: '2SA', name: '2 Samuel', swName: '2 Samweli', abbrev: '2Sa', swAbbrev: '2Sam', testament: 'OT', chaptersCount: 24, category: 'History' },
  { id: '1KI', name: '1 Kings', swName: '1 Wafalme', abbrev: '1Ki', swAbbrev: '1Waf', testament: 'OT', chaptersCount: 22, category: 'History' },
  { id: '2KI', name: '2 Kings', swName: '2 Wafalme', abbrev: '2Ki', swAbbrev: '2Waf', testament: 'OT', chaptersCount: 25, category: 'History' },
  { id: '1CH', name: '1 Chronicles', swName: '1 Mambo ya Nyakati', abbrev: '1Ch', swAbbrev: '1Nya', testament: 'OT', chaptersCount: 29, category: 'History' },
  { id: '2CH', name: '2 Chronicles', swName: '2 Mambo ya Nyakati', abbrev: '2Ch', swAbbrev: '2Nya', testament: 'OT', chaptersCount: 36, category: 'History' },
  { id: 'EZR', name: 'Ezra', swName: 'Ezra', abbrev: 'Ezr', swAbbrev: 'Ezr', testament: 'OT', chaptersCount: 10, category: 'History' },
  { id: 'NEH', name: 'Nehemiah', swName: 'Nehemia', abbrev: 'Neh', swAbbrev: 'Neh', testament: 'OT', chaptersCount: 13, category: 'History' },
  { id: 'EST', name: 'Esther', swName: 'Esta', abbrev: 'Est', swAbbrev: 'Est', testament: 'OT', chaptersCount: 10, category: 'History' },
  { id: 'JOB', name: 'Job', swName: 'Ayubu', abbrev: 'Job', swAbbrev: 'Ayu', testament: 'OT', chaptersCount: 42, category: 'Poetry' },
  { id: 'PSA', name: 'Psalms', swName: 'Zaburi', abbrev: 'Psa', swAbbrev: 'Zab', testament: 'OT', chaptersCount: 150, category: 'Poetry' },
  { id: 'PRO', name: 'Proverbs', swName: 'Mithali', abbrev: 'Pro', swAbbrev: 'Mit', testament: 'OT', chaptersCount: 31, category: 'Poetry' },
  { id: 'ECC', name: 'Ecclesiastes', swName: 'Mhubiri', abbrev: 'Ecc', swAbbrev: 'Mhu', testament: 'OT', chaptersCount: 12, category: 'Poetry' },
  { id: 'SNG', name: 'Song of Solomon', swName: 'Wimbo Ulio Bora', abbrev: 'Sng', swAbbrev: 'Wim', testament: 'OT', chaptersCount: 8, category: 'Poetry' },
  { id: 'ISA', name: 'Isaiah', swName: 'Isaya', abbrev: 'Isa', swAbbrev: 'Isa', testament: 'OT', chaptersCount: 66, category: 'Prophets' },
  { id: 'JER', name: 'Jeremiah', swName: 'Yeremia', abbrev: 'Jer', swAbbrev: 'Yer', testament: 'OT', chaptersCount: 52, category: 'Prophets' },
  { id: 'LAM', name: 'Lamentations', swName: 'Maombolezo', abbrev: 'Lam', swAbbrev: 'Mao', testament: 'OT', chaptersCount: 5, category: 'Prophets' },
  { id: 'EZK', name: 'Ezekiel', swName: 'Ezekieli', abbrev: 'Ezk', swAbbrev: 'Eze', testament: 'OT', chaptersCount: 48, category: 'Prophets' },
  { id: 'DAN', name: 'Daniel', swName: 'Danieli', abbrev: 'Dan', swAbbrev: 'Dan', testament: 'OT', chaptersCount: 12, category: 'Prophets' },
  { id: 'HOS', name: 'Hosea', swName: 'Hosea', abbrev: 'Hos', swAbbrev: 'Hos', testament: 'OT', chaptersCount: 14, category: 'Prophets' },
  { id: 'JOL', name: 'Joel', swName: 'Yoeli', abbrev: 'Jol', swAbbrev: 'Yoe', testament: 'OT', chaptersCount: 3, category: 'Prophets' },
  { id: 'AMO', name: 'Amos', swName: 'Amosi', abbrev: 'Amo', swAbbrev: 'Amo', testament: 'OT', chaptersCount: 9, category: 'Prophets' },
  { id: 'OBA', name: 'Obadiah', swName: 'Obadia', abbrev: 'Oba', swAbbrev: 'Oba', testament: 'OT', chaptersCount: 1, category: 'Prophets' },
  { id: 'JON', name: 'Jonah', swName: 'Yona', abbrev: 'Jon', swAbbrev: 'Yon', testament: 'OT', chaptersCount: 4, category: 'Prophets' },
  { id: 'MIC', name: 'Micah', swName: 'Mika', abbrev: 'Mic', swAbbrev: 'Mik', testament: 'OT', chaptersCount: 7, category: 'Prophets' },
  { id: 'NAM', name: 'Nahum', swName: 'Nahumu', abbrev: 'Nam', swAbbrev: 'Nah', testament: 'OT', chaptersCount: 3, category: 'Prophets' },
  { id: 'HAB', name: 'Habakkuk', swName: 'Habakuki', abbrev: 'Hab', swAbbrev: 'Hab', testament: 'OT', chaptersCount: 3, category: 'Prophets' },
  { id: 'ZEP', name: 'Zephaniah', swName: 'Sefania', abbrev: 'Zep', swAbbrev: 'Sef', testament: 'OT', chaptersCount: 3, category: 'Prophets' },
  { id: 'HAG', name: 'Haggai', swName: 'Hagai', abbrev: 'Hag', swAbbrev: 'Hag', testament: 'OT', chaptersCount: 2, category: 'Prophets' },
  { id: 'ZEC', name: 'Zechariah', swName: 'Zekaria', abbrev: 'Zec', swAbbrev: 'Zek', testament: 'OT', chaptersCount: 14, category: 'Prophets' },
  { id: 'MAL', name: 'Malachi', swName: 'Malaki', abbrev: 'Mal', swAbbrev: 'Mal', testament: 'OT', chaptersCount: 4, category: 'Prophets' },

  // NEW TESTAMENT (Agano Jipya) - 27 Books
  { id: 'MAT', name: 'Matthew', swName: 'Mathayo', abbrev: 'Mat', swAbbrev: 'Mat', testament: 'NT', chaptersCount: 28, category: 'Gospels' },
  { id: 'MRK', name: 'Mark', swName: 'Marko', abbrev: 'Mrk', swAbbrev: 'Mar', testament: 'NT', chaptersCount: 16, category: 'Gospels' },
  { id: 'LUK', name: 'Luke', swName: 'Luka', abbrev: 'Luk', swAbbrev: 'Luk', testament: 'NT', chaptersCount: 24, category: 'Gospels' },
  { id: 'JHN', name: 'John', swName: 'Yohana', abbrev: 'Jhn', swAbbrev: 'Yoh', testament: 'NT', chaptersCount: 21, category: 'Gospels' },
  { id: 'ACT', name: 'Acts', swName: 'Matendo ya Mitume', abbrev: 'Act', swAbbrev: 'Mdo', testament: 'NT', chaptersCount: 28, category: 'History' },
  { id: 'ROM', name: 'Romans', swName: 'Warumi', abbrev: 'Rom', swAbbrev: 'Rum', testament: 'NT', chaptersCount: 16, category: 'Epistles' },
  { id: '1CO', name: '1 Corinthians', swName: '1 Wakorintho', abbrev: '1Co', swAbbrev: '1Kor', testament: 'NT', chaptersCount: 16, category: 'Epistles' },
  { id: '2CO', name: '2 Corinthians', swName: '2 Wakorintho', abbrev: '2Co', swAbbrev: '2Kor', testament: 'NT', chaptersCount: 13, category: 'Epistles' },
  { id: 'GAL', name: 'Galatians', swName: 'Wagalatia', abbrev: 'Gal', swAbbrev: 'Gal', testament: 'NT', chaptersCount: 6, category: 'Epistles' },
  { id: 'EPH', name: 'Ephesians', swName: 'Waefeso', abbrev: 'Eph', swAbbrev: 'Efe', testament: 'NT', chaptersCount: 6, category: 'Epistles' },
  { id: 'PHP', name: 'Philippians', swName: 'Wafilipi', abbrev: 'Php', swAbbrev: 'Fil', testament: 'NT', chaptersCount: 4, category: 'Epistles' },
  { id: 'COL', name: 'Colossians', swName: 'Wakolosai', abbrev: 'Col', swAbbrev: 'Kol', testament: 'NT', chaptersCount: 4, category: 'Epistles' },
  { id: '1TH', name: '1 Thessalonians', swName: '1 Wathesalonike', abbrev: '1Th', swAbbrev: '1The', testament: 'NT', chaptersCount: 5, category: 'Epistles' },
  { id: '2TH', name: '2 Thessalonians', swName: '2 Wathesalonike', abbrev: '2Th', swAbbrev: '2The', testament: 'NT', chaptersCount: 3, category: 'Epistles' },
  { id: '1TI', name: '1 Timothy', swName: '1 Timotheo', abbrev: '1Ti', swAbbrev: '1Tim', testament: 'NT', chaptersCount: 6, category: 'Epistles' },
  { id: '2TI', name: '2 Timothy', swName: '2 Timotheo', abbrev: '2Ti', swAbbrev: '2Tim', testament: 'NT', chaptersCount: 4, category: 'Epistles' },
  { id: 'TIT', name: 'Titus', swName: 'Tito', abbrev: 'Tit', swAbbrev: 'Tit', testament: 'NT', chaptersCount: 3, category: 'Epistles' },
  { id: 'PHM', name: 'Philemon', swName: 'Filemoni', abbrev: 'Phm', swAbbrev: 'Flm', testament: 'NT', chaptersCount: 1, category: 'Epistles' },
  { id: 'HEB', name: 'Hebrews', swName: 'Waebrania', abbrev: 'Heb', swAbbrev: 'Ebr', testament: 'NT', chaptersCount: 13, category: 'Epistles' },
  { id: 'JAS', name: 'James', swName: 'Yakobo', abbrev: 'Jas', swAbbrev: 'Yak', testament: 'NT', chaptersCount: 5, category: 'Epistles' },
  { id: '1PE', name: '1 Peter', swName: '1 Petro', abbrev: '1Pe', swAbbrev: '1Pet', testament: 'NT', chaptersCount: 5, category: 'Epistles' },
  { id: '2PE', name: '2 Peter', swName: '2 Petro', abbrev: '2Pe', swAbbrev: '2Pet', testament: 'NT', chaptersCount: 3, category: 'Epistles' },
  { id: '1JN', name: '1 John', swName: '1 Yohana', abbrev: '1Jn', swAbbrev: '1Yoh', testament: 'NT', chaptersCount: 5, category: 'Epistles' },
  { id: '2JN', name: '2 John', swName: '2 Yohana', abbrev: '2Jn', swAbbrev: '2Yoh', testament: 'NT', chaptersCount: 1, category: 'Epistles' },
  { id: '3JN', name: '3 John', swName: '3 Yohana', abbrev: '3Jn', swAbbrev: '3Yoh', testament: 'NT', chaptersCount: 1, category: 'Epistles' },
  { id: 'JUD', name: 'Jude', swName: 'Yuda', abbrev: 'Jud', swAbbrev: 'Yud', testament: 'NT', chaptersCount: 1, category: 'Epistles' },
  { id: 'REV', name: 'Revelation', swName: 'Ufunuo wa Yohana', abbrev: 'Rev', swAbbrev: 'Ufu', testament: 'NT', chaptersCount: 22, category: 'Apocalypse' },
];

export function findBook(nameOrAbbrev: string): BookInfo | undefined {
  const q = nameOrAbbrev.trim().toLowerCase();
  return BIBLE_BOOKS.find(b => 
    b.name.toLowerCase() === q ||
    b.swName.toLowerCase() === q ||
    b.abbrev.toLowerCase() === q ||
    b.swAbbrev.toLowerCase() === q ||
    b.id.toLowerCase() === q
  );
}
