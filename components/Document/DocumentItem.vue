<template>
  <tr :class="{ 'bg-amber-50 hover:bg-amber-100': document.isArchived, 'hover:bg-gray-50': !document.isArchived }" class="transition-colors">
    <!-- Прапорець -->
    <td class="px-4 py-4 whitespace-nowrap">
      <input
          type="checkbox"
          :checked="isSelected"
          @change="emit('select', document.id)"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
    </td>

    <!-- Заголовок -->
    <td class="px-4 py-4">
      <div class="text-sm font-medium text-gray-900">{{ document.title }}</div>
    </td>

    <!-- Вміст -->
    <td class="px-4 py-4">
      <div class="text-sm text-gray-500 max-w-xs truncate">
        <span>{{ compressedContent }}</span>
        <span v-if="showCompressedLabel" class="text-xs text-amber-600 font-medium ml-1 px-1.5 py-0.5 bg-amber-50 rounded-full">
          [стиснуто]
        </span>
      </div>
    </td>

    <!-- Статус -->
    <td class="px-4 py-4 whitespace-nowrap">
      <span
          :class="{
          'px-3 py-1.5 rounded-full text-xs font-medium': true,
          'bg-green-100 text-green-800': document.status === 'completed',
          'bg-yellow-100 text-yellow-800': document.status === 'pending',
          'bg-blue-100 text-blue-800': document.status === 'active',
          'bg-amber-100 text-amber-800': document.status === 'archived'
        }"
      >
        {{ statusLabels[document.status] || document.status }}
      </span>
    </td>

    <!-- Дата створення -->
    <td class="px-4 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ formattedDate }}</div>
    </td>

    <!-- Дії -->
    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex gap-2 justify-end">
        <button
            v-if="!document.isArchived && !document.isDeleted"
            @click="emit('archive', document.id)"
            class="text-amber-600 hover:text-amber-900 transition-colors p-1.5 hover:bg-amber-50 rounded-full"
            title="Архівувати"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </button>

        <button
            v-if="document.isArchived && !document.isDeleted"
            @click="emit('unarchive', document.id)"
            class="text-blue-600 hover:text-blue-900 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
            title="Розархівувати"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>


<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { Document } from '~/composables/useDocumentStore'
import type { PropType } from 'vue'

// Мапа статусів для локалізації
const statusLabels: Record<string, string> = {
  active: 'Активний',
  pending: 'На розгляді',
  completed: 'Завершений',
  archived: 'Архівовано'
}

// Props
const props = defineProps({
  document: { type: Object as PropType<Document>, required: true },
  isSelected: { type: Boolean as PropType<boolean>, default: false }
})

// Emits
const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'archive', id: number): void
  (e: 'unarchive', id: number): void
}>()

// Compressed content
const compressedContent = computed(() => {
  const txt = props.document.content
  return txt
})

// Визначаємо, чи потрібно показувати мітку стиснення
const showCompressedLabel = computed(() => {
  // Перевіряємо, чи документ стиснутий
  if (!props.document.compressed) return false;

  // Перевіряємо довжину контенту - якщо більше 100 символів, показуємо мітку
  return props.document.content.length > 100 ||
      (props.document.previousState?.originalContentLength || 0) > 100;
})

// Format date
const formattedDate = computed(() =>
    new Date(props.document.createdAt).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
)

// Для шаблону
const { document, isSelected } = toRefs(props)
</script>
