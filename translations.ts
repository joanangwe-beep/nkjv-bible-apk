export interface TranslationMeta {
  id: string;
  name: string;
  abbrev: string;
  language: 'en' | 'sw';
  copyright: string;
  licenseStatus: 'included' | 'public_domain' | 'api_licensed';
  description: string;
  requiresKey: boolean;
  setupGuide?: string;
}

export const ENGLISH_TRANSLATIONS: TranslationMeta[] = [
  {
    id: 'NKJV',
    name: 'New King James Version',
    abbrev: 'NKJV',
    language: 'en',
    copyright: 'Scripture taken from the New King James Version®. Copyright © 1982 by Thomas Nelson. Used by permission. All rights reserved.',
    licenseStatus: 'api_licensed',
    description: 'The default translation of this app. Renowned for its grace, poetic cadence, and uncompromising fidelity to the original Hebrew, Aramaic, and Greek texts.',
    requiresKey: false,
    setupGuide: 'NKJV text is accessed via authorized Bible API endpoints or licensed Thomas Nelson publisher integration. In offline mode, verified key chapters are cached locally.',
  },
  {
    id: 'KJV',
    name: 'King James Version (Authorized)',
    abbrev: 'KJV',
    language: 'en',
    copyright: 'Public Domain in most jurisdictions; Crown copyright in the United Kingdom.',
    licenseStatus: 'public_domain',
    description: 'The historic English translation completed in 1611 under King James I of England. Known for majestic prose and timeless cadence.',
    requiresKey: false,
  },
  {
    id: 'ESV',
    name: 'English Standard Version',
    abbrev: 'ESV',
    language: 'en',
    copyright: 'Scripture quotations are from the ESV® Bible (The Holy Bible, English Standard Version®), copyright © 2001 by Crossway.',
    licenseStatus: 'api_licensed',
    description: 'An essentially literal translation emphasizing word-for-word accuracy and literary excellence.',
    requiresKey: true,
    setupGuide: 'Requires ESV API Key from api.esv.org. Configure in Settings > API Keys.',
  },
  {
    id: 'NIV',
    name: 'New International Version',
    abbrev: 'NIV',
    language: 'en',
    copyright: 'Scripture taken from The Holy Bible, NEW INTERNATIONAL VERSION®, NIV® Copyright © 1973, 1978, 1984, 2011 by Biblica, Inc.®',
    licenseStatus: 'api_licensed',
    description: 'A balance between word-for-word and thought-for-thought translation, highly readable and popular worldwide.',
    requiresKey: true,
    setupGuide: 'Requires licensed API integration from Biblica or American Bible Society API.',
  },
  {
    id: 'NLT',
    name: 'New Living Translation',
    abbrev: 'NLT',
    language: 'en',
    copyright: 'Scripture quotations are taken from the Holy Bible, New Living Translation, copyright ©1996, 2004, 2015 by Tyndale House Foundation.',
    licenseStatus: 'api_licensed',
    description: 'A dynamic equivalence translation rendering ancient texts into clear, natural contemporary English.',
    requiresKey: true,
    setupGuide: 'Requires NLT API credentials from api.nlt.to.',
  },
];

export const SWAHILI_TRANSLATIONS: TranslationMeta[] = [
  {
    id: 'SUV',
    name: 'Swahili Union Version (Biblia Takatifu)',
    abbrev: 'SUV',
    language: 'sw',
    copyright: 'Biblia Takatifu — Swahili Union Version (SUV). Bible Society of Kenya and Tanzania.',
    licenseStatus: 'included',
    description: 'Tafsiri inayotumiwa zaidi na kupendwa Afrika Mashariki nzima. Inajulikana kwa lugha fasaha ya kitheolojia na usahihi wake.',
    requiresKey: false,
  },
  {
    id: 'BHN',
    name: 'Biblia Habari Njema',
    abbrev: 'BHN',
    language: 'sw',
    copyright: 'Biblia Habari Njema (BHN) © 1996, 2001 Bible Societies of Kenya and Tanzania.',
    licenseStatus: 'api_licensed',
    description: 'Tafsiri ya lugha ya sasa na inayoeleweka kwa urahisi kwa wasomaji wote wa kisasa.',
    requiresKey: false,
  },
];
