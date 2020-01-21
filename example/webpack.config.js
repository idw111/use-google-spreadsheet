const path = require('path');

module.exports = {
	mode: 'development',
	entry: './example/index.js',
	output: {
		path: __dirname,
		filename: 'bundle.js'
	},
	module: {
		rules: [{ test: /\.js$/, exclude: '/node_modules', use: ['babel-loader'] }]
	}
};
