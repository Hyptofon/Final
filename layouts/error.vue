<template>
  <div>
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
