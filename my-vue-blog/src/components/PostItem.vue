/*
Пояснения для проверки
PostItem.vue — компонент отображения и редактирования одного поста

  Реализовано в компоненте:

  1. Отображение поста
     - Заголовок, текст, автор, даты создания и обновления
     - Изображение поста (или заглушка, если нет картинки)

  2. Режим редактирования
     - Переключение между просмотром и редактированием
     - Используются реактивные переменные `editing`, `editTitle`, `editContent`

  3. Редактирование поста
     - Изменения отправляются родителю через `props.updatePost`
     - Используется асинхронное сохранение с `await`
     - Отображается спиннер во время сохранения

  4. Удаление поста
     - Кнопка удаления
     - Вызов функции `props.removePost` из родительского компонента

  5. Черновики редактирования
     - Автосохранение изменений в `localStorage`
     - Отдельный ключ для каждого поста
     - Восстановление черновика при повторном редактировании

  6. Обработка ошибок
     - Отображение сообщения об ошибке при неудачном сохранении
*/

<template>
  <!-- Карточка одного поста -->
  <div class="post">
    <!-- Картинка поста -->
    <!--
      Если у поста нет изображения —
      подставляется случайный котик с cataas.com
    -->
    <img
      :src="post.image || `https://cataas.com/cat?width=400&height=200&random=${post.id}`"
      alt="Котик"
      class="post-img"
    />

    <!-- РЕЖИМ ПРОСМОТРА -->
    <div v-if="!editing">
      <!-- Заголовок поста -->
      <h3>{{ post.title }}</h3>

      <!-- Текст поста -->
      <p>{{ post.content }}</p>

      <!-- Даты создания и обновления -->
      <p class="post-date">
        Создано: {{ formatDate(post.createdAt) }}
        <span v-if="post.updatedAt">
          | Обновлено: {{ formatDate(post.updatedAt) }}
        </span>
      </p>

      <!-- Автор поста -->
      <small>Автор: {{ post.author.name }}</small>
      <br />

      <!-- Кнопки действий -->
      <button class="edit-btn" @click="startEdit">
        Редактировать
      </button>

      <button
        class="delete-btn"
        @click="removePostHandler(post.id)"
      >
        Удалить
      </button>
    </div>

    <!-- РЕЖИМ РЕДАКТИРОВАНИЯ -->
    <div v-else>
      <!-- Поле редактирования заголовка -->
      <input v-model="editTitle" />

      <!-- Поле редактирования контента -->
      <textarea v-model="editContent"></textarea>
      <br />

      <!-- Кнопка сохранения -->
      <button @click="saveEdit" :disabled="saving">
        <!-- Спиннер при сохранении -->
        <span v-if="saving" class="spinner-btn"></span>
        {{ saving ? "Сохраняем..." : "Сохранить" }}
      </button>

      <!-- Отмена редактирования -->
      <button @click="cancelEdit" :disabled="saving">
        Отмена
      </button>

      <!-- Сообщение об ошибке -->
      <div v-if="error" class="error">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  Компонент одного поста
  Поддерживает:
  - просмотр
  - редактирование
  - удаление
  - автосохранение черновика
*/

import { ref, watch } from "vue";
import type { Post } from "../types";

// Входные параметры компонента
const props = defineProps<{
  post: Post;                                 // Данные поста
  removePost: (id: string) => Promise<void>; // Функция удаления
  updatePost: (post: Post) => Promise<void>; // Функция обновления
}>();

// Событие для уведомления родителя об обновлении
const emit = defineEmits<{
  (e: "updated", post: Post): void;
}>();

// Флаги и состояния
const editing = ref(false);    // режим редактирования
const editTitle = ref("");     // редактируемый заголовок
const editContent = ref("");   // редактируемый текст
const saving = ref(false);     // состояние сохранения
const error = ref("");         // сообщение об ошибке

// Ключ для хранения черновика в localStorage
const DRAFT_KEY = `draft-${props.post.id}`;

// Включаем режим редактирования
// и загружаем черновик, если он есть
function startEdit() {
  editing.value = true;

  const draft = localStorage.getItem(DRAFT_KEY);
  if (draft) {
    try {
      const obj = JSON.parse(draft);
      editTitle.value = obj.title || props.post.title;
      editContent.value = obj.content || props.post.content;
    } catch {
      // Если черновик повреждён
      editTitle.value = props.post.title;
      editContent.value = props.post.content;
    }
  } else {
    // Если черновика нет
    editTitle.value = props.post.title;
    editContent.value = props.post.content;
  }

  error.value = "";
}

// Автосохранение черновика при изменении текста
watch([editTitle, editContent], ([title, content]) => {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({ title, content })
  );
});

// Отмена редактирования
function cancelEdit() {
  editing.value = false;
  localStorage.removeItem(DRAFT_KEY);
}

// Форматирование даты для отображения
function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

// Сохранение изменений поста
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

    // Обновляем пост через родительскую функцию
    await props.updatePost(updated);

    // Уведомляем родителя
    emit("updated", updated);

    // Выходим из режима редактирования
    editing.value = false;
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    error.value = "Ошибка сохранения!";
  } finally {
    saving.value = false;
  }
}

// Удаление поста
async function removePostHandler(id: string) {
  saving.value = true;
  await props.removePost(id);
  saving.value = false;
}
</script>

<style scoped>
/* Карточка поста */
.post {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
}

/* Изображение поста */
.post-img {
  width: 50%;
  border-radius: 6px;
  margin-bottom: 0.5rem;
}

/* Кнопки */
.post button {
  margin-right: 0.5rem;
  padding: 0.3rem 0.6rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Кнопка редактирования */
.edit-btn {
  background-color: #ffc107;
  color: #fff;
}

/* Кнопка удаления */
.delete-btn {
  background-color: #dc3545;
  color: #fff;
}

/* Ховер эффект */
.post button:hover {
  opacity: 0.8;
}

/* Заблокированная кнопка */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Поля ввода */
input,
textarea {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Фокус полей */
input:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* Ошибка */
.error {
  color: red;
  font-size: 0.9rem;
}

/* Дата */
.post-date {
  font-size: 0.85rem;
  color: #666;
  margin-bottom: 0.5rem;
}

/* Спиннер в кнопке */
.spinner-btn {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid #fff;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  margin-right: 0.3rem;
  animation: spin 0.8s linear infinite;
}

/* Анимация спиннера */
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
