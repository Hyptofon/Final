<template>
  <div class="bg-white">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Архів</h1>
      </header>

      <!-- Tabs -->
      <div class="flex mb-8 border-b border-gray-200">
        <NuxtLink to="/documents" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Усі документи
        </NuxtLink>
        <NuxtLink to="/documents/archive" class="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium -mb-px">
          Архів
        </NuxtLink>
      </div>

      <!-- Пошук та фільтр -->
      <div class="flex flex-wrap gap-3 mb-6">
        <div class="relative flex-1 min-w-[240px]">
          <input
              v-model="search"
              placeholder="Пошук архівованих документів..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
            v-model="filterStatus"
            class="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">Всі статуси</option>
          <option value="active">Активний</option>
          <option value="pending">На розгляді</option>
          <option value="completed">Завершений</option>
        </select>
      </div>

      <!-- Сортування -->
      <div class="flex justify-between mb-6 flex-wrap gap-3">
        <div class="flex gap-2">
          <button
              @click="sortBy('title')"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center gap-1"
              :class="{'bg-blue-50': sortField==='title'}"
          >
            <span>Назва</span>
            <svg v-if="sortField === 'title'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="sortDirection==='desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 9l-7 7-7-7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <button
              @click="sortBy('createdAt')"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center gap-1"
              :class="{'bg-blue-50': sortField==='createdAt'}"
          >
            <span>Дата</span>
            <svg v-if="sortField === 'createdAt'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none"
                 viewBox="0 0 24 24" stroke="currentColor">
              <path v-if="sortDirection==='desc'" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 9l-7 7-7-7" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-600">Рядків:</span>
          <select
              v-model.number="pageSize"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="-1">Всі</option>
            <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
          </select>
          <button
              @click="resetFilters"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                 stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Скинути
          </button>
        </div>
      </div>

      <!-- Масові дії -->
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
              @click="bulkUnarchive"
              class="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
            Розархівувати вибрані
          </button>
          <button
              title="Видалити вибрані"
              class="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M6 18L18 6M6 6l12 12" />
            </svg>
            Видалити
          </button>
        </div>
      </div>


      <!-- Таблиця архіву -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th class="w-12 px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <input
                    type="checkbox"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Заголовок
              </th>
              <th class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Вміст
              </th>
              <th class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статус
              </th>
              <th class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата створення
              </th>
              <th class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата архівування
              </th>
              <th class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дії
              </th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr
                v-for="doc in paginated"
                :key="doc.id"
                class="bg-amber-50 hover:bg-amber-100 transition-colors"
            >
              <td class="px-3 py-4 whitespace-nowrap">
                <input
                    type="checkbox"
                    :checked="selectedIds.includes(doc.id)"
                    @change="toggleSelect(doc.id)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </td>
              <td class="px-3 py-4">
                <div class="text-sm font-medium text-gray-900">{{ doc.title }}</div>
              </td>
              <td class="px-3 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  <span>
                    {{ doc.content }}
                    <span v-if="doc.compressed" class="text-xs text-amber-600 font-medium ml-1">[стиснуто]</span>
                  </span>
                </div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <span
                    :class="{
                    'px-2.5 py-1 rounded-full text-xs font-medium': true,
                    'bg-green-100 text-green-800': doc.status==='completed',
                    'bg-yellow-100 text-yellow-800': doc.status==='pending',
                    'bg-blue-100 text-blue-800': doc.status==='active'
                  }"
                >
                  {{ statusLabels[doc.status] }}
                </span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(doc.createdAt) }}</div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <div class="text-sm text-amber-600 font-medium">{{ formatDate(doc.archivedAt||'') }}</div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex gap-2 justify-end">
                  <!-- Розархівувати -->
                  <button
                      @click="onUnarchiveRequested(doc.id)"
                      class="text-blue-600 hover:text-blue-900 transition-colors p-1.5 hover:bg-blue-50 rounded-full"
                      title="Розархівувати"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                    </svg>
                  </button>
                  <!-- Кошик (видалити) -->
                  <button
                      class="text-red-600 hover:text-red-800 transition-colors p-1.5 hover:bg-red-50 rounded-full"
                      title="Видалити"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                         viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="paginated.length===0">
              <td colspan="7" class="px-3 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                  <p class="text-lg font-medium">Архівованих документів не знайдено</p>
                  <p class="text-sm">Тут з’являться документи, які ви архівуєте</p>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Пагінація -->
      <div
          v-if="pageSize!==-1"
          class="flex justify-between items-center bg-white rounded-xl border border-gray-100 px-6 py-4 shadow-sm"
      >
        <div class="text-sm text-gray-700">
          Показано з <span class="font-medium">{{ start+1 }}</span> по <span class="font-medium">{{ Math.min(start+paginated.length, filtered.length) }}</span> з <span class="font-medium">{{ filtered.length }}</span> документів
        </div>
        <div class="flex gap-2">
          <button
              @click="page--"
              :disabled="page===1"
              class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Попередня
          </button>
          <button
              @click="page++"
              :disabled="page===totalPages || totalPages===0"
              class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Наступна
          </button>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useDocumentStore } from '~/composables/useDocumentStore'
