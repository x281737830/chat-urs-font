// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

const apiBaseUrl = "https://chat.ursai.xyz/urs/"

export default defineNuxtConfig({
  modules: [
    // '@nuxt/typescript-build',
    // '@vueuse/nuxt',
    '@nuxt/image',
    'nuxt-icon',
    '@element-plus/nuxt'
  ],
  css: [
    '/assets/css/tailwind.css',
    "@/assets/css/font.css",
    'element-plus/dist/index.css',
  ],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      apiBaseUrl,
    },
  },
  ssr: false
})