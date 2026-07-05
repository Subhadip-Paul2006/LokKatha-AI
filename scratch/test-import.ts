import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
console.log('type of pdf:', typeof pdf);
console.log('keys of pdf:', Object.keys(pdf));
