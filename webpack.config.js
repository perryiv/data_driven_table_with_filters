var path = require ( "path" );
var HtmlWebpackPlugin = require ( "html-webpack-plugin" );
var webpack = require ( "webpack" );
var merge = require ( "webpack-merge" );
var Clean = require ( "clean-webpack-plugin" );
var ExtractTextPlugin = require ( "extract-text-webpack-plugin" );

var pkg = require ( "./package.json" );

var TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

var PATHS = {
  app: path.join ( __dirname, "app" ),
  build: path.join ( __dirname, "build" )
};

var common = {
  entry: PATHS.app,
  resolve: {
    extensions: [ "", ".js", ".jsx" ]
  },
  output: {
    path: PATHS.build,
    filename: "bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: [ "babel?cacheDirectory" ],
        include: PATHS.app
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin ( {
      template: "node_modules/html-webpack-template/index.html",
      title: "Data-Driven Table with Filters",
      appMountId: "app"
    } )
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
      host: process.env.HOST, // Parse host and port from env so this is easy to customize.
      port: process.env.PORT
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: [ "style", "css" ],
          include: PATHS.app
        },
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  } );
}

if ( TARGET === "build" || TARGET === "stats" )
{
  module.exports = merge ( common, {
    entry: {
      app: PATHS.app,
      vendor: Object.keys ( pkg.dependencies ).filter ( function ( v ) { return v; } )
    },
    output: {
      path: PATHS.build,
      filename: "[name].[chunkhash].js",
      chunkFilename: "[chunkhash].js"
    },
    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract("style", "css"),
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new Clean ( [ PATHS.build ] ),

      // Output extracted CSS to a file
      new ExtractTextPlugin ( "styles.[chunkhash].css" ),

      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin ( { names: [ "vendor", "manifest" ] } ),

      // Setting DefinePlugin affects React library size!
      new webpack.DefinePlugin ( { "process.env.NODE_ENV": JSON.stringify ( "production" ) } ),

      new webpack.optimize.UglifyJsPlugin ( { compress: { warnings: false } } )
    ]
  });
}
