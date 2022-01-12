const URL = require('url').URL
const fr = require('vuetify/es5/locale/fr').default
const en = require('vuetify/es5/locale/en').default
let config = { ...require('config') }
config.basePath = new URL(config.publicUrl + '/').pathname

if (!config.proxyNuxt) {
  const nuxtConfigInject = require('@koumoul/nuxt-config-inject')
  if (process.argv.slice(-1)[0] === 'build') config = nuxtConfigInject.prepare(config)
  else nuxtConfigInject.replace(config, ['nuxt-dist/**/*', 'public/static/**/*'])
}

module.exports = {
  target: 'server',
  ssr: false,
  components: true,
  srcDir: 'public/',
  buildDir: 'nuxt-dist',
  build: {
    publicPath: '_nuxt/',
    transpile: [/@koumoul/]
  },
  loading: { color: '#1e88e5' }, // Customize the progress bar color
  plugins: [
    { src: '~plugins/session' },
    { src: '~plugins/ws', ssr: false },
    { src: '~plugins/dayjs' }
  ],
  router: {
    base: config.basePath
  },
  modules: ['@nuxtjs/axios', 'cookie-universal-nuxt', ['@nuxtjs/i18n', {
    seo: false,
    locales: ['fr', 'en'],
    defaultLocale: config.i18n.defaultLocale,
    vueI18nLoader: true,
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_lang'
    },
    vueI18n: {
      fallbackLocale: config.i18n.defaultLocale
    }
  }]],
  axios: {
    browserBaseURL: config.basePath
  },
  buildModules: [
    ['@nuxtjs/vuetify', { icons: { iconfont: 'mdi' } }],
    ['@nuxtjs/google-fonts', { download: true, display: 'swap', families: { Nunito: [100, 300, 400, 500, 700, 900] } }]],
  vuetify: {
    customVariables: ['~assets/variables.scss'],
    theme: {
      dark: config.theme.dark,
      themes: {
        light: config.theme.colors,
        dark: { ...config.theme.colors, ...config.theme.darkColors }
      }
    },
    treeShake: true,
    defaultAssets: false,
    lang: {
      locales: { fr, en },
      current: config.i18n.defaultLocale
    }
  },
  css: [
    '@mdi/font/css/materialdesignicons.min.css'
  ],
  env: {
    mainPublicUrl: config.publicUrl,
    basePath: config.basePath,
    directoryUrl: config.directoryUrl,
    openapiViewerUrl: config.openapiViewerUrl,
    analytics: config.analytics,
    notifyUrl: config.notifyUrl,
    theme: config.theme,
    i18n: config.i18n,
    messageMaxLength: config.messageMaxLength
    // allowedEditRoles: config.allowedEditRoles
  },
  head: {
    title: config.brand.title,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'application', name: 'application-name', content: config.brand.title },
      { hid: 'description', name: 'description', content: config.brand.description },
      { hid: 'robots', name: 'robots', content: 'noindex' }
    ],
    link: [],
    style: []
  }
}

if (config.theme.cssUrl) {
  module.exports.head.link.push({ rel: 'stylesheet', href: config.theme.cssUrl })
}

if (config.theme.cssText) {
  module.exports.head.style.push({ type: 'text/css', cssText: config.theme.cssText })
}
