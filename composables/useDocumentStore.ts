// composables/useDocumentStore.ts
import { ref, watch, reactive } from "vue"

// Додаємо тип для розширеного previousState
interface DocumentPreviousState {
    id: number
    title: string
    content: string
    status: "active" | "pending" | "completed" | "archived"
    createdAt: string
    updatedAt: string
    isArchived: boolean
    isDeleted: boolean
    archivedAt: string | null
}

export interface Document {
    id: number
    title: string
    content: string
    status: "active" | "pending" | "completed" | "archived"
    createdAt: string
    updatedAt: string
    isArchived: boolean
    isDeleted: boolean
    archivedAt: string | null
    history: {
        timestamp: string
        data: Omit<Document, "history">
    }[]
    previousState?: DocumentPreviousState | null
}

// Налаштування архівування за замовчуванням
export interface ArchiveSettings {
    autoArchiveEnabled: boolean
    autoArchiveDays: number
    archiveCompletedDocs: boolean
}

export function useDocumentStore() {
    const documents = ref<Document[]>([])

    // Налаштування архівування (за замовчуванням)
    const archiveSettings = reactive<ArchiveSettings>({
        autoArchiveEnabled: true,
        autoArchiveDays: 30,
        archiveCompletedDocs: true,
    })

    function loadArchiveSettings() {
        // ТУТ: закоментований GET-запит до API, щоб підвантажувати список документів
        // fetch('/swagger/v1/documents?perPage=10&page=1&archived=false')
        //   .then(res => res.json())
        //   .then(data => {
        //     documents.value = data.documents
        //   })
        const saved = localStorage.getItem("archiveSettings")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (parsed.autoArchiveEnabled !== undefined) archiveSettings.autoArchiveEnabled = parsed.autoArchiveEnabled
                if (parsed.autoArchiveDays !== undefined) archiveSettings.autoArchiveDays = parsed.autoArchiveDays
                if (parsed.archiveCompletedDocs !== undefined)
                    archiveSettings.archiveCompletedDocs = parsed.archiveCompletedDocs
            } catch (e) {
                console.error("Error loading archive settings:", e)
            }
        }
    }

    // Збереження налаштувань архівування
    function saveArchiveSettings() {
        localStorage.setItem("archiveSettings", JSON.stringify(archiveSettings))
    }

    // Load documents from localStorage or initialize with mock data
    function loadDocuments() {
        // Спочатку завантажуємо налаштування архівування
        loadArchiveSettings()

        const saved = localStorage.getItem("documents")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                documents.value = parsed.map((d: any) => ({
                    ...d,
                    history: Array.isArray(d.history) ? d.history : [],
                }))
            } catch (e) {
                console.error("Error loading documents from localStorage:", e)
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
                title: "Довідник працівника",
                content: "Політики компанії та настанови для всіх співробітників.",
                status: "active",
                createdAt: new Date(Date.now() - 12 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 2,
                title: "План редизайну сайту",
                content: "Початкова концепція та підхід до оновлення вебсайту.",
                status: "pending",
                createdAt: new Date(Date.now() - 8 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 3,
                title: "Підсумок зворотного зв'язку клієнтів",
                content: "Зібрані відгуки з опитувань користувачів та звернень до підтримки.",
                status: "completed",
                createdAt: new Date(Date.now() - 20 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 4,
                title: "Контрольний список адаптації",
                content: "Завдання та ресурси для ефективної адаптації нових працівників.",
                status: "active",
                createdAt: new Date(Date.now() - 3 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 5,
                title: "Чернетка договору з постачальником",
                content: "Умови угоди для нових партнерств із постачальниками.",
                status: "pending",
                createdAt: new Date(Date.now() - 45 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 6,
                title: "Звіт з аудиту безпеки",
                content: "Результати та рекомендації після останнього аудиту системної безпеки.",
                status: "completed",
                createdAt: new Date(Date.now() - 60 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 7,
                title: "Річна оцінка ефективності",
                content: "Підсумки роботи та цілі для членів команди на цей рік.",
                status: "active",
                createdAt: new Date(Date.now() - 10 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 8,
                title: "Графік запуску продукту",
                content: "Детальний розклад підготовки до наступного релізу продукту.",
                status: "pending",
                createdAt: new Date(Date.now() - 18 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 9,
                title: "Структура навчальних матеріалів",
                content: "План і структура для проведення тренінгів співробітників.",
                status: "completed",
                createdAt: new Date(Date.now() - 22 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
            {
                id: 10,
                title: "Стратегія соцмереж",
                content: "План покращення взаємодії та охоплення у соціальних мережах.",
                status: "active",
                createdAt: new Date(Date.now() - 6 * 24 * 3600e3).toISOString(),
                updatedAt: new Date().toISOString(),
                isArchived: false,
                isDeleted: false,
                archivedAt: null,
                history: [],
            },
        ]
        saveDocuments()
    }

    function saveDocuments() {
        localStorage.setItem("documents", JSON.stringify(documents.value))
        // ТУТ: закоментований POST-запит, щоб відправляти всі документи на сервер
        // fetch('/swagger/v1/documents', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(documents.value)
        // })
    }

    // Watch for changes and save
    watch(documents, saveDocuments, { deep: true })

    // Watch for changes in archive settings and save
    watch(archiveSettings, saveArchiveSettings, { deep: true })

    // Add current state to document history
    function addToHistory(doc: Document) {
        if (!Array.isArray(doc.history)) doc.history = []
        const { history, ...rest } = doc
        doc.history.push({
            timestamp: new Date().toISOString(),
            data: rest,
        })
    }

    // Add a new document
    function addDocument(
        payload: Omit<
            Document,
            "id" | "createdAt" | "updatedAt" | "isArchived" | "isDeleted" | "archivedAt" | "history" | "previousState"
        >,
    ) {
        // Перевірка, щоб не можна було створити документ зі статусом 'archived'
        if (payload.status === "archived") {
            payload.status = "active" // Замінюємо на 'active' за замовчуванням
        }

        const newDoc: Document = {
            ...payload,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isArchived: false,
            isDeleted: false,
            archivedAt: null,
            history: [],
        }
        documents.value.push(newDoc)
        //  Після додавання нового документа — POST лише цього запису
        // fetch('/swagger/v1/documents', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     name: newDoc.title,
        //     content: newDoc.content,
        //     status: newDoc.status,
        //     // …інші поля згідно API
        //   })
        // })
    }

    // Archive a document
    function archiveDocument(id: number) {
        const idx = documents.value.findIndex((d) => d.id === id)
        if (idx === -1) return

        const doc = documents.value[idx]

        // Skip if already archived
        if (doc.isArchived) return

        // Save current state before archiving
        const { history, previousState, ...currentState } = doc

        // Add current version to history
        addToHistory(doc)

        // Оновлення документа зі зміною статусу на 'archived'
        documents.value[idx] = {
            ...doc,
            status: "archived", // Змінюємо статус на 'archived'
            isArchived: true,
            archivedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            previousState: {
                ...currentState,
                content: doc.content, // Зберігаємо оригінальний контент
            },
        }

        // Після локального архівування — виклик API-архіву
        // fetch(`/swagger/v1/documents/${id}/archive`)
    }

    function unarchiveDocument(id: number) {
        const idx = documents.value.findIndex((d) => d.id === id)
        if (idx === -1) return

        const doc = documents.value[idx]
        if (!doc.isArchived) return

        addToHistory(doc)

        const previousStatus = doc.previousState?.status || "active"

        const restored: Document = {
            ...doc,
            status: previousStatus,
            isArchived: false,
            archivedAt: null,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            history: [
                ...doc.history,
                {
                    timestamp: new Date().toISOString(),
                    data: { ...doc, previousState: null },
                },
            ],
            previousState: null,
        }

        documents.value[idx] = restored
        // Якщо знадобиться відновити на сервері (PUT)
        // fetch(`/swagger/v1/documents/${id}`, {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'multipart/form-data' },
        //   body: /* FormData з відновленими полями */
        // })

    }

    function checkAutoArchive() {
        if (!archiveSettings.autoArchiveEnabled) return
        const now = Date.now()
        documents.value.forEach((d) => {
            if (!d.isArchived && !d.isDeleted) {
                const daysOld = (now - new Date(d.createdAt).getTime()) / 86400e3

                const shouldArchiveByAge = daysOld > archiveSettings.autoArchiveDays

                const shouldArchiveByStatus = archiveSettings.archiveCompletedDocs && d.status === "completed"

                if (shouldArchiveByAge || shouldArchiveByStatus) {
                    archiveDocument(d.id)
                }
            }
        })
    }

    function cleanupArchive() {
        const now = Date.now()
        documents.value = documents.value.filter((d) => {
            if (!d.isArchived) return true
            if (!d.archivedAt) return true

            const daysArch = (now - new Date(d.archivedAt).getTime()) / 86400e3
            return daysArch <= 90
        })
    }

    function updateArchiveSettings(settings: Partial<ArchiveSettings>) {
        Object.assign(archiveSettings, settings)
        saveArchiveSettings()
    }

    return {
        documents,
        archiveSettings,
        loadDocuments,
        addDocument,
        archiveDocument,
        unarchiveDocument,
        checkAutoArchive,
        cleanupArchive,
        updateArchiveSettings,
    }
}
