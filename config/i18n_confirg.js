import i18n from 'i18n';
import path from 'node:path';
import { __dirname } from './utils.js';

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locals'),
  defaultLocale: 'en',
  autoReload: true,
  syncFiles: true,
  cookie: 'nodeapp-locale',
  logDebugFn: (msg) => console.debug('i18n Debug:', msg),
  logWarnFn: (msg) => console.warn('i18n Warning:', msg)
});

export default i18n;