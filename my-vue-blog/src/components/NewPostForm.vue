<template>
  <div>
    <h2>Создать пост (=^･ｪ･^=)</h2>

    <form @submit.prevent="submit">
      <input
        v-model="title"
        placeholder="Заголовок"
        :aria-invalid="!!errors.title"
        :aria-describedby="'title-error'"
        required
      />
      <div id="title-error" v-if="errors.title" style="color:red">{{ errors.title }}</div>

      <br /><br />

      <textarea
        v-model="content"
        placeholder="Текст"
        :aria-invalid="!!errors.content"
        :aria-describedby="'content-error'"
        required
      ></textarea>
      <div id="content-error" v-if="errors.content" style="color:red">{{ errors.content }}</div>

      <br /><br />

      <button type="submit" :disabled="saving">
        {{ saving ? "Сохраняем..." : "Добавить" }}
      </button>
      <button type="button" @click="resetDraft" :disabled="saving">Сбросить черновик</button>
    </form>

    <hr />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { usePosts } from "../composables/usePosts";

const title = ref("");
const content = ref("");
const saving = ref(false);
const errors = ref<{ title?: string; content?: string }>({});

const { addPost } = usePosts();

// Ключ в localStorage
const DRAFT_KEY = "new-post-draft";

// Восстанавливаем черновик при монтировании
onMounted(() => {
  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    const data = JSON.parse(draft);
    title.value = data.title || "";
    content.value = data.content || "";
  }
});

// Debounced watch для автосохранения
let timeout: number;
watch([title, content], () => {
  clearTimeout(timeout);
  timeout = window.setTimeout(() => {
    localStorage.setItem(
      DRAFT_KEY,
      JSON.stringify({ title: title.value, content: content.value })
    );
  }, 500);
});

function validate() {
  const errs: typeof errors.value = {};
  if (!title.value.trim()) errs.title = "Заголовок обязателен";
  if (!content.value.trim()) errs.content = "Текст обязателен";
  errors.value = errs;
  return Object.keys(errs).length === 0;
}

async function submit() {
  if (!validate()) return;

  saving.value = true;

  // Оптимистичное добавление: сразу показываем пост
  const optimisticTitle = title.value;
  const optimisticContent = content.value;

  try {
    await addPost(optimisticTitle, optimisticContent);
    resetDraft(); // очистка черновика
    title.value = "";
    content.value = "";
  } catch (e) {
    alert("Ошибка при добавлении поста!");
  } finally {
    saving.value = false;
  }
}

function resetDraft() {
  localStorage.removeItem(DRAFT_KEY);
  title.value = "";
  content.value = "";
}
</script>

<style scoped>
input,
textarea {
  width: 100%;
  margin-bottom: 0.01
  rem;
}
</style>
