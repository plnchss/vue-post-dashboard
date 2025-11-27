<template>
  <div class="post">
    <img 
  :src="post.image || `https://cataas.com/cat?width=400&height=200&random=${post.id}`" 
  alt="Котик" 
  class="post-img" 
/>
    <!-- Просмотр поста -->
    <div v-if="!editing">
      <h3>{{ post.title }}</h3>
      <p>{{ post.content }}</p>
      <p class="post-date">
        Создано: {{ formatDate(post.createdAt) }}
        <span v-if="post.updatedAt"> | Обновлено: {{ formatDate(post.updatedAt) }}</span>
      </p>
      <small>Автор: {{ post.author.name }}</small>
      <br />
      <button class="edit-btn" @click="startEdit">Редактировать ✎</button>
      <button class="delete-btn" @click="removePost(post.id)">Удалить 🗑</button>
    </div>

    <!-- Редактирование поста -->
    <div v-else>
      <input v-model="editTitle" />
      <textarea v-model="editContent"></textarea>
      <br />
      <button @click="saveEdit" :disabled="saving">
        {{ saving ? "Сохраняем..." : "Сохранить" }}
      </button>
      <button @click="cancelEdit" :disabled="saving">Отмена</button>
      <div v-if="error" class="error">{{ error }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import type { Post } from "../types";
import { updatePost } from "../services/api";

const props = defineProps<{
  post: Post;
  removePost: (id: string) => void;
}>();

const emit = defineEmits<{
  (e: "updated", post: Post): void;
}>();

const editing = ref(false);
const editTitle = ref("");
const editContent = ref("");
const saving = ref(false);
const error = ref("");

// Начать редактирование
function startEdit() {
  editing.value = true;
  editTitle.value = props.post.title;
  editContent.value = props.post.content;
  error.value = "";
}

// Отмена редактирования
function cancelEdit() {
  editing.value = false;
}

// Форматируем дату
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Сохраняем изменения
async function saveEdit() {
  saving.value = true;
  error.value = "";
  try {
    const updated = await updatePost(props.post.id, {
      title: editTitle.value,
      content: editContent.value,
      updatedAt: new Date().toISOString(), // обновляем дату редактирования
    });
    emit("updated", updated);
    editing.value = false;
  } catch (e) {
    error.value = "Ошибка сохранения!";
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.post {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
}

.post button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.post-img {
  width: 50%;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}


.edit-btn {
  background-color: #ffc107;
  color: #fff;
}

.delete-btn {
  background-color: #dc3545;
  color: #fff;
}

.post button:hover {
  opacity: 0.8;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

input:focus, textarea:focus {
  border-color: #007bff;
  outline: none;
}

.error {
  color: red;
  font-size: 0.9rem;
}

.post-date {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}
</style>
