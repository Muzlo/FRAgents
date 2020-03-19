module.exports = {
    // lintOnSave: false,
    devServer: {
        proxy: {
            '/api': {
                target: 'http://v.juhe.cn/', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': '',
                },
            },
            '/fr': {
                target: 'http://192.168.2.124:8099/', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/fr': '',
                },
            },
        },
    },
}