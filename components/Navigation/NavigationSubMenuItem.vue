<template>
  <NuxtLink :to="menuItem.to"
            :external="menuItem.external"
            active-class="text-dark-gray font-medium"
            class="group flex no-underline duration-150 items-center gap-2 cursor-pointer hover:bg-gray-150 rounded-lg text-gray-800 hover:text-dark-gray px-3"
            :class="[menuShow ? 'py-2.5' : 'py-2']"
            @click="menuToggle"
  >
    <span class="select-none whitespace-nowrap overflow-hidden text-ellipsis">{{ menuItem.label }}</span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{
  menuItem: object,
  menuShow: boolean
}>();

const route = useRoute();
const emit = defineEmits<{
  (e: 'menuToggle'): void
}>();
const menuToggle = function (){
  emit('menuToggle');
};
</script>
<style lang="postcss" scoped>
.active {
  @apply text-dark-gray font-medium;
}
</style>
