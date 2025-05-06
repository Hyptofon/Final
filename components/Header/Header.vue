<template>
  <header class="um-docs-header sticky z-50 bg-white min-h-[68px] max-h-[68px] lg:min-h-[72px] lg:max-h-[72px] left-0 top-0 w-full py-4 flex items-center justify-start px-4 border-b border-solid shadow">
    <button
      class="flex rounded-lg group pl-2 ml-0 mr-5 order-1 lg:order-none lg:pl-0 lg:hover:bg-gray-100 lg:hover:text-gray-700"
      @click="menuToggle"
      v-tooltip.right="{
              content: isMenuCollapsed ? 'Розгорнути меню' : 'Згорнути меню',
              html: true,
              distance: '7',
            }"
    >
      <UIcon
        class="w-5 text-dark-gray text-lg"
        :name="!isMenuCollapsed ? 'icon-park-outline:expand-right' : 'icon-park-outline:expand-left'"
        dynamic
        v-if="!isMobile"
      />
      <UIcon
          v-if="isMobile"
        class="lg:hidden w-5 text-dark-gray"
        :class="!isMenuCollapsed ? 'text-base' : 'text-xl'"
        :name="!isMenuCollapsed ? 'material-symbols:close' : 'ci:hamburger'"
        dynamic
      />
    </button>
    <NuxtLink to="/" class="flex order-2 items-center text-sm lg:text-lg font-bold no-underline text-black lg:hidden">
      <img alt="Logo" src="https://cdn.umsys.com.ua/umsystem-logo-white.svg" class="h-9">
      <span class="hidden">UMSystem Docs</span>
    </NuxtLink>

    <div class="ml-auto flex items-center space-x-0.5 order-3 lg:order-none">
      <button class="group relative hover:bg-gray-150 p-3 rounded-lg flex items-center">
        <UIcon name="i-heroicons-magnifying-glass-20-solid" class="text-xl text-gray-800 transition duration-75 group-hover:text-gray-900"/>
      </button>

      <button class="group hover:bg-gray-150 p-3 rounded-lg">
        <div class="relative flex items-center">
          <UChip :show="newMessages" size="md" color="red">
            <UIcon name="material-symbols:notifications" class="text-xl text-gray-800 transition duration-75 group-hover:text-gray-900" dynamic/>
          </UChip>
        </div>
      </button>

      <UPopover v-model:open="openMessages" :popper="{ placement: 'bottom-end' }" :ui="{width: 'w-[350px] max-w-[350px]'}">
        <button class="flex items-center justify-center group hover:bg-gray-150 p-3 rounded-lg order-4 lg:order-none relative"
                :class="{'bg-gray-150' : openMessages}"
        >
          <div class="relative flex items-center justify-center flex-shrink-0">
            <UChip :show="newMessages" size="md" color="red">
              <UIcon name="ic:baseline-message" class="text-xl text-gray-800 transition duration-75 group-hover:text-gray-900"
                   dynamic/>
            </UChip>
          </div>
        </button>

        <template #panel>
<!--          <ConversationPopover/>-->
        </template>
      </UPopover>
    </div>

    <div class="lg:ml-3 layout-topbar-menu flex origin-top order-5 lg:order-none">
        <NavigationProfile v-if="!isMobile" v-model="isMenuCollapsed"/>
    </div>
  </header>
</template>

<script setup lang="ts">
// import { Switch } from '@headlessui/vue';
// const darkMode = ref(false);
const isMenuCollapsed = defineModel()

const isMobile = useIsMobile();

const emit = defineEmits<{
  (e: 'menuToggle'): void
}>();

const menuToggle = function (){
  emit('menuToggle');
};

const newMessages = ref(true);
const openMessages = ref(false);
// const isAdmin = useState('isAdmin');
// const auth = {'isAdmin': isAdmin.value};
</script>

<style lang="postcss" scoped>
.um-docs-header {
  transition: left 1000ms;
}
</style>
