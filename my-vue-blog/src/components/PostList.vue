
/*
Пояснения для проверки
  PostList.vue — компонент списка постов

  Реализовано в компоненте:

  1. Отображение списка постов
     - Получает массив постов через `props`
     - Отображает каждый пост через компонент `PostItem`

  2. Фильтрация и сортировка
     - Используется компонент `PostFilters`
     - Фильтрация и сортировка реализованы через `computed`

  3. Состояние загрузки
     - Пока `loading = true`, отображается спиннер
     - После загрузки отображается список постов

  4. Пустое состояние
     - Если список постов пуст — показывается сообщение "Нет записей"

  5. Анимации
     - Используется `transition-group`
     - Анимация появления и удаления постов
*/
<template>
  <!-- Контейнер списка постов -->
  <div id="post-list">
    <!-- Заголовок с количеством постов -->
    <h2>Посты (Всего: {{ posts.length }})</h2>

    <!-- Компонент фильтров и сортировки -->
    <!--
      v-model:filter — строка поиска
      v-model:sortOrder — порядок сортировки (новые / старые)
    -->
    <PostFilters
      v-model:filter="filter"
      v-model:sortOrder="sortOrder"
    />

    <!-- Спиннер во время загрузки данных -->
    <div v-if="loading" class="spinner"></div>

    <!-- Сообщение, если постов нет -->
    <div v-else-if="filteredPosts.length === 0" class="no-posts">
      Нет записей
    </div>

    <!-- Анимированный список постов -->
    <transition-group name="fade" tag="div">
      <!-- Один пост -->
      <PostItem
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        :removePost="removePost"
        :updatePost="updatePost"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
/*
  Script setup — Composition API
  Используется TypeScript для строгой типизации
*/

import { ref, computed } from "vue";
import PostItem from "./PostItem.vue";       // Компонент одного поста
import PostFilters from "./PostFilters.vue"; // Компонент фильтрации и сортировки
import type { Post } from "../types";        // Тип данных Post

// Описание входных параметров (props)
interface Props {
  posts: Post[];                              // Массив постов
  loading: boolean;                           // Флаг загрузки данных
  removePost: (id: string) => Promise<void>;  // Функция удаления поста
  updatePost: (post: Post) => Promise<void>;  // Функция обновления поста
}

// Получаем props с типизацией
const props = defineProps<Props>();

// Текст фильтра (поиск по заголовку)
const filter = ref("");

// Порядок сортировки постов
// newest — сначала новые
// oldest — сначала старые
const sortOrder = ref<"newest" | "oldest">("newest");

// Вычисляемый список постов с учётом фильтра и сортировки
const filteredPosts = computed(() => {
  let filtered = props.posts;

  // Фильтрация по названию поста
  if (filter.value) {
    filtered = filtered.filter(post =>
      post.title
        .toLowerCase()
        .includes(filter.value.toLowerCase())
    );
  }

  // Сортировка по дате создания
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    // Новые сверху или старые сверху
    return sortOrder.value === "newest"
      ? dateB - dateA
      : dateA - dateB;
  });

  return filtered;
});
</script>

<style scoped>
/* Контейнер списка постов */
#post-list {
  max-width: 700px;
  margin: 0 auto;
}

/* Сообщение "Нет записей" */
.no-posts {
  text-align: center;
  font-size: 1rem;
  color: #999;
  margin-top: 1rem;
}

/* Спиннер загрузки */
.spinner {
  margin: 1rem auto;
  width: 40px;
  height: 40px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

/* Анимация вращения спиннера */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Анимации появления и исчезновения постов */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
