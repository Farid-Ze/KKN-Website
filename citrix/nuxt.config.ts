import { defineNuxtConfig } from 'nuxt/config';
import vitePluginGlsl from 'vite-plugin-glsl';

export default defineNuxtConfig({
  devtools: { enabled: false },

  modules: [
    '@pinia/nuxt'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  vite: {
    plugins: [
      vitePluginGlsl()
    ]
  },

  app: {
    head: {
      title: 'Red Bull Racing + Citrix | Scrollytelling Engine 2026',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'description', content: 'Immersive 3D Scrollytelling Engine built with Nuxt 3, Three.js WebGL, and Web Audio API.' },
        { name: 'theme-color', content: '#0B101E' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  typescript: {
    strict: true,
    typeCheck: false
  }
});
