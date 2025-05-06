<template>
  <section class="p-4 bg-white w-full h-full flex flex-col items-start justify-start">
    <InterfaceFileUpload @onSelect="upload" :label="'PDF, DOC, DOCX, CSV, XLS or XLSX'" v-if="isUploadFileSuccess != 1"/>

    <div v-if="isUploadFileSuccess === 2" class="w-full pt-4 text-red-500 text-center">
      The file must be of type: PDF, DOC, DOCX, CSV, XLS, XLSX.
    </div>
  </section>
</template>
<script setup lang="ts">
import {useUserStore} from "~/stores/useUserStore";

const runtimeConfig = useRuntimeConfig();

const userStore = useUserStore();
const { accessToken } = storeToRefs(userStore);

const pending = ref(false);

const createdOn = ref();
const file = ref([]);

const emit = defineEmits<{
  (e: 'sendFile'): void
}>();

const formData = new FormData();
const isUploadFileSuccess = ref(0);
const upload = function (data) {
  file.value = [];
  //console.log(data, file)
  if (data.name) {
    file.value.push(data)

    formData.append('file', file.value[0]);
    formData.append('createdOn', new Date(data.lastModifiedDate).toISOString());
    formData.append('name', data.name);
    formData.append('contentType', data.type);

    uploadFile();
  }
  //emit('done');
}

async function uploadFile() {
  pending.value = true;

  await $fetch(`/documents`, {
    method: 'POST',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${accessToken.value}`,
    },
    body: formData,
    baseURL: runtimeConfig.public.apiBase,
  }).then(async response => {
    isUploadFileSuccess.value = 1;
    //console.log(response)
    if (response?.document.id) {
      isUploadFileSuccess.value = 1;
      await navigateTo(`/documents/edit/${response?.document.id}`);
    }
  }).catch((error)=> {
    isUploadFileSuccess.value = 2;
    //isDisabledContinue.value = true;

  }).finally(()=> {
    pending.value = false;
  });
}
</script>