<template>
  <NuxtLink :to="menuItem.to"
            :external="menuItem.external"
            :target="menuItem.external ? '_blank' : ''"
            active-class="active-menu-item"
            class="group flex no-underline items-center gap-2 cursor-pointer text-indigo-200 hover:text-white hover:bg-indigo-700 font-medium rounded-lg px-3 antialiased border border-transparent"
            :class="[!menuShow ? 'justify-center py-3' : 'py-2.5']"
            @click="menuToggle"
            v-tooltip.right="{
              content: !menuShow ? navTooltip : '',
              html: true,
              distance: '7',
            }"
  >
    <UIcon v-if="menuItem.icon" :name="menuItem.icon" dynamic
          class="text-xl text-indigo-200 hover:text-white transition duration-75 group-hover:text-white"
    />
    <span class="select-none whitespace-nowrap overflow-hidden text-ellipsis ms-1" v-if="menuShow">
      {{ menuItem.label }}
    </span>
    <UIcon v-if="menuItem.external" v-show="menuShow" dynamic name="material-symbols:arrow-outward"
               class="ml-auto text-[0.65em] transition duration-75 group-hover:text-white lg:hidden lg:group-hover:block" filled
    />
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

const navTooltip = props.menuItem.external
  ? '<div class="flex items-center gap-x-1">' + props.menuItem.tooltip + '<svg width="8" height="8" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
  '<path d="M8.33329 1.66675L1.66663 8.33341" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n' +
  '<path d="M2.49994 1.66675H8.33327V7.50008" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>\n' +
  '</svg></div>'
  : props.menuItem.tooltip;

</script>
<style lang="postcss" scoped>

</style>
