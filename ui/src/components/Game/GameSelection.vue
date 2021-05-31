<template>
  <div class="gameSelection">
    <button
      @click="init('easy')"
      :class="
        `gameSelection__button ${
          gameMode === 'easy' ? 'gameSelection__button--active' : ''
        }`
      "
    >
      EASY
    </button>

    <button
      @click="init('medium')"
      :class="
        `gameSelection__button ${
          gameMode === 'medium' ? 'gameSelection__button--active' : ''
        }`
      "
    >
      MEDIUM
    </button>

    <button
      @click="init('hard')"
      :class="
        `gameSelection__button ${
          gameMode === 'hard' ? 'gameSelection__button--active' : ''
        }`
      "
    >
      HARD
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
  props: {
    gameMode: String,
  },
  setup(props, context) {
    const init = inject("init");
    const gameMode = inject("gameMode");

    return {
      init,
      gameMode,
    };
  },
});
</script>
