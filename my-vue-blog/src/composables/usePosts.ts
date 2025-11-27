import { ref, onMounted } from "vue";
import { getPosts, createPost, deletePost, updatePost } from "../services/api";
import type { Post } from "../types";

export function usePosts() {
  const posts = ref<Post[]>([]);
  const loading = ref(true);

  onMounted(async () => {
    posts.value = await getPosts();
    loading.value = false;
  });

  async function addPost(title: string, content: string) {
    const newPost: Omit<Post, "id"> = {
      title,
      content,
      author: { id: 1, name: "Polina :)" },
      createdAt: new Date().toISOString(),
      published: true,
    };
    const saved = await createPost(newPost);
    posts.value.push(saved);
  }

  async function removePost(id: string) {
    // Находим индекс и сохраняем пост на случай отката
    const index = posts.value.findIndex(p => p.id === id);
    if (index === -1) return;
    const removedPost = posts.value[index];

    // Оптимистично убираем пост
    posts.value.splice(index, 1);

    try {
      await deletePost(id);
    } catch (e) {
      // Откат: возвращаем пост обратно
      posts.value.splice(index, 0, removedPost);
      alert("Ошибка удаления поста!");
    }
  }

  return { posts, loading, addPost, removePost };
}
