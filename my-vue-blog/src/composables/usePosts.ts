/*
Пояснения для проверки
  usePosts.ts — composable для работы с постами (С ДЕЛЕЕМ!!!)

  Реализовано:

  1. Хранение состояния постов
     - Реактивный массив `posts`
     - Флаг `loading` для отображения спиннеров загрузки

  2. Получение постов с сервера
     - GET-запрос через axios
     - Во время загрузки `loading = true`
     - Используется искусственная задержка `delay`
     - После ответа данные сохраняются в `posts`

  3. Добавление нового поста
     - Формирование объекта нового поста
     - POST-запрос на сервер через axios
     - Используется задержка для наглядного отображения спиннера
     - После успешного запроса пост добавляется в локальный массив

  4. Удаление поста
     - DELETE-запрос по id
     - Используется задержка для визуального эффекта
     - После успешного запроса пост удаляется из локального массива

  5. Редактирование поста
     - PUT-запрос на сервер с обновлёнными данными
     - Используется задержка для отображения процесса сохранения
     - После ответа сервера локальное состояние синхронизируется

  6. Искусственная задержка
     - Функция `delay(ms)`
     - Позволяет визуально показать загрузку и спиннеры
*/


import { ref } from "vue";
import axios from "axios";
import type { Post } from "../types";

// URL API для работы с постами
const API_URL = "http://localhost:3000/posts";

// Вспомогательная функция для имитации задержки
// Используется, чтобы спиннеры и визуальные эффекты были заметны
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Основной composable для работы с постами
export function usePosts() {
  // Реактивный массив постов
  const posts = ref<Post[]>([]);
  
  // Флаг загрузки данных
  const loading = ref(false);

  
  // Получение всех постов с сервера
  const fetchPosts = async () => {
    loading.value = true; // включаем спиннер
    try {
      const res = await axios.get(API_URL); // запрос к API
      await delay(1000); // искусственная задержка 1 секунда
      posts.value = res.data; // сохраняем полученные посты в реактивный массив
    } catch (e) {
      console.error(e); // выводим ошибку в консоль
    } finally {
      loading.value = false; // выключаем спиннер
    }
  };

  // Добавление нового поста
  const addPost = async (title: string, content: string) => {
    // Формируем новый пост
    const newPost: Post = {
      id: Date.now().toString(), // уникальный ID на основе timestamp
      title,
      content,
      author: { id: 1, name: "Polina :)" }, // автор по умолчанию
      createdAt: new Date().toISOString(),
      published: true,
      image: `https://cataas.com/cat?width=400&height=200&random=${Date.now()}` // случайное кото-изображение
    };
    try {
      // Отправляем новый пост на сервер
      await axios.post(API_URL, newPost);
      await delay(1000); // небольшая задержка для спиннера
      posts.value.push(newPost); // добавляем пост локально в массив
    } catch (e) {
      console.error(e);
    }
  };

  // Удаление поста
  const removePost = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`); // удаляем с сервера
      await delay(500); // задержка для визуализации
      // Обновляем локальный массив постов
      posts.value = posts.value.filter(p => p.id !== id);
    } catch (e) {
      console.error(e);
    }
  };
  
  // Обновление поста (редактирование)
  const updatePost = async (updatedPost: Post) => {
    try {
      // Отправляем обновлённый пост на сервер
      await axios.put(`${API_URL}/${updatedPost.id}`, updatedPost);
      await delay(1000); // задержка для спиннера
      // Находим индекс поста в локальном массиве и обновляем
      const index = posts.value.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) posts.value[index] = updatedPost;
    } catch (e) {
      console.error(e);
    }
  };

  // Возвращаем всё необходимое для работы с постами
  return { posts, loading, fetchPosts, addPost, removePost, updatePost };
}
