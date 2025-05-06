<template>
  <div
    class="tabs-wrapper text-base gap-x-3 overflow-hidden no-scrollbar" :class="fullWidth ? 'w-full' : 'w-full lg:w-fit'"
    ref="scrollContainer"
    @mousewheel="scrollX"
  >
    <span
      v-for="tab in tabs"
      class="tabs-item text-nowrap"
      :class="[
        {'tabs-item--active !font-medium':currentTabName === tab.name},
        tabClass,
        currentTabName === tab.name ? activeClass : '',
      ]"
      @click="currentTabName = tab.name"
      v-tooltip="{
        content: tab.hoverTooltip ? tab.hoverTooltip : '',
        html: true,
        distance: '7',
      }"
    >
      {{ tab.label }}
      <span v-if="tab.value">({{ tab.value }})</span>
    </span>
  </div>
</template>

<script setup lang="ts">
const currentTabName = defineModel('currentTabName');
const props = withDefaults(defineProps<{
  tabs?: Array<{
    name: string,
    value?: string,
    label: string,
    tooltip?: string,
    hoverTooltip?: string
  }>,
  fullWidth?: boolean,
  activeClass?: string,
  tabClass?: string,
}>(), {
  fullWidth: false,
  activeClass: '',
  tabClass: '',
});

const scrollContainer = ref(null);
function scrollX(e: WheelEvent) {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: e.deltaY, behavior: 'smooth' });

    e.preventDefault();
  }
}
</script>

<style lang="postcss" scoped>
@reference "tailwindcss";
.tabs {
  &-wrapper {
    scrollbar-width: none;
    @apply flex ;
  }

  &-item {
    @apply relative pb-2 leading-[18px] text-gray-700 flex items-center;

    &:hover {
      @apply cursor-pointer text-dark-gray border-b-2 border-solid border-gray-400;
    }

    &--active {
      @apply text-dark-gray font-semibold border-b-2 border-solid border-gray-400;
    }
  }
}
</style>
