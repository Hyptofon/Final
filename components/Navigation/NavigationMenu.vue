<template>
  <div class="layout-menu-container flex flex-col">
    <ul class="layout-menu">
      <li class="my-1 mb-4">
        <UButton
            to="/documents/upload"
            class="w-full h-12 justify-center text-slate-50 text-lg hover:text-white bg-indigo-500 hover:bg-indigo-700 font-medium rounded-lg"
        >
          <UIcon name="i-material-symbols-upload-file" dynamic
                 class="text-xl text-indigo-200 hover:text-white transition duration-75 group-hover:text-white"
          />
          {{isMenuCollapsed ? '' : 'Завантажити'}}
        </UButton>
      </li>
      <template v-for="(item, index) in sidebarMenu">
        <li class="my-1" v-if="item.to">
          <NavigationMenuItem @menu-toggle="menuToggle" :menu-item="item" :menu-show="!isMenuCollapsed"/>
        </li>

        <li class="my-1" v-else-if="!item.to && item.items?.length > 0">
          <button
            class="group flex w-full no-underline items-center gap-3 cursor-pointer px-3 text-indigo-200 hover:text-white hover:bg-indigo-700 font-medium rounded-lg antialiased border border-transparent"
            @click="toogleSubmenu(index)"
            :class="[
              isMenuCollapsed ? 'justify-center py-3' : 'py-2.5',
              {'text-dark-gray bg-green-100 hover:bg-green-200' : item.exact},
              {'bg-gray-150' : item.open && isMenuCollapsed}
            ]"
            v-tooltip.right="{
            content: isMenuCollapsed && !item.open ? item.tooltip + '...' : '',
            distance: '7',
            }"
          >
            <UIcon v-if="item.icon" :name="item.exact ? item.icon+'-active' : item.icon"
                       class="text-[1.25em]  transition duration-75 group-hover:text-dark-gray"
                       :class="item.open && isMenuCollapsed ? 'text-dark-gray' : 'text-gray-700'"
                       filled/>
            <span v-if="!isMenuCollapsed" class="select-none whitespace-nowrap overflow-hidden text-ellipsis">{{ item.label }}</span>
            <UIcon v-if="!isMenuCollapsed"
                       :name="item.open ? 'chevron-up' : 'chevron-down'"
                       class="duration-100 ml-auto text-[0.65em] group-hover:text-gray-800"
                       :class="item.open ? 'text-dark-gray' : 'text-gray-600'"
                       filled
            />
          </button>

          <div v-if="item.open" :class="!isMenuCollapsed ? 'relative' : 'fixed left-16 -mt-11 bg-white shadow-lg rounded-lg p-3 pt-3 border border-gray-400/50'" :ref="setDropdownMenu">
                <span v-if="isMenuCollapsed" class="select-none whitespace-nowrap overflow-hidden text-ellipsis uppercase text-xs font-normal text-gray-600 tracking-[.04rem]">{{ item.label }}</span>
                <ul class="pt-1" :class="!isMenuCollapsed ? 'pl-9' : 'pl-4'">
                    <li class="text-base relative sub-level after:last:bg-transparent" v-for="(subitem, levelIndex) in item.items">
                        <img alt="icon" src="/images/nav/sub-nav-line.svg"
                             class="w-5 h-5 text-gray-200 absolute -left-[18px]"
                             :class="{'top-0.5' : !isMenuCollapsed}"
                        />
                        <template v-if="subitem.items?.length > 0">
                            <button
                                    class="flex justify-between w-full no-underline duration-300 items-center gap-3 cursor-pointer px-3 hover:bg-gray-150 rounded-lg text-gray-800"
                                    @click="toogleSubmenu(index, levelIndex)"
                                    :class="[{'bg-gray-50' : subitem.open}, !isMenuCollapsed ? 'font-medium py-2.5' : 'font-normal py-2']"
                            >
                                {{ subitem.label }}
                                <UIcon v-if="!isMenuCollapsed"
                                           :name="subitem.open ? 'chevron-up' : 'chevron-down'"
                                           class="duration-100 ml-auto text-[0.65em] group-hover:text-gray-800"
                                           :class="subitem.open ? 'text-dark-gray' : 'text-gray-600'"
                                           filled
                                />
                            </button>
                            <ul v-if="subitem.open" class="pl-4">
                                <li class="my-1" v-for="subitem in subitem.items">
                                    <NavigationSubMenuItem @menu-toggle="menuToggle" :menu-item="subitem" :menu-show="!isMenuCollapsed" :open="item.open" sub-item/>
                                </li>
                            </ul>
                        </template>

                        <button v-else-if="subitem.button" class="w-full py-2.5 group flex no-underline duration-150 items-center gap-2 cursor-pointer hover:bg-gray-150 rounded-lg text-gray-800 hover:text-dark-gray px-3" @click="subitem.click()">
                          <span class="select-none whitespace-nowrap overflow-hidden text-ellipsis">{{ subitem.label }}</span>
                        </button>

                        <NavigationSubMenuItem @menu-toggle="menuToggle" :menu-item="subitem" :menu-show="!isMenuCollapsed" :open="item.open" sub-item v-else/>
                    </li>
                </ul>
            </div>

        </li>
      </template>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';

