import {I18n} from 'i18n';
import path from 'node:path';
import { __dirname } from './utils.js';

const i18n = new I18n({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locals'),
  defaultLocale: 'en',
  autoReload: true,
  syncFiles: true,
  cookie: 'nodeapp-locale'
})

export default i18n