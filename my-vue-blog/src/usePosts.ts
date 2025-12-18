import { ref } from "vue";         // Реактивные переменные Vue 3
import axios from "axios";         // HTTP-клиент для запросов к серверу
import type { Post } from "../types"; // Типизация поста

// URL локального JSON-сервера
const API_URL = "http://localhost:3000/posts";

// composable для работы с постами
export function usePosts() {
  // =========================
  // Состояние
  // =========================
  const posts = ref<Post[]>([]);   // массив постов
  const loading = ref(false);      // флаг загрузки для спиннеров

  // =========================
  // Получение всех постов
  // =========================
  const fetchPosts = async () => {
    loading.value = true;          // включаем спиннер
    try {
      const res = await axios.get(API_URL); // GET-запрос к серверу
      posts.value = res.data;               // сохраняем данные в реактивный массив
    } catch (e) {
      console.error(e);                     // выводим ошибку в консоль
    } finally {
      loading.value = false;                // выключаем спиннер
    }
  };

  // =========================
  // Добавление нового поста
  // =========================
  const addPost = async (title: string, content: string) => {
    const newPost: Post = {
      id: Date.now().toString(),            // уникальный ID по timestamp
      title,                                // заголовок
      content,                              // текст поста
      author: { id: 1, name: "Polina :)" },// автор по умолчанию
      createdAt: new Date().toISOString(),  // дата создания
      published: true,                      // статус публикации
      image: `https://cataas.com/cat?width=400&height=200&random=${Date.now()}` // случайная картинка
    };

    posts.value.push(newPost);              // Оптимистично обновляем UI (без делея!!)

    try {
      await axios.post(API_URL, newPost);   // Отправляем на сервер
    } catch (e) {
      // Если ошибка — откатываем изменения
      posts.value = posts.value.filter(p => p.id !== newPost.id);
      console.error(e);
    }
  };

  // =========================
  // Удаление поста
  // =========================
  const removePost = async (id: string) => {
    const index = posts.value.findIndex(p => p.id === id);
    if (index === -1) return;              // если пост не найден, выходим

    const removedPost = posts.value[index];
    posts.value.splice(index, 1);          // Оптимистично удаляем из UI

    try {
      await axios.delete(`${API_URL}/${id}`); // DELETE-запрос на сервер
    } catch (e) {
      // Если ошибка — откатываем удаление
      posts.value.splice(index, 0, removedPost);
      console.error(e);
    }
  };

  // =========================
  // Обновление поста (редактирование)
  // =========================
  const updatePost = async (updatedPost: Post) => {
    const index = posts.value.findIndex(p => p.id === updatedPost.id);
    if (index === -1) return;              // если пост не найден, выходим

    const oldPost = { ...posts.value[index] };
    posts.value[index] = updatedPost;       // Оптимистично обновляем UI

    try {
      await axios.put(`${API_URL}/${updatedPost.id}`, updatedPost); // PUT-запрос на сервер
    } catch (e) {
      // Если ошибка — откатываем изменения
      posts.value[index] = oldPost;
      console.error(e);
    }
  };

  // Возвращаем реактивные переменные и функции
  return { posts, loading, fetchPosts, addPost, removePost, updatePost };
}
