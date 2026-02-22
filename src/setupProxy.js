const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://172.31.21.247;4000',   // o http://localhost:4000 si levantarás backend local
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
};
