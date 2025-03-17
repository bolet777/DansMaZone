import webpack from 'webpack';
import ejs from 'ejs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import ExtReloader from 'webpack-ext-reloader';
import path from 'path';
import { fileURLToPath } from 'url';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import WriteWebpackPlugin from 'write-webpack-plugin';
import manifestInput from './src/manifest/index.js';
import * as sass from 'sass';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetBrowser = process.env.TARGET || 'chrome';

function processManifest(manifest, browser) {
  const processed = { ...manifest };
  
  if (browser === 'firefox') {
    processed.browser_specific_settings = {
      gecko: { id: 'ccosenza.dlab@gmail.com' }
    };
  }
  
  if (browser === 'chrome') {
    processed.minimum_chrome_version = '88';
  }
  
  if (browser === 'opera') {
    processed.minimum_opera_version = '74';
    processed.developer = { name: 'bolet' };
  }
  
  return processed;
}

const finalManifest = processManifest(manifestInput, targetBrowser);

const config = {
  mode: process.env.NODE_ENV,
  context: `${__dirname}/src`,
  entry: {
    'content_script': './content_script/index.js',
    'options': './options/options.js', 
    'background': './background/background.js',
  },
  output: {
    path: path.join(__dirname, 'dist', targetBrowser),
    filename: '[name].js',
  },
  optimization: {
    moduleIds: 'deterministic',
  },
  stats: {
    warnings: false,
  },
  performance: {
    hints: false,
  },
  infrastructureLogging: {
    level: 'error', // Réduit les logs
  },
  experiments: {
    topLevelAwait: true,
  },
  resolve: {
    extensions: ['.js', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: sass,
              sassOptions: {
                outputStyle: 'compressed',
              },
            },
          },
        ],
      },
      {
        test: /\.sass$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader?indentedSyntax'],
      },
      {
        test: /\.txt$/i,
        use: 'raw-loader',
      },
      {
        test: /\.json$/,
        type: 'javascript/auto',
        use: 'json-loader',
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|ico)$/,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][ext]'
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
    ],
  },
  plugins: [
    new webpack.ids.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      global: 'window',
    }),
    new WriteWebpackPlugin([
      {
        name: 'manifest.json',
        data: Buffer.from(JSON.stringify(finalManifest, null, 2))
      }
    ]),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Copier options.html et options.css vers la racine du dossier dist
        { from: 'options/options.html', to: 'options.html' },
        { from: 'options/options.css', to: 'options.css' },
      ]
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: '_locales', to: '_locales' },
        { from: 'icons', to: 'icons', globOptions: { ignore: ['icon.xcf', '.DS_Store'] } },
        { from: 'datas/*.json', to: '[path][name][ext]' },
      ],
    }),
  ],
};

if (config.mode === 'production') {
  config.plugins = (config.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
      },
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'disabled',
      generateStatsFile: true,
      statsOptions: { source: false },
    }),
  ]);
}

if (process.env.HMR === 'true') {
  config.plugins = (config.plugins || []).concat([
    new ExtReloader({
      manifest: path.resolve(__dirname, `dist/${targetBrowser}/manifest.json`),
      port: 9090,
      reloadPage: true,
      entries: {
        contentScript: 'content_script'
      }
    }),
  ]);
}

function transformHtml(content) {
  return ejs.render(content.toString(), {
    ...process.env,
  });
}

export default config;