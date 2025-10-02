import esbuild from 'esbuild';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill';

await esbuild.build({
    entryPoints: ['expose-gsn.js'],
    bundle: true,                 // web3 1.2.11 wird MIT gebündelt
    minify: true,
    platform: 'browser',
    format: 'iife',               // sofort ausführbar
    // !!! KEIN globalName hier !!!
    target: ['es2018'],
    outfile: 'gsn-umd.min.js',
    define: {
        'process.env.NODE_ENV': '"production"',
        'global': 'window'
    },
    plugins: [
        NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
        NodeModulesPolyfillPlugin()
    ]
});
