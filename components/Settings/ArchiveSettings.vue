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

      <!-- Стискання вмісту -->
      <div class="flex items-start gap-3">
        <input
            type="checkbox"
            id="compressContent"
            v-model="settings.compressContent"
            class="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        >
        <div>
          <label for="compressContent" class="text-sm font-medium text-gray-700">Стискати вміст при архівуванні</label>
          <p class="text-sm text-gray-500">Скорочувати довгий вміст документів при архівуванні для економії місця</p>
        </div>
      </div>

      <!-- Рівень стиснення -->
      <div v-if="settings.compressContent" class="ml-7 mt-2">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Рівень стиснення</h3>
        <div class="flex flex-col space-y-2">
          <label class="flex items-center gap-2 cursor-pointer">
            <input
                type="radio"
                v-model="settings.compressionLevel"
                value="light"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            >
            <span class="text-sm text-gray-700">Легкий (зберігає ~70% тексту)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
                type="radio"
                v-model="settings.compressionLevel"
                value="medium"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            >
            <span class="text-sm text-gray-700">Середній (зберігає ~50% тексту)</span>
          </label>
          <label class="flex items-center gap-2 cursor-pointer">
            <input
                type="radio"
                v-model="settings.compressionLevel"
                value="high"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            >
            <span class="text-sm text-gray-700">Сильний (зберігає ~30% тексту)</span>
          </label>
        </div>
      </div>

      <!-- Поріг стиснення -->
      <div v-if="settings.compressContent" class="ml-7">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Стискати тексти довші за</h3>
        <div class="flex items-center gap-3">
          <input
              type="number"
              v-model.number="settings.compressionThreshold"
              min="50"
              max="1000"
              step="10"
              class="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
          <span class="text-gray-600">символів</span>
        </div>
      </div>

      <!-- Демонстрація стиснення -->
      <div v-if="settings.compressContent" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Демонстрація стиснення</h3>
        <div class="mb-3">
          <div class="text-xs text-gray-500 mb-1">Оригінальний текст ({{ demoText.length }} символів):</div>
          <div class="text-sm bg-white p-2 rounded border border-gray-200 max-h-20 overflow-y-auto">
            {{ demoText }}
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-500 mb-1 flex justify-between">
            <span>Стиснутий текст ({{ compressedDemoText.length }} символів):</span>
            <span class="text-amber-600 font-medium">
              Стиснуто на {{ compressionRatio }}%
            </span>
          </div>
          <div class="text-sm bg-white p-2 rounded border border-gray-200 max-h-20 overflow-y-auto">
            {{ compressedDemoText }}
          </div>
        </div>

        <!-- Індикатор стиснення -->
        <div class="mt-3">
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
                class="bg-amber-500 h-2.5 rounded-full"
                :style="{ width: `${100 - compressionRatio}%` }"
            ></div>
          </div>
          <div class="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>Ефективність стиснення</span>
            <span>100%</span>
          </div>
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
import { reactive, onMounted, ref, computed } from 'vue'
import { useDocumentStore, type ArchiveSettings, type CompressionLevel } from '~/composables/useDocumentStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const { archiveSettings, updateArchiveSettings } = useDocumentStore()

// Локальна копія налаштувань для редагування
const settings = reactive<ArchiveSettings>({
  autoArchiveEnabled: archiveSettings.autoArchiveEnabled,
  autoArchiveDays: archiveSettings.autoArchiveDays,
  archiveCompletedDocs: archiveSettings.archiveCompletedDocs,
  compressContent: archiveSettings.compressContent,
  compressionLevel: archiveSettings.compressionLevel || "medium",
  compressionThreshold: archiveSettings.compressionThreshold || 100
})

const isMounted = ref(false);
const initialSettings = ref<ArchiveSettings>({
  autoArchiveEnabled: false,
  autoArchiveDays: 30,
  archiveCompletedDocs: false,
  compressContent: false,
  compressionLevel: "medium",
  compressionThreshold: 100
});

// Демонстраційний текст для прикладу стиснення
const demoText = ref(`Цей текст демонструє, як працює стиснення вмісту документів при архівуванні. Залежно від обраного рівня стиснення, буде збережено різну кількість тексту. Легкий рівень зберігає більшу частину тексту, середній - приблизно половину, а сильний - лише найважливішу інформацію на початку. Це дозволяє значно зменшити розмір архівованих документів, зберігаючи при цьому можливість розуміння їх змісту без повного розархівування.`);

