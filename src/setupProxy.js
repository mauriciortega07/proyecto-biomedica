const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://ec2-3-87-154-111.compute-1.amazonaws.com:4000',   // o http://localhost:4000 si levantarás backend local
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    })
  );
};
