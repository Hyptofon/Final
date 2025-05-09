<template>
  <Transition name="fade">
    <div v-if="visible" class="fixed inset-0 bg-white/5 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div class="bg-white/90 rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-scaleIn">
        <div class="p-6">
          <div class="flex items-center justify-center mb-4">
            <div class="bg-blue-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h3 class="text-lg font-medium text-gray-900 text-center mb-2">Підтвердження</h3>
          <p class="mb-6 text-center text-gray-600">{{ message }}</p>
          <div class="flex justify-center gap-3">
            <button
                @click="onCancel"
                class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Скасувати
            </button>
            <button
                @click="onConfirm"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Підтвердити
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>



<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Props
const props = defineProps<{
  visible: boolean
  message: string
}>()

// Emissions
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

<style scoped>
.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>