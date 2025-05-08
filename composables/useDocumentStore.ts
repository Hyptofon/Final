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
    /** Previous state before archiving */
    previousState?: Omit<Document, 'history' | 'previousState'> | null
    /** Full history of document states */
    history: {
        timestamp: string
        /** State without the history array */
        data: Omit<Document, 'history'>
    }[]
}

export function useDocumentStore() {
    const documents = ref<Document[]>([])

    // Load documents from localStorage or initialize with mock data
    function loadDocuments() {
        const saved = localStorage.getItem('documents')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                documents.value = parsed.map((d: any) => ({
                    ...d,
                    history: Array.isArray(d.history) ? d.history : []
                }))
            } catch (e) {
                console.error('Error loading documents from localStorage:', e)
                initializeMockData()
            }
        } else {
            initializeMockData()
        }
    }

    // Initialize with mock data
    function initializeMockData() {
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

    // Save documents to localStorage
    function saveDocuments() {
        localStorage.setItem('documents', JSON.stringify(documents.value))
        // Simulated backend API call (commented out)
        // fetch('/api/documents', {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/json'},
        //   body: JSON.stringify(documents.value)
        // })
    }

    // Watch for changes and save
    watch(documents, saveDocuments, { deep: true })

    // Add current state to document history
    function addToHistory(doc: Document) {
        if (!Array.isArray(doc.history)) doc.history = []
        const { history, ...rest } = doc
        doc.history.push({
            timestamp: new Date().toISOString(),
            data: rest
        })
    }

    // Add a new document
    function addDocument(payload: Omit<Document,
        'id'|'createdAt'|'updatedAt'|'isArchived'|'isDeleted'|'archivedAt'|'compressed'|'history'|'previousState'
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

    // Update an existing document
    function updateDocument(id: number, updates: Partial<Document>) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return

        // Add current state to history before updating
        addToHistory(documents.value[idx])

        documents.value[idx] = {
            ...documents.value[idx],
            ...updates,
            updatedAt: new Date().toISOString()
        }
    }

    // Archive a document
    function archiveDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return

        const doc = documents.value[idx]

        // Skip if already archived
        if (doc.isArchived) return

        // Save current state before archiving
        const { history, previousState, ...currentState } = doc

        // Add to history
        addToHistory(doc)

        // Compress content if it's longer than 100 characters
        let compressedContent = doc.content
        if (doc.content.length > 100) {
            compressedContent = doc.content.substring(0, 100) + '...'
        }

        // Update the document
        documents.value[idx] = {
            ...doc,
            content: compressedContent,
            isArchived: true,
            archivedAt: new Date().toISOString(),
            compressed: doc.content.length > 100,
            updatedAt: new Date().toISOString(),
            previousState: currentState
        }
    }

    // Unarchive a document
    function unarchiveDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return

        const doc = documents.value[idx]

        // Skip if not archived
        if (!doc.isArchived) return

        // Add to history
        addToHistory(doc)

        // Restore from previous state if available
        if (doc.previousState) {
            documents.value[idx] = {
                ...doc.previousState,
                updatedAt: new Date().toISOString(),
                history: doc.history,
                previousState: null
            }
        } else {
            // Basic unarchive if no previous state
            documents.value[idx] = {
                ...doc,
                isArchived: false,
                archivedAt: null,
                compressed: false,
                updatedAt: new Date().toISOString()
            }
        }
    }

    // Move document to trash
    function deleteDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return

        // Add to history
        addToHistory(documents.value[idx])

        documents.value[idx] = {
            ...documents.value[idx],
            isDeleted: true,
            updatedAt: new Date().toISOString()
        }
    }

    // Restore document from trash
    function restoreDocument(id: number) {
        const idx = documents.value.findIndex(d => d.id === id)
        if (idx === -1) return

        // Add to history
        addToHistory(documents.value[idx])

        documents.value[idx] = {
            ...documents.value[idx],
            isDeleted: false,
            updatedAt: new Date().toISOString()
        }
    }

    // Revert to a previous version
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

    // Check for documents that should be auto-archived
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

    // Clean up old archives (remove archives older than 90 days)
    function cleanupArchive() {
        const now = Date.now()
        documents.value = documents.value.filter(d => {
            if (!d.isArchived) return true
            if (!d.archivedAt) return true

            const daysArch = (now - new Date(d.archivedAt).getTime()) / 86400e3
            return daysArch <= 90
        })
    }

    // Permanently delete a document
    function permanentlyDeleteDocument(id: number) {
        documents.value = documents.value.filter(d => d.id !== id)
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
        cleanupArchive,
        permanentlyDeleteDocument
    }
}