<template>
  <div class="bg-white">
    <div class="container mx-auto p-6">
      <!-- Tabs -->
      <div class="flex mb-8 border-b border-gray-200">
        <NuxtLink to="/documents" class="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium -mb-px">
          Усі документи
        </NuxtLink>
        <NuxtLink to="/documents/archive" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Архів
        </NuxtLink>
        <NuxtLink to="/documents/settings" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Налаштування
        </NuxtLink>
      </div>

      <!-- Search, Filter, and Add -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div class="relative flex-1 min-w-[300px]">
          <input
              v-model="search"
              placeholder="Пошук документів..."
              class="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
            v-model="filterStatus"
            class="px-4 py-3.5 rounded-xl border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm min-w-[180px]"
        >
          <option value="all">Всі статуси</option>
          <option value="active">Активний</option>
          <option value="pending">На розгляді</option>
          <option value="completed">Завершений</option>
          <option value="archived">Архівовано</option>
        </select>
        <button
            @click="showAddEditModal = true; editingDocument = null"
            class="px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Додати документ
        </button>
      </div>

      <!-- Sort Controls -->
      <div class="flex justify-between mb-6 flex-wrap gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <div class="flex gap-3">
          <button
              @click="sortBy('title')"
              class="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
              :class="{'bg-blue-50 border-blue-200 text-blue-700': sortField === 'title'}"
          >
            <span>Назва</span>
            <svg v-if="sortField === 'title'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-if="sortDirection === 'desc'" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-else />
            </svg>
          </button>
          <button
              @click="sortBy('createdAt')"
              class="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
              :class="{'bg-blue-50 border-blue-200 text-blue-700': sortField === 'createdAt'}"
          >
            <span>Дата</span>
            <svg v-if="sortField === 'createdAt'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-if="sortDirection === 'desc'" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-else />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-gray-600 font-medium">Рядків:</span>
          <select
              v-model.number="pageSize"
              class="px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          >
            <option value="-1">Всі</option>
            <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
          </select>
          <button
              @click="resetFilters"
              class="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Скинути
          </button>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div
          v-if="selectedIds.length > 0"
          class="mb-6 p-5 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between animate-fadeIn shadow-sm"
      >
        <span class="text-blue-700 font-medium flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          {{ selectedIds.length }} документів вибрано
        </span>
        <div class="flex gap-3">
          <button
              @click="bulkArchive"
              class="px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Архівувати вибрані
          </button>
        </div>
      </div>

      <!-- Documents Table -->
      <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-8">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="w-12 px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Заголовок</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Вміст</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата створення</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дії</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-100">
            <tr v-for="doc in paginated" :key="doc.id" :class="{ 'bg-amber-50': doc.isArchived }" class="hover:bg-gray-50 transition-colors">
              <td class="px-4 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    :checked="selectedIds.includes(doc.id)"
                    @change="toggleSelect(doc.id)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <td class="px-4 py-4">
                <div class="text-sm font-medium text-gray-900">{{ doc.title }}</div>
              </td>
              <td class="px-4 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  <span>{{ doc.content }}</span>
                  <span v-if="shouldShowCompressedLabel(doc)" class="text-xs text-amber-600 font-medium ml-1 px-1.5 py-0.5 bg-amber-50 rounded-full">
                    [стиснуто]
                  </span>
                </div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                  <span
                      :class="{
                      'px-3 py-1.5 rounded-full text-xs font-medium': true,
                      'bg-green-100 text-green-800': doc.status === 'completed',
                      'bg-yellow-100 text-yellow-800': doc.status === 'pending',
                      'bg-blue-100 text-blue-800': doc.status === 'active'
                    }"
                  >
                      {{ statusLabels[doc.status] }}
                  </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(doc.createdAt) }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex gap-3">
                  <button
                      v-if="!doc.isArchived"
                      @click="onArchiveRequested(doc.id)"
                      class="text-amber-600 hover:text-amber-900 transition-colors p-1.5 hover:bg-amber-50 rounded-full"
                      title="Архівувати"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="paginated.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-xl font-medium mb-1">Документів не знайдено</p>
                  <p class="text-sm">Спробуйте змінити критерії пошуку або фільтра</p>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div
          v-if="pageSize !== -1"
          class="flex justify-between items-center bg-white rounded-xl border border-gray-100 px-6 py-4 shadow-sm"
      >
        <div class="text-sm text-gray-700 font-medium">
          Показано з <span class="font-semibold text-blue-600">{{ start + 1 }}</span> по <span class="font-semibold text-blue-600">{{ Math.min(start + paginated.length, filtered.length) }}</span> з <span class="font-semibold text-blue-600">{{ filtered.length }}</span> документів
        </div>
        <div class="flex gap-3">
          <button
              @click="page--"
              :disabled="page === 1"
              class="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Попередня
          </button>
          <button
              @click="page++"
              :disabled="page === totalPages || totalPages === 0"
              class="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1"
          >
            Наступна
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Document Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-white/10 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-scaleIn">
        <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">{{ editingDocument ? 'Редагувати документ' : 'Додати новий документ' }}</h2>
          <button @click="showAddEditModal = false" class="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>


        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Заголовок</label>
            <input
                v-model="formData.title"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Введіть заголовок документа"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Вміст</label>
            <textarea
                v-model="formData.content"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Введіть вміст документа"
            ></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
                v-model="formData.status"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="active">Активний</option>
              <option value="pending">На розгляді</option>
              <option value="completed">Завершений</option>
            </select>
          </div>

          <div class="flex justify-end gap-3">
            <button
                @click="showAddEditModal = false"
                class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Скасувати
            </button>
            <button
                @click="saveDocument"
                class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Зберегти документ
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Dialog -->
    <ConfirmDialog
        :visible="confirmVisible"
        :message="confirmMessage"
        @confirm="onDialogConfirm"
        @cancel="onDialogCancel"
    />
  </div>
