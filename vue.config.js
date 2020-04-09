module.exports = {
    // lintOnSave: false,
    devServer: {
        proxy: {
            '/fr': {
                target: 'http://192.168.2.184:8099/', // 对应自己的接口
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/fr': '',
                },
            },
        },
    },
    publicPath: '/frangets/'
}