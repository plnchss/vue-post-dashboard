<template>
  <div class="post-filters">
    <!-- Поле для ввода текста поиска по заголовку поста -->
    <input
      v-model="filter"
      placeholder="Поиск по заголовку"
      type="text"
    />

    <!-- Выпадающий список для выбора порядка сортировки постов -->
    <select v-model="sortOrder">
      <option value="newest">Сначала новые</option>
      <option value="oldest">Сначала старые</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from "vue";

// Принимаем два пропса: текущий фильтр и порядок сортировки
const props = defineProps<{ filter: string; sortOrder: string }>();

// Объявляем события для обновления значений фильтра и сортировки родителем
const emit = defineEmits<{
  (e: "update:filter", value: string): void;
  (e: "update:sortOrder", value: string): void;
}>();

// Локальные реактивные переменные для привязки к input и select
const filter = ref(props.filter || "");       // текст фильтра
const sortOrder = ref(props.sortOrder || "newest"); // порядок сортировки по умолчанию "newest"

// Следим за изменением filter и sortOrder и отправляем изменения родительскому компоненту
watch(filter, (val) => emit("update:filter", val));
watch(sortOrder, (val) => emit("update:sortOrder", val));
</script>

<style scoped>
.post-filters {
  display: flex;               /* Располагаем input и select в ряд */
  justify-content: space-between;
  margin-bottom: 1rem;
}

input {
  flex: 1;                     /* input занимает всё доступное пространство */
  margin-right: 0.5rem;        /* небольшой отступ между input и select */
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
