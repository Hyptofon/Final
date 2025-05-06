<template>
  <tr :class="{ 'bg-gray-100': document.isArchived }">
    <!-- чекбокс -->
    <td class="py-2 px-2 border">
      <input
          type="checkbox"
          :checked="isSelected"
          @change="emit('select', document.id)"
      />
    </td>

    <!-- Title -->
    <td class="py-2 px-4 border">{{ document.title }}</td>

    <!-- Content -->
    <td class="py-2 px-4 border">
      <span v-if="document.compressed">{{ compressedContent }}</span>
      <span v-else>{{ document.content }}</span>
      <span v-if="document.compressed" class="text-xs text-gray-500 ml-1">
        [compressed]
      </span>
    </td>

    <!-- Status -->
    <td class="py-2 px-4 border">
      <span
          :class="{
          'px-2 py-1 rounded text-xs': true,
          'bg-green-100 text-green-800': document.status === 'completed',
          'bg-yellow-100 text-yellow-800': document.status === 'pending',
          'bg-blue-100 text-blue-800': document.status === 'active'
        }"
      >
        {{ document.status }}
      </span>
    </td>

    <!-- Created -->
    <td class="py-2 px-4 border">{{ formattedDate }}</td>

    <!-- Actions -->
    <td class="py-2 px-4 border">
      <div class="flex space-x-2">
        <button
            v-if="!document.isArchived && !document.isDeleted"
            @click="emit('archive', document.id)"
            class="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
        >Archive</button>

        <button
            v-if="document.isArchived && !document.isDeleted"
            @click="emit('unarchive', document.id)"
            class="bg-blue-500 text-white px-2 py-1 rounded text-xs"
        >Unarchive</button>

        <button
            v-if="!document.isDeleted"
            @click="emit('delete', document.id)"
            class="bg-red-500 text-white px-2 py-1 rounded text-xs"
        >Delete</button>

        <button
            v-if="document.isDeleted"
            @click="emit('restore', document.id)"
            class="bg-green-500 text-white px-2 py-1 rounded text-xs"
        >Restore</button>

        <button
            v-if="!document.isArchived && !document.isDeleted"
            @click="emit('edit', document)"
            class="bg-primary text-white px-2 py-1 rounded text-xs"
        >Edit</button>
      </div>
    </td>
  </tr>
</template>

<script setup lang="ts">
import { computed, toRefs } from 'vue'
import type { Document } from '~/composables/useDocumentStore'
// Ось тут — лише type-only імпорт!
import type { PropType } from 'vue'

// Пропси
const props = defineProps({
  document: { type: Object as PropType<Document>, required: true },
  isSelected: { type: Boolean as PropType<boolean>, default: false }
})

// Емісії
const emit = defineEmits<{
  (e: 'select', id: number): void
  (e: 'archive', id: number): void
  (e: 'unarchive', id: number): void
  (e: 'delete', id: number): void
  (e: 'restore', id: number): void
  (e: 'edit', doc: Document): void
}>()

// Стиснений контент
const compressedContent = computed(() => {
  const txt = props.document.content
  return txt.length > 50 ? txt.slice(0, 50) + '...' : txt
})

// Формат дати
const formattedDate = computed(() =>
    new Date(props.document.createdAt).toLocaleDateString()
)

// Розпаковка для шаблону
const { document, isSelected } = toRefs(props)
</script>
