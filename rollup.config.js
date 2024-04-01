import {nodeResolve} from '@rollup/plugin-node-resolve';
import {babel} from '@rollup/plugin-babel';
//import nodePolyfills from 'rollup-plugin-polyfill-node';
//import commonjs from '@rollup/plugin-commonjs';
import {readFileSync} from 'node:fs';


export default [
    // chirpstack
    {
        input: './src/chirpstack/index.js',
        output: {
            file: './dist/chirpstack/rollup.js',
            format: 'iife',
            banner: readFileSync('./src/chirpstack/init.js', 'utf8'),
            footer: readFileSync('./src/chirpstack/test.js', 'utf8')
        },
        plugins: [
            nodeResolve(),
            //nodePolyfills( /* options */ ),
            //commonjs(),
            babel({babelHelpers: 'bundled'}),
        ]
    }

    // ttn
];
