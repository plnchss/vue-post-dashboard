<template>
  <div class="post">
    <img :src="post.image || `https://cataas.com/cat?width=400&height=200&random=${post.id}`" alt="Котик" class="post-img" />

    <div v-if="!editing">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <p class="post-date">
        Создано: {{ formatDate(post.createdAt) }}
        <span v-if="post.updatedAt"> | Обновлено: {{ formatDate(post.updatedAt) }}</span>
      </p>
      <small>Автор: {{ post.author.name }}</small>
      <br />
      <button class="edit-btn" @click="startEdit">Редактировать</button>
      <button class="delete-btn" @click="removePostHandler(post.id)">Удалить</button>
    </div>

    <div v-else>
      <input v-model="editTitle" />
      <textarea v-model="editContent"></textarea>
      <br />
      <button @click="saveEdit" :disabled="saving">
        <span v-if="saving" class="spinner-btn"></span>
        {{ saving ? "Сохраняем..." : "Сохранить" }}
      </button>
      <button @click="cancelEdit" :disabled="saving">Отмена</button>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import type { Post } from "../types";

const props = defineProps<{
  post: Post;
  removePost: (id: string) => Promise<void>;
  updatePost: (post: Post) => Promise<void>;
}>();
const emit = defineEmits<{ (e: "updated", post: Post): void }>();

const editing = ref(false);
const editTitle = ref("");
const editContent = ref("");
const saving = ref(false);
const error = ref("");
const DRAFT_KEY = `draft-${props.post.id}`;

// Загружаем черновик при старте редактирования
function startEdit() {
  editing.value = true;
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      const obj = JSON.parse(draft);
      editTitle.value = obj.title || props.post.title;
      editContent.value = obj.content || props.post.content;
    } catch {
      editTitle.value = props.post.title;
      editContent.value = props.post.content;
    }
  } else {
    editTitle.value = props.post.title;
    editContent.value = props.post.content;
  }
  error.value = "";
}

// Сохраняем черновик при изменении
watch([editTitle, editContent], ([t, c]) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: t, content: c }));
});

function cancelEdit() {
  editing.value = false;
  localStorage.removeItem(DRAFT_KEY);
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

async function saveEdit() {
  saving.value = true;
  error.value = "";
  try {
    const updated: Post = {
      ...props.post,
      title: editTitle.value,
      content: editContent.value,
      updatedAt: new Date().toISOString()
    };
    await props.updatePost(updated);
    emit("updated", updated);
    editing.value = false;
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    error.value = "Ошибка сохранения!";
  } finally {
    saving.value = false;
  }
}

async function removePostHandler(id: string) {
  saving.value = true;
  await props.removePost(id);
  saving.value = false;
}
</script>

<style scoped>
.post { background: #fff; border: 1px solid #ddd; border-radius: 8px; padding: 1rem; margin-bottom: 1rem; box-shadow: 1px 1px 5px rgba(0,0,0,0.05); }
.post-img { width: 50%; border-radius: 6px; margin-bottom: 0.5rem; }
.post button { margin-right: 0.5rem; padding: 0.3rem 0.6rem; border: none; border-radius: 4px; cursor: pointer; }
.edit-btn { background-color: #ffc107; color: #fff; }
.delete-btn { background-color: #dc3545; color: #fff; }
.post button:hover { opacity: 0.8; }
button:disabled { opacity: 0.5; cursor: not-allowed; }
input, textarea { width: 100%; padding: 0.5rem; margin-bottom: 0.5rem; border: 1px solid #ccc; border-radius: 4px; }
input:focus, textarea:focus { border-color: #007bff; outline: none; }
.error { color: red; font-size: 0.9rem; }
.post-date { font-size: 0.85rem; color: #666; margin-bottom: 0.5rem; }
.spinner-btn { display: inline-block; width: 14px; height: 14px; border: 2px solid #fff; border-top: 2px solid #007bff; border-radius: 50%; margin-right: 0.3rem; animation: spin 0.8s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>
