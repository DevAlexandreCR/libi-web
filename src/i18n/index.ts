import { createI18n } from 'vue-i18n'
import en from './en'
import es from './es'

const i18n = createI18n({
  legacy: false,
  locale: import.meta.env.VITE_DEFAULT_LOCALE || 'es',
  fallbackLocale: 'en',
  messages: {
    en,
    es
  }
})

export default i18n
