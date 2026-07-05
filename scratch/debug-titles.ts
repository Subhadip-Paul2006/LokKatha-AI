import { extractPdfText } from '../lib/pipeline/pdfExtractor';
import { cleanText } from '../lib/pipeline/textCleaner';
import { bengaliCharRatio } from '../lib/pipeline/utils';

const SENTENCE_ENDINGS = new Set(['।', '॥', '?', '!', '…']);
const EXCLUDED_FIRST_WORDS = new Set(['ঠাকুরমার', 'ঝুলি', 'সূচিপত্র', 'সূচী', 'বিষয়সূচি', 'ভূমিকা', 'প্রকাশকের', 'লেখকের', 'সম্পাদকের', 'গ্রন্থপরিচয়', 'কথামুখ', 'পরিচিতি', 'অংশ', 'খণ্ড', 'পর্ব', 'অধ্যায়']);

async function run() {
  const raw = await extractPdfText('books/TkakurmarJhuli.pdf');
  const cleaned = cleanText(raw);
  const lines = cleaned.text.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (t.length >= 2 && t.length <= 80 && bengaliCharRatio(t) >= 0.5) {
      const lastChar = [...t].at(-1) ?? '';
      const firstWord = t.split(/[\s\u00a0]+/)[0] ?? '';
      if (!SENTENCE_ENDINGS.has(lastChar) && !EXCLUDED_FIRST_WORDS.has(firstWord)) {
        console.log(`Line ${i}: [${t}] (Len: ${t.length})`);
      }
    }
  }
}

run().catch(console.error);
