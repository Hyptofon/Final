<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg w-full max-w-sm">
      <p class="mb-4 text-center">{{ message }}</p>
      <div class="flex justify-end space-x-2">
        <button @click="onCancel" class="px-4 py-2 border rounded">Скасувати</button>
        <button @click="onConfirm" class="bg-primary text-white px-4 py-2 rounded">Так</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Пропсы
const props = defineProps<{
  visible: boolean
  message: string
}>()

// Эмиссии через перегрузки
const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()

function onConfirm() {
  emit('confirm')
}

function onCancel() {
  emit('cancel')
}
</script>
