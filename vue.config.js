module.exports = {
  devServer: {
    public: "http://nespresso.local:80" /* Edit in hosts file */,
    disableHostCheck: true,
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
