// src/services/api.ts
import axios from "axios";
import type { Post } from "../types";

const API_URL = "http://localhost:3000/posts";

// Получение всех постов
export async function fetchPosts(): Promise<Post[]> {
  const res = await axios.get(API_URL);
  return res.data;
}

// Добавление нового поста
export async function addNewPost(post: { title: string; content: string }): Promise<Post> {
  const newPost: Post = {
    id: Date.now().toString(),
    title: post.title,
    content: post.content,
    author: { id: 1, name: "Polina :)" },
    createdAt: new Date().toISOString(),
    published: true,
  };
  const res = await axios.post(API_URL, newPost);
  return res.data;
}

// Удаление поста по ID
export async function deletePost(id: string): Promise<void> {
  await axios.delete(`${API_URL}/${id}`);
}

// Обновление поста
export async function updatePost(id: string, updatedFields: Partial<Post>): Promise<Post> {
  const res = await axios.patch(`${API_URL}/${id}`, updatedFields);
  return res.data;
}
