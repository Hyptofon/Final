<template>
  <UCard
      v-if="data.document"
      class="w-full"
      :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: { padding: 'p-4', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
      footer: { padding: 'p-4' }
    }"
  >
    <template #header>
      <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
        Документ: {{data.document.name}} <span class="text-sm">( <a :href="data.link">{{data.document.fileName}}</a> )</span>
      </h2>
    </template>

    <section class="w-full flex">
      <div class="w-2/3">
        {{data.link}}
      </div>
      <aside class="w-1/3 flex flex-col text-sm">
        <InterfaceTabs v-model:current-tab-name="currentTab" :tabs="tabs" class="mb-4"/>

        <template v-if="currentTab === 'info'">
          <div class="flex items-center justify-between">
            <UButton label="Open" @click="isSignModalOpen = true" />
            <UButton label="Close" @click="isSignModalOpen = false" />
          </div>
          <div class="flex items-center justify-between">
            <span>Файл: </span>
            <span><a :href="data.link">{{data.document.fileName}}</a></span>
          </div>
          <div class="flex items-center justify-between">
            <span>Ідентифікатор: </span>
            <span>{{data.document.id}}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Тип: </span>
            <span>{{data.document.contentType}}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Розмір:</span>
            <span>{{ (data.document.fileSize / 1024).toFixed(2) }} Кб</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Дата останньої зміни: </span>
            <span>{{ formatDate(data.document.modifiedOn) }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span>Номер: </span>
            <span>{{data.document.number}}</span>
          </div>
        </template>

        <DocumentHistory v-if="currentTab === 'history'" :data="data"/>
      </aside>
    </section>
  </UCard>
  <UModal v-model="isOpen" v-if="isOpen">
    <div class="p-4">
<!--      <DocumentSignModal :documents="[{id: data.document.id, fileName: data.document.fileName}]"/>-->
    </div>
  </UModal>


  <pre class="overflow-x-hidden">{{data}}</pre>
</template>

<script setup lang="ts">
import {useUserStore} from "~/stores/useUserStore";
import DocumentHistory from "~/components/Document/DocumentHistory.vue";
import DocumentSignModal from "~/components/Document/DocumentSignModal.vue";
import {useUIStore} from "~/stores/useUIStore";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();
const { accessToken } = storeToRefs(userStore);
const uiControl = useUIStore();
const { isSignModalOpen, docs } = storeToRefs(uiControl)



const isOpen = ref(false);
const formatDate = (dateStr) => useDateFormat(dateStr, 'DD.MM.YYYY HH:mm:ss', { locales: 'uk-UA' });

const currentTab = ref('info');
const tabs = [
  {
    name: 'info',
    label: 'Інформація',
  },
  {
    name: 'history',
    label: 'Історія',
  }
];

const { data, status } = await useLazyAsyncData<{
  id: number
  title: string
  completed: string
}[]>('doc', () => ($fetch as any)(`/documents/${route.params.id}/view`, {
  headers: {
    Authorization: `Bearer ${accessToken.value}`,
  },
  baseURL: runtimeConfig.public.apiBase,
}), {
  default: () => [],
})
docs.value = [{id: route.params.id, fileName: 'data.value?.document?.fileName'}]
</script>