var path = require('path');
var webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

 const production = process.env.NODE_ENV === 'production';

 const turnOffES2015ModuleTranspilation = preset => {
	if (preset.match(/babel-preset-latest/)) {
		return [ preset, { 'es2015': { 'modules': false } }];
	} else {
		return preset;
	}
};

const babelPresets = [
	'babel-preset-latest'
].map(require.resolve).map(turnOffES2015ModuleTranspilation);

 module.exports = {
     entry: './public/main.js',
     output: {
         path: path.resolve(__dirname, 'build/js'),
         filename: 'main.bundle.js'
     },
     node: {
        fs: 'empty'
     },
     target: 'node',
     externals: [nodeExternals()],
     module: {
         rules: [{
            test: /\.js$/,
            include: [path.resolve(__dirname, "build/js")],
            exclude: [path.resolve(__dirname, "node_modules")],
            use: {
                loader: 'babel-loader',
                options: {
                    presets: babelPresets
                }
            }
        }]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
 };