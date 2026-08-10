<template>
  <button
    v-if="!isBlocked"
    ref="toggleButton"
    class="kawan-kkn-chat__toggle"
    type="button"
    aria-controls="kawan-kkn-chat-dialog"
    :aria-expanded="isOpen"
    aria-label="Buka chat KawanKKN"
    @click.stop="toggleChat"
    @keydown.stop
  >
    <span aria-hidden="true">💬</span>
    <span>Tanya KawanKKN</span>
  </button>

  <Teleport to="body">
    <section
      v-if="isOpen && !isBlocked"
      id="kawan-kkn-chat-dialog"
      class="kawan-kkn-chat"
      role="dialog"
      aria-labelledby="kawan-kkn-chat-title"
      @click.stop
      @pointerdown.stop
      @wheel.stop
      @touchmove.stop
      @keydown="onDialogKeydown"
    >
      <header class="kawan-kkn-chat__header">
        <div>
          <p class="kawan-kkn-chat__eyebrow">ASISTEN KKN</p>
          <h2 id="kawan-kkn-chat-title">KawanKKN</h2>
        </div>
        <button class="kawan-kkn-chat__close" type="button" aria-label="Tutup chat KawanKKN" @click="closeChat">×</button>
      </header>

      <div ref="messageList" class="kawan-kkn-chat__messages" role="log" aria-live="polite" aria-relevant="additions" @wheel.stop @touchmove.stop>
        <article v-for="message in messages" :key="message.id" class="kawan-kkn-chat__message" :class="`kawan-kkn-chat__message--${message.role}`">
          {{ message.content }}
        </article>
        <article v-if="isLoading" class="kawan-kkn-chat__message kawan-kkn-chat__message--model kawan-kkn-chat__message--loading" aria-label="KawanKKN sedang mengetik">
          Mengetik…
        </article>
      </div>

      <form class="kawan-kkn-chat__composer" @submit.prevent="sendMessage" @keydown.stop>
        <label class="sr-only" for="kawan-kkn-chat-input">Tulis pertanyaan untuk KawanKKN</label>
        <textarea
          id="kawan-kkn-chat-input"
          ref="input"
          v-model="draft"
          class="kawan-kkn-chat__input"
          rows="2"
          maxlength="1500"
          placeholder="Tulis pertanyaan Anda…"
          :disabled="isLoading"
          @keydown="onInputKeydown"
          @wheel.stop
          @touchmove.stop
        />
        <button class="kawan-kkn-chat__send" type="submit" :disabled="isLoading || !draft.trim()">
          {{ isLoading ? 'Mengirim…' : 'Kirim' }}
        </button>
      </form>
    </section>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

type MessageRole = 'user' | 'model';

interface ChatMessage {
  id: number;
  role: MessageRole;
  content: string;
  isError?: boolean;
}

interface ChatApiResponse {
  reply?: string;
  error?: string;
}

const props = withDefaults(defineProps<{ isBlocked?: boolean }>(), {
  isBlocked: false
});

const WELCOME_MESSAGE = 'Halo! Saya KawanKKN. Tanyakan informasi KKN atau ide program kerja yang tersedia pada panduan resmi.';
const NETWORK_ERROR_MESSAGE = 'Maaf, layanan KawanKKN belum dapat dihubungi. Silakan coba lagi.';
const MAX_HISTORY_MESSAGES = 8;

const isOpen = ref(false);
const isLoading = ref(false);
const draft = ref('');
const input = ref<HTMLTextAreaElement | null>(null);
const toggleButton = ref<HTMLButtonElement | null>(null);
const messageList = ref<HTMLElement | null>(null);
const messages = ref<ChatMessage[]>([
  { id: 1, role: 'model', content: WELCOME_MESSAGE }
]);
let nextMessageId = 2;

watch(() => props.isBlocked, (blocked) => {
  if (blocked) {
    closeChat();
  }
});

function scrollToLatestMessage() {
  void nextTick(() => {
    if (messageList.value) {
      messageList.value.scrollTop = messageList.value.scrollHeight;
    }
  });
}

function focusInput() {
  void nextTick(() => input.value?.focus());
}

function toggleChat() {
  if (isOpen.value) {
    closeChat();
    return;
  }

  isOpen.value = true;
  scrollToLatestMessage();
  focusInput();
}

function closeChat() {
  isOpen.value = false;
  void nextTick(() => toggleButton.value?.focus());
}

function onDialogKeydown(event: KeyboardEvent) {
  event.stopPropagation();

  if (event.key === 'Escape') {
    event.preventDefault();
    closeChat();
  }
}

function onInputKeydown(event: KeyboardEvent) {
  event.stopPropagation();

  if (event.key === 'Escape') {
    event.preventDefault();
    closeChat();
    return;
  }

  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    void sendMessage();
  }
}

function createHistory() {
  return messages.value
    .filter((message) => !message.isError)
    .slice(-MAX_HISTORY_MESSAGES)
    .map(({ role, content }) => ({ role, content }));
}

