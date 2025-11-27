<template>
  <h1>Нано-Блог</h1>

  <NewPostForm />
  <PostList />
</template>

<script setup lang="ts">
import NewPostForm from "./components/NewPostForm.vue";
import PostList from "./components/PostList.vue";
</script>

<style>
/* Базовые стили страницы */
body {
  font-family: Arial, sans-serif;
  padding: 2rem;
  margin: 0;
  min-height: 100vh;
  background-color: #ffe6e6; /* светло-розовый фон по умолчанию */
  color: #333;
}

h1 {
  text-align: center;
  color: inherit; /* берёт цвет текста из body */
}

#app {
  max-width: 700px;
  margin: 0 auto;
}

/* Карточки постов */
.post {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
}

.post button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post:hover {
  box-shadow: 2px 2px 10px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.post button:hover {
  opacity: 0.8;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Поля ввода */
input, textarea {
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus, textarea:focus {
  border-color: #007bff;
  outline: none;
}

hr {
  border: 0;
  height: 1px;
  background: #ddd;
  margin: 1rem 0;
}

#title-error, #content-error {
  font-size: 0.9rem;
}

/* Тёмная тема */
@media (prefers-color-scheme: dark) {
  body {
    background-color: #ffd6d6; /* чуть более насыщенный светло-розовый для тёмной темы */
    color: #333; /* текст оставляем тёмным, чтобы контраст был хорошим */
  }

  .post {
    background: #fff;
    border: 1px solid #ddd;
    color: #333;
  }

  input, textarea {
    background: #fff;
    color: #333;
    border: 1px solid #ccc;
  }

  button {
    background-color: #1a1a1a;
    color: #fff;
  }
}
</style>
