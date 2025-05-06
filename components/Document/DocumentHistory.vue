<template>
  <section>
    <div v-for="historyItem in data.document.history">
      <div class="font-medium">{{ formatDate(historyItem.createdOn) }}</div>
      <div class="flex items-center justify-between">
        <span>{{historyItem.status}}</span>
        <span>{{data.users[historyItem.userId].fullName[0].userFullName}}</span>
      </div>
    </div>

  </section>
</template>
<script setup lang="ts">
const props = defineProps<{
  data: object,
}>();

const formatDate = (dateStr) => useDateFormat(dateStr, 'DD.MM.YYYY HH:mm:ss', { locales: 'uk-UA' });
</script>