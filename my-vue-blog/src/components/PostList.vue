<template>
  <div id="post-list">
    <h2>Посты (Всего: {{ posts.length }})</h2>

    <PostFilters v-model:filter="filter" v-model:sortOrder="sortOrder" />

    <div v-if="loading" class="spinner"></div>

    <div v-else-if="filteredPosts.length === 0" class="no-posts">
      Нет записей
    </div>

    <transition-group name="fade" tag="div">
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
import { ref, computed } from "vue";
import PostItem from "./PostItem.vue";
import PostFilters from "./PostFilters.vue";
import type { Post } from "../types";

interface Props {
  posts: Post[];
  loading: boolean;
  removePost: (id: string) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
}
const props = defineProps<Props>();

const filter = ref("");
const sortOrder = ref<"newest" | "oldest">("newest");

const filteredPosts = computed(() => {
  let filtered = props.posts;
  if (filter.value) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(filter.value.toLowerCase()));
  }
  filtered = filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
  });
  return filtered;
});
</script>

<style scoped>
#post-list { max-width: 700px; margin: 0 auto; }
.no-posts { text-align: center; font-size: 1rem; color: #999; margin-top: 1rem; }
.spinner { margin: 1rem auto; width: 40px; height: 40px; border: 5px solid #f3f3f3; border-top: 5px solid #007bff; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
.fade-enter-active, .fade-leave-active { transition: all 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateY(-10px); }
</style>
