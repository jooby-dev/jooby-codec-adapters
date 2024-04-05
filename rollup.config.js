import {nodeResolve} from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import {readFileSync} from 'node:fs';


const processTemplate = fileName => {
    return {
        name: 'processTemplate',
        'generateBundle': async ( meta, data ) => {
            const templateData = readFileSync(fileName, 'utf8');

            for ( const [chunkName, chunkData] of Object.entries(data) ) {
                chunkData.code = templateData.replaceAll('/*{{bundle}}*/', chunkData.code.trim());
            }
        }
    };
};


export default [
    // chirpstack uplink+downlink
    {
        input: './src/targets/chirpstack/analog/index.js',
        output: [
            {
                file: './dist/chirpstack/analog/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack/analog/init.js', 'utf8'),
            },
            {
                file: './dist/chirpstack/analog/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack/analog/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/chirpstack/analog/template.js')
        ]
    },

    // chirpstack uplink+downlink tests
    {
        input: './src/targets/chirpstack/analog/test.js',
        output: [
            {
                file: './dist/chirpstack/analog/test.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack/analog/init.js', 'utf8'),
            },
            {
                file: './dist/chirpstack/analog/test.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack/analog/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
        ]
    },

    // thingsboard uplink
    {
        input: './src/targets/thingsboard/analog/uplink/index.js',
        output: [
            {
                file: './dist/thingsboard/analog/uplink.js',
                format: 'cjs',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/init.js', 'utf8'),
            },
            {
                file: './dist/thingsboard/analog/uplink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/init.js', 'utf8'),
                plugins: [terser({
                    ecma: 5,
                    //mangle: false,
                    compress: false,
                    parse: {bare_returns: true},
                    //format: {braces: true}
                })]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env'],
                targets: 'defaults',
                plugins: [
                    ['@babel/plugin-transform-arrow-functions', {spec: false}],
                    '@babel/plugin-transform-destructuring',
                    '@babel/plugin-transform-block-scoping',
                    '@babel/plugin-transform-parameters',
                    '@babel/plugin-transform-shorthand-properties',
                    '@babel/plugin-transform-spread',
                    '@babel/plugin-transform-template-literals'
                ]
            }),
            processTemplate('./src/targets/thingsboard/analog/uplink/template.js')
        ]
    },

    // thingsboard downlink
    {
        input: './src/targets/thingsboard/analog/downlink/index.js',
        output: [
            {
                file: './dist/thingsboard/analog/downlink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/downlink/init.js', 'utf8'),
            },
            {
                file: './dist/thingsboard/analog/downlink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/downlink/init.js', 'utf8'),
                plugins: [terser({
                    ecma: 5,
                    //mangle: false,
                    compress: false,
                    parse: {bare_returns: true},
                    //format: {braces: true}
                })]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({
                babelHelpers: 'bundled',
                presets: ['@babel/preset-env'],
                targets: 'defaults',
                plugins: [
                    ['@babel/plugin-transform-arrow-functions', {spec: false}],
                    '@babel/plugin-transform-destructuring',
                    '@babel/plugin-transform-block-scoping',
                    '@babel/plugin-transform-parameters',
                    '@babel/plugin-transform-shorthand-properties',
                    '@babel/plugin-transform-spread',
                    '@babel/plugin-transform-template-literals'
                ]
            }),
            processTemplate('./src/targets/thingsboard/analog/downlink/template.js')
        ]
    }
];
