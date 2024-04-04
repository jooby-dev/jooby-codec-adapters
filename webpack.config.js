import {resolve} from 'node:path';
import webpack from 'webpack';
import {readFileSync} from 'node:fs';


// webpack --config-name=chirpstack
export default [
    {
        name: 'chirpstack',
        mode: 'production',
        entry: './src/chirpstack/analog/index.js',
        //target: 'es5',
        output: {
            filename: 'webpack.js',
            path: resolve('./dist/chirpstack/analog/'),
            chunkFormat: 'array-push',
            environment: {
                arrowFunction: false,
                asyncFunction: false,
                bigIntLiteral: false,
                const: false,
                destructuring: false,
                dynamicImport: false,
                dynamicImportInWorker: false,
                forOf: false,
                globalThis: false,
                module: false,
                optionalChaining: false,
                templateLiteral: false
            }
        },
        optimization: {
            minimize: true
        },
        module: {
            rules: [
                {
                    test: /\.(?:js|mjs|cjs)$/,
                    exclude: /node_modules/,
                    use: {loader: 'babel-loader'}
                }
            ]
        },
        plugins: [
            // https://webpack.js.org/plugins/banner-plugin/
            new webpack.BannerPlugin({
                raw: true,
                banner: readFileSync('./src/chirpstack/analog/banner.js', 'utf8'),
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
            }),
            new webpack.BannerPlugin({
                raw: true,
                banner: readFileSync('./src/chirpstack/analog/footer.js', 'utf8'),
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
                footer: true
            })
        ]
    },

    {
        name: 'thingsboard',
        mode: 'production',
        entry: './src/thingsboard/uplink/index.js',
        //target: 'es5',
        output: {
            filename: 'webpack.js',
            path: resolve('./dist/thingsboard/'),
            chunkFormat: 'array-push',
            environment: {
                arrowFunction: false,
                asyncFunction: false,
                bigIntLiteral: false,
                const: false,
                destructuring: false,
                dynamicImport: false,
                dynamicImportInWorker: false,
                forOf: false,
                globalThis: false,
                module: false,
                optionalChaining: false,
                templateLiteral: false
            }
        },
        optimization: {
            minimize: false
        },
        module: {
            rules: [
                {
                    test: /\.(?:js|mjs|cjs)$/,
                    exclude: /node_modules/,
                    use: {loader: 'babel-loader'}
                }
            ]
        },
        plugins: [
            // https://webpack.js.org/plugins/banner-plugin/
            new webpack.BannerPlugin({
                raw: true,
                banner: readFileSync('./src/thingsboard/uplink/banner.js', 'utf8'),
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
            }),
            new webpack.BannerPlugin({
                raw: true,
                banner: readFileSync('./src/thingsboard/uplink/footer.js', 'utf8'),
                stage: webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
                footer: true
            })
        ]
    }
];