</template>


<script setup lang="ts">
import { ref, computed, reactive, onUnmounted, onMounted } from 'vue'
import { useDocumentStore, type Document } from '~/composables/useDocumentStore'
import ConfirmDialog from '~/components/Interface/ConfirmDialog.vue'
import { useToast } from 'vue-toastification'


const statusLabels: Record<string, string> = {
  active: 'Активний',
  pending: 'На розгляді',
  completed: 'Завершений',
  archived: 'Архівовано'
}

// Toast notifications
const toast = useToast()

// --- ConfirmDialog state & helpers ---
const confirmVisible = ref(false)
const confirmMessage = ref('')
const pendingAction = ref<(() => void) | null>(null)

function showConfirm(message: string, action: () => void) {
  confirmMessage.value = message
  pendingAction.value = action
  confirmVisible.value = true
}

function onDialogConfirm() {
  confirmVisible.value = false
  pendingAction.value?.()
  pendingAction.value = null
}

function onDialogCancel() {
  confirmVisible.value = false
  pendingAction.value = null
}

// --- Store initialization ---
const {
  documents,
  loadDocuments,
  addDocument,
  archiveDocument,
  checkAutoArchive,
  cleanupArchive
} = useDocumentStore()

// --- Document selection state ---
const selectedIds = ref<number[]>([])

function toggleSelect(id: number) {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const isAllSelected = computed(() => {
  return filtered.value.length > 0 && selectedIds.value.length === filtered.value.length
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filtered.value.map(doc => doc.id)
  }
}

function bulkArchive() {
  showConfirm(`Архів ${selectedIds.value.length} вибрані документи?`, () => {
    selectedIds.value.forEach(id => archiveDocument(id))
    toast.success('Документи архівовано')
    selectedIds.value = []
  })
}

// --- Confirmation wrappers ---
function onArchiveRequested(id: number) {
  showConfirm('Ви впевнені, що хочете архівувати цей документ?', () => {
    archiveDocument(id)
    toast.success('Документ успішно архівовано')
  })
}

// Функція для визначення, чи показувати мітку стиснення
function shouldShowCompressedLabel(doc: Document): boolean {
  // Перевіряємо, чи документ стиснутий
  if (!doc.compressed) return false;

  // Перевіряємо довжину контенту - якщо понад 100 символів, показуємо мітку
  return doc.content.length > 100 ||
      (doc.previousState?.originalContentLength || 0) > 100;
}

// --- Filter, sort & pagination state ---
const search = ref('')
const filterStatus = ref<'all'|'active'|'pending'|'completed'|'archived'>('all')

const sortField = ref<'title'|'createdAt'>('createdAt')
const sortDirection = ref<'asc'|'desc'>('desc')

const page = ref(1)
const pageSize = ref(10)

// --- Add/Edit Document Modal ---
const showAddEditModal = ref(false)
const editingDocument = ref<Document | null>(null)
const formData = reactive({
  title: '',
  content: '',
  status: 'active' as 'active' | 'pending' | 'completed'
})

function saveDocument() {
  if (!formData.title.trim()) {
    toast.error("Заголовок обов'язковий")
    return
  } else {
    addDocument({
      title: formData.title,
      content: formData.content,
      status: formData.status
    })
    toast.success('Документ успішно додано')
  }
  showAddEditModal.value = false
}

// Format date helper
function formatDate(dateString: string) {
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

let intervalId: number | null = null;
const toastRef = ref(useToast());

const loadAndSetupPeriodicChecks = () => {
  loadDocuments();
  checkAutoArchive();
  cleanupArchive();

  intervalId = window.setInterval(() => {
    checkAutoArchive();
    cleanupArchive();
  }, 3600000);
};

onMounted(() => {
  loadAndSetupPeriodicChecks();
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

// --- Computed lists ---
const filtered = computed(() => {
  let list = documents.value.filter(d => !d.isArchived)

  if (search.value) {
    const q = search.value.toLowerCase()
    list = list.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value !== 'all') {
    list = list.filter(d => d.status === filterStatus.value)
  }

  return list
})

const sorted = computed(() =>
    [...filtered.value].sort((a, b) => {
      let A: any = a[sortField.value], B: any = b[sortField.value]
      if (sortField.value === 'createdAt') {
        A = new Date(A); B = new Date(B)
      }
      return sortDirection.value === 'asc' ? (A > B ? 1 : -1) : (A < B ? 1 : -1)
    })
)

const start = computed(() => (page.value - 1) * pageSize.value)
const paginated = computed(() =>
    pageSize.value === -1
        ? sorted.value
        : sorted.value.slice(start.value, start.value + pageSize.value)
)
const totalPages = computed(() =>
    Math.ceil(filtered.value.length / pageSize.value) || 1
)

// --- Helpers ---
function sortBy(field: 'title'|'createdAt') {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

function resetFilters() {
  search.value = ''
  filterStatus.value = 'all'
  pageSize.value = 10
  sortField.value = 'createdAt'
  sortDirection.value = 'desc'
  page.value = 1
  selectedIds.value = []
  loadDocuments()
}
</script>


<style>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

.animate-scaleIn {
  animation: scaleIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
</style>