const route = useRoute();
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
const toogleSubmenu = (i, levelIndex = null) => {
  if (levelIndex !== null) {
    // Toggle the selected submenu
    sidebarMenu.value[i].items[levelIndex].open = !sidebarMenu.value[i].items[levelIndex].open;

    // Close all other submenus at the same level
    sidebarMenu.value[i].items.forEach((item, index) => {
      if (index !== levelIndex) {
        item.open = false;
      }
    });
  } else {
    // Toggle the selected main menu
    sidebarMenu.value[i].open = !sidebarMenu.value[i].open;

    // Close all other main menus
    sidebarMenu.value.forEach((item, index) => {
      if (index !== i) {
        item.open = false;
      }
    });
  }

  // levelIndex !== null
  //   ? sidebarMenu.value[i].items[levelIndex].open = !sidebarMenu.value[i].items[levelIndex].open
  //   : sidebarMenu.value[i].open = !sidebarMenu.value[i].open;
}

/*Close dropdown menu on outside click in small menu mode*/
const dropdownMenu = ref(null);
const setDropdownMenu = (el) => {
  if (el) {
    dropdownMenu.value = el
  }
}
onClickOutside(dropdownMenu, () => {
  if(isMenuCollapsed.value) {
    sidebarMenu.value.forEach((item) => {
        item.open = false;
    });
    //sidebarMenu.value = sidebarMenu.value.map(item => ({ ...item, open: false }));
  }
});

const upload = () => {

}

watch(isMenuCollapsed, () => {
  if(isMenuCollapsed.value) {
    sidebarMenu.value.forEach((item) => {
      item.open = false;
    });
  } else {
    sidebarMenu.value.forEach(item => {
      if (item.exact) {
        item.open = true;
      }
    });
  }
})

const sidebarMenu = ref([
  {
    label: 'Документи',
    icon: 'material-symbols:docs',
    to: '/documents',
    tooltip: 'Документи',
    external: false,
    exact: computed(() => route.path === '/'),
  },
  {
    label: 'Архів',
    icon: 'material-symbols:archive',
    to: '/documents/archive',
    tooltip: 'Архів',
    external: false,
    exact: computed(() => route.path.includes('/get-funding')),
  },
//   {
//   label: 'My Deals',
//       icon: 'my-deals',
//       tooltip: 'My Deals',
//       open: route.path.includes('/my-deals'),
//       exact: computed(() => route.path.includes('/my-deals')),
//       items: [
//     {
//       label: 'Deal Flow',
//       icon: 'pi pi-fw pi-bookmark',
//       to: '/my-deals/deal-flow',
//       external: false,
//       //open: route.path.includes('/my-deals/deal-flow'),
//       // items: [
//       //   { label: 'Investor Mindset', icon: '', to: '/1' },
//       //   { label: 'How to Use PiN', icon: '', to: '/1' },
//       //   { label: 'Understanding the Data', icon: '', to: '/1' },
//       //   { label: 'Applying PiN to Your Business', icon: '', to: '/1' },
//       // ]
//     },
//     {
//       label: 'Favorites',
//       icon: '',
//       to: '/my-deals/favorites',
//       external: false,
//     },
//     {
//       label: 'Lists',
//       icon: '',
//       to: '/my-deals/lists',
//       external: false,
//     },
//     {
//       label: 'Annotations',
//       icon: '',
//       to: '/my-deals/annotations',
//       external: false,
//     },
//   ]
// },
]);
const isOpenAddCompPopup = ref(false);
</script>
<style lang="postcss" scoped>
.sub-level::after {
  position: absolute;
  height: 100%;
  width: 1px;
  background: #dddddd;
  top: 4px;
  opacity: 1;
  content: "";
  left: -14px;
}
</style>
