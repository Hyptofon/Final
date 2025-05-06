<template>
<!--  <ClientOnly>-->
<!--            <Head>-->
<!--              <Script src="/scripts/common.js" defer/>-->
<!--              <Script src="/scripts/euutils.js" defer/>-->
<!--              <Script src="/scripts/euscpt.js" defer/>-->
<!--              <Script src="/scripts/euscpm.js" defer/>-->
<!--              <Script src="/scripts/euscp.js" defer/>-->
<!--              <Script src="/scripts/fs/FileSaver.js" defer/>-->
<!--              <Script src="/scripts/euscptest.js" defer/>-->
<!--            </Head>-->
<!--  </ClientOnly>-->
  <div class="app-panel">
    <nav class="sidebar test fixed z-40 top-0 left-0 overflow-y-auto lg:border-solid lg:border-r lg:border-gray-400 flex flex-col pt-0 h-mobile-screen bg-indigo-600"
         :class="[!isMenuCollapsed ? 'w-full lg:w-[262px] max-lg:pt-16 p-4 z-50' : 'hidden lg:flex lg:w-[72px] p-3', {'space-y-4' : isMobile}]">
      <div class="mb-4 py-1 hidden lg:block">
        <NuxtLink to="/" class=" flex items-center text-sm lg:text-lg font-bold no-underline text-black"
        :class="isMenuCollapsed ? 'justify-center ml-0' : 'ml-3.5'"
        >
          <img alt="Logo" :src="!isMenuCollapsed ? 'https://cdn.umsys.com.ua/umsystem-logo-white.svg' : 'https://cdn.umsys.com.ua/umsystem-logo-white-h.svg'" class="h-14">
        </NuxtLink>
      </div>
      <NavigationMenu @menuToggle="toggleMenu" v-model="isMenuCollapsed"/>
      <div class="h-px bg-gray-200 border-t border-solid self-stretch" v-if="isMobile"></div>
      <NavigationBottomMenu @menuToggle="toggleMenu" v-model="isMenuCollapsed" class="lg:mt-auto"/>

      <div class="h-px bg-gray-200 border-t border-solid self-stretch" v-if="isMobile"></div>
      <NavigationProfile @menuToggle="toggleMenu" v-if="isMobile" v-model="isMenuCollapsed" class="lg:mt-auto"/>

      <div class="text-center text-gray-400 text-xs">v1.0.0</div>
    </nav>

    <div class="main-container max-h-screen flex flex-col ml-0 h-mobile-screen" :class="!isMenuCollapsed ? 'lg:ml-[262px]' : 'lg:ml-[72px]'">
      <Header @menuToggle="toggleMenu" v-model="isMenuCollapsed"/>
      <main class="grow overflow-auto relative flex flex-col">
        <!--        <Breadcrumbs/>-->
        <slot />
<!--        <UModal v-model="isSignModalOpen">-->
          <div class="p-4 fixed inset-auto" >
<!--            <DocumentSignModal v-show="isSignModalOpen"/>-->
          </div>
<!--        </UModal>-->

      </main>
<!--      <Footer class="mt-auto"/>-->
    </div>

    <!--    <teleport to="body">-->
    <!--      <div v-if="menuShow" class="layout-mask p-component-overlay"></div>-->
    <!--    </teleport>-->

  </div>
</template>

<script setup lang="ts">
import {useUIStore} from "~/stores/useUIStore";
import {useUserStore} from "~/stores/useUserStore";

const uiControl = useUIStore();
const { isMenuCollapsed, isSignModalOpen } = storeToRefs(uiControl)

const userStore = useUserStore();
const { accessToken } = storeToRefs(userStore);

if (!accessToken.value) {
  await navigateTo('/sign-in');
}

const isMobile = useIsMobile();
const runtimeConfig = useRuntimeConfig();
const route = useRoute();

const toggleMenu = () => {
  isMenuCollapsed.value = !isMenuCollapsed.value;
}

watch(isMobile, (newValue) => {
  if (newValue) {
    isMenuCollapsed.value = true;
  }
});

//
// const { pending, data: auth } = await useFetch(() => `/api-pin/v2/user-accesses/`, {
//   method: 'GET',
//   baseURL: runtimeConfig.public.apiBase,
//   headers: {
//     ...useRequestHeaders(['cookie']),
//     'X-Requested-With': 'XMLHttpRequest',
//   }
// });
//
// const isAdmin = useState('isAdmin'); //can be used in all components
// isAdmin.value = auth.value?.data.isAdmin ?? false;
//
// if(!isAdmin.value) {
//   await navigateTo(runtimeConfig.public.apiBase, { external: true });
// }

useHead({
  //link: [{ rel: "icon", type: "image/x-icon", href: "/icon.png" }],
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: computed(() => {
      return (isMenuCollapsed.value && isMobile.value) ? 'bg-gray-200 overflow-y-hidden' : 'bg-gray-200';
    }),
  },
  // script: [
  //   { src: '/scripts/common.js', tagPosition: 'head', defer: true },
  //   { src: '/scripts/euutils.js', tagPosition: 'head', defer: true },
  //   { src: '/scripts/euscpt.js', tagPosition: 'head', defer: true },
  //   { src: '/scripts/euscpm.js', tagPosition: 'head', defer: true },
  //   { src: '/scripts/euscp.js', tagPosition: 'head', defer: true },
  //   { src: '/scripts/fs/FileSaver.js', tagPosition: 'head', defer: true },
  //   { src: '/scripts/euscptest.js', tagPosition: 'head', defer: true },
  // ]
});

// onMounted(() => {
//   useHead({
//     script: [
//       { src: '/scripts/common.js', tagPosition: 'head', defer: true },
//       { src: '/scripts/euutils.js', tagPosition: 'head', defer: true },
//       { src: '/scripts/euscpt.js', tagPosition: 'head', defer: true },
//       { src: '/scripts/euscpm.js', tagPosition: 'head', defer: true },
//       { src: '/scripts/euscp.js', tagPosition: 'head', defer: true },
//       { src: '/scripts/fs/FileSaver.js', tagPosition: 'head', defer: true },
//       { src: '/scripts/euscptest.js', tagPosition: 'head', defer: true },
//     ]
//   });
// });

</script>

<style scoped lang="postcss">
.sidebar {
  user-select: none;
  transition: transform 300ms, left 300ms;
}
.main-container {
  transition: margin-left 300ms;
}
/*.layout-mask {*/
/*  @apply z-30 bg-dark-gray/70 block absolute top-0 left-0 w-full h-full;*/
/*}*/
</style>
