<template>
  <div class="flex items-center justify-center h-screen w-full">
    <slot />
  </div>
</template>
<script setup lang="ts">
useHead({
  //link: [{ rel: "icon", type: "image/x-icon", href: "/icon.png" }],
  htmlAttrs: {
    lang: "en",
  },
});
</script>
