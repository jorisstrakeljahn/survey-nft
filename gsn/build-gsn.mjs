// build-gsn.mjs
import esbuild from 'esbuild';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const web3ShimPlugin = {
    name: 'web3-shim',
    setup(build) {
        build.onResolve({ filter: /^web3$/ }, (args) => {
            const shimPath = path.resolve(__dirname, './web3-global-shim.js');
            return { path: shimPath };
        });
    }
};

await esbuild.build({
    entryPoints: ['expose-gsn.js'],
    bundle: true,
    minify: false,
    platform: 'browser',
    format: 'iife',
    target: ['es2018'],
    outfile: 'gsn-umd.js',
    define: { 'process.env.NODE_ENV': '"production"', 'global': 'window' },
    plugins: [
        NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
        NodeModulesPolyfillPlugin(),
        web3ShimPlugin,
    ],
});

console.log('[build] gsn-umd.js ready');
