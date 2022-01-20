module.exports = {
  port: 'PORT',
  publicUrl: 'PUBLIC_URL',
  wsPublicUrl: 'WS_PUBLIC_URL',
  directoryUrl: 'DIRECTORY_URL',
  privateDirectoryUrl: 'PRIVATE_DIRECTORY_URL',
  openapiViewerUrl: 'OPENAPI_VIEWER_URL',
  notifyUrl: 'NOTIFY_URL',
  privateNotifyUrl: 'PRIVATE_NOTIFY_URL',
  mongoUrl: 'MONGO_URL',
  secretKeys: {
    notifications: 'SECRET_NOTIFICATIONS'
  },
  brand: {
    logo: 'BRAND_LOGO',
    title: 'BRAND_TITLE',
    description: 'BRAND_DESCRIPTION',
    url: 'BRAND_URL',
    embed: 'BRAND_EMBED'
  },
  theme: {
    dark: {
      __name: 'THEME_DARK',
      __format: 'json'
    },
    colors: {
      primary: 'THEME_PRIMARY',
      secondary: 'THEME_SECONDARY',
      accent: 'THEME_ACCENT',
      error: 'THEME_ERROR',
      info: 'THEME_INFO',
      success: 'THEME_SUCCESS',
      warning: 'THEME_WARNING'
    },
    darkColors: {
      primary: 'THEME_DARK_PRIMARY',
      secondary: 'THEME_DARK_SECONDARY',
      accent: 'THEME_DARK_ACCENT',
      error: 'THEME_DARK_ERROR',
      info: 'THEME_DARK_INFO',
      success: 'THEME_DARK_SUCCESS',
      warning: 'THEME_DARK_WARNING'
    },
    cssUrl: 'THEME_CSS_URL',
    cssText: 'THEME_CSS_TEXT'
  },
  darkModeSwitch: {
    __name: 'DARK_MODE_SWITCH',
    __format: 'json'
  },
  i18n: {
    locales: 'I18N_LOCALES',
    defaultLocale: 'I18N_DEFAULT_LOCALE'
  },
  messageMaxLength: {
    __name: 'MESSAGE_MAX_LENGTH',
    __format: 'number'
  }
  /* allowedEditRoles: {
    __name: 'ALLOWED_EDIT_ROLES',
    __format: 'json'
  } */
}
