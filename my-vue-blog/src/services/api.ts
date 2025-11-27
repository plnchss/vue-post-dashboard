import type { Post } from "../types";

const API_URL = "http://localhost:3000/posts";

export async function getPosts(): Promise<Post[]> {
  const res = await fetch(API_URL);
  return await res.json();
}

export async function createPost(newPost: Omit<Post, "id">): Promise<Post> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  });
  return await res.json();
}

export async function deletePost(id: string): Promise<void> {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
}

export async function updatePost(id: string, updated: Partial<Post>): Promise<Post> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updated),
  });
  return await res.json();
}
