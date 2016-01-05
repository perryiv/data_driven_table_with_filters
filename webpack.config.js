var path = require ( "path" );
var HtmlWebpackPlugin = require ( "html-webpack-plugin" );
var webpack = require ( "webpack" );
var merge = require ( "webpack-merge" );

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join ( __dirname, "app" ),
  build: path.join ( __dirname, "build" )
};

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: [ "", ".js", ".jsx" ]
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loaders: [ "style", "css" ],
        include: PATHS.app
      },
      {
        test: /\.jsx?$/,
        loaders: [ "babel" ],
        include: PATHS.app
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin ( { title: "Wrestling Data" } )
  ]
};

if ( TARGET === "start" || !TARGET )
{
  module.exports = merge ( common, {
    devtool: "eval-source-map",
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,
      quiet: true, // 
      stats: "errors-only", // Display only errors to reduce the amount of output.
      // host: process.env.HOST, // Parse host and port from env so this is easy to customize.
      port: process.env.PORT
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  });
}
