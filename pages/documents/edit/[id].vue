<template>
    <div class="flex items-center space-x-4" v-if="status === 'pending'">
      <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
      <div class="space-y-2">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
    </div>

  <InterfaceFileEditForm :data="data" v-if="data"/>

  <pre class="overflow-x-hidden">{{data}}</pre>
</template>

<script setup lang="ts">
import {useUserStore} from "~/stores/useUserStore";

const route = useRoute();
const runtimeConfig = useRuntimeConfig();
const userStore = useUserStore();
const { accessToken } = storeToRefs(userStore);

const { data, status } = await useLazyFetch(() => `/documents/${route.params.id}`, {
  headers: {
    Authorization: `Bearer ${accessToken.value}`,
  },
  baseURL: runtimeConfig.public.apiBase,
});
</script>