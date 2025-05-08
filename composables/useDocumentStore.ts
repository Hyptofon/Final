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
    previousState?: Omit<Document, 'history' | 'previousState'> | null
    history: {
        timestamp: string
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
                title: 'Employee Handbook',
                content: 'Company policies and guidelines for all staff members.',
                status: 'active',
                createdAt: new Date(Date.now() - 12 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: true,
                history: []
            },
            {
                id: 2,
                title: 'Website Redesign Plan',
                content: 'Initial concept and design approach for the website overhaul project.',
                status: 'pending',
                createdAt: new Date(Date.now() - 8 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: false,
                history: []
            },
            {
                id: 3,
                title: 'Customer Feedback Summary',
                content: 'Compiled feedback from recent user surveys and support tickets.',
                status: 'completed',
                createdAt: new Date(Date.now() - 20 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: false,
                history: []
            },
            {
                id: 4,
                title: 'Onboarding Checklist',
                content: 'Tasks and resources for onboarding new hires effectively.',
                status: 'active',
                createdAt: new Date(Date.now() - 3 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: false,
                history: []
            },
            {
                id: 5,
                title: 'Vendor Contract Draft',
                content: 'Draft agreement terms for new supplier partnerships.',
                status: 'pending',
                createdAt: new Date(Date.now() - 45 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: false,
                history: []
            },
            {
                id: 6,
                title: 'Security Audit Report',
                content: 'Findings and recommendations from the latest system security audit.',
                status: 'completed',
                createdAt: new Date(Date.now() - 60 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: true,
                history: []
            },
            {
                id: 7,
                title: 'Annual Performance Review',
                content: 'Performance summary and goals for team members this year.',
                status: 'active',
                createdAt: new Date(Date.now() - 10 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: false,
                history: []
            },
            {
                id: 8,
                title: 'Product Launch Timeline',
                content: 'Detailed schedule leading up to the next product release.',
                status: 'pending',
                createdAt: new Date(Date.now() - 18 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: true,
                history: []
            },
            {
                id: 9,
                title: 'Training Materials Outline',
                content: 'Structure and content plan for employee training sessions.',
                status: 'completed',
                createdAt: new Date(Date.now() - 22 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                compressed: false,
                history: []
            },
            {
                id: 10,
                title: 'Social Media Strategy',
                content: 'Plan to improve engagement and reach across platforms.',
                status: 'active',
                createdAt: new Date(Date.now() - 6 * 24 * 3600e3).toISOString(),
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
        if (!doc.isArchived) return

        // Зберігаємо поточний (архівований) стан до історії
        addToHistory(doc)

        const restored: Document = doc.previousState
            ? {
                ...doc.previousState,
                isArchived: false,
                archivedAt: null,
                compressed: false,
                updatedAt: new Date().toISOString(),
                history: [
                    ...doc.history,
                    {
                        timestamp: new Date().toISOString(),
                        data: { ...doc, previousState: null }
                    }
                ],
                previousState: null
            }
            : {
                ...doc,
                isArchived: false,
                archivedAt: null,
                compressed: false,
                updatedAt: new Date().toISOString(),
                previousState: null
            }

        documents.value[idx] = restored
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


    return {
        documents,
        loadDocuments,
        addDocument,
        archiveDocument,
        unarchiveDocument,
        checkAutoArchive,
        cleanupArchive,
    }
}