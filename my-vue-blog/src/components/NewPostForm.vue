<template>
  <div class="new-post-form">
    <h3>Новая запись</h3>
    <input v-model="title" placeholder="Заголовок" />
    <textarea v-model="content" placeholder="Содержание"></textarea>
    <br />
    <button @click="addPost" :disabled="saving">
      {{ saving ? "Сохраняем..." : "Добавить" }}
    </button>
    <div v-if="draftExists" class="draft-note">
      Черновик восстановлен из предыдущей сессии.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { addNewPost } from "../services/api";

const title = ref("");
const content = ref("");
const saving = ref(false);

const DRAFT_KEY = "blog-draft";

// Проверяем наличие черновика в localStorage
const draftExists = ref(false);

onMounted(() => {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      const obj = JSON.parse(draft);
      title.value = obj.title || "";
      content.value = obj.content || "";
      if (title.value || content.value) draftExists.value = true;
    } catch {
      console.warn("Ошибка при восстановлении черновика");
    }
  }
});

// Сохраняем черновик в localStorage при изменении
watch([title, content], ([newTitle, newContent]) => {
  localStorage.setItem(DRAFT_KEY, JSON.stringify({ title: newTitle, content: newContent }));
});

// Добавление нового поста
async function addPost() {
  if (!title.value || !content.value) return;

  saving.value = true;
  try {
    await addNewPost({ title: title.value, content: content.value });
    // Очищаем форму и черновик
    title.value = "";
    content.value = "";
    localStorage.removeItem(DRAFT_KEY);
    draftExists.value = false;
  } catch (e) {
    alert("Ошибка при добавлении поста");
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped>
.new-post-form {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
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

button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: #fff;
  cursor: pointer;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.draft-note {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}
</style>
