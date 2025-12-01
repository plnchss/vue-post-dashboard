<template>
  <h1>Нано-Блог</h1>

  <NewPostForm :addPost="addPost" />
  <PostList :posts="posts" :loading="loading" :removePost="removePost" :updatePost="updatePost" />
</template>

<script setup lang="ts">
import { usePosts } from "./composables/usePosts";
import NewPostForm from "./components/NewPostForm.vue";
import PostList from "./components/PostList.vue";

const { posts, loading, addPost, removePost, updatePost, fetchPosts } = usePosts();

// Подгружаем посты при старте
fetchPosts();
</script>

<style>
body {
  font-family: Arial, sans-serif;
  padding: 2rem;
  margin: 0;
  min-height: 100vh;
  background-color: #ffe6e6;
  color: #333;
}

h1 {
  text-align: center;
}

#app {
  max-width: 700px;
  margin: 0 auto;
}
</style>
