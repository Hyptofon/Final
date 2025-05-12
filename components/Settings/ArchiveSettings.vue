<template>
  <div class="bg-white rounded-xl shadow-md border border-gray-100 p-6">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Налаштування архівування</h2>

    <div class="space-y-6">
      <!-- Увімкнення автоматичного архівування -->
      <div class="flex items-center justify-between">
        <div>
          <h3 class="text-sm font-medium text-gray-700">Автоматичне архівування</h3>
          <p class="text-sm text-gray-500">Автоматично архівувати документи за певних умов</p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
              type="checkbox"
              v-model="settings.autoArchiveEnabled"
              class="sr-only peer"
          >
          <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      <!-- Кількість днів до архівування -->
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-2">Архівувати документи старші за</h3>
        <div class="flex items-center gap-3">
          <input
              type="number"
              v-model.number="settings.autoArchiveDays"
              min="1"
              max="365"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              :disabled="!settings.autoArchiveEnabled"
          >
          <span class="text-gray-600">днів</span>
        </div>
      </div>

      <!-- Архівування завершених документів -->
      <div class="flex items-start gap-3">
        <input
            type="checkbox"
            id="archiveCompleted"
            v-model="settings.archiveCompletedDocs"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            :disabled="!settings.autoArchiveEnabled"
        >
        <div>
          <label for="archiveCompleted" class="text-sm font-medium text-gray-700">Архівувати завершені документи</label>
          <p class="text-sm text-gray-500">Автоматично архівувати документи зі статусом "Завершений"</p>
        </div>
      </div>

      <!-- Кнопки дій -->
      <div class="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <button
            @click="resetToDefaults"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Скинути до стандартних
        </button>
        <button
            @click="saveSettings"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Зберегти налаштування
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { useDocumentStore, type ArchiveSettings } from '~/composables/useDocumentStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { archiveSettings, updateArchiveSettings } = useDocumentStore()

// Локальна копія налаштувань для редагування
const settings = reactive<ArchiveSettings>({
  autoArchiveEnabled: false,
  autoArchiveDays: 30,
  archiveCompletedDocs: false
})

const isMounted = ref(false);
const initialSettings = ref<ArchiveSettings>({
  autoArchiveEnabled: false,
  autoArchiveDays: 30,
  archiveCompletedDocs: false
});

onMounted(() => {
  isMounted.value = true;

  // Initialize initialSettings with default values
  initialSettings.value = {
    autoArchiveEnabled: false,
    autoArchiveDays: 30,
    archiveCompletedDocs: false
  };

  // Override with values from archiveSettings if they exist
  if (archiveSettings) {
    initialSettings.value = {
      autoArchiveEnabled: archiveSettings.autoArchiveEnabled,
      autoArchiveDays: archiveSettings.autoArchiveDays,
      archiveCompletedDocs: archiveSettings.archiveCompletedDocs
    }
  }


  // Копіюємо налаштування з store
  settings.autoArchiveEnabled = initialSettings.value.autoArchiveEnabled;
  settings.autoArchiveDays = initialSettings.value.autoArchiveDays;
  settings.archiveCompletedDocs = initialSettings.value.archiveCompletedDocs;
})

// Збереження налаштувань
function saveSettings() {
  updateArchiveSettings({
    autoArchiveEnabled: settings.autoArchiveEnabled,
    autoArchiveDays: settings.autoArchiveDays,
    archiveCompletedDocs: settings.archiveCompletedDocs
  })
  toast.success('Налаштування архівування збережено')
}

// Скидання до стандартних налаштувань
function resetToDefaults() {
  settings.autoArchiveEnabled = initialSettings.value.autoArchiveEnabled;
  settings.autoArchiveDays = initialSettings.value.autoArchiveDays;
  settings.archiveCompletedDocs = initialSettings.value.archiveCompletedDocs;
  toast.info('Налаштування скинуто до стандартних')
}
</script>
