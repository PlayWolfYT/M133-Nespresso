module.exports = {
  devServer: {
    proxy: {
      "^/nespresso/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },

  pluginOptions: {
    i18n: {
      locale: "de",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: true,
      enableBridge: false,
    },
  },
};
