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
    compressed: boolean
    originalContentLength?: number // Додаємо опціональне поле для довжини оригінального контенту
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
    compressed: boolean
    previousState?: DocumentPreviousState | null
    history: {
        timestamp: string
        data: Omit<Document, "history">
    }[]
}

// Налаштування архівування за замовчуванням
export interface ArchiveSettings {
    autoArchiveEnabled: boolean
    autoArchiveDays: number
    archiveCompletedDocs: boolean
    compressContent: boolean
}

export function useDocumentStore() {
    const documents = ref<Document[]>([])

    // Налаштування архівування (за замовчуванням)
    const archiveSettings = reactive<ArchiveSettings>({
        autoArchiveEnabled: true,
        autoArchiveDays: 30,
        archiveCompletedDocs: true,
        compressContent: true,
    })

    // Завантаження налаштувань архівування
    function loadArchiveSettings() {
        const saved = localStorage.getItem("archiveSettings")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // Замінюємо Object.assign на пряме присвоєння кожного поля
                // щоб гарантувати, що всі поля будуть оновлені
                if (parsed.autoArchiveEnabled !== undefined) archiveSettings.autoArchiveEnabled = parsed.autoArchiveEnabled
                if (parsed.autoArchiveDays !== undefined) archiveSettings.autoArchiveDays = parsed.autoArchiveDays
                if (parsed.archiveCompletedDocs !== undefined)
                    archiveSettings.archiveCompletedDocs = parsed.archiveCompletedDocs
                if (parsed.compressContent !== undefined) archiveSettings.compressContent = parsed.compressContent
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
                compressed: true,
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
                compressed: false,
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
                compressed: false,
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
                compressed: false,
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
                compressed: false,
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
                compressed: true,
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
                compressed: false,
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
                compressed: true,
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
                compressed: false,
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
                compressed: false,
                history: [],
            },
        ]
        saveDocuments()
    }

    function saveDocuments() {
        localStorage.setItem("documents", JSON.stringify(documents.value))
        // Simulated backend API call (commented out)
        // fetch('/api/documents', {
        //   method: 'POST',
        //   headers: {'Content-Type': 'application/json'},
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
            | "id"
            | "createdAt"
            | "updatedAt"
            | "isArchived"
            | "isDeleted"
            | "archivedAt"
            | "compressed"
            | "history"
            | "previousState"
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
            compressed: false,
            history: [],
        }
        documents.value.push(newDoc)
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

        // Стискання вмісту, якщо увімкнено в налаштуваннях
        let isCompressed = false
        let compressedContent = doc.content
        const originalLength = doc.content.length

        if (archiveSettings.compressContent && doc.content.length > 100) {
            compressedContent = doc.content.substring(0, 100) + "..."
            isCompressed = true
        }

        // Оновлення документа з правильним прапором compressed та зміна статусу на 'archived'
        documents.value[idx] = {
            ...doc,
            content: compressedContent,
            status: "archived", // Змінюємо статус на 'archived'
            isArchived: true,
            archivedAt: new Date().toISOString(),
            compressed: isCompressed,
            updatedAt: new Date().toISOString(),
            previousState: {
                ...currentState,
                originalContentLength: originalLength, // Тепер це поле визначено в типі
                content: doc.content, // Зберігаємо оригінальний контент
            },
        }
    }

    // Unarchive a document
    function unarchiveDocument(id: number) {
        const idx = documents.value.findIndex((d) => d.id === id)
        if (idx === -1) return

        const doc = documents.value[idx]
        if (!doc.isArchived) return

        // Зберігаємо поточний (архівований) стан до історії
        addToHistory(doc)

        // Відновлюємо попередній статус документа (якщо є previousState)
        // або залишаємо поточний, але не 'archived'
        const previousStatus = doc.previousState?.status || "active"

        // Відновлюємо оригінальний контент, якщо він був стиснутий
        const originalContent = doc.compressed && doc.previousState?.content ? doc.previousState.content : doc.content

        const restored: Document = {
            ...doc,
            content: originalContent,
            status: previousStatus, // Відновлюємо попередній статус, але не 'archived'
            isArchived: false,
            archivedAt: null,
            compressed: false,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(), // Оновлюємо дату створення на поточну
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
    }

    // Check for documents that should be auto-archived
    function checkAutoArchive() {
        // Якщо автоархівування вимкнено, виходимо
        if (!archiveSettings.autoArchiveEnabled) return

        const now = Date.now()
        documents.value.forEach((d) => {
            if (!d.isArchived && !d.isDeleted) {
                const daysOld = (now - new Date(d.createdAt).getTime()) / 86400e3

                // Архівуємо документи, які старші за вказану кількість днів
                const shouldArchiveByAge = daysOld > archiveSettings.autoArchiveDays

                // Архівуємо завершені документи, якщо це увімкнено в налаштуваннях
                const shouldArchiveByStatus = archiveSettings.archiveCompletedDocs && d.status === "completed"

                if (shouldArchiveByAge || shouldArchiveByStatus) {
                    archiveDocument(d.id)
                }
            }
        })
    }

    // Clean up old archives (remove archives older than 90 days)
    function cleanupArchive() {
        const now = Date.now()
        documents.value = documents.value.filter((d) => {
            if (!d.isArchived) return true
            if (!d.archivedAt) return true

            const daysArch = (now - new Date(d.archivedAt).getTime()) / 86400e3
            return daysArch <= 90
        })
    }

    // Оновлення налаштувань архівування
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
