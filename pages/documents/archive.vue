<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Archive</h1>

    <!-- Пошук та фільтр по статусу -->
    <div class="flex space-x-2 mb-4">
      <input
          v-model="search"
          placeholder="Search archived..."
          class="flex-1 border rounded px-3 py-2"
      />
      <select v-model="filterStatus" class="border rounded px-3 py-2">
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
      </select>
    </div>

    <!-- Сортування та керування сторінками -->
    <div class="flex justify-between mb-4">
      <div>
        <button @click="sortBy('title')" class="px-3 py-2 border rounded mr-2">
          Sort by Title
          <span v-if="sortField === 'title'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </button>
        <button @click="sortBy('createdAt')" class="px-3 py-2 border rounded">
          Sort by Date
          <span v-if="sortField === 'createdAt'">
            {{ sortDirection === 'asc' ? '↑' : '↓' }}
          </span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <span>Rows per page:</span>
        <select v-model.number="pageSize" class="border rounded px-2 py-1">
          <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
        </select>
        <button @click="resetFilters" class="px-3 py-2 border rounded">Reset</button>
      </div>
    </div>

    <!-- Таблиця архівованих -->
    <table class="min-w-full bg-white border">
      <thead>
      <tr>
        <th class="py-2 px-4 border">Title</th>
        <th class="py-2 px-4 border">Content</th>
        <th class="py-2 px-4 border">Status</th>
        <th class="py-2 px-4 border">Created</th>
        <th class="py-2 px-4 border">Actions</th>
      </tr>
      </thead>
      <tbody>
      <DocumentItem
          v-for="doc in paginated"
          :key="doc.id"
          :document="doc"
          @unarchive="onUnarchiveRequested"
          @delete="onDeleteRequested"
          @restore="onRestoreRequested"
      />
      <tr v-if="paginated.length === 0">
        <td colspan="5" class="py-4 text-center text-gray-500">
          No archived documents found
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Пагінація -->
    <div class="flex justify-between items-center mt-4">
      <div>
        Showing {{ start + 1 }} – {{ start + paginated.length }} of {{ filtered.length }}
      </div>
      <div class="space-x-2">
        <button
            @click="page--"
            :disabled="page === 1"
            class="px-3 py-1 border rounded"
        >Prev</button>
        <button
            @click="page++"
            :disabled="page === totalPages"
            class="px-3 py-1 border rounded"
        >Next</button>
      </div>
    </div>

    <!-- ConfirmDialog -->
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
import { useDocumentStore, type Document } from '~/composables/useDocumentStore'
import DocumentItem from '~/components/Document/DocumentItem.vue'
import ConfirmDialog from '~/components/Interface/ConfirmDialog.vue'

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
  checkAutoArchive,
  cleanupArchive,
  unarchiveDocument,
  deleteDocument,
  restoreDocument
} = useDocumentStore()

// --- Confirmation wrappers ---
function onUnarchiveRequested(id: number) {
  showConfirm('Ви впевнені, що хочете розархівувати документ?', () => unarchiveDocument(id))
}
function onDeleteRequested(id: number) {
  showConfirm('Ви впевнені, що хочете видалити документ?', () => deleteDocument(id))
}
function onRestoreRequested(id: number) {
  showConfirm('Ви впевнені, що хочете відновити документ?', () => restoreDocument(id))
}

// --- Filter, sort & pagination state ---
const search = ref('')
const filterStatus = ref<'all'|'active'|'pending'|'completed'>('all')

const sortField = ref<'title'|'createdAt'>('createdAt')
const sortDirection = ref<'asc'|'desc'>('desc')

const page = ref(1)
const pageSize = ref(10)

onMounted(() => {
  loadDocuments()
  checkAutoArchive()
  setInterval(() => {
    checkAutoArchive()
    cleanupArchive()
  }, 3600000)
})

// --- Computed lists ---
const filtered = computed(() => {
  let list = documents.value.filter(d => d.isArchived && !d.isDeleted)
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
    Math.ceil(filtered.value.length / pageSize.value)
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
