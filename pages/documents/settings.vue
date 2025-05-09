<template>
  <div class="bg-white">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Налаштування</h1>
        <p class="text-gray-600">Керуйте налаштуваннями системи</p>
      </header>

      <!-- Tabs -->
      <div class="flex mb-8 border-b border-gray-200">
        <NuxtLink to="/documents" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Усі документи
        </NuxtLink>
        <NuxtLink to="/documents/archive" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Архів
        </NuxtLink>
        <NuxtLink to="/documents/settings" class="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium -mb-px">
          Налаштування
        </NuxtLink>
      </div>

      <!-- Settings Sections -->
      <div class="grid gap-8">
        <!-- Archive Settings -->
        <ArchiveSettings />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ArchiveSettings from '~/components/Settings/ArchiveSettings.vue'
</script>
