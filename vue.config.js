module.exports = {
    devServer: {
        proxy: {
            '^/nespresso/api': {
                target: 'http://localhost:8080',
                changeOrigin: true
            }
        }
    }
}