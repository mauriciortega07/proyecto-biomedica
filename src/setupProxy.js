const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://54.226.35.178:4000',   // o http://localhost:4000 si levantarás backend local
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
};
