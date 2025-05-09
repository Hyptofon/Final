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
                title: 'Довідник працівника',
                content: 'Політики компанії та настанови для всіх співробітників.',
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
                title: 'План редизайну сайту',
                content: 'Початкова концепція та підхід до оновлення вебсайту.',
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
                title: 'Підсумок зворотного зв’язку клієнтів',
                content: 'Зібрані відгуки з опитувань користувачів та звернень до підтримки.',
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
                title: 'Контрольний список адаптації',
                content: 'Завдання та ресурси для ефективної адаптації нових працівників.',
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
                title: 'Чернетка договору з постачальником',
                content: 'Умови угоди для нових партнерств із постачальниками.',
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
                title: 'Звіт з аудиту безпеки',
                content: 'Результати та рекомендації після останнього аудиту системної безпеки.',
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
                title: 'Річна оцінка ефективності',
                content: 'Підсумки роботи та цілі для членів команди на цей рік.',
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
                title: 'Графік запуску продукту',
                content: 'Детальний розклад підготовки до наступного релізу продукту.',
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
                title: 'Структура навчальних матеріалів',
                content: 'План і структура для проведення тренінгів співробітників.',
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
                title: 'Стратегія соцмереж',
                content: 'План покращення взаємодії та охоплення у соціальних мережах.',
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