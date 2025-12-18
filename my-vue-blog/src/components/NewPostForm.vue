/*
Пояснения для проверки
  NewPostForm.vue — форма добавления нового поста

  Реализовано в компоненте:

  1. Ввод данных поста
     - Заголовок и текст поста хранятся в реактивных переменных `title` и `content`
     - Связь с полями ввода через `v-model`

  2. Добавление поста
     - При нажатии кнопки вызывается `addPostHandler`
     - Данные передаются родительскому компоненту через `props.addPost`
     - Используется асинхронный вызов с `await`
     - Во время запроса включается состояние `saving` и отображается спиннер

  3. Спиннер загрузки
     - Управляется реактивной переменной `saving`
     - Пока `saving = true`, кнопка блокируется и показывается индикатор загрузки

  4. Сохранение черновика
     - Черновик автоматически сохраняется в `localStorage`
     - Используется `watch` на `title` и `content`
     - Данные сохраняются при каждом изменении текста

  5. Восстановление черновика
     - При монтировании компонента (`onMounted`)
     - Черновик загружается из `localStorage`
     - Если данные есть, показывается уведомление пользователю

  6. Очистка черновика
     - После успешного добавления поста
     - Черновик удаляется из `localStorage`
*/

<template>
  <!-- Форма добавления нового поста -->
  <div class="new-post-form">
    <!-- Заголовок формы -->
    <h3>Новая запись</h3>

    <!-- Поле ввода заголовка поста -->
    <input
      v-model="title"
      placeholder="Заголовок"
    />

    <!-- Поле ввода содержимого поста -->
    <textarea
      v-model="content"
      placeholder="Содержание"
    ></textarea>

    <br />

    <!-- Кнопка добавления поста -->
    <button
      @click="addPostHandler"
      :disabled="saving"
    >
      <!-- Спиннер во время сохранения -->
      <span v-if="saving" class="spinner-btn"></span>
      {{ saving ? "Сохраняем..." : "Добавить" }}
    </button>

    <!-- Сообщение о восстановленном черновике -->
    <div v-if="draftExists" class="draft-note">
      Черновик восстановлен из предыдущей сессии.
    </div>
  </div>
</template>

<script setup lang="ts">
/*
  Компонент формы создания нового поста
  Поддерживает:
  - ввод данных
  - сохранение черновика
  - восстановление черновика
  - отправку данных родителю
*/

import { ref, watch, onMounted } from "vue";

interface Props {
  // Функция добавления поста,
  // передаётся из родительского компонента
  addPost: (title: string, content: string) => Promise<void>;
}

// Получаем props с типизацией
const props = defineProps<Props>();

// Реактивные поля формы
const title = ref("");        // заголовок поста
const content = ref("");      // текст поста
const saving = ref(false);    // состояние сохранения

// Ключ для хранения черновика в localStorage
const DRAFT_KEY = "blog-draft";

// Флаг наличия восстановленного черновика
const draftExists = ref(false);

// При монтировании компонента
// пытаемся восстановить черновик из localStorage
onMounted(() => {
  const draft = localStorage.getItem(DRAFT_KEY);

  if (draft) {
    try {
      const obj = JSON.parse(draft);
      title.value = obj.title || "";
      content.value = obj.content || "";

      // Если данные есть — показываем сообщение
      if (title.value || content.value) {
        draftExists.value = true;
      }
    } catch {
      console.warn("Ошибка при восстановлении черновика");
    }
  }
});

// Автоматически сохраняем черновик
// при любом изменении заголовка или текста
watch([title, content], ([newTitle, newContent]) => {
  localStorage.setItem(
    DRAFT_KEY,
    JSON.stringify({
      title: newTitle,
      content: newContent
    })
  );
});

// Обработчик добавления нового поста
const addPostHandler = async () => {
  // Простая валидация
  if (!title.value || !content.value) return;

  saving.value = true;

  try {
    // Вызываем функцию добавления поста из родителя
    await props.addPost(title.value, content.value);

    // Очищаем форму после успешного добавления
    title.value = "";
    content.value = "";

    // Удаляем черновик
    localStorage.removeItem(DRAFT_KEY);
    draftExists.value = false;
  } catch {
    alert("Ошибка при добавлении поста");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
/* Контейнер формы */
.new-post-form {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  box-shadow: 1px 1px 5px rgba(0,0,0,0.05);
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

/* Состояние фокуса */
input:focus,
textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* Кнопка */
button {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  background-color: #28a745;
  color: #fff;
  cursor: pointer;
}

/* Заблокированная кнопка */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Сообщение о черновике */
.draft-note {
  margin-top: 0.5rem;
  font-size: 0.85rem;
  color: #666;
}

/* Спиннер внутри кнопки */
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
