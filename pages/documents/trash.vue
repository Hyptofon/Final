<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Trash</h1>
        <p class="text-gray-600">Documents pending permanent deletion</p>
      </header>

      <!-- Tabs -->
      <div class="flex mb-8 border-b border-gray-200">
        <NuxtLink to="/documents" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          All Documents
        </NuxtLink>
        <NuxtLink to="/documents/archive" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Archive
        </NuxtLink>
        <NuxtLink to="/documents/trash" class="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium -mb-px">
          Trash
        </NuxtLink>
      </div>

      <!-- Search and filter -->
      <div class="flex flex-wrap gap-3 mb-6">
        <div class="relative flex-1 min-w-[240px]">
          <input
              v-model="search"
              placeholder="Search trash..."
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <select
            v-model="filterStatus"
            class="px-4 py-2.5 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <!-- Sort controls -->
      <div class="flex justify-between mb-6 flex-wrap gap-3">
        <div class="flex gap-2">
          <button
              @click="sortBy('title')"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center gap-1"
          >
            <span>Title</span>
            <svg v-if="sortField === 'title'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-if="sortDirection === 'desc'" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-else />
            </svg>
          </button>
          <button
              @click="sortBy('createdAt')"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center gap-1"
          >
            <span>Date</span>
            <svg v-if="sortField === 'createdAt'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-if="sortDirection === 'desc'" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-else />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-gray-600">Rows:</span>
          <select
              v-model.number="pageSize"
              class="px-3 py-2 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
          </select>
          <button
              @click="resetFilters"
              class="px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-all flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
          </button>
        </div>
      </div>

      <!-- Trash table -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-3 py-3.5 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="doc in paginated" :key="doc.id" class="bg-red-50 hover:bg-red-100 transition-colors">
              <td class="px-3 py-4">
                <div class="text-sm font-medium text-gray-900">{{ doc.title }}</div>
              </td>
              <td class="px-3 py-4">
                <div class="text-sm text-gray-500 max-w-xs truncate">
                  <span>{{ doc.content }} <span v-if="doc.compressed" class="text-xs text-red-600 font-medium ml-1">[compressed]</span></span>
                </div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                  <span
                      :class="{
                      'px-2.5 py-1 rounded-full text-xs font-medium': true,
                      'bg-green-100 text-green-800': doc.status === 'completed',
                      'bg-yellow-100 text-yellow-800': doc.status === 'pending',
                      'bg-blue-100 text-blue-800': doc.status === 'active'
                    }"
                  >
                    {{ doc.status }}
                  </span>
              </td>
              <td class="px-3 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(doc.createdAt) }}</div>
              </td>
              <td class="px-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                    @click="onRestoreRequested(doc.id)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Restore
                </button>
              </td>
            </tr>
            <tr v-if="paginated.length === 0">
              <td colspan="5" class="px-3 py-8 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <p class="text-lg font-medium">No documents in trash</p>
                  <p class="text-sm">Deleted documents will appear here</p>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center bg-white rounded-lg border border-gray-200 px-4 py-3">
        <div class="text-sm text-gray-700">
          Showing <span class="font-medium">{{ start + 1 }}</span> to <span class="font-medium">{{ Math.min(start + paginated.length, filtered.length) }}</span> of <span class="font-medium">{{ filtered.length }}</span> documents
        </div>
        <div class="flex gap-2">
          <button
              @click="page--"
              :disabled="page === 1"
              class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >Previous</button>
          <button
              @click="page++"
              :disabled="page === totalPages || totalPages === 0"
              class="px-3 py-1 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >Next</button>
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
import { ref, computed, onMounted } from 'vue'
import { useDocumentStore } from '~/composables/useDocumentStore'
import ConfirmDialog from '~/components/Interface/ConfirmDialog.vue'
import { useToast } from 'vue-toastification'

// Toast notifications
const toast = useToast()

// --- ConfirmDialog state & helpers ---
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

// --- Store initialization ---
const {
  documents,
  loadDocuments,
  restoreDocument
} = useDocumentStore()

// --- Filter, sort & pagination state ---
const search = ref('')
const filterStatus = ref<'all'|'active'|'pending'|'completed'>('all')

const sortField = ref<'title'|'createdAt'>('createdAt')
const sortDirection = ref<'asc'|'desc'>('desc')

const page = ref(1)
const pageSize = ref(10)

// Load documents only once
const isLoaded = ref(false);

onMounted(() => {
  if (!isLoaded.value) {
    loadDocuments();
    isLoaded.value = true;
  }
})

// --- Confirmation wrappers ---
function onRestoreRequested(id: number) {
  showConfirm('Are you sure you want to restore this document?', () => {
    restoreDocument(id)
    toast.success('Document restored successfully')
  })
}

// Format date helper
function formatDate(dateString: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// --- Computed lists ---
const filtered = computed(() => {
  let list = documents.value.filter(d => d.isDeleted)

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
    sorted.value.slice(start.value, start.value + pageSize.value)
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
  page.value = 1
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