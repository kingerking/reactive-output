import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

import pkg from './package.json';

export default {
    input: 'lib/index.js',
    output: {
        file: pkg.main,
        format: "cjs",
        sourcemap: true
    },
    external: ['lodash', "EventEmitter", "events", 'readline', 'debug', 'async'],
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        resolve(),
        commonjs()
    ]
}