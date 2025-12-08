<template>
  <!-- Заголовок блога -->
  <h1>Нано-Блог</h1>

  <!-- Форма для добавления нового поста -->
  <!-- Передаём функцию addPost из usePosts -->
  <NewPostForm :addPost="addPost" />

  <!-- Список постов -->
  <!-- Передаём массив posts, состояние загрузки и функции удаления/обновления -->
  <PostList
    :posts="posts"
    :loading="loading"
    :removePost="removePost"
    :updatePost="updatePost"
  />
</template>

<script setup lang="ts">
import { usePosts } from "./composables/usePosts"; // Импортируем кастомный хук для работы с постами
import NewPostForm from "./components/NewPostForm.vue"; // Импорт формы нового поста
import PostList from "./components/PostList.vue"; // Импорт списка постов

// Используем хук usePosts для получения реактивных данных и функций
const { posts, loading, addPost, removePost, updatePost, fetchPosts } = usePosts();

// Загружаем посты с сервера при старте приложения
fetchPosts();
</script>

<style>
/* Стили для всего приложения */
body {
  font-family: Arial, sans-serif; /* шрифт */
  padding: 2rem;
  margin: 0;
  min-height: 100vh; /* минимальная высота экрана */
  background-color: #ffe6e6; /* светло-розовый фон */
  color: #333; /* цвет текста */
}

h1 {
  text-align: center; /* центрируем заголовок */
}

#app {
  max-width: 700px; /* максимальная ширина приложения */
  margin: 0 auto; /* центрируем контейнер по горизонтали */
}
</style>
