// vite.config.ts
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import checker from 'vite-plugin-checker'

import fs from 'fs'
import path from 'path'

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = (relative: string) => path.resolve(appDirectory, relative)
const srcRoot = resolveApp('src')

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, '../', '')

  const isProduction = env.VITE_APP_ENVIRONMENT === 'production'
  const isDevelopment = env.VITE_APP_ENVIRONMENT === 'development'
  const isAnalyze = env.VITE_APP_ENVIRONMENT === 'analyze'

  return {
    server: {
      port: Number(env.VITE_PORT || 5173),
    },

    publicDir: 'static',

    plugins: [
      vue(),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: '[name]',
      }),

      checker({
        overlay: isDevelopment
          ? { initialIsOpen: false }
          : false,

        typescript: true,
        eslint: {
          lintCommand:
            'eslint "{src,config}/**/*.{vue,js,ts}" --cache --max-warnings=999999',
        },
      }),

      ...(isAnalyze
        ? [
          visualizer({
            open: true,
          }),
        ]
        : []),
    ],

    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @import "@/styles/_functions.scss";
            @import "@/styles/_mixins.scss";
          `,
          quietDeps: true,
          silenceDeprecations: ['legacy-js-api', 'import', 'global-builtin', 'color-functions'],
        },
      },
    },

    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
      dedupe: ['vue'],
      alias: {
        '@config': `${srcRoot}/config.ts`,
        '@static': `${srcRoot}/../static`,
        '@contracts': `${srcRoot}/../../contracts/`,
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
