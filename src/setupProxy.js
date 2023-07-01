const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
	app.use(
		'/api',
		createProxyMiddleware({
		target: 'https://api.pokemontcg.io',
		changeOrigin: true,
		pathRewrite: {
			'^/api': '',
		},
		})
	);

	app.use(
		'/images',
		createProxyMiddleware({
		target: 'https://images.pokemontcg.io',
		changeOrigin: true,
		})
	);
};
