<template>
  <section class="p-4 bg-white w-full h-full flex flex-col items-start justify-center">
    <h2 class="dark:text-gray-200 block font-medium text-inherit">Файл</h2>

    <div class="flex flex-col w-full gap-4">
      <div class="flex items-center gap-2 bg-amber-50 w-fit h-fit p-4">
        <UIcon name="i-heroicons-document-text-solid" class="w-8 h-8"/>
        {{ data.document.fileName }}
      </div>

      <UForm :schema="schema" :state="state" class="space-y-4 w-1/2" @submit="onSubmit">
        <UFormField label="Номер документа" name="number">
          <UInput v-model="state.number"/>
        </UFormField>

        <UFormField label="Назва" name="name">
          <UInput v-model="state.name"/>
        </UFormField>

        <UButton type="submit">
          Продовжити
        </UButton>
      </UForm>
    </div>

  </section>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import {useUserStore} from "~/stores/useUserStore";

const props = defineProps<{
  data: object,
}>();

const runtimeConfig = useRuntimeConfig();

const userStore = useUserStore();
const { accessToken } = storeToRefs(userStore);

const pending = ref(false);
const emit = defineEmits<{
  (e: 'sendFile'): void
}>();

const schema = z.object({
  number: z.string(),
  name: z.string().min(3, 'Must be at least 3 characters')
})

type Schema = z.output<typeof schema>

const state = reactive({
  number: undefined,
  name: props.data.document.name ?? undefined,
})

async function onSubmit (event: FormSubmitEvent<Schema>) {
  await editDocument();
  // Do something with event.data
  //console.log(event.data)
}

async function editDocument() {
  pending.value = true;

  const formData = new FormData();

  formData.append('number', state.number);
  formData.append('name', state.name);

  await $fetch(`/documents/${props.data.document.id}`, {
    method: 'PUT',
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      Authorization: `Bearer ${accessToken.value}`,
    },
    body: formData,
    baseURL: runtimeConfig.public.apiBase,
    async onResponse({ request, response, options }) {
      // Log response
      // console.log("[fetch response]", request, response, response.body);

      if (response.ok) {
        pending.value = false;
        await navigateTo('/documents');
      }
    }
  })
}
</script>
