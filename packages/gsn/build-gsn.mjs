import esbuild from 'esbuild'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'

esbuild.build({
    entryPoints: ['expose-gsn.js'],
    bundle: true,
    format: 'iife',
    globalName: 'Gsn',            // erzeugt window.Gsn
    outfile: 'gsn-umd.min.js',
    minify: true,
    platform: 'browser',
    define: {
        'process.env.NODE_ENV': '"production"',
        'global': 'window',
    },
    plugins: [
        NodeGlobalsPolyfillPlugin({ process: true, buffer: true }),
        NodeModulesPolyfillPlugin(),
    ],
}).catch(() => process.exit(1))
