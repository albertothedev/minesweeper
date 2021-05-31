<template>
  <div class="scoreboard">
    <div class="scoreboard__flags">{{ flagsLeft }}</div>
    <button class="scoreboard__faceButton" @click="() => init(gameMode)">
      <img class="scoreboard__faceButton__face" :src="currentFace" alt="Face" />
    </button>
    <div class="scoreboard__time">{{ time }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, inject } from "vue";

export default defineComponent({
  setup(props, context) {
    const init = inject("init");
    const incrementTime: any = inject("incrementTime");
    const endGame: any = inject("endGame");
    const isGameOver: any = inject("isGameOver");

    const gameMode = inject("gameMode");
    const gameState: any = inject("gameState");
    const flagsLeft = inject("flagsLeft");
    let time: any = inject("time");
    const currentFace = inject("currentFace");

    onMounted(() =>
      setInterval(() => {
        if (gameState.value === "playing") {
          incrementTime();
          isGameOver();
        }
      }, 1000)
    );

    return {
      init,
      gameMode,
      gameState,
      flagsLeft,
      time,
      currentFace,
      incrementTime,
      endGame,
      isGameOver,
    };
  },
});
</script>
