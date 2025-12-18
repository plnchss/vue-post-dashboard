import axios from "axios";          // HTTP-клиент для запросов на сервер
import type { Post } from "../types"; // Типизация данных поста

const API_URL = "http://localhost:3000/posts"; // URL для API постов

// Получение всех постов 
export async function fetchPosts(): Promise<Post[]> {
  const res = await axios.get(API_URL); // GET-запрос
  return res.data;                      // возвращаем массив постов
}

// Добавление нового поста 
export async function addNewPost(post: { title: string; content: string }): Promise<Post> {
  const newPost: Post = {
    id: Date.now().toString(),          // уникальный ID
    title: post.title,                  // заголовок
    content: post.content,              // текст
    author: { id: 1, name: "Polina :)" }, // автор по умолчанию
    createdAt: new Date().toISOString(), // дата создания
    published: true                     // опубликовано
  };
  const res = await axios.post(API_URL, newPost); // POST-запрос на сервер
  return res.data;                                // возвращаем созданный пост
}

// Удаление поста 
export async function deletePost(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`); // DELETE-запрос по ID
}

// Обновление поста 
export async function updatePost(id: string, updatedFields: Partial<Post>): Promise<Post> {
  const res = await axios.patch(`${API_URL}/${id}`, updatedFields); // PATCH-запрос с частичными полями
  return res.data;                                                  // возвращаем обновлённый пост
}
