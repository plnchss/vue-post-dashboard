<template>
  <div id="post-list">
    <h2>Посты (Всего: {{ posts.length }})</h2>

    <PostFilters v-model:filter="filter" />

    <div v-if="loading" class="spinner"></div>

    <div v-else-if="filteredPosts.length === 0" class="no-posts">
      Нет записей
    </div>

    <transition-group name="fade" tag="div">
      <PostItem
        v-for="post in filteredPosts"
        :key="post.id"
        :post="post"
        @removePost="removePost"
        @updated="updatePostList"
      />
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import PostItem from "./PostItem.vue";
import PostFilters from "./PostFilters.vue";
import { usePosts } from "../composables/usePosts";

const { posts, loading, fetchPosts, removePost, updatePost } = usePosts();
const filter = ref("");

onMounted(async () => {
  await fetchPosts();
  console.log("Posts in PostList:", posts.value); // <-- проверка
});

const filteredPosts = computed(() => {
  if (!filter.value) return posts.value;
  return posts.value.filter(p =>
    p.title.toLowerCase().includes(filter.value.toLowerCase())
  );
});

function updatePostList(updatedPost: any) {
  updatePost(updatedPost);
}
</script>
