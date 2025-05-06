<template>
  <UDropdownMenu :items="items" :ui="{ item: { disabled: 'cursor-text select-text' } }" :popper="{ placement: 'bottom-start' }">
    <UAvatar :src="user.picture" :alt="user.name"/>

    <template #account="{ item }">
      <div class="text-left">
        <p>
          Signed in as
        </p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          {{ item.label }}
        </p>
      </div>
    </template>

    <template #item="{ item }">
      <span class="truncate">{{ item.label }}</span>

      <UIcon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500 ms-auto" />
    </template>
  </UDropdownMenu>
</template>
<script setup lang="ts">
import {useUserStore} from "~/stores/useUserStore";

const isMobile = useIsMobile();
const userStore = useUserStore();
const { user } = storeToRefs(userStore);

const props = withDefaults(defineProps<{
  modelValue: boolean,
}>(), {
  modelValue: false,
});

const emit = defineEmits<{
  (e: 'menuToggle'): void
  (e: 'update:modelValue', value: boolean): void
}>();

const isMenuCollapsed = computed({
  get: () => props.modelValue,
  set: (val) => {
    emit('update:modelValue', val)
  }
});
const menuToggle = function (){
  if (isMobile.value) {
    emit('menuToggle');
  }
};

// const user = ref({
//   image: 'https://avatars.githubusercontent.com/u/739984?v=4',
//   name: 'Test Name'
// })
const items = [
  [{
    label: user.value?.email,
    slot: 'account',
    disabled: true
  }], [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth'
  }], [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open'
  }, {
    label: 'Changelog',
    icon: 'i-heroicons-megaphone'
  }, {
    label: 'Status',
    icon: 'i-heroicons-signal'
  }], [{
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle'
  }]
]
</script>
