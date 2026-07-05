import { writeFileSync } from 'fs';
import { extractPdfText } from '../lib/pipeline/pdfExtractor';
import { cleanText } from '../lib/pipeline/textCleaner';
import { splitStories } from '../lib/pipeline/storySplitter';

async function run() {
  const raw = await extractPdfText('books/TkakurmarJhuli.pdf');
  const cleaned = cleanText(raw);
  writeFileSync('scratch/dump.txt', cleaned.text, 'utf8');

  // Also print the titles found by splitStories
  const stories = splitStories(cleaned);
  console.log('Stories detected:', stories.length);
  stories.forEach(s => console.log('Title:', s.title));
}

run().catch(console.error);
