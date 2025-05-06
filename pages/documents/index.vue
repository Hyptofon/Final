<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-6">Document Management System</h1>

    <!-- Таби -->
    <div class="flex space-x-4 mb-4">
      <button
          @click="activeTab = 'all'"
          :class="['px-4 py-2 rounded', activeTab === 'all' ? 'bg-primary text-white' : 'bg-gray-200']"
      >All Documents</button>
      <button
          @click="activeTab = 'archived'"
          :class="['px-4 py-2 rounded', activeTab === 'archived' ? 'bg-primary text-white' : 'bg-gray-200']"
      >Archive</button>
      <button
          @click="activeTab = 'deleted'"
          :class="['px-4 py-2 rounded', activeTab === 'deleted' ? 'bg-primary text-white' : 'bg-gray-200']"
      >Trash</button>
    </div>

    <!-- Фільтри та сортування -->
    <div class="flex justify-between mb-4">
      <div class="flex space-x-2">
        <input
            v-model="searchQuery"
            placeholder="Search documents..."
            class="border rounded px-3 py-2"
        />
        <select v-model="filterStatus" class="border rounded px-3 py-2">
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div>
        <button @click="sortBy('title')" class="px-3 py-2 border rounded mr-2">
          Sort by Title
          <span v-if="sortField === 'title'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
        </button>
        <button @click="sortBy('createdAt')" class="px-3 py-2 border rounded">
          Sort by Date
          <span v-if="sortField === 'createdAt'">{{ sortDirection === 'asc' ? '↑' : '↓' }}</span>
        </button>
      </div>
    </div>

    <!-- Додати документ -->
    <div class="mb-4">
      <button @click="openModalForNew" class="bg-green-500 text-white px-4 py-2 rounded">
        Add New Document
      </button>
    </div>

    <!-- Таблиця -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border">
        <thead>
        <tr>
          <th class="py-2 px-2 border"></th>
          <th class="py-2 px-4 border">Title</th>
          <th class="py-2 px-4 border">Content</th>
          <th class="py-2 px-4 border">Status</th>
          <th class="py-2 px-4 border">Created</th>
          <th class="py-2 px-4 border">Actions</th>
        </tr>
        </thead>
        <tbody>
        <DocumentItem
            v-for="doc in filteredDocuments"
            :key="doc.id"
            :document="doc"
            :isSelected="selectedIds.includes(doc.id)"
            @select="toggleSelect"
            @archive="archiveDocument"
            @unarchive="unarchiveDocument"
            @delete="deleteDocument"
            @restore="restoreDocument"
            @edit="openModalForEdit"
        />
        <tr v-if="filteredDocuments.length === 0">
          <td colspan="6" class="py-4 text-center text-gray-500">
            No documents found
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- Модалка додавання/редагування -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-full max-w-lg">
        <h2 class="text-xl font-bold mb-4">{{ isEditing ? 'Edit Document' : 'Add New Document' }}</h2>
        <div class="mb-4">
          <label class="block mb-1">Title</label>
          <input v-model="current.title" class="w-full border rounded px-3 py-2" />
        </div>
        <div class="mb-4">
          <label class="block mb-1">Content</label>
          <textarea v-model="current.content" class="w-full border rounded px-3 py-2 h-32"></textarea>
        </div>
        <div class="mb-4">
          <label class="block mb-1">Status</label>
          <select v-model="current.status" class="w-full border rounded px-3 py-2">
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="showModal = false" class="px-4 py-2 border rounded">Cancel</button>
          <button @click="saveCurrent" class="bg-primary text-white px-4 py-2 rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import DocumentItem from '~/components/Document/DocumentItem.vue'
import { useDocumentStore } from '~/composables/useDocumentStore'
import type { Document } from '~/composables/useDocumentStore'
import ConfirmDialog from '~/components/Interface/ConfirmDialog.vue'

const confirmVisible = ref(false)
const confirmMessage = ref('')
// ми зберігатимемо “чернетку” дії:
let pendingAction: null | (() => void) = null

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

const {
  documents,
  loadDocuments,
  addDocument,
  updateDocument,
  archiveDocument,
  unarchiveDocument,
  deleteDocument,
  restoreDocument,
  checkAutoArchive,
  cleanupArchive
} = useDocumentStore()

const activeTab = ref<'all'|'archived'|'deleted'>('all')
const searchQuery = ref('')
const filterStatus = ref<'all'|'active'|'pending'|'completed'>('all')
const sortField = ref<'title'|'createdAt'>('createdAt')
const sortDirection = ref<'asc'|'desc'>('desc')

const showModal = ref(false)
const isEditing = ref(false)
const current = ref<Partial<Document>>({ title: '', content: '', status: 'active' })

// **Нові реактивні для чекбоксів**
const selectedIds = ref<number[]>([])
function toggleSelect(id: number) {
  const i = selectedIds.value.indexOf(id)
  if (i === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(i, 1)
}

// Життєвий цикл
onMounted(() => {
  loadDocuments()
  checkAutoArchive()
  setInterval(() => {
    checkAutoArchive()
    cleanupArchive()
  }, 60 * 60 * 1000)
})

// Дії з модалкою
function openModalForNew() {
  isEditing.value = false
  current.value = { title: '', content: '', status: 'active' }
  showModal.value = true
}
function openModalForEdit(doc: Document) {
  isEditing.value = true
  current.value = { ...doc }
  showModal.value = true
}
function saveCurrent() {
  if (!current.value.title?.trim()) {
    alert('Title is required')
    return
  }
  if (isEditing.value && current.value.id) {
    updateDocument(current.value.id, current.value as Document)
  } else {
    addDocument(current.value as any)
  }
  showModal.value = false
}

// Фільтрація + сортування
const filteredDocuments = computed(() => {
  let result = [...documents.value]

  if (activeTab.value === 'archived') {
    result = result.filter(d => d.isArchived && !d.isDeleted)
  } else if (activeTab.value === 'deleted') {
    result = result.filter(d => d.isDeleted)
  } else {
    result = result.filter(d => !d.isArchived && !d.isDeleted)
  }

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(d =>
        d.title.toLowerCase().includes(q) ||
        d.content.toLowerCase().includes(q)
    )
  }

  if (filterStatus.value !== 'all') {
    result = result.filter(d => d.status === filterStatus.value)
  }

  result.sort((a,b) => {
    let A:any = a[sortField.value], B:any = b[sortField.value]
    if (sortField.value === 'createdAt') {
      A = new Date(A); B = new Date(B)
    }
    return sortDirection.value === 'asc' ? (A > B ? 1 : -1) : (A < B ? 1 : -1)
  })

  return result
})

function sortBy(f: typeof sortField.value) {
  if (sortField.value === f) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = f
    sortDirection.value = 'asc'
  }
}
</script>

<style scoped>
:root { --color-primary: #4f46e5; }
.bg-primary { background-color: var(--color-primary); }
</style>
