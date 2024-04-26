const i18n = require('i18n')

const locales = ['fr', 'en']
const defaultLocale = 'fr'

i18n.configure({
  locales,
  directory: './server/i18n',
  defaultLocale,
  fallbacks: { en: 'fr' },
  directoryPermissions: '444'
})

exports.middleware = i18n.init

exports.i18nInstance = i18n

exports.getObjectI18n = (i18n, key, args) => {
  return {
    fr: i18n.__({ phrase: key, locale: 'fr' }, args),
    en: i18n.__({ phrase: key, locale: 'en' }, args)
  }
}
