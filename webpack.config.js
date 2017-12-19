const path = require('path');
const webpack = require('webpack');

module.exports={
	context: __dirname,
	devtool:'source-map',
	entry:{
		app:'./src/app'
	},
	output:{
		publicPath:'/',
		path:path.join(__dirname,'/public'),
		filename:'bundle.js'
	},
	module:{
		rules:[
			{
				test:/\.js$/,
				exclude:/node_modules/,
				use:{
					loader:'babel-loader',
					query:{
						presets:[['env',{ "modules": false }],'react'],
						plugins: ['transform-runtime']
					}
				}
			}
		]
	},
	plugins:[
		new webpack.HotModuleReplacementPlugin()
	],
	devServer: {
		contentBase: path.join(__dirname, 'public'),
		port: 3000,
		inline: true,
		hot: true,
		historyApiFallback: true
	}
}
