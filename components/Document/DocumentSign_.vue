<template>
  <Layout :title="pageTitle" v-bind="context">
    <ClientOnly>
      <div v-if="openSignDialog" class="relative z-10">
        <div class="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <div class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <h3 class="text-lg font-medium leading-6 text-gray-900">Підпис документу</h3>
              <div>
                <span class="hidden" id="status">(завантаження...)</span>
                <progress value="0" max="100" id="progress" hidden />
                <h6>Оберіть ЦСК</h6>
                <select aria-label="Виберіть сервер" id="CAsServersSelect" class="styled-select1 w-full form-select px-3 py-2 outline-none cursor-pointer appearance-none border-2 ring-gray-300 focus:border-gray-300 border-gray-300 focus:ring-gray-300 bg-gray-200 outline-2 focus:outline-2">
                  <!-- Options should be dynamically populated -->
                </select>
                <h6>Оберіть файл з особистим ключем та вкажіть пароль захисту</h6>
                <div class="mb-4">
                  <UploadField
                      name="avatar"
                      :setFiles="setFile"
                      :files="file"
                      placeholder="Виберіть особистий ключ:"
                      id="PKeyFileInput"
                      accept="*"
                  />
                  <div class="mt-7">
                    <PasswordField
                        id="PKeyPassword"
                        placeholder="Введіть пароль від ЕЦП"
                        label="Пароль"
                    />
                  </div>
                  <input type="hidden" id="table-documents-list" :value="JSON.stringify(filteredDocuments)" />
                </div>
              </div>
              <div class="flex align-center justify-center gap-4">
                <button type="button" class="btn-success" id="sign-btn" @click="signFile">
                  Підписати
                </button>
                <button @click="setOpenSignDialog(false)" class="btn-danger" id="close-btn">
                  Закрити
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <input type="hidden" id="access-token" :value="context.accessToken" />

    <div class="flex md:flex-row flex-col items-center gap-2 mb-4">
      <router-link to="new" class="btn-primary">
        Створити
      </router-link>
      <router-link :to="`${selectedRowsIds.join('')}/download`" class="btn-primary">
        Завантажити
      </router-link>
      <router-link :to="`${selectedRowsIds.join('')}/send`" class="btn-gray">
        Відправити
      </router-link>
      <button class="btn-gray" @click="setOpenSignDialog(true)" :disabled="!canSign">
        Підписати
      </button>
      <button class="btn-gray">Редагувати</button>
      <button class="btn-gray">Зв'язати</button>
      <button class="btn-gray">Зберегти</button>
      <button class="btn-gray">Перемістити</button>
    </div>

    <DataGrid :defaultColumns="columns" :data="documents" :extendedRowId="documentId" />
  </Layout>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';
import uk from 'date-fns/locale/uk';
import { fetchDocuments, signFile } from '~/src/fetch'; // Adjust this import as needed
import { Layout, DataGrid, ClientOnly, CheckboxField, UploadField, PasswordField } from '~/src/components';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();

    const context = useContext(); // Assuming a useContext hook or equivalent in Vue

    const pageTitle = 'Документи';
    const openSignDialog = ref(false);
    const selectedRowsIds = ref<string[]>([]);
    const documents = ref<Document[]>([]); // Replace with your Document type
    const file = ref<File[]>([]);

    const loadDocuments = async () => {
      const res = await fetchDocuments(); // Define this function to fetch documents
      if (res.status === 401) {
        router.push('/sign-in');
      } else if (res.status === 403) {
        router.push('/access-denied');
      } else {
        documents.value = await res.json();
      }
    };

    const canSign = computed(() => {
      return documents.value.some(doc => selectedRowsIds.value.includes(doc.id) && doc.canSign);
    });

    const filteredDocuments = computed(() => {
      return documents.value.filter(doc => selectedRowsIds.value.includes(doc.id));
    });

    const columns = ref([
          {
            key: 'id',
            header: () => (
                <CheckboxField
                    name=""
            v-model="selectedRowsIds.length === documents.length"
            @change="toggleSelectAll"
                />
        ),
        cell: (row) => (
            <CheckboxField
                name="checkbox"
    v-model="selectedRowsIds.includes(row.id)"
  @change={() => toggleRowSelection(row.id)}
    />
  ),
  },
    {
      key: 'name',
          header: () => 'Назва',
        cell: (row) => row.name,
    },
    {
      key: 'number',
          header: () => '#',
        cell: (row) => row.number,
    },
    {
      key: 'baseNumber',
          header: () => '# підстави',
        cell: (row) => row.baseNumber,
    },
    {
      key: 'createdOn',
          header: () => 'Дата створення',
        cell: (row) => format(new Date(row.createdOn), 'dd.MM.yyyy HH:mm', { locale: uk }),
    },
    {
      key: 'actions',
          header: () => (
        <div class="flex w-full items-center justify-center" />
    ),
        cell: (row) => (
        <div class="flex w-full items-center justify-center md:gap-2">
            <router-link :to="`${row.id}/view`">
    <EyeIcon class="h-6 w-6 cursor-pointer" aria-hidden="true" />
        </router-link>
        <router-link v-if="canEdit" :to="`${row.id}/edit`">
    <PencilIcon class="h-6 w-6 cursor-pointer text-blue-500" aria-hidden="true" />
        </router-link>
        <router-link v-if="canDelete" :to="`${row.id}/delete`">
    <TrashIcon class="h-6 w-6 cursor-pointer text-red-500" aria-hidden="true" />
        </router-link>
        </div>
    ),
    },
  ]);

    const toggleRowSelection = (id: string) => {
      if (selectedRowsIds.value.includes(id)) {
        selectedRowsIds.value = selectedRowsIds.value.filter(rowId => rowId !== id);
      } else {
        selectedRowsIds.value.push(id);
      }
    };

    const toggleSelectAll = () => {
      if (selectedRowsIds.value.length === documents.value.length) {
        selectedRowsIds.value = [];
      } else {
        selectedRowsIds.value = documents.value.map(doc => doc.id);
      }
    };

    const setOpenSignDialog = (value: boolean) => {
      openSignDialog.value = value;
    };

    const handleSignFile = async () => {
      await signFile(file.value); // Define the signFile function appropriately
    };

    onMounted(loadDocuments);

    return {
      pageTitle,
      openSignDialog,
      selectedRowsIds,
      documents,
      file,
      canSign,
      filteredDocuments,
      columns,
      setOpenSignDialog,
      signFile: handleSignFile,
      context,
    };
  },
});
</script>

<style scoped>
/* Add your styles here */
</style>
