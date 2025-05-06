<script lang="ts" setup>
import type { TableColumn } from '@nuxt/ui'
import type { Column } from '@tanstack/vue-table'

// Columns
const columns: TableColumn<T>[] = [{
  accessorKey: 'id',
  header: 'id',
}, {
  accessorKey: 'number',
  header: 'Номер',
}, {
  accessorKey: 'name',
  header: 'Назва',
}, {
  accessorKey: 'createdOn',
  header: 'Дата створення',
}, {
  accessorKey: 'modifiedOn',
  header: 'Дата зміни',
}, {
  accessorKey: 'fileSize',
  header: 'Розмір',
}, {
  accessorKey: 'actions',
  header: 'Дії',
}]

const selectedColumns = ref(columns)
const columnsTable = computed(() => columns.filter((column) => selectedColumns.value.includes(column)))

// Selected Rows
const selectedRows = ref([])

function select (row) {
  const index = selectedRows.value.findIndex((item) => item.id === row.id)
  if (index === -1) {
    selectedRows.value.push(row)
  } else {
    selectedRows.value.splice(index, 1)
  }
}

// Actions
const actions = [
  [{
    key: 'completed',
    label: 'Completed',
    icon: 'i-heroicons-check'
  }], [{
    key: 'uncompleted',
    label: 'In Progress',
    icon: 'i-heroicons-arrow-path'
  }]
]

// Filters
const documentStatus = [
  {
    key: 'uploaded',
    label: 'Завантажений',
    value: false
  },
  {
    key: 'signed',
    label: 'Підписано',
    value: false
  },
  {
    key: 'send',
    label: 'Надісланий на підпис',
    value: false
  },
  {
    key: 'waitingYourSign',
    label: 'Очікує вашого підпису',
    value: false
  },
  {
    key: 'waitingOtherSign',
    label: 'Очікує підпису контрагнта(ів)',
    value: false
  },
  {
    key: 'reviewed',
    label: 'Переглянуто',
    value: false
  },
  {
    key: 'awaitingReview',
    label: 'Очікує перегляду',
    value: false
  }
]

const search = ref('')
const selectedStatus = ref([])
const searchStatus = computed(() => {
  if (selectedStatus.value?.length === 0) {
    return ''
  }

  if (selectedStatus?.value?.length > 1) {
    return `?completed=${selectedStatus.value[0].value}&completed=${selectedStatus.value[1].value}`
  }

  return `?completed=${selectedStatus.value[0].value}`
})

const resetFilters = () => {
  search.value = ''
  selectedStatus.value = []
}

const formatDate = (dateStr) => useDateFormat(dateStr, 'DD.MM.YYYY HH:mm:ss', { locales: 'uk-UA' });

// Pagination
const sort = ref({ column: 'modifiedOn', direction: 'desc' as const })
const page = ref(1)
const pageCount = ref(10)
const pageTotal = ref(1) // This value should be dynamic coming from the API
const pageFrom = computed(() => (page.value - 1) * pageCount.value + 1)
const pageTo = computed(() => Math.min(page.value * pageCount.value, pageTotal.value))

// Data
const { data, status, refresh } = await useLazyAsyncData<{
  id: number;
  title: string;
  completed: string;
}>('docs', () => {
  return (useApiFetch as any)(`/documents`, {
    query: {
      query: search.value,
      page: page.value,
      perPage: pageCount.value,
      columnId: sort.value.column,
      order: sort.value.direction,
    },
    // Add onResponse handler here
    onResponse({ response }) {
      //console.log(response)
      pageTotal.value = Number(response._data.total);
    },
  });
}, {
  default: () => [],
  watch: [page, search, searchStatus, pageCount, sort],
});

//Delete
async function deleteFile(fileId) {
  await useApiFetch(`/documents/${fileId}`, {
    method: 'DELETE',
    async onResponse({ response }) {
      if (response.ok) {
        refresh();
      }
    }
  });
}

</script>

