import { ref } from "vue";
import axios from "axios";
import type { Post } from "../types";

const API_URL = "http://localhost:3000/posts";

export function usePosts() {
  const posts = ref<Post[]>([]);
  const loading = ref(false);

  const fetchPosts = async () => {
    loading.value = true;
    try {
      const res = await axios.get(API_URL);
      posts.value = res.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  const addPost = async (title: string, content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      title,
      content,
      author: { id: 1, name: "Polina :)" },
      createdAt: new Date().toISOString(),
      published: true,
      image: `https://cataas.com/cat?width=400&height=200&random=${Date.now()}`
    };

    posts.value.push(newPost); // Оптимистично обновляем UI

    try {
      await axios.post(API_URL, newPost);
    } catch (e) {
      posts.value = posts.value.filter(p => p.id !== newPost.id); // откат
      console.error(e);
    }
  };

  const removePost = async (id: string) => {
    const index = posts.value.findIndex(p => p.id === id);
    if (index === -1) return;

    const removedPost = posts.value[index];
    posts.value.splice(index, 1); // Оптимистично удаляем

    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (e) {
      posts.value.splice(index, 0, removedPost); // откат
      console.error(e);
    }
  };

  const updatePost = async (updatedPost: Post) => {
    const index = posts.value.findIndex(p => p.id === updatedPost.id);
    if (index === -1) return;

    const oldPost = { ...posts.value[index] };
    posts.value[index] = updatedPost; // Оптимистично обновляем

    try {
      await axios.put(`${API_URL}/${updatedPost.id}`, updatedPost);
    } catch (e) {
      posts.value[index] = oldPost; // откат
      console.error(e);
    }
  };

  return { posts, loading, fetchPosts, addPost, removePost, updatePost };
}
