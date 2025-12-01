import { ref } from "vue";
import axios from "axios";

const API_URL = "http://localhost:3000/posts";

export function usePosts() {
  const posts = ref<any[]>([]);
  const loading = ref(false);

  const fetchPosts = async () => {
    loading.value = true;
    try {
      const res = await axios.get(API_URL);
      posts.value = res.data;
    } catch (err) {
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const addPost = async (title: string, content: string) => {
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      author: { id: 1, name: "Polina :)" },
      createdAt: new Date().toISOString(),
      published: true,
    };
    try {
      await axios.post(API_URL, newPost);
      posts.value.push(newPost);
    } catch (err) {
      console.error(err);
    }
  };

  const removePost = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      posts.value = posts.value.filter(p => p.id !== id);
    } catch (err) {
      console.error(err);
    }
  };

  const updatePost = async (updatedPost: any) => {
    try {
      await axios.patch(`${API_URL}/${updatedPost.id}`, updatedPost);
      const index = posts.value.findIndex(p => p.id === updatedPost.id);
      if (index !== -1) posts.value[index] = updatedPost;
    } catch (err) {
      console.error(err);
    }
  };

  return { posts, loading, fetchPosts, addPost, removePost, updatePost };
}