<template>
  <UCard
      class="w-full"
      :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
      footer: { padding: 'p-4' }
    }"
  >
    <template #header>
      <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">
        Documents
      </h2>
    </template>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Пошук по номеру та назві..." />

      <USelectMenu v-model="selectedStatus" :options="documentStatus" multiple placeholder="Статус" class="w-40" />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Рядків на сторінці:</span>

        <USelect
            v-model.number="pageCount"
            :options="[3, 5, 10, 20, 30, 40]"
            class="me-2 w-20"
            size="xs"
        />
      </div>

      <div class="flex gap-1.5 items-center">
        <UDropdownMenu v-if="selectedRows.length > 1" :items="actions" :ui="{ width: 'w-36' }">
          <UButton
              icon="i-heroicons-chevron-down"
              trailing
              color="gray"
              size="xs"
          >
            Mark as
          </UButton>
        </UDropdownMenu>

        <USelectMenu v-model="selectedColumns" :options="columns" multiple>
          <UButton
              icon="i-heroicons-view-columns"
              color="gray"
              size="xs"
          >
            Колонки
          </UButton>
        </USelectMenu>

        <UButton
            icon="i-heroicons-funnel"
            color="gray"
            size="xs"
            :disabled="search === '' && selectedStatus.length === 0"
            @click="resetFilters"
        >
          Скинути
        </UButton>
      </div>
    </div>

    <!-- Table -->
    <UTable
        v-model="selectedRows"
        v-model:sort="sort"
        :rows="data.documents"
        :columns="columnsTable"
        :loading="status === 'pending'"
        sort-asc-icon="i-heroicons-arrow-up"
        sort-desc-icon="i-heroicons-arrow-down"
        sort-mode="manual"
        class="w-full"
        :ui="{ td: { base: 'truncate' }, default: { checkbox: { color: 'blue' } } }"
        @select="select"
    >
<!--      <template #completed-data="{ row }">-->
<!--        <UBadge size="xs" :label="row.completed ? 'Completed' : 'In Progress'" :color="row.completed ? 'emerald' : 'orange'" variant="subtle" />-->
<!--      </template>-->

      <template #fileSize-data="{ row }">
        {{ (row.fileSize / 1024).toFixed(2) }} Кб
      </template>

      <template #createdOn-data="{ row }">
        {{ formatDate(row.createdOn) }}
      </template>

      <template #modifiedOn-data="{ row }">
        {{ formatDate(row.modifiedOn) }}
      </template>

      <template #actions-data="{ row }">
        <div class="flex gap-3">
          <UTooltip text="Підписати" :popper="{ placement: 'top', arrow: true }">
            <UButton
                icon="i-heroicons-eye"
                size="2xs"
                color="emerald"
                variant="outline"
                :ui="{ rounded: 'rounded-full' }"
                square
                :to="`/documents/${row.id}`"
            />
          </UTooltip>

          <UTooltip text="Переглянути" :popper="{ placement: 'top', arrow: true }">
            <UButton
                icon="i-heroicons-eye"
                size="2xs"
                color="emerald"
                variant="outline"
                :ui="{ rounded: 'rounded-full' }"
                square
                :to="`/documents/${row.id}`"
            />
          </UTooltip>

          <UTooltip text="Редагувати" :popper="{ placement: 'top', arrow: true }">
            <UButton
                v-if="!row.completed"
                icon="i-heroicons-pencil"
                size="2xs"
                color="orange"
                variant="outline"
                :ui="{ rounded: 'rounded-full' }"
                square
                :to="`/documents/edit/${row.id}`"
            />
          </UTooltip>

          <UTooltip text="Видалити" :popper="{ placement: 'top', arrow: true }">
            <UButton
                icon="i-heroicons-trash"
                size="2xs"
                color="red"
                variant="outline"
                :ui="{ rounded: 'rounded-full' }"
                square
                @click.stop="deleteFile(row.id)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Показано
            <span class="font-medium">{{ pageFrom }}</span>
            по
            <span class="font-medium">{{ pageTo }}</span>
            з
            <span class="font-medium">{{ pageTotal }}</span>
            результатів
          </span>
        </div>

        <UPagination
            v-model="page"
            :page-count="pageCount"
            :total="pageTotal"
            :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: {
              activeButton: {
                variant: 'outline'
              }
            }
          }"
        />
      </div>
    </template>
  </UCard>
  <NuxtPage>

  </NuxtPage>
</template>