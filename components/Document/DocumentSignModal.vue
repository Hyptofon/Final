<template>
  <div>
    <ClientOnly>
      <Head>
        <Script src="/scripts/common.js" defer/>
        <Script src="/scripts/euutils.js" defer/>
        <Script src="/scripts/euscpt.js" defer/>
        <Script src="/scripts/euscpm.js" defer/>
        <Script src="/scripts/euscp.js" defer/>
        <Script src="/scripts/fs/FileSaver.js" defer/>
        <Script src="/scripts/euscptest.js" defer/>
      </Head>

      <div class="relative z-10">
          <div class="overflow-y-auto">
            <div class="flex min-h-full items-center justify-center p-4 text-center">
              <div
                  class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <h3 class="text-lg font-medium leading-6 text-gray-900">Підпис документу</h3>
                <div>
                  <div>
                    <span class="" id="status">(завантаження...)</span>
                    <progress value="0" max="100" id="progress" hidden/>
                  </div>
                  <h6>Оберіть ЦСК</h6>
                  <div class="styled-select1">
                    <select
                        aria-label="Виберіть сервер"
                        id="CAsServersSelect"
                        class="w-full form-select px-3 py-2 outline-none cursor-pointer appearance-none border-2  ring-gray-300 focus:border-gray-300 border-gray-300  focus:ring-gray-300 bg-gray-200 outline-2 focus:outline-2"
                    />
                  </div>
                  <div>
                    <h6>Оберіть файл з особистим ключем та вкажіть пароль захисту</h6>
                  </div>
                  <div class="mb-4">
                    <div class="custom-file">
                      <input type="file" placeholder="Виберіть особистий ключ:" id="PKeyFileInput" accept="*"/>
                      <input id="PKeyPassword" placeholder="Введіть пароль від ЕЦП"
                             type="password" v-model="password"/>
                      <button @click="signFile" id="sign-btn">Підписати</button>
                      <p v-if="statusMessage">{{ statusMessage }}</p>

                    </div>
                    <input
                        type="hidden"
                        id="table-documents-list"
                        :value="JSON.stringify(docs)"
                    />

                    <input
                        type="hidden"
                        id="access-token"
                        :value="accessToken"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import {useUserStore} from "~/stores/useUserStore";
import { useUIStore } from "~/stores/useUIStore.js";
const userStore = useUserStore();
const { accessToken } = storeToRefs(userStore);

const props = withDefaults(defineProps<{
  documents?: object[],
}>(), {
  documents: [{id: 0, fileName: null}],
});
const uiControl = useUIStore();
const { docs } = storeToRefs(uiControl)

const password = ref('')
const statusMessage = ref('')

const signFile = () => {
  window.euSignTest?.signFile()
}

// function handleFileSelect(event) {
//   selectedFile.value = event.target.files[0]
// }

// async function initializeEUSign() {
//   return new Promise((resolve) => {
//     window.EUSignCPModuleLoaded = () => {
//       const euSign = new window.EUSignCP()
//       euSign.Initialize().then(() => resolve(euSign))
//     }
//   })
// }
//
// async function signFile() {
//   if (!selectedFile.value || !password.value) {
//     statusMessage.value = 'Please select a file and enter a password.'
//     return
//   }
//
//   try {
//     const euSign = await initializeEUSign()
//
//     // Set up your signing parameters, such as reading the key
//     euSign.SetJavaStringCompliant(true)
//
//     // Load the personal key
//     await euSign.ReadPrivateKeyFromFile(selectedFile.value, password.value)
//
//     // Assuming you want to sign the file itself
//     const signedData = await euSign.SignFile(selectedFile.value)
//
//     statusMessage.value = 'File signed successfully!'
//     console.log('Signed Data:', signedData) // You can save this data or send it to your server
//   } catch (error) {
//     console.error('Signing Error:', error)
//     statusMessage.value = 'Error signing file. Please check your password and try again.'
//   }
// }
</script>

<style scoped>
/* Add styling if necessary */
</style>