import ConfirmDialog from '~/components/Interface/ConfirmDialog.vue'
import { useToast } from 'vue-toastification'

// Локалізація статусів
const statusLabels: Record<string, string> = {
  active: 'Активний',
  pending: 'На розгляді',
  completed: 'Завершений'
}

// Повідомлення (toast)
const toast = useToast()

// --- Стан підтвердження ---
const confirmVisible = ref(false)
const confirmMessage = ref('')
let pendingAction: (() => void) | null = null

function showConfirm(message: string, action: () => void) {
  confirmMessage.value = message
  pendingAction = action
  confirmVisible.value = true
}

function onDialogConfirm() {
  confirmVisible.value = false
  pendingAction?.()
  pendingAction = null
}

function onDialogCancel() {
  confirmVisible.value = false
  pendingAction = null
}

// --- Ініціалізація store ---
const {
  documents,
  loadDocuments,
  unarchiveDocument,
  checkAutoArchive,
  cleanupArchive
} = useDocumentStore()

// --- Стан вибраних документів ---
const selectedIds = ref<number[]>([])

function toggleSelect(id: number) {
  const index = selectedIds.value.indexOf(id)
  if (index === -1) {
    selectedIds.value.push(id)
  } else {
    selectedIds.value.splice(index, 1)
  }
}

const isAllSelected = computed(() =>
    filtered.value.length > 0 && selectedIds.value.length === filtered.value.length
)

function toggleSelectAll() {
  if (isAllSelected.value) {
    selectedIds.value = []
  } else {
    selectedIds.value = filtered.value.map(doc => doc.id)
  }
}

// --- Масове розархівування ---
function bulkUnarchive() {
  showConfirm(`Розархівувати ${selectedIds.value.length} вибраних документів?`, () => {
    selectedIds.value.forEach(id => unarchiveDocument(id))
    toast.success(`Розархівовано ${selectedIds.value.length} документ(ів)`)
    selectedIds.value = []
  })
}

// --- Підтвердження дії розархівування одного документа ---
function onUnarchiveRequested(id: number) {
  showConfirm('Ви впевнені, що хочете розархівувати цей документ?', () => {
    unarchiveDocument(id)
    toast.success('Документ успішно розархівовано')
  })
}

// --- Фільтрація, сортування, пагінація ---
const search = ref('')
const filterStatus = ref<'all' | 'active' | 'pending' | 'completed'>('all')

const sortField = ref<'title' | 'createdAt'>('createdAt')
const sortDirection = ref<'asc' | 'desc'>('desc')

const page = ref(1)
const pageSize = ref(10)

// Форматування дати
function formatDate(dateString: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Періодичні перевірки
const intervalId = ref<number | null>(null)

onMounted(() => {
  loadDocuments()
  checkAutoArchive()

  intervalId.value = window.setInterval(() => {
    checkAutoArchive()
    cleanupArchive()
  }, 3600000) // кожну годину
})

onUnmounted(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
})

// --- Обчислення списку ---
const filtered = computed(() => {
  let list = documents.value.filter(d => d.isArchived)

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
        A = new Date(A)
        B = new Date(B)
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

// --- Допоміжні функції ---
function sortBy(field: 'title' | 'createdAt') {
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

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>