const config = require('config')
const acceptLangParser = require('accept-language-parser')

const fr = require('../resources/messages-fr.json')
const messages = {
  fr,
  en: { ...fr, ...require('../resources/messages-en.json') }
}

function getObjectI18n (__, key, args) {
  return {
    fr: __({ phrase: key, locale: 'fr' }, args),
    en: __({ phrase: key, locale: 'en' }, args),
    es: __({ phrase: key, locale: 'es' }, args),
    pt: __({ phrase: key, locale: 'pt' }, args),
    it: __({ phrase: key, locale: 'it' }, args),
    de: __({ phrase: key, locale: 'de' }, args)
  }
}

exports.middleware = (req, res, next) => {
  const locales = acceptLangParser.parse(req.get('Accept-Language'))
  const localeCode = req.cookies.i18n_lang || (locales && locales[0] && locales[0].code) || config.i18n.defaultLocale
  req.locale = localeCode
  req.messages = messages[localeCode] || messages.fr
  req.__all = (key, args) => getObjectI18n(req.__, key, args)
  next()
}
