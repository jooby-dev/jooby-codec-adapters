import {nodeResolve} from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import {readFileSync} from 'node:fs';
import path from 'node:path';


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

const ttnTerserOptions = {
    ecma: 5,
    //mangle: false,
    compress: {
        arrows: true
    },
    parse: {bare_returns: true},
    //format: {braces: true}
};

const thingsboardBabelPlugin = babel({
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
});

const ttnBabelPlugin = babel({
    babelHelpers: 'bundled',
    presets: ['@babel/preset-env'],
    targets: 'defaults'
});


export default [
    /* // ChirpStack v3 analog uplink+downlink
    {
        input: './src/targets/chirpstack3/analog/index.js',
        output: [
            {
                file: './dist/chirpstack3/analog/develop/full.js',
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

    // ChirpStack v3 analog uplink+downlink tests
    {
        input: './src/targets/chirpstack3/analog/test.js',
        output: [
            {
                file: './dist/chirpstack3/analog/develop/test.js',
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

    // ChirpStack v3 MTX1 uplink+downlink
    {
        input: './src/targets/chirpstack3/mtx1/index.js',
        output: [
            {
                file: './dist/chirpstack3/mtx1/develop/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack3/mtx1/init.js', 'utf8')
            },
            {
                file: './dist/chirpstack3/mtx1/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack3/mtx1/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/chirpstack3/mtx1/template.js')
        ]
    },

    // ChirpStack v3 MTX1 uplink+downlink tests
    {
        input: './src/targets/chirpstack3/mtx1/test.js',
        output: [
            {
                file: './dist/chirpstack3/mtx1/develop/test.js',
                format: 'iife'
            },
            {
                file: './dist/chirpstack3/mtx1/test.min.js',
                format: 'iife',
                plugins: [terser()]
            }
        ],
        plugins: [
            // commonjs(),
            nodeResolve(),
            babel({babelHelpers: 'bundled'})
        ]
    },

    // ChirpStack v3 MTX3 uplink+downlink
    {
        input: './src/targets/chirpstack3/mtx3/index.js',
        output: [
            {
                file: './dist/chirpstack3/mtx3/develop/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack3/mtx3/init.js', 'utf8')
            },
            {
                file: './dist/chirpstack3/mtx3/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack3/mtx3/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/chirpstack3/mtx3/template.js')
        ]
    },

    // ChirpStack v3 MTX3 uplink+downlink tests
    {
        input: './src/targets/chirpstack3/mtx3/test.js',
        output: [
            {
                file: './dist/chirpstack3/mtx3/develop/test.js',
                format: 'iife'
            },
            {
                file: './dist/chirpstack3/mtx3/test.min.js',
                format: 'iife',
                plugins: [terser()]
            }
        ],
        plugins: [
            // commonjs(),
            nodeResolve(),
            babel({babelHelpers: 'bundled'})
        ]
    },


    // ChirpStack v4 analog uplink+downlink
    {
        input: './src/targets/chirpstack4/analog/index.js',
        output: [
            {
                file: './dist/chirpstack4/analog/develop/full.js',
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

    // ChirpStack v4 analog uplink+downlink tests
    {
        input: './src/targets/chirpstack4/analog/test.js',
        output: [
            {
                file: './dist/chirpstack4/analog/develop/test.js',
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

    // ChirpStack v4 MTX1 uplink+downlink
    {
        input: './src/targets/chirpstack4/mtx1/index.js',
        output: [
            {
                file: './dist/chirpstack4/mtx1/develop/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack4/mtx1/init.js', 'utf8')
            },
            {
                file: './dist/chirpstack4/mtx1/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack4/mtx1/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            processTemplate('./src/targets/chirpstack4/mtx1/template.js')
        ]
    },

    // ChirpStack v4 MTX1 uplink+downlink tests
    {
        input: './src/targets/chirpstack4/mtx1/test.js',
        output: [
            {
                file: './dist/chirpstack4/mtx1/develop/test.js',
                format: 'iife'
            },
            {
                file: './dist/chirpstack4/mtx1/test.min.js',
                format: 'iife',
                plugins: [terser()]
            }
        ],
        plugins: [
            // commonjs(),
            nodeResolve()
        ]
    },

    // ChirpStack v4 MTX3 uplink+downlink
    {
        input: './src/targets/chirpstack4/mtx3/index.js',
        output: [
            {
                file: './dist/chirpstack4/mtx3/develop/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack4/mtx3/init.js', 'utf8')
            },
            {
                file: './dist/chirpstack4/mtx3/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/chirpstack4/mtx3/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            processTemplate('./src/targets/chirpstack4/mtx3/template.js')
        ]
    },

    // ChirpStack v4 MTX3 uplink+downlink tests
    {
        input: './src/targets/chirpstack4/mtx3/test.js',
        output: [
            {
                file: './dist/chirpstack4/mtx3/develop/test.js',
                format: 'iife'
            },
            {
                file: './dist/chirpstack4/mtx3/test.min.js',
                format: 'iife',
                plugins: [terser()]
            }
        ],
        plugins: [
            // commonjs(),
            nodeResolve()
        ]
    },


    // TagoIO analog uplink
    {
        input: './src/targets/tago.io/analog/uplink/index.js',
        output: [
            {
                file: './dist/tago.io/analog/uplink/develop/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/tago.io/analog/uplink/init.js', 'utf8')
            },
            {
                file: './dist/tago.io/analog/uplink/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/tago.io/analog/uplink/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            //babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/tago.io/analog/uplink/template.js')
        ]
    },


    // ThingPark analog uplink+downlink
    {
        input: './src/targets/thingpark/analog/index.js',
        output: [
            {
                file: './dist/thingpark/analog/develop/full.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingpark/analog/init.js', 'utf8')
            },
            {
                file: './dist/thingpark/analog/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingpark/analog/init.js', 'utf8'),
                plugins: [terser()]
            }
        ],
        plugins: [
            nodeResolve(),
            //babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingpark/analog/template.js')
        ]
    },


    // ThingsBoard analog downlink
    {
        input: './src/targets/thingsboard/analog/downlink/index.js',
        output: [
            {
                file: './dist/thingsboard/analog/develop/downlink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/downlink/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/analog/downlink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/downlink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/analog/downlink/template.js')
        ]
    },

    // ThingsBoard analog downlink tests
    {
        input: './src/targets/thingsboard/analog/downlink/test.js',
        output: [
            {
                file: './dist/thingsboard/analog/develop/downlink.test.js',
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

    // ThingsBoard analog uplink
    {
        input: './src/targets/thingsboard/analog/uplink/index.js',
        output: [
            {
                file: './dist/thingsboard/analog/develop/uplink.js',
                format: 'cjs',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/analog/uplink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/analog/uplink/template.js')
        ]
    },

    // ThingsBoard analog uplink tests
    {
        input: './src/targets/thingsboard/analog/uplink/test.js',
        output: [
            {
                file: './dist/thingsboard/analog/develop/uplink.test.js',
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
    },

    // ThingsBoard analog uplink for loriot
    {
        input: './src/targets/thingsboard/analog/uplink/loriot/index.js',
        output: [
            {
                file: './dist/thingsboard/analog/loriot/develop/uplink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/loriot/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/analog/loriot/uplink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/analog/uplink/loriot/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/analog/uplink/template.js')
        ]
    },

    // ThingsBoard MTX1 downlink
    {
        input: './src/targets/thingsboard/mtx1/downlink/index.js',
        output: [
            {
                file: './dist/thingsboard/mtx1/develop/downlink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx1/downlink/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/mtx1/downlink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx1/downlink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/mtx1/downlink/template.js')
        ]
    },

    // ThingsBoard MTX1 downlink tests
    {
        input: './src/targets/thingsboard/mtx1/downlink/test.js',
        output: [
            {
                file: './dist/thingsboard/mtx1/develop/downlink.test.js',
                format: 'iife'
            },
            {
                file: './dist/thingsboard/mtx1/downlink.test.min.js',
                format: 'iife',
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            // commonjs(),
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingsboard/mtx1/downlink/template.test.js')
        ]
    },

    // ThingsBoard MTX1 uplink
    {
        input: './src/targets/thingsboard/mtx1/uplink/index.js',
        output: [
            {
                file: './dist/thingsboard/mtx1/develop/uplink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx1/uplink/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/mtx1/uplink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx1/uplink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/mtx1/uplink/template.js')
        ]
    },

    // ThingsBoard MTX1 uplink tests
    {
        input: './src/targets/thingsboard/mtx1/uplink/test.js',
        output: [
            {
                file: './dist/thingsboard/mtx1/develop/uplink.test.js',
                format: 'iife'
            },
            {
                file: './dist/thingsboard/mtx1/uplink.test.min.js',
                format: 'iife',
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            // commonjs(),
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingsboard/mtx1/uplink/template.test.js')
        ]
    },


    // ThingsBoard MTX3 downlink
    {
        input: './src/targets/thingsboard/mtx3/downlink/index.js',
        output: [
            {
                file: './dist/thingsboard/mtx3/develop/downlink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx3/downlink/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/mtx3/downlink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx3/downlink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/mtx3/downlink/template.js')
        ]
    },

    // ThingsBoard MTX3 downlink tests
    {
        input: './src/targets/thingsboard/mtx3/downlink/test.js',
        output: [
            {
                file: './dist/thingsboard/mtx3/develop/downlink.test.js',
                format: 'iife'
            },
            {
                file: './dist/thingsboard/mtx3/downlink.test.min.js',
                format: 'iife',
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            //commonjs(),
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingsboard/mtx3/downlink/template.test.js')
        ]
    },

    // ThingsBoard MTX3 uplink
    {
        input: './src/targets/thingsboard/mtx3/uplink/index.js',
        output: [
            {
                file: './dist/thingsboard/mtx3/develop/uplink.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx3/uplink/init.js', 'utf8')
            },
            {
                file: './dist/thingsboard/mtx3/uplink.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/thingsboard/mtx3/uplink/init.js', 'utf8'),
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            thingsboardBabelPlugin,
            processTemplate('./src/targets/thingsboard/mtx3/uplink/template.js')
        ]
    },

    // ThingsBoard MTX3 uplink tests
    {
        input: './src/targets/thingsboard/mtx3/uplink/test.js',
        output: [
            {
                file: './dist/thingsboard/mtx3/develop/uplink.test.js',
                format: 'iife'
            },
            {
                file: './dist/thingsboard/mtx3/uplink.test.min.js',
                format: 'iife',
                plugins: [terser(thingsboardTerserOptions)]
            }
        ],
        plugins: [
            //commonjs(),
            nodeResolve(),
            babel({babelHelpers: 'bundled'}),
            processTemplate('./src/targets/thingsboard/mtx3/uplink/template.test.js')
        ]
    }, /**/


    // The Things Network analog (hardware type GASI3)
    {
        input: './src/targets/ttn/analog-gasi3/index.js',
        output: [
            {
                file: './dist/ttn/analog-gasi3.js',
                format: 'iife'
            }
        ],
        plugins: [
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/analog-gasi3/template.js')
        ]
    },

    // The Things Network analog (hardware type GASI3) test
    {
        input: './src/targets/ttn/analog-gasi3/test.js',
        output: [
            {
                file: './dist/ttn/analog-gasi3.test.js'
            }
        ],
        plugins: [
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/analog-gasi3/template.js')
        ],
        external: ['node:test', 'node:assert']
    },


    // The Things Network analog (hardware type GASIC)
    {
        input: './src/targets/ttn/analog-gasic/index.js',
        output: [
            {
                file: './dist/ttn/analog-gasic.js',
                format: 'iife'
            }
        ],
        plugins: [
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/analog-gasic/template.js')
        ]
    },

    // The Things Network analog (hardware type GASIC) test
    {
        input: './src/targets/ttn/analog-gasic/test.js',
        output: [
            {
                file: './dist/ttn/analog-gasic.test.js'
            }
        ],
        plugins: [
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/analog-gasic/template.js')
        ],
        external: ['node:test', 'node:assert']
    },


    // The Things Network analog (hardware type IMP4EU)
    {
        input: './src/targets/ttn/analog-imp4eu/index.js',
        output: [
            {
                file: './dist/ttn/analog-imp4eu.js',
                format: 'iife'
            }
        ],
        plugins: [
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/analog-imp4eu/template.js')
        ]
    },

    // The Things Network analog (hardware type IMP4EU) test
    {
        input: './src/targets/ttn/analog-imp4eu/test.js',
        output: [
            {
                file: './dist/ttn/analog-imp4eu.test.js'
            }
        ],
        plugins: [
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/analog-imp4eu/template.js')
        ],
        external: ['node:test', 'node:assert']
    },


    // The Things Network MTX1
    {
        input: './src/targets/ttn/mtx1/index.js',
        output: [
            {
                file: './dist/ttn/mtx1.js',
                format: 'iife',
                //banner: readFileSync('./src/targets/ttn/mtx1/init.js', 'utf8')
            }/* ,
            {
                file: './dist/ttn/mtx1/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/ttn/mtx1/init.js', 'utf8'),
                plugins: [terser(ttnTerserOptions)]
            } */
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/mtx1/template.js')
        ]
    },

    // The Things Network MTX1 test
    {
        input: './src/targets/ttn/mtx1/test.js',
        output: [
            {
                file: './dist/ttn/mtx1.test.js',
                //format: 'iife',
                //banner: readFileSync('./src/targets/ttn/mtx1/init.js', 'utf8')
            }/* ,
            {
                file: './dist/ttn/mtx1/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/ttn/mtx1/init.js', 'utf8'),
                plugins: [terser(ttnTerserOptions)]
            } */
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            commonjs(),
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/mtx1/template.js')
        ],
        external: ['node:test', 'node:assert']
    },

    // The Things Network MTX3
    {
        input: './src/targets/ttn/mtx3/index.js',
        output: [
            {
                file: './dist/ttn/mtx3.js',
                format: 'iife',
                //banner: readFileSync('./src/targets/ttn/mtx3/init.js', 'utf8')
            }/* ,
            {
                file: './dist/ttn/mtx3/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/ttn/mtx3/init.js', 'utf8'),
                plugins: [terser(ttnTerserOptions)]
            } */
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/mtx3/template.js')
        ]
    },

    // The Things Network MTX3 test
    {
        input: './src/targets/ttn/mtx3/test.js',
        output: [
            {
                file: './dist/ttn/mtx3.test.js',
                //format: 'iife',
                //banner: readFileSync('./src/targets/ttn/mtx3/init.js', 'utf8')
            }/* ,
            {
                file: './dist/ttn/mtx3/full.min.js',
                format: 'iife',
                banner: readFileSync('./src/targets/ttn/mtx3/init.js', 'utf8'),
                plugins: [terser(ttnTerserOptions)]
            } */
        ],
        plugins: [
            alias({
                entries: [
                    {find: '../utils/crypto.js', replacement: path.resolve('./src/utils/crypto.js')}
                ]
            }),
            commonjs(),
            nodeResolve(),
            ttnBabelPlugin,
            processTemplate('./src/targets/ttn/mtx3/template.js')
        ],
        external: ['node:test', 'node:assert']
    }
];
