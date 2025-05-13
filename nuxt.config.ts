// https://nuxt.com/docs/api/configuration/nuxt-config
//import { getIconCollections } from '@egoist/tailwindcss-icons'
export default defineNuxtConfig({
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  runtimeConfig: {
    public: {
      apiBase: 'https://umsystem-documents.azurewebsites.net/', // can be overridden by NUXT_PUBLIC_API_BASE environment variable
    }
  },
  plugins: [
    '~/plugins/toastification.ts',
  ],
  //ssr: false,
  devtools: { enabled: true },
  colorMode: {
    preference: 'light'
  },
  modules: [
    "@nuxt/ui",
    "@nuxtjs/google-fonts",
    'floating-vue/nuxt',
    'nuxt-vue3-google-signin',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  googleSignIn: {
    clientId: '646900796778-8r8t7r2rktkjc7h1gtb4vg7081a7anmn.apps.googleusercontent.com',
   // GOOGLE_CLIENT_SECRET='nMnxT3352vAhuzxSd1B5jgp0'
  },
  piniaPluginPersistedstate: {
    storage: 'cookies',
    cookieOptions: {
      sameSite: 'lax',
    },
  },
  ui: {
    //global: true,
    // icons: {
    //   dynamic: true,
    //   collections: {
    //     umsys: {
    //       icons: {}
    //     },
    //     ...getIconCollections(['heroicons'])
    //   }
    // },
  },
  // components: {
  //   dirs: [
  //     {
  //       path: './components'
  //     }
  //   ]
  // },
  css: [
    '~/assets/css/main.css',
    '@/assets/css/floating.css',
  ],
  vite: {
    plugins: [
      //tailwindcss(),

    ],
  },
  googleFonts: {
    families: {
      Heebo: {
        wght: [100, 400, 500, 600, 700],
        ital: [400]
      },
    },
    download: true,
    overwriting: false
  },
  compatibilityDate: '2024-08-08'
})