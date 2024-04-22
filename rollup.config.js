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

const thingsboardTerserOptions = {
    ecma: 5,
    //mangle: false,
    compress: false,
    parse: {bare_returns: true},
    //format: {braces: true}
};


export default [
    // chirpstack3 uplink+downlink
    {
        input: './src/targets/chirpstack3/analog/index.js',
        output: [
            {
                file: './dist/chirpstack3/analog/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack3/analog/init.js', 'utf8')
            },
            {
                file: './dist/chirpstack3/analog/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack3/analog/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/chirpstack3/analog/template.js')
        ]
    },

    // chirpstack3 uplink+downlink tests
    {
        input: './src/targets/chirpstack3/analog/test.js',
        output: [
            {
                file: './dist/chirpstack3/analog/test.js',
                format: 'iife'
            },
            {
                file: './dist/chirpstack3/analog/test.min.js',
                format: 'iife',
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({babelHelpers: 'bundled'})
        ]
    },


    // chirpstack4 uplink+downlink
    {
        input: './src/targets/chirpstack4/analog/index.js',
        output: [
            {
                file: './dist/chirpstack4/analog/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack4/analog/init.js', 'utf8')
            },
            {
                file: './dist/chirpstack4/analog/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack4/analog/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            //babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/chirpstack4/analog/template.js')
        ]
    },

    // chirpstack4 uplink+downlink tests
    {
        input: './src/targets/chirpstack4/analog/test.js',
        output: [
            {
                file: './dist/chirpstack4/analog/test.js',
                format: 'iife'
            },
            {
                file: './dist/chirpstack4/analog/test.min.js',
                format: 'iife',
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve()
            //babel({babelHelpers: 'bundled'})
        ]
    },


    // thingsboard uplink
    {
        input: './src/targets/thingsboard/analog/uplink/index.js',
        output: [
            // {
            //     file: './dist/thingsboard/analog/uplink.js',
            //     format: 'cjs',
            //     banner: readFileSync('./src/targets/thingsboard/analog/uplink/init.js', 'utf8')
            // },
            {
                file: './dist/thingsboard/analog/uplink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
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
                    '@babel/plugin-transform-template-literals',
                    '@babel/plugin-transform-computed-properties'
                ]
            }),
            processTemplate('./src/targets/thingsboard/analog/uplink/template.js')
        ]
    },

    // thingsboard downlink
    {
        input: './src/targets/thingsboard/analog/downlink/index.js',
        output: [
            // {
            //     file: './dist/thingsboard/analog/downlink.js',
            //     format: 'iife',
            //     banner: readFileSync('./src/targets/thingsboard/analog/downlink/init.js', 'utf8')
            // },
            {
                file: './dist/thingsboard/analog/downlink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/downlink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
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
                    '@babel/plugin-transform-template-literals',
                    '@babel/plugin-transform-computed-properties'
                ]
            }),
            processTemplate('./src/targets/thingsboard/analog/downlink/template.js')
        ]
    },

    // thingsboard downlink tests
    {
        input: './src/targets/thingsboard/analog/downlink/test.js',
        output: [
            {
                file: './dist/thingsboard/analog/downlink.test.js',
                format: 'iife'
            },
            {
                file: './dist/thingsboard/analog/downlink.test.min.js',
                format: 'iife',
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingsboard/analog/downlink/template.test.js')
        ]
    },

    // thingsboard uplink tests
    {
        input: './src/targets/thingsboard/analog/uplink/test.js',
        output: [
            {
                file: './dist/thingsboard/analog/uplink.test.js',
                format: 'iife'
            },
            {
                file: './dist/thingsboard/analog/uplink.test.min.js',
                format: 'iife',
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingsboard/analog/uplink/template.test.js')
        ]
    }
];
