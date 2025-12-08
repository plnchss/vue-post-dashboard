import { ref } from "vue";
import axios from "axios";
import type { Post } from "../types";

const API_URL = "http://localhost:3000/posts";

// Функция задержки для имитации медленного запроса
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function usePosts() {
  const posts = ref<Post[]>([]);
  const loading = ref(false);

  // Получение всех постов
  const fetchPosts = async () => {
    loading.value = true;
    try {
      const res = await axios.get(API_URL);
      await delay(1000); // искусственная задержка 1 секунда
      posts.value = res.data;
    } catch (e) {
      console.error(e);
    } finally {
      loading.value = false;
    }
  };

  // Добавление нового поста
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
    try {
      await axios.post(API_URL, newPost);
      await delay(1000); // задержка для визуализации спиннера
      posts.value.push(newPost);
    } catch (e) {
      console.error(e);
    }
  };

  // Удаление поста
  const removePost = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      await delay(500); // небольшая задержка для спиннера
      posts.value = posts.value.filter(p => p.id !== id);
    } catch (e) {
      console.error(e);
    }
  };

  // Обновление поста (редактирование)
  const updatePost = async (updatedPost: Post) => {
    try {
      await axios.put(`${API_URL}/${updatedPost.id}`, updatedPost);
      await delay(1000); // задержка для визуализации сохранения
      const index = posts.value.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) posts.value[index] = updatedPost;
    } catch (e) {
      console.error(e);
    }
  };

  return { posts, loading, fetchPosts, addPost, removePost, updatePost };
}
