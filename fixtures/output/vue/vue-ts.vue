<script setup lang="ts">
import { computed, ref } from "vue";
const props = defineProps<{ msg: string }>();
const count = ref(0);
const doubled = computed(() => count.value * 2);
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ props.msg }}</h1>
    <button type="button" @click="count++">count is {{ count }}, doubled is {{ doubled }}</button>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
}
</style>
