<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-50 to-white">
    <div class="container mx-auto p-6">
      <!-- Header -->
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-2">Document Management System</h1>
        <p class="text-gray-600">Manage, organize, and track your documents</p>
      </header>

      <!-- Tabs -->
      <div class="flex mb-8 border-b border-gray-200">
        <NuxtLink to="/documents" class="px-6 py-3 text-blue-600 border-b-2 border-blue-600 font-medium -mb-px">
          All Documents
        </NuxtLink>
        <NuxtLink to="/documents/archive" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Archive
        </NuxtLink>
        <NuxtLink to="/documents/trash" class="px-6 py-3 text-gray-600 hover:text-blue-600">
          Trash
        </NuxtLink>
      </div>

      <!-- Search, Filter, and Add -->
      <div class="flex flex-wrap gap-4 mb-8">
        <div class="relative flex-1 min-w-[300px]">
          <input
              v-model="search"
              placeholder="Search documents..."
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
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button
            @click="showAddEditModal = true; editingDocument = null"
            class="px-6 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all flex items-center gap-2 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Add Document
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
            <span>Title</span>
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
            <span>Date</span>
            <svg v-if="sortField === 'createdAt'" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" v-if="sortDirection === 'desc'" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" v-else />
            </svg>
          </button>
        </div>
        <div class="flex items-center gap-3">
          <span class="text-gray-600 font-medium">Rows:</span>
          <select
              v-model.number="pageSize"
              class="px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          >
            <option v-for="n in [5,10,20,50]" :key="n" :value="n">{{ n }}</option>
          </select>
          <button
              @click="resetFilters"
              class="px-5 py-2.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Reset
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
          {{ selectedIds.length }} document(s) selected
        </span>
        <div class="flex gap-3">
          <button
              @click="bulkArchive"
              class="px-4 py-2.5 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archive Selected
          </button>
          <button
              @click="bulkDelete"
              class="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete Selected
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
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
              <th scope="col" class="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                  <span v-if="doc.compressed">{{ doc.content }} <span class="text-xs text-amber-600 font-medium ml-1 px-1.5 py-0.5 bg-amber-50 rounded-full">[compressed]</span></span>
                  <span v-else>{{ doc.content }}</span>
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
                    {{ doc.status }}
                  </span>
              </td>
              <td class="px-4 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">{{ formatDate(doc.createdAt) }}</div>
              </td>
              <td class="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex gap-3">
                  <button
                      v-if="!doc.isArchived && !doc.isDeleted"
                      @click="onArchiveRequested(doc.id)"
                      class="text-amber-600 hover:text-amber-900 transition-colors p-1.5 hover:bg-amber-50 rounded-full"
                      title="Archive"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                  </button>
                  <button
                      v-if="!doc.isDeleted"
                      @click="onDeleteRequested(doc.id)"
                      class="text-red-600 hover:text-red-900 transition-colors p-1.5 hover:bg-red-50 rounded-full"
                      title="Delete"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  <button
                      v-if="!doc.isArchived && !doc.isDeleted"
                      @click="openEditModal(doc)"
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
            <tr v-if="paginated.length === 0">
              <td colspan="6" class="px-4 py-10 text-center text-gray-500">
                <div class="flex flex-col items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="text-xl font-medium mb-1">No documents found</p>
                  <p class="text-sm">Try adjusting your search or filter criteria</p>
                </div>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex justify-between items-center bg-white rounded-xl border border-gray-100 px-6 py-4 shadow-sm">
        <div class="text-sm text-gray-700 font-medium">
          Showing <span class="font-semibold text-blue-600">{{ start + 1 }}</span> to <span class="font-semibold text-blue-600">{{ Math.min(start + paginated.length, filtered.length) }}</span> of <span class="font-semibold text-blue-600">{{ filtered.length }}</span> documents
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
            Previous
          </button>
          <button
              @click="page++"
              :disabled="page === totalPages || totalPages === 0"
              class="px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-1"
          >
            Next
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Document Modal -->
    <div v-if="showAddEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-scaleIn">
        <div class="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 border-b border-blue-700 flex justify-between items-center">
          <h2 class="text-xl font-bold text-white">{{ editingDocument ? 'Edit Document' : 'Add New Document' }}</h2>
          <button @click="showAddEditModal = false" class="text-white hover:text-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
                v-model="formData.title"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter document title"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
            <textarea
                v-model="formData.content"
                rows="4"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter document content"
            ></textarea>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
                v-model="formData.status"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div class="flex justify-end gap-3">
            <button
                @click="showAddEditModal = false"
                class="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
                @click="saveDocument"
                class="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
            >
              Save Document
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
import { ref, computed, reactive, onUnmounted } from 'vue'
import { useDocumentStore, type Document } from '~/composables/useDocumentStore'
import ConfirmDialog from '~/components/Interface/ConfirmDialog.vue'
import { useToast } from 'vue-toastification'
import { onMounted } from 'vue';

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
  addDocument,
  updateDocument,
  archiveDocument,
  deleteDocument,
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
  showConfirm(`Archive ${selectedIds.value.length} selected documents?`, () => {
    selectedIds.value.forEach(id => archiveDocument(id))
    toast.success(`${selectedIds.value.length} documents archived`)
    selectedIds.value = []
  })
}

function bulkDelete() {
  showConfirm(`Delete ${selectedIds.value.length} selected documents?`, () => {
    selectedIds.value.forEach(id => deleteDocument(id))
    toast.success(`${selectedIds.value.length} documents moved to trash`)
    selectedIds.value = []
  })
}

// --- Confirmation wrappers ---
function onArchiveRequested(id: number) {
  showConfirm('Are you sure you want to archive this document?', () => {
    archiveDocument(id)
    toast.success('Document archived successfully')
  })
}

function onDeleteRequested(id: number) {
  showConfirm('Are you sure you want to delete this document?', () => {
    deleteDocument(id)
    toast.success('Document moved to trash')
  })
}

// --- Filter, sort & pagination state ---
const search = ref('')
const filterStatus = ref<'all'|'active'|'pending'|'completed'>('all')

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

function openEditModal(doc: Document) {
  editingDocument.value = doc
  formData.title = doc.title
  formData.content = doc.content
  formData.status = doc.status
  showAddEditModal.value = true
}

function saveDocument() {
  if (!formData.title.trim()) {
    toast.error('Title is required')
    return
  }

  if (editingDocument.value) {
    // Update existing document
    updateDocument(editingDocument.value.id, {
      title: formData.title,
      content: formData.content,
      status: formData.status
    })
    toast.success('Document updated successfully')
  } else {
    // Add new document
    addDocument({
      title: formData.title,
      content: formData.content,
      status: formData.status
    })
    toast.success('Document added successfully')
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

// Fix for NodeJS.Timeout error - use number type instead
let intervalId: number;

const setupPeriodicChecks = () => {
  checkAutoArchive()
  cleanupArchive()

  intervalId = window.setInterval(() => {
    checkAutoArchive()
    cleanupArchive()
  }, 3600000);
};

onMounted(() => {
  loadDocuments();
  setupPeriodicChecks();
});

onUnmounted(() => {
  clearInterval(intervalId);
});

// --- Computed lists ---
const filtered = computed(() => {
  let list = documents.value.filter(d => !d.isArchived && !d.isDeleted)

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