// composables/useDocumentStore.ts
import { ref, watch } from 'vue'

export interface Document {
    id: number
    title: string
    content: string
    status: 'active' | 'pending' | 'completed'
    createdAt: string
    updatedAt: string
    isArchived: boolean
    isDeleted: boolean
    archivedAt: string | null
    compressed: boolean
    /** Повна історія станів документу */
    history: {
        timestamp: string
        /** Стан без самого масиву history */
        data: Omit<Document, 'history'>
    }[]
}

export function useDocumentStore() {
    const documents = ref<Document[]>([])

    // Завантажуємо з localStorage і гарантовано даємо кожному doc масив history
    function loadDocuments() {
        const saved = localStorage.getItem('documents')
        if (saved) {
            const parsed = JSON.parse(saved)
            documents.value = parsed.map((d: any) => ({
                ...d,
                history: Array.isArray(d.history) ? d.history : []
            }))
        } else {
            documents.value = [
                {
                    id: 1,
                    title: 'Project Proposal',
                    content: 'This is a detailed project proposal for the new marketing campaign.',
                    status: 'active',
                    createdAt: new Date(Date.now() - 5 * 24 * 3600e3).toISOString(),
                    updatedAt: new Date().toISOString(),
                    isArchived: false,
                    isDeleted: false,
                    archivedAt: null,
                    compressed: false,
                    history: []
                },
                {
                    id: 2,
                    title: 'Meeting Notes',
                    content: 'Notes from the quarterly planning meeting with the executive team.',
                    status: 'completed',
                    createdAt: new Date(Date.now() - 30 * 24 * 3600e3).toISOString(),
                    updatedAt: new Date().toISOString(),
                    isArchived: false,
                    isDeleted: false,
                    archivedAt: null,
                    compressed: false,
                    history: []
                },
                {
                    id: 3,
                    title: 'Budget Report',
                    content: 'Financial analysis and budget report for Q2 2023.',
                    status: 'pending',
                    createdAt: new Date(Date.now() - 15 * 24 * 3600e3).toISOString(),
                    updatedAt: new Date().toISOString(),
                    isArchived: false,
                    isDeleted: false,
                    archivedAt: null,
                    compressed: false,
                    history: []
                }
            ]
            saveDocuments()
        }
    }

    // Зберігаємо масив у localStorage
    function saveDocuments() {
        localStorage.setItem('documents', JSON.stringify(documents.value))
        // Імітація бекенду
        // fetch('/api/documents', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(documents.value) })
    }

    // Слідкуємо за будь-якими змінами
    watch(documents, saveDocuments, { deep: true })

    // Додає поточний стан документа (без поля history) в його масив версій
    function addToHistory(doc: Document) {
        if (!Array.isArray(doc.history)) doc.history = []
        const { history, ...rest } = doc
        doc.history.push({
            timestamp: new Date().toISOString(),
            data: rest
        })
    }

    // ── CRUD та архівна логіка ────────────────────────────────────────────────────

    function addDocument(payload: Omit<Document,
        'id'|'createdAt'|'updatedAt'|'isArchived'|'isDeleted'|'archivedAt'|'compressed'|'history'
    >) {
        const newDoc: Document = {
            ...payload,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isArchived: false,
            isDeleted: false,
            archivedAt: null,
            compressed: false,
            history: []
        }
        documents.value.push(newDoc)
    }

    function updateDocument(id: number, updates: Partial<Document>) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return
        addToHistory(documents.value[idx])
        documents.value[idx] = {
            ...documents.value[idx],
            ...updates,
            updatedAt: new Date().toISOString()
        }
    }

    function archiveDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return
        addToHistory(documents.value[idx])
        documents.value[idx] = {
            ...documents.value[idx],
            isArchived: true,
            archivedAt: new Date().toISOString(),
            compressed: true,
            updatedAt: new Date().toISOString()
        }
    }

    function unarchiveDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return
        addToHistory(documents.value[idx])
        documents.value[idx] = {
            ...documents.value[idx],
            isArchived: false,
            archivedAt: null,
            compressed: false,
            updatedAt: new Date().toISOString()
        }
    }

    function deleteDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return
        addToHistory(documents.value[idx])
        documents.value[idx].isDeleted = true
        documents.value[idx].updatedAt = new Date().toISOString()
    }

    function restoreDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return
        addToHistory(documents.value[idx])
        documents.value[idx].isDeleted = false
        documents.value[idx].updatedAt = new Date().toISOString()
    }

    function revertToVersion(id: number, versionIndex: number) {
        const doc = documents.value.find(d => d.id === id)
        if (!doc || !doc.history[versionIndex]) return
        const version = doc.history[versionIndex]
        documents.value = documents.value.map(d =>
            d.id === id
                ? { ...version.data, updatedAt: new Date().toISOString(), history: d.history }
                : d
        )
    }

    function checkAutoArchive() {
        const now = Date.now()
        documents.value.forEach(d => {
            if (!d.isArchived && !d.isDeleted) {
                const daysOld = (now - new Date(d.createdAt).getTime()) / 86400e3
                if (daysOld > 30 || d.status === 'completed') {
                    archiveDocument(d.id)
                }
            }
        })
    }

    function cleanupArchive() {
        const now = Date.now()
        documents.value = documents.value.filter(d => {
            if (!d.isArchived) return true
            const daysArch = (now - new Date(d.archivedAt!).getTime()) / 86400e3
            return daysArch <= 90
        })
    }

    return {
        documents,
        loadDocuments,
        addDocument,
        updateDocument,
        archiveDocument,
        unarchiveDocument,
        deleteDocument,
        restoreDocument,
        revertToVersion,
        checkAutoArchive,
        cleanupArchive
    }
}