// Функція для стискання демонстраційного тексту
function compressDemo(text: string, level: CompressionLevel, threshold: number): {
  compressedText: string,
  ratio: number
} {
  const originalLength = text.length;

  // Якщо текст коротший за поріг, повертаємо його без змін
  if (originalLength <= threshold) {
    return { compressedText: text, ratio: 0 };
  }

  let compressedText = "";
  let keepLength = 0;

  // Визначаємо скільки символів зберігати в залежності від рівня стиснення
  switch (level) {
    case "light":
      // Легке стиснення - зберігаємо 70% початку і додаємо "..."
      keepLength = Math.floor(originalLength * 0.7);
      compressedText = text.substring(0, keepLength) + "...";
      break;
    case "medium":
      // Середнє стиснення - зберігаємо початок і кінець, загалом 50%
      const mediumKeepStart = Math.floor(originalLength * 0.35);
      const mediumKeepEnd = Math.floor(originalLength * 0.15);
      compressedText =
          text.substring(0, mediumKeepStart) +
          "..." +
          text.substring(originalLength - mediumKeepEnd);
      break;
    case "high":
      // Сильне стиснення - зберігаємо 30% початку і додаємо "..."
      keepLength = Math.floor(originalLength * 0.3);
      compressedText = text.substring(0, keepLength) + "...";
      break;
    default:
      // За замовчуванням - середнє стиснення
      keepLength = Math.floor(originalLength * 0.5);
      compressedText = text.substring(0, keepLength) + "...";
  }

  // Обчислюємо відсоток стиснення
  const ratio = Math.round(
      ((originalLength - compressedText.length) / originalLength) * 100
  );

  return { compressedText, ratio };
}

// Обчислюємо стиснутий демо-текст на основі поточних налаштувань
const compressedDemoText = computed(() => {
  const result = compressDemo(
      demoText.value,
      settings.compressionLevel,
      settings.compressionThreshold
  );
  return result.compressedText;
});

// Обчислюємо відсоток стиснення
const compressionRatio = computed(() => {
  const result = compressDemo(
      demoText.value,
      settings.compressionLevel,
      settings.compressionThreshold
  );
  return result.ratio;
});

onMounted(() => {
  isMounted.value = true;

  // Initialize initialSettings with default values
  initialSettings.value = {
    autoArchiveEnabled: false,
    autoArchiveDays: 30,
    archiveCompletedDocs: false,
    compressContent: false,
    compressionLevel: "medium",
    compressionThreshold: 100
  };

  // Override with values from archiveSettings if they exist
  if (archiveSettings) {
    initialSettings.value = {
      autoArchiveEnabled: archiveSettings.autoArchiveEnabled,
      autoArchiveDays: archiveSettings.autoArchiveDays,
      archiveCompletedDocs: archiveSettings.archiveCompletedDocs,
      compressContent: archiveSettings.compressContent,
      compressionLevel: archiveSettings.compressionLevel || "medium",
      compressionThreshold: archiveSettings.compressionThreshold || 100
    };
  }

  // Копіюємо налаштування з store
  settings.autoArchiveEnabled = initialSettings.value.autoArchiveEnabled;
  settings.autoArchiveDays = initialSettings.value.autoArchiveDays;
  settings.archiveCompletedDocs = initialSettings.value.archiveCompletedDocs;
  settings.compressContent = initialSettings.value.compressContent;
  settings.compressionLevel = initialSettings.value.compressionLevel;
  settings.compressionThreshold = initialSettings.value.compressionThreshold;
})

// Збереження налаштувань
function saveSettings() {
  updateArchiveSettings({
    autoArchiveEnabled: settings.autoArchiveEnabled,
    autoArchiveDays: settings.autoArchiveDays,
    archiveCompletedDocs: settings.archiveCompletedDocs,
    compressContent: settings.compressContent,
    compressionLevel: settings.compressionLevel,
    compressionThreshold: settings.compressionThreshold
  })
  toast.success('Налаштування архівування збережено')
}
//123 test
// Скидання до стандартних налаштувань
function resetToDefaults() {
  settings.autoArchiveEnabled = initialSettings.value.autoArchiveEnabled;
  settings.autoArchiveDays = initialSettings.value.autoArchiveDays;
  settings.archiveCompletedDocs = initialSettings.value.archiveCompletedDocs;
  settings.compressContent = initialSettings.value.compressContent;
  settings.compressionLevel = initialSettings.value.compressionLevel;
  settings.compressionThreshold = initialSettings.value.compressionThreshold;
  toast.info('Налаштування скинуто до стандартних')
}
</script>
