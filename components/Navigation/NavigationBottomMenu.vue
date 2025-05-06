<template>
  <div class="layout-menu-container flex flex-col">
    <ul class="layout-bottom-menu mb-2">
      <template v-for="(item, index) in sidebarBottomMenu">
        <li class="my-1" v-if="item.to">
          <NavigationMenuItem @menu-toggle="menuToggle" :menu-item="item" :menu-show="!isMenuCollapsed"/>
        </li>
      </template>
    </ul>
  </div>
</template>
<script setup lang="ts">
const isMobile = useIsMobile();
const props = defineProps<{
  modelValue: boolean,
}>();
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

const sidebarBottomMenu = ref([
  {
    label: 'UMSystem',
    icon: 'mdi:web',
    to: 'https://umsys.com.ua',
    tooltip: 'UMSystem',
    external: true,
  },
]);
</script>
