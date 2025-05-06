import { defineNuxtPlugin } from '#app'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(Toast, {
        // POSITION.TOP_RIGHT гарантовано коректний елемент із типу
        position: POSITION.TOP_RIGHT,
        timeout: 3000,
        closeOnClick: true,
    })
})
