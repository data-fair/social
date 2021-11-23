import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(localizedFormat)
dayjs.extend(relativeTime)

Vue.prototype.$dayjs = dayjs

Vue.filter('date', (value, format = 'LLL') => {
  if (!value) return
  return dayjs(value).format(format)
})

Vue.filter('fromNow', (value) => {
  if (!value) return
  // prevent showing date in the future, can happen in case of small clock mismatch
  const date = dayjs(value)
  const now = dayjs()
  return (date > now ? now : date).fromNow()
})

export default async ({ app }) => {
  dayjs.locale(app.i18n.locale)
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    dayjs.locale(newLocale)
  }
}
