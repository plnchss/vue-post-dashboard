/*
Пояснения для проверки
  PostFilters.vue — компонент фильтрации и сортировки постов

  Реализовано в компоненте:

  1. Фильтрация постов
     - Поле ввода для поиска по заголовку
     - Используется `v-model` для двусторонней связи с родителем

  2. Сортировка постов
     - Выпадающий список с вариантами:
       * сначала новые
       * сначала старые

  3. Кастомный v-model
     - Используются события `update:filter` и `update:sortOrder`
     - Все изменения передаются родительскому компоненту

  4. Локальное состояние
     - Внутренние `ref` для input и select
     - Синхронизация с родителем через `watch`
*/

<template>
  <!-- Блок фильтрации и сортировки постов -->
  <div class="post-filters">
    <!-- Поле ввода для поиска постов по заголовку -->
    <!--
      v-model связывает значение input с локальной переменной filter
      Все изменения автоматически передаются родителю
    -->
    <input
      v-model="filter"
      placeholder="Поиск по заголовку"
      type="text"
    />

    <!-- Выпадающий список для выбора порядка сортировки -->
    <!--
      newest — сначала новые посты
      oldest — сначала старые посты
    -->
    <select v-model="sortOrder">
      <option value="newest">Сначала новые</option>
      <option value="oldest">Сначала старые</option>
    </select>
  </div>
</template>

<script setup lang="ts">
/*
  Компонент фильтров постов
  Работает через кастомный v-model
  и передаёт изменения родительскому компоненту
*/

import { ref, defineProps, defineEmits, watch } from "vue";

// Входные параметры компонента
// filter — текущая строка поиска
// sortOrder — текущий порядок сортировки
const props = defineProps<{
  filter: string;
  sortOrder: string;
}>();

// События для реализации v-model в родителе
const emit = defineEmits<{
  (e: "update:filter", value: string): void;
  (e: "update:sortOrder", value: string): void;
}>();

// Локальные реактивные значения,
// которые используются в input и select
const filter = ref(props.filter || "");
const sortOrder = ref(props.sortOrder || "newest");

// Следим за изменением фильтра
// и передаём новое значение родителю
watch(filter, (value) => {
  emit("update:filter", value);
});

// Следим за изменением сортировки
// и передаём новое значение родителю
watch(sortOrder, (value) => {
  emit("update:sortOrder", value);
});
</script>

<style scoped>
/* Контейнер фильтров */
.post-filters {
  display: flex;                /* input и select в одну строку */
  justify-content: space-between;
  margin-bottom: 1rem;
}

/* Поле поиска */
input {
  flex: 1;                      /* занимает всё доступное пространство */
  margin-right: 0.5rem;         /* отступ между input и select */
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

/* Выпадающий список */
select {
  padding: 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}
</style>
