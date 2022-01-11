module.exports = {
  port: 8080,
  publicUrl: 'http://localhost:8080',
  wsPublicUrl: 'ws://localhost:8080',
  directoryUrl: 'http://localhost:8080/simple-directory',
  privateDirectoryUrl: '',
  openapiViewerUrl: 'https://koumoul.com/openapi-viewer/',
  notifyUrl: null,
  privateNotifyUrl: null,
  mongoUrl: 'mongodb://localhost:27017/social-' + (process.env.NODE_ENV || 'development'),
  brand: {
    logo: null,
    title: '@data-fair/social',
    description: '',
    url: null,
    embed: null
  },
  theme: {
    dark: false,
    colors: {
      primary: '#1E88E5', // blue.darken1
      secondary: '#42A5F5', // blue.lighten1,
      accent: '#FF9800', // orange.base
      error: 'FF5252', // red.accent2
      info: '#2196F3', // blue.base
      success: '#4CAF50', // green.base
      warning: '#E91E63', // pink.base
      admin: '#E53935' // red.darken1
    },
    darkColors: {
      primary: '#2196F3', // blue.base
      success: '#00E676' // green.accent3
    },
    cssUrl: null,
    cssText: ''
  },
  darkModeSwitch: true,
  // secrets that can be used to configure global webhooks for example to update users and organizations
  secretKeys: {
    notifications: null
  },
  nuxtDev: false,
  proxyNuxt: false,
  i18n: {
    locales: 'fr,en',
    defaultLocale: 'fr'
  },
  messageMaxLength: 200
}
