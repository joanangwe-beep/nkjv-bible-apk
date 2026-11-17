import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function resolvePort(): number {
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    const parsed = parseInt(process.argv[portArgIndex + 1], 10);
    if (!isNaN(parsed)) return parsed;
  }
  // Dev server in AI Studio must always bind to port 3000
  if (process.env.NODE_ENV !== 'production') {
    return 3000;
  }
  return parseInt(process.env.PORT || '3000', 10);
}

const port = resolvePort();

app.use(express.json());

// Initialize Google Gemini AI client if key is configured
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// AI Bible Study Assistant endpoint
app.post('/api/ai-study', async (req: Request, res: Response) => {
  const { question, verseRef, verseText, language = 'en', mode = 'explain' } = req.body;

  if (!question && !verseRef) {
    return res.status(400).json({ error: 'Missing question or verse reference' });
  }

  // If Gemini API is configured, use it for deep reverent theological study
  if (ai) {
    try {
      const systemInstruction = `You are a reverent, scholarly, pastoral Christian Bible study assistant for the NKJV Bible application.
Your purpose is to explain Scripture faithfully, grounded in sound biblical hermeneutics, historical context, and Christian orthodoxy.
Distinguish Scripture clearly from human commentary. Never present human or AI interpretation as the authoritative Word of God.
When quoting Scripture, use the New King James Version (NKJV) for English and Swahili Union Version (Biblia Habari Njema / SUV) when responding in or addressing Kiswahili.
Respond respectfully, clearly, and pastorally. Support both English and Kiswahili users.`;

      const promptText = `Bible Study Query:
Passage: ${verseRef || 'General Bible Study'}
Scripture Text: "${verseText || ''}"
User Question/Task: ${question}
Requested Language: ${language === 'sw' ? 'Kiswahili' : 'English'}

Provide a well-structured response with:
1. Historical & Biblical Context
2. Key Theological Insights
3. Practical Application for Christian Living
4. Related Cross-References
${language === 'sw' ? 'Tafadhali toa maelezo kwa Kiswahili fasaha na chenye heshima.' : ''}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
        config: {
          systemInstruction,
          temperature: 0.4,
        },
      });

      return res.json({
        content: response.text || 'No response generated.',
        source: 'gemini-2.5-flash',
      });
    } catch (err: any) {
      console.error('Error in AI study generation:', err?.message || err);
      // Fallback gracefully below
    }
  }

  // Reverent pastoral fallback responses if API key is not configured or fails
  const fallbackExplanations: Record<string, string> = {
    'John 3:16': `### Biblical Context & Exposition: John 3:16
**Context**: Spoken during Jesus' nocturnal conversation with Nicodemus, a member of the Jewish Sanhedrin who came seeking truth about the Kingdom of God.

**Key Theological Insights**:
- **"God so loved the world"**: Divine love is boundless, proactive, and sacrificial.
- **"He gave His only begotten Son"**: The Greek *monogenes* emphasizes the unique, unmatched nature of Christ's relationship with the Father.
- **"Whoever believes in Him"**: Salvation is offered freely by grace through faith, accessible to every soul regardless of heritage.
- **"Should not perish but have everlasting life"**: Eternal redemption replaces spiritual separation from God.

**Practical Application**:
1. Anchor your security in God's demonstrated love rather than fluctuating feelings.
2. Extend sacrificial love to others as a reflection of Christ's grace.

**Key Cross-References**: Romans 5:8, 1 John 4:9-10, Ephesians 2:8-9.`,
  };

  const responseText = fallbackExplanations[verseRef] || 
    `### Bible Study Reflection: ${verseRef || 'Scripture'}
**Scripture**: "${verseText || ''}"

**Theological Summary**:
This sacred passage reminds us of God's sovereign wisdom, steadfast covenant love, and faithful guidance for our walk of faith.

**Practical Takeaways**:
- **Meditation**: Reflect deeply on how this Word applies to your daily walk today.
- **Prayer**: Bring this truth before the Lord in thanksgiving and intercession.
- **Faith in Action**: Allow this passage to shape how you love and serve those around you.

*Tip: For deeper original language parsing (Greek/Hebrew), use the Blue Letter Bible and BibleHub study buttons in the Online Research tab.*`;

  return res.json({
    content: responseText,
    source: 'in-app-study-library',
  });
});

// Dedicated binary streaming helper for downloadable Android Project ZIPs
const streamNamedZipArchive = (zipFileName: string) => (req: Request, res: Response) => {
  const candidatePaths = [
    path.join(__dirname, 'downloads', zipFileName),
    path.join(process.cwd(), 'downloads', zipFileName),
    path.join(__dirname, 'public', 'downloads', zipFileName),
    path.join(__dirname, 'dist', 'downloads', zipFileName),
  ];
  const zipPath = candidatePaths.find((p) => fs.existsSync(p));

  if (!zipPath) {
    res.status(404).setHeader('Content-Type', 'text/plain');
    return res.send(`Error: ${zipFileName} not found on server.`);
  }

  const stat = fs.statSync(zipPath);
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`);
  res.setHeader('Content-Length', stat.size);
  res.setHeader('Accept-Ranges', 'bytes');
  res.setHeader('Cache-Control', 'public, max-age=86400, no-transform');

  if (req.method === 'HEAD') {
    return res.status(200).end();
  }

  const stream = fs.createReadStream(zipPath);
  stream.on('error', (err) => {
    console.error('Stream error while sending ZIP archive:', err);
    if (!res.headersSent) {
      res.status(500).setHeader('Content-Type', 'text/plain');
      res.send('Error streaming ZIP file.');
    }
  });
  stream.pipe(res);
};

const serveNewNativeAndroidZip = streamNamedZipArchive('NKJV_BIBLE_ANDROID_NEW.zip');
const serveZipArchive = streamNamedZipArchive('nkjv-bible-android-project.zip');

app.get('/api/download/nkjv-bible-android-new-zip', serveNewNativeAndroidZip);
app.head('/api/download/nkjv-bible-android-new-zip', serveNewNativeAndroidZip);
app.get('/downloads/NKJV_BIBLE_ANDROID_NEW.zip', serveNewNativeAndroidZip);
app.head('/downloads/NKJV_BIBLE_ANDROID_NEW.zip', serveNewNativeAndroidZip);

app.get('/api/download/android-project-zip', serveZipArchive);
app.head('/api/download/android-project-zip', serveZipArchive);
app.get('/downloads/nkjv-bible-android-project.zip', serveZipArchive);
app.head('/downloads/nkjv-bible-android-project.zip', serveZipArchive);

// Also serve static files from root downloads/ without polluting Vite public/ or Capacitor APK assets
app.use('/downloads', express.static(path.join(__dirname, 'downloads')));

// Start Express server and mount Vite in development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const server = app.listen(port, '0.0.0.0', () => {
    console.log(`NKJV Bible server listening on http://0.0.0.0:${port}`);
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`Port ${port} in use, dev server already listening.`);
    } else {
      console.error('Server listen error:', err);
    }
  });
}

startServer();
