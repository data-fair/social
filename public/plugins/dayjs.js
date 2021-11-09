import Vue from 'vue'
import dayjs from 'dayjs'
import 'dayjs/locale/fr'
import 'dayjs/locale/en'
import localizedFormat from 'dayjs/plugin/localizedFormat'
dayjs.extend(localizedFormat)

Vue.filter('date', (value, format = 'LLL') => {
  if (!value) return
  console.log(dayjs(value).format('LLL'))
  return dayjs(value).format(format)
})

export default async ({ app }) => {
  dayjs.locale(app.i18n.locale)
  app.i18n.onLanguageSwitched = (oldLocale, newLocale) => {
    dayjs.locale(newLocale)
  }
}