async function sendMessage() {
  const message = draft.value.trim();
  if (!message || isLoading.value) {
    return;
  }

  const history = createHistory();
  messages.value.push({ id: nextMessageId++, role: 'user', content: message });
  draft.value = '';
  isLoading.value = true;
  scrollToLatestMessage();

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    const data = await response.json() as ChatApiResponse;

    if (!response.ok || !data.reply) {
      throw new Error(data.error || NETWORK_ERROR_MESSAGE);
    }

    messages.value.push({ id: nextMessageId++, role: 'model', content: data.reply });
  } catch (error) {
    const content = error instanceof Error && error.message ? error.message : NETWORK_ERROR_MESSAGE;
    messages.value.push({ id: nextMessageId++, role: 'model', content, isError: true });
  } finally {
    isLoading.value = false;
    scrollToLatestMessage();
    focusInput();
  }
}
</script>

<style scoped>
.kawan-kkn-chat__toggle,
.kawan-kkn-chat {
  position: fixed;
  right: clamp(1rem, 3vw, 2rem);
  z-index: 1100;
  font-family: var(--font-family-body, sans-serif);
}

.kawan-kkn-chat__toggle {
  bottom: 6.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  min-height: 2.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(195, 140, 92, 0.8);
  border-radius: 999px;
  background: #0e2b2d;
  color: #ffffff;
  cursor: pointer;
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.3);
  font: inherit;
  font-weight: 700;
  letter-spacing: 0.02em;
  pointer-events: auto;
  touch-action: manipulation;
  user-select: none;
}

.kawan-kkn-chat__toggle:hover,
.kawan-kkn-chat__toggle:focus-visible {
  border-color: #c38c5c;
  background: #153e41;
  outline: 2px solid #c38c5c;
  outline-offset: 3px;
}

.kawan-kkn-chat {
  bottom: 7rem;
  display: flex;
  width: min(23rem, calc(100vw - 2rem));
  height: min(34rem, 72dvh);
  overflow: hidden;
  border: 1px solid rgba(195, 140, 92, 0.45);
  border-radius: 1rem;
  background: #0e2b2d;
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.45);
  color: #ffffff;
  flex-direction: column;
  pointer-events: auto;
  touch-action: pan-y;
  user-select: text;
}

.kawan-kkn-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.125rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  background: #133639;
}

.kawan-kkn-chat__header h2,
.kawan-kkn-chat__eyebrow {
  margin: 0;
}

.kawan-kkn-chat__header h2 {
  color: #ffffff;
  font-family: var(--font-family-heading, sans-serif);
  font-size: 1.15rem;
  letter-spacing: 0.03em;
}

.kawan-kkn-chat__eyebrow {
  margin-bottom: 0.2rem;
  color: #c38c5c;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.kawan-kkn-chat__close,
.kawan-kkn-chat__send {
  border: 0;
  cursor: pointer;
  font: inherit;
}

.kawan-kkn-chat__close {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 50%;
  background: transparent;
  color: #ffffff;
  font-size: 1.75rem;
  line-height: 1;
}

.kawan-kkn-chat__close:hover,
.kawan-kkn-chat__close:focus-visible {
  background: rgba(255, 255, 255, 0.12);
  outline: 2px solid #c38c5c;
  outline-offset: 2px;
}

.kawan-kkn-chat__messages {
  display: flex;
  min-height: 0;
  flex: 1;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 1rem;
  background: #0b101e;
  scrollbar-color: #c38c5c #0b101e;
}

.kawan-kkn-chat__message {
  max-width: 88%;
  padding: 0.75rem 0.9rem;
  border-radius: 0.85rem;
  font-size: 0.9rem;
  line-height: 1.45;
  overflow-wrap: anywhere;
  white-space: pre-wrap;
}

.kawan-kkn-chat__message--model {
  align-self: flex-start;
  border-bottom-left-radius: 0.2rem;
  background: #1b3e40;
  color: #ffffff;
}

.kawan-kkn-chat__message--user {
  align-self: flex-end;
  border-bottom-right-radius: 0.2rem;
  background: #c38c5c;
  color: #0b101e;
  font-weight: 600;
}

.kawan-kkn-chat__message--loading {
  color: rgba(255, 255, 255, 0.75);
  font-style: italic;
}

.kawan-kkn-chat__composer {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.65rem;
  align-items: end;
  padding: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  background: #133639;
}

.kawan-kkn-chat__input {
  width: 100%;
  min-height: 2.75rem;
  max-height: 7rem;
  resize: vertical;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 0.6rem;
  background: #ffffff;
  color: #0b101e;
  font: inherit;
  line-height: 1.4;
  padding: 0.65rem 0.75rem;
  touch-action: pan-y;
  user-select: text;
}

.kawan-kkn-chat__input:focus-visible,
.kawan-kkn-chat__send:focus-visible {
  outline: 2px solid #c38c5c;
  outline-offset: 2px;
}

.kawan-kkn-chat__send {
  min-height: 2.75rem;
  border-radius: 0.6rem;
  background: #c38c5c;
  color: #0b101e;
  font-weight: 800;
  padding: 0.65rem 0.85rem;
}

.kawan-kkn-chat__send:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

@media (max-width: 640px) {
  .kawan-kkn-chat__toggle {
    bottom: 1rem;
  }

  .kawan-kkn-chat {
    right: 1rem;
    bottom: 1rem;
    width: calc(100vw - 2rem);
    height: min(35rem, calc(100dvh - 2rem));
  }
}
</style>
