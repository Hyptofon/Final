<template>
  <div @drop="onDropHandler"
       @dragover.prevent="onDragoverHandler"
       class="group flex no-underline items-center gap-2 cursor-pointer text-slate-50 hover:text-white bg-indigo-500 hover:bg-indigo-700 font-medium rounded-lg  antialiased border border-transparent justify-center w-full"
  >
    <div @click="refFile.click()" class="px-3 py-3 gap-4 flex flex-col items-center justify-center w-full h-72">
      <UIcon name="i-heroicons-document-text-solid" class="w-32 h-32" />
      <p class="mb-0 font-medium text-center">{{ label }}</p>
      <span class="text-xs text-center">Перетягніть сюди файл, або натисніть на кнопку</span>
    </div>
    <input type="file" ref="refFile" :accept="accept" @change="onDrop" :multiple="multiple" class="hidden"/>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string,
  accept?: string,
  multiple?: boolean,
}>(), {
  accept: '',
  multiple: false
});

const emit = defineEmits<{
  (e: 'onSelect'): void
}>();
const refFile = ref();
const file = ref();

function onDrop(acceptFiles: any) {
  emit("onSelect", acceptFiles.target.files["0"]);
}

function onDropHandler(event: any) {
  event.preventDefault();

  if (event.dataTransfer.items) {
    emit("onSelect", event.dataTransfer.items[0].getAsFile());
    file.value = event.dataTransfer.items[0].getAsFile();
  }
}

function onDragoverHandler(event: any) {
  event.preventDefault();
}
</script>
