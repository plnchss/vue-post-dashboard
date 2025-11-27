<template>
  <div class="post-filters">
    <input
      v-model="filter"
      placeholder="Поиск по заголовку"
      type="text"
    />

    <select v-model="sortOrder">
      <option value="newest">Сначала новые</option>
      <option value="oldest">Сначала старые</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps<{ filter: string; sortOrder: string }>();
const emit = defineEmits<{
  (e: "update:filter", value: string): void;
  (e: "update:sortOrder", value: string): void;
}>();

const filter = ref(props.filter || "");
const sortOrder = ref(props.sortOrder || "newest");

watch(filter, (val) => emit("update:filter", val));
watch(sortOrder, (val) => emit("update:sortOrder", val));
</script>

<style scoped>
.post-filters {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

input {
  flex: 1;
  margin-right: 0.5rem;
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
