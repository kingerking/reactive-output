import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

import pkg from './package.json';

export default {
    input: 'lib/index.js',
    output: {
        file: 'core.js',
        dir: "dist",
        format: "cjs"
    },
    plugins: [
        resolve(),
        commonjs()
    ]
}