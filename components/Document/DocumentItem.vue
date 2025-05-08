<template>
  <tr :class="{ 'bg-amber-50 hover:bg-amber-100': document.isArchived, 'hover:bg-gray-50': !document.isArchived }" class="transition-colors">
    <!-- Checkbox -->
    <td class="px-4 py-4 whitespace-nowrap">
      <input
          type="checkbox"
          :checked="isSelected"
          @change="emit('select', document.id)"
          class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
      />
    </td>

    <!-- Title -->
    <td class="px-4 py-4">
      <div class="text-sm font-medium text-gray-900">{{ document.title }}</div>
    </td>

    <!-- Content -->
    <td class="px-4 py-4">
      <div class="text-sm text-gray-500 max-w-xs truncate">
        <span>{{ compressedContent }}</span>
        <span v-if="document.compressed" class="text-xs text-amber-600 font-medium ml-1 px-1.5 py-0.5 bg-amber-50 rounded-full">
          [compressed]
        </span>
      </div>
    </td>

    <!-- Status -->
    <td class="px-4 py-4 whitespace-nowrap">
      <span
          :class="{
          'px-3 py-1.5 rounded-full text-xs font-medium': true,
          'bg-green-100 text-green-800': document.status === 'completed',
          'bg-yellow-100 text-yellow-800': document.status === 'pending',
          'bg-blue-100 text-blue-800': document.status === 'active'
        }"
      >
        {{ document.status }}
      </span>
    </td>

    <!-- Created -->
    <td class="px-4 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ formattedDate }}</div>
    </td>

    <!-- Actions -->
    <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex gap-2 justify-end">
        <button
            v-if="!document.isArchived && !document.isDeleted"
            @click="emit('archive', document.id)"
            class="text-amber-600 hover:text-amber-900 transition-colors p-1.5 hover:bg-amber-50 rounded-full"
            title="Archive"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
        </button>

        <button
            v-if="document.isArchived && !document.isDeleted"
            @click="emit('unarchive', document.id)"
            class="text-blue-600 hover:text-blue-900 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
            title="Unarchive"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
            v-if="!document.isDeleted"
            @click="emit('delete', document.id)"
            class="text-red-600 hover:text-red-900 transition-colors p-1.5 hover:bg-red-50 rounded-full"
            title="Delete"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>

        <button
            v-if="document.isDeleted"
            @click="emit('restore', document.id)"
            class="text-green-600 hover:text-green-900 transition-colors p-1.5 hover:bg-green-50 rounded-full"
            title="Restore"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
            v-if="!document.isArchived && !document.isDeleted"
            @click="emit('edit', document)"
            class="text-blue-600 hover:text-blue-900 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
            title="Edit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { Document } from '~/composables/useDocumentStore'
// Type-only import
import type { PropType } from 'vue'

// Props
const props = defineProps({
  document: { type: Object as PropType<Document>, required: true },
  isSelected: { type: Boolean as PropType<boolean>, default: false }
})

// Emissions
const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'archive', id: number): void
  (e: 'unarchive', id: number): void
  (e: 'delete', id: number): void
  (e: 'restore', id: number): void
  (e: 'edit', doc: Document): void
}>()

// Compressed content
const compressedContent = computed(() => {
  const txt = props.document.content
  return txt.length > 50 ? txt.slice(0, 50) + '...' : txt
})

// Format date
const formattedDate = computed(() =>
    new Date(props.document.createdAt).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
)

// Unpacking for template
const { document, isSelected } = toRefs(props)
</script>