import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())
  return {
    base: env.VITE_APP_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
    ],
    resolve: {
      alias: [{ find: '@', replacement: resolve(__dirname, 'src') }],
      extensions: ['.vue', '.js'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          // additionalData:
          //   '@use "@/scss/global.scss" as *;',
        },
      },
    },
    server: {
      port: 7878,
      open: true,
      outDir: 'dist',
    },

  }
})
